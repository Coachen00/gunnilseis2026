-- Återapplicering av 20260425113804_content_blocks.sql (utan seed).
-- Originalet nådde aldrig remote: deploy-workflown tillkom senare och
-- `supabase db push` applicerar inte migrationer med äldre timestamp än
-- remote-historikens huvud. Frontend föll därför tyst tillbaka till statisk
-- data och admin-redigering kunde inte spara (404 PGRST205).
--
-- Seeden från originalet är avsiktligt utelämnad: identitetsorden i
-- src/data/identity.ts har skrivits om sedan april, och en gammal seed-rad
-- skulle överskugga den nyare fallback-datan. saveContent gör upsert, så
-- raden skapas första gången admin sparar.
-- All DDL är idempotent — säkert även om originalmigrationen skulle köras.

create table if not exists public.content_blocks (
  key         text primary key,
  data        jsonb not null,
  description text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

-- Touch updated_at on update.
create or replace function public.touch_content_blocks_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists touch_content_blocks_updated_at on public.content_blocks;
create trigger touch_content_blocks_updated_at
  before update on public.content_blocks
  for each row execute function public.touch_content_blocks_updated_at();

-- RLS: alla får läsa (förbereder framtida publik delning), endast godkända
-- användare får skriva.
alter table public.content_blocks enable row level security;

drop policy if exists "Public read content_blocks" on public.content_blocks;
create policy "Public read content_blocks"
  on public.content_blocks for select
  to anon, authenticated
  using (true);

drop policy if exists "Approved users write content_blocks" on public.content_blocks;
create policy "Approved users write content_blocks"
  on public.content_blocks for all
  to authenticated
  using (public.is_approved_user())
  with check (public.is_approved_user());

-- Realtime: useContent/useReflections invaliderar cache via supabase_realtime.
-- Saknades i originalmigrationen.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'content_blocks'
  ) then
    alter publication supabase_realtime add table public.content_blocks;
  end if;
end $$;
