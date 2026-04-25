# Stream C — Spelmodell (principsidor)

## Repo
`C:\Scripts\fotboll\Material\Gunnilse\matcher\gunnilseis2026-source\`

## Läs först
- `C:\Users\joel.sjoqvist\.claude\projects\C--Scripts-fotboll\memory\project_canonical_repo.md`
- `STREAMS/00-COORDINATION.md` (i denna repo)

## Mål
Principsidorna förklarar **HUR vi spelar** — identitet, försvar, anfall, fasta, fyra skeden. Ska kännas som en "läs vår spelidé"-bok: stor typografi, en princip i taget, exempel under varje. Innehåll redigerbart via `useContent`-hooken (Supabase-backed) så coach kan uppdatera utan deploy.

## Scope (DU äger dessa filer)

- `src/pages/Identitet.tsx` (lista) och `src/pages/IdentitetDetalj.tsx` (slug-vy)
- `src/pages/Forsvar.tsx`
- `src/pages/Anfall.tsx`
- `src/pages/Fasta.tsx`
- `src/pages/Spelide.tsx` (helhetsvyn)
- `src/data/identity.ts`
- `src/data/principles.ts`
- `src/data/phaseCues.ts`
- `src/hooks/useContent.ts`
- Komponenter som BARA används av principsidor (t.ex. PrincipleCard, om finns)

## Rör INTE

- `src/App.tsx` route-definitioner (skicka önskemål)
- `src/pages/Hem.tsx`, `src/components/Layout.tsx` (Stream A) — även om PrincipleTeaser finns på Hem, är komponenten ägd av Stream A
- `src/pages/MatchKommande.tsx`, match-komponenter (Stream B)
- `src/pages/Roller`, `src/pages/Verktyg`, print-routes (Stream D)

## Branch
```
git checkout -b feat/C-spelmodell
```

## Konkreta uppgifter att börja med

1. **Säkerställ useContent på all data** — `identity.ts`, `principles.ts`, `phaseCues.ts`. Alla principsidor ska gå genom `useContent("identity", IDENTITY)`-mönstret så de kan redigeras live.
2. **Admin-vy `/admin/spelmodell`** — där coach kan klicka och redigera principer (titel, kort, bullets, exempel). Sparar till Supabase. Om `/admin` redan finns (CLAUDE.md nämner det), lägg till en undersektion. Annars bygg ny.
3. **Polera `/identitet/:slug`** — typografi, plats för exempel-text, plats för bild/video (kan vara placeholder med upload-knapp).
4. **"Nästa princip"-navigation** i botten på varje principdetalj — så coach/spelare kan bläddra som i en bok.
5. **Spelide.tsx** — sammanställer alla principer på en sida som "hela spelidén" (för utskrift/onboarding av nya spelare).

## Test

- `npm run dev` på port 8080. Logga in.
- `/identitet` listar 5 identitetspunkter.
- `/identitet/<slug>` visar detaljvy med titel, kort, bullets.
- `/forsvar`, `/anfall`, `/fasta` visar respektive principvy.
- `/spelide` visar helheten.
- Ändra text i admin-vy → reload publik sida → ny text syns.
- `npm run build` ska gå igenom.

## Kommunicera med Joel om

- Du vill ändra `src/App.tsx` (nya routes som `/admin/spelmodell`).
- Du vill ändra Supabase-schema (ny tabell `content` eller motsv).
- Du vill ändra `Layout` eller `AuthGuard`.
- Du vill lägga till bild/video-upload (storage-policy i Supabase).
