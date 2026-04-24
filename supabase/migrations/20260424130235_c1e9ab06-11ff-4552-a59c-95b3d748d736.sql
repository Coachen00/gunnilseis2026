
insert into storage.buckets (id, name, public)
values ('matchplan', 'matchplan', true)
on conflict (id) do update set public = true;

-- Allow public read of matchplan files
create policy "Public read matchplan"
on storage.objects for select
to public
using (bucket_id = 'matchplan');

-- Allow approved users to upload/update matchplan files via the function (service role bypasses RLS, but keep for safety)
create policy "Approved users can upload matchplan"
on storage.objects for insert
to authenticated
with check (bucket_id = 'matchplan' and public.is_approved_user());

create policy "Approved users can update matchplan"
on storage.objects for update
to authenticated
using (bucket_id = 'matchplan' and public.is_approved_user())
with check (bucket_id = 'matchplan' and public.is_approved_user());
