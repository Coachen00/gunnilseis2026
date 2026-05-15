-- media_library: centralt mediabibliotek för tränare.
--
-- Frikopplat från `media_items` (slot+match) och `principle_media`
-- (block+principle). Tränaren laddar upp filmer eller länkar och taggar
-- dem med kategori (anfall/försvar/övergångar/identitet/fasta), datum
-- och valbara kopplingar (match, träning, princip, block).
--
-- "visible_to_players": styr om en spelare som inte är admin/approved
-- ser klippet på respektive spelmodell-sida. (Admins/approved tränare
-- ser alltid allt.)
--
-- Lagring: återanvänder befintliga storage-bucketen `match-media` med
-- prefix `library/<category>/<id>-<ts>.<ext>`. Bucketen är privat,
-- signed URLs skapas frontend-sidan via createSignedUrl.

create table if not exists public.media_library (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      text not null check (category in (
                  'anfall',
                  'forsvar',
                  'omstallning-anfall',
                  'omstallning-forsvar',
                  'identitet',
                  'fasta'
                )),
  media_type    text not null default 'video' check (media_type in ('video','image')),
  source_kind   text not null check (source_kind in ('url','upload')),
  url           text,
  storage_path  text,

  -- Valfri djup-koppling: vilken princip/block tagningen illustrerar.
  -- (Frihandstext för att inte behöva FK mot frontend-strängar.)
  principle_id  text,
  block_id      text,

  -- Valfri koppling till en specifik match eller träning.
  match_id      uuid references public.matches(id) on delete set null,
  training_label text,

  -- Datum för händelsen klippet visar (inte upload-datum — det är created_at).
  event_date    date,

  -- Default false: tränaren får aktivt välja att exponera för spelarna.
  visible_to_players boolean not null default false,

  created_by    uuid references auth.users(id) on delete set null,
  updated_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Datapakt: en rad måste ha antingen url eller storage_path.
  constraint media_library_has_source check (
    (source_kind = 'url'    and url is not null and storage_path is null)
    or
    (source_kind = 'upload' and storage_path is not null)
  )
);

create index if not exists idx_media_library_category    on public.media_library(category);
create index if not exists idx_media_library_event_date  on public.media_library(event_date desc);
create index if not exists idx_media_library_visible     on public.media_library(visible_to_players) where visible_to_players = true;
create index if not exists idx_media_library_match       on public.media_library(match_id);

-- updated_at trigger (återanvänder touch_updated_at från principle_media-migrationen)
drop trigger if exists trg_media_library_updated on public.media_library;
create trigger trg_media_library_updated
  before update on public.media_library
  for each row execute function public.touch_updated_at();

-- created_by / updated_by trigger så frontend slipper sätta auth.uid().
create or replace function public.set_media_library_actor()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    new.created_by := coalesce(new.created_by, auth.uid());
  end if;
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_media_library_actor on public.media_library;
create trigger trg_media_library_actor
  before insert or update on public.media_library
  for each row execute function public.set_media_library_actor();

-- RLS
alter table public.media_library enable row level security;

-- Approved users ser allt; "okända" authenticated users ser bara
-- de rader som är markerade visible_to_players = true.
-- (Sidan är Protected via AuthGuard, så anon räknar vi inte.)
drop policy if exists "Read media_library — approved sees all"   on public.media_library;
drop policy if exists "Read media_library — players see visible" on public.media_library;

create policy "Read media_library — approved sees all"
  on public.media_library for select
  to authenticated
  using (public.is_approved_user());

create policy "Read media_library — players see visible"
  on public.media_library for select
  to authenticated
  using (visible_to_players = true);

-- Approved users skriver (insert/update/delete).
drop policy if exists "Write media_library — approved users" on public.media_library;
create policy "Write media_library — approved users"
  on public.media_library for all
  to authenticated
  using (public.is_approved_user())
  with check (public.is_approved_user());
