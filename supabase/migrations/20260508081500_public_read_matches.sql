-- Årets matcher visas publikt på /match/matcher.
-- Skrivrättigheter ligger kvar bakom approved-user-policyerna.
drop policy if exists "Anyone can read matches" on public.matches;

create policy "Anyone can read matches"
on public.matches
for select
to anon, authenticated
using (true);
