-- ============================================================================
-- Aktivera `players` i Supabase Dashboard
-- ============================================================================
--
-- ANVÄNDNING:
--   1. Öppna https://supabase.com/dashboard/project/fojviymdmhjlpyrpjexp/sql/new
--   2. SQL Editor → New query → klistra in HELA innehållet nedanför
--   3. Run
--
-- Tabellen fylls av edge-funktionen `sync-gunnilse-squad`, som skrapar
-- https://www.svenskalag.se/gunnilseis-herr/truppen. Utan tabellen svarar
-- REST-API:t PGRST205 ("Could not find the table") och funktionen failar på
-- sin upsert — kör därför denna FÖRE du deployar funktionen.
--
-- Identisk med supabase/migrations/20260428120000_players_table.sql — denna
-- fil finns bara för manuell dashboard-paste (CI-deployen kräver repo-secrets,
-- se README "Deploya Supabase"). Säker att köra flera gånger.
--
-- Tills tabellen har rader visar /truppen statisk fallback från
-- src/data/squad.ts med en gul "Fallback-data"-pille.
-- ============================================================================

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null check (position in ('GK', 'DEF', 'MID', 'FWD', 'STAFF')),
  jersey_number int,
  birth_year int,
  is_staff boolean not null default false,
  staff_role text,
  sort_order int,
  external_id text unique,
  source text not null default 'scraped',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_players_position on public.players(position);
create index if not exists idx_players_sort on public.players(sort_order);
create index if not exists idx_players_is_staff on public.players(is_staff);

-- Auto-uppdatera updated_at
create or replace function public.players_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_players_updated_at on public.players;
create trigger trg_players_updated_at
  before update on public.players
  for each row execute function public.players_set_updated_at();

-- RLS: alla får läsa, bara service_role skriver
alter table public.players enable row level security;

drop policy if exists "Anyone can read players" on public.players;
create policy "Anyone can read players"
  on public.players for select
  using (true);

drop policy if exists "Service role can manage players" on public.players;
create policy "Service role can manage players"
  on public.players for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================================
-- KONTROLL (kör som separat query efteråt)
-- ============================================================================
-- Direkt efter migrationen: 0 rader, men inget felmeddelande.
-- Efter att sync-gunnilse-squad körts: 29 rader (26 spelare + 3 ledare).
--
--   select position, count(*) from public.players group by position order by 1;
--   select name, staff_role from public.players where is_staff order by sort_order;
-- ============================================================================
