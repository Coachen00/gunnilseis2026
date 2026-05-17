-- ============================================================================
-- Aktivera `principle_media` i Supabase Dashboard
-- ============================================================================
--
-- ANVÄNDNING:
--   1. Öppna https://supabase.com/dashboard/project/fojviymdmhjlpyrpjexp
--   2. SQL Editor → New query → klistra in HELA innehållet nedanför
--   3. Run
--
-- Efter detta börjar /maj-2026 läsa/skriva mot Supabase, så att YouTube-
-- länkar och uppladdat material syns för alla inloggade — inte bara i
-- den webbläsare där admin sparade.
--
-- Säker att köra flera gånger (CREATE IF NOT EXISTS, DROP POLICY IF EXISTS).
-- ============================================================================

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

-- RLS: alla inloggade får läsa (datan är inte hemlig, men sidan kräver login).
-- Approved users får skriva — matchar content_blocks-mönstret.
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

-- Sanity check — radera fritt om du inte vill ha kvar.
select 'principle_media tabell + RLS OK' as status,
       count(*)::text || ' rader' as rader
from   public.principle_media;
