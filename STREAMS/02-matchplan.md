# Stream B — Veckans match & matchplan

## Repo
`C:\Scripts\fotboll\Material\Gunnilse\matcher\gunnilseis2026-source\`

## Läs först
- `C:\Users\joel.sjoqvist\.claude\projects\C--Scripts-fotboll\memory\project_canonical_repo.md`
- `STREAMS/00-COORDINATION.md` (i denna repo)

## Mål
Veckans match är **kärnan i arbetssidan**. `/match/kommande` ska vara den primära coach-vyn inför match: motståndare, formation, matchplan (9 sektioner enligt MP_COHERENCE), fokuspunkter, spelarkommentarer. Allt sparas per match i Supabase via `EditableText` (tabellen `match_section_text`).

## Scope (DU äger dessa filer)

- `src/pages/MatchKommande.tsx`
- `src/pages/MatchHistorik.tsx` (om den finns)
- `src/components/match/MatchHeader.tsx`
- `src/components/match/Matchplan.tsx`
- `src/components/match/Formation.tsx`
- `src/components/EditableText.tsx`
- `src/data/matchplan.ts` (MATCH_META, FOCUS, FORMATION, COHERENCE)
- `src/hooks/useMatch.ts`
- Supabase-tabell `match_section_text` (om schema-ändring krävs → koordinera med Joel)

## Rör INTE

- `src/App.tsx` route-definitioner (skicka önskemål)
- `src/pages/Hem.tsx`, `src/components/Layout.tsx`, `src/pages/Login.tsx` (Stream A)
- `src/pages/Identitet*`, `src/pages/Forsvar`, `src/pages/Anfall`, `src/pages/Fasta` (Stream C)
- `src/pages/Roller`, `src/pages/Verktyg`, print-routes (Stream D)

## Branch
```
git checkout -b feat/B-matchplan
```

## Konkreta uppgifter att börja med

1. **"Nästa match"-väljare** — just nu är `MATCH_META` hardcoded i `src/data/matchplan.ts`. Bygg så coach kan välja vilken match som är "kommande" (dropdown eller från Supabase-tabell `matches`).
2. **Formation-tooltip** — hover på spelare i `Formation.tsx` ska visa roll-anvisning kort (t.ex. "Hög press, vinn andrabollar").
3. **"Skriv ut matchplan"-knapp** uppe till höger på MatchKommande som öppnar `/matchblad` (Stream D äger den filen — koordinera om printing-flödet ändras).
4. **Autospar-feedback** i `EditableText`: visuell indikator (t.ex. liten "Sparat ✓" tre sek) när texten har skrivits till Supabase.
5. **Matchhistorik** — `/match/historik` (om finns) ska lista tidigare matcher med plan + utfall, så coach kan jämföra.

## Test

- `npm run dev` på port 8080. Logga in.
- `/match/kommande` ska visa hela matchplanen: header + formation + 9 sektioner + sidofält.
- Skriv i ett `EditableText`-fält → reload → texten ska finnas kvar.
- Anchor-länkar i sidofältet ("Genvägar") ska scrolla till rätt sektion.
- Hovra över spelare i formation → tooltip syns.
- `npm run build` ska gå igenom.

## Kommunicera med Joel om

- Du vill ändra `src/App.tsx` eller `Layout`.
- Du vill ändra Supabase-schema (ny tabell, ny kolumn).
- Du vill ändra `src/lib/supabaseClient.ts`.
