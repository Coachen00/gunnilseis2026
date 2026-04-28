-- Spelare och ledare för Gunnilse IS Herr.
-- Synkas automatiskt av edge function `sync-gunnilse-squad` mot
-- https://www.svenskalag.se/gunnilseis-herr/truppen

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
