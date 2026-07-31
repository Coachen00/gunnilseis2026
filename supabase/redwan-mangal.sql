-- Redwan Mangal (målvakt) — manuell insert, 2026-07-31.
--
-- VARFÖR SQL och inte bara squad.ts: frontenden läser tabellen `players` och
-- använder squad.ts bara när tabellen är TOM. En kodändring syns alltså inte
-- live. Samma mönster som supabase/omar-burhan.sql.
--
-- VARFÖR manuellt: Redwan ligger ännu inte i truppen på svenskalag.se, så
-- edge-funktionen `sync-gunnilse-squad` hittar honom inte. `external_id` med
-- prefixet `manual-` markerar att raden inte kommer från syncen.
--
-- Kör i Supabase SQL editor (projekt: gunnilseis2026). Idempotent — kan köras
-- om utan att skapa dubbletter.
--
-- NÄR HAN DYKER UPP PÅ SVENSKALAG.SE: syncen skapar en andra rad med sitt
-- eget external_id. Ta då bort den här raden, annars står han dubbelt på
-- /truppen:
--   delete from public.players where external_id = 'manual-redwan-mangal';

insert into public.players (external_id, name, position, is_staff, staff_role, sort_order)
select 'manual-redwan-mangal', 'Redwan Mangal', 'GK', false, null, 998
where not exists (
  select 1 from public.players where external_id = 'manual-redwan-mangal'
);

-- Kontroll: ska ge fyra målvakter (Ali Carneil, Kamal Fekhouri, Parsa Ahang, Redwan Mangal)
select name, position, external_id from public.players where position = 'GK' order by name;
