-- Lägg till Omar Burhan i spelmodellen.se:s trupp.
--
-- Kör i Supabase-projektet för spelmodellen.se: fojviymdmhjlpyrpjexp
--   Dashboard → SQL Editor → klistra in → Run
--
-- VARFÖR SQL och inte bara squad.ts: frontenden läser tabellen `players` och
-- använder squad.ts bara när tabellen är TOM. En kodändring syns alltså inte live.
--
-- VARFÖR DET ÖVERLEVER SYNKEN: sync-gunnilse-squad gör `upsert` på `external_id`
-- och raderar aldrig rader som saknas hos svenskalag.se. Ett external_id som
-- skrapan aldrig producerar (den använder href-vägar) rörs alltså inte.
-- Läggs Omar senare upp på svenskalag.se får han en ANDRA rad med skrapans
-- external_id — då raderar du den manuella nedan.

insert into public.players (external_id, name, position, is_staff, staff_role, sort_order)
values ('manual-omar-burhan', 'Omar Burhan', 'DEF', false, null, 999)
on conflict (external_id) do update
  set name     = excluded.name,
      position = excluded.position;

-- Kontroll: ska ge en rad med Omar Burhan / DEF
select external_id, name, position, sort_order
from public.players
where name ilike '%omar%';

-- Om något ser fel ut, ångra med:
--   delete from public.players where external_id = 'manual-omar-burhan';
