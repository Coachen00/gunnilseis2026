create table if not exists public.spelarvard_docs (
  id           uuid primary key default gen_random_uuid(),
  section_id   text not null,
  title        text not null,
  doc_kind     text not null default 'pdf'    check (doc_kind in ('pdf','slides','html','link','image')),
  source_kind  text not null default 'upload' check (source_kind in ('url','upload')),
  url          text,
  storage_path text,
  caption      text,
  sort_order   integer not null default 0,
  updated_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

GRANT SELECT ON public.spelarvard_docs TO authenticated;
GRANT ALL ON public.spelarvard_docs TO service_role;

create index if not exists idx_spelarvard_docs_section
  on public.spelarvard_docs(section_id, sort_order, created_at);

drop trigger if exists trg_spelarvard_docs_updated on public.spelarvard_docs;
create trigger trg_spelarvard_docs_updated
  before update on public.spelarvard_docs
  for each row execute function public.touch_updated_at();

alter table public.spelarvard_docs enable row level security;

drop policy if exists "Read spelarvard_docs" on public.spelarvard_docs;
create policy "Read spelarvard_docs"
  on public.spelarvard_docs for select
  to authenticated
  using (true);

drop policy if exists "Approved users write spelarvard_docs" on public.spelarvard_docs;
create policy "Approved users write spelarvard_docs"
  on public.spelarvard_docs for all
  to authenticated
  using (public.is_approved_user())
  with check (public.is_approved_user());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'spelarvard_docs'
  ) then
    alter publication supabase_realtime add table public.spelarvard_docs;
  end if;
end$$;