-- principle_media: en media-/textslot per princip per block på Maj 2026-sidan
-- (/maj-2026). Modellen är medvetet generisk: block_id + principle_id är
-- frikopplade textnycklar så data lever även om frontend-strängar byts.
--
-- Tre lägen (mutually exclusive):
--   - "video"  → film via URL (YouTube/Vimeo/m.fl.) eller uppladdad fil
--   - "image"  → bild via URL eller uppladdad fil
--   - "text"   → text-kort (text_title + text_body)
--
-- Lagring: återanvänder befintliga storage-bucketen "match-media" med
-- prefix "principles/<block_id>/<principle_id>-<ts>.<ext>" för att slippa
-- ny bucket-RLS. Bucketen är private; signed URLs hanteras frontend-sidan.

create table if not exists public.principle_media (
  id           uuid primary key default gen_random_uuid(),
  block_id     text not null,
  principle_id text not null,
  media_type   text not null default 'video' check (media_type in ('video','image','text')),
  source_kind  text not null default 'url'  check (source_kind in ('url','upload','text')),
  url          text,
  storage_path text,
  text_title   text,
  text_body    text,
  caption      text,
  updated_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (block_id, principle_id)
);

create index if not exists idx_principle_media_block on public.principle_media(block_id);

-- updated_at trigger — återanvänder befintlig touch_updated_at()
drop trigger if exists trg_principle_media_updated on public.principle_media;
create trigger trg_principle_media_updated
  before update on public.principle_media
  for each row execute function public.touch_updated_at();

-- RLS: alla får läsa (sidan är Protected men datan i sig är inte hemlig),
-- approved users får skriva — matchar content_blocks-mönstret.
alter table public.principle_media enable row level security;

drop policy if exists "Read principle_media" on public.principle_media;
create policy "Read principle_media"
  on public.principle_media for select
  to authenticated
  using (true);

drop policy if exists "Approved users write principle_media" on public.principle_media;
create policy "Approved users write principle_media"
  on public.principle_media for all
  to authenticated
  using (public.is_approved_user())
  with check (public.is_approved_user());
