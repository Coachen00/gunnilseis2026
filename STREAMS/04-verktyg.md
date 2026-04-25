# Stream D — Tränarverktyg & utskrifter

## Repo
`C:\Scripts\fotboll\Material\Gunnilse\matcher\gunnilseis2026-source\`

## Läs först
- `C:\Users\joel.sjoqvist\.claude\projects\C--Scripts-fotboll\memory\project_canonical_repo.md`
- `STREAMS/00-COORDINATION.md` (i denna repo)

## Mål
Verktygslådan för coach: **roller & trupp, träningsplan, matchblad, motståndaranalys, taktiktavla**. Print-routes producerar A4-utskrift utan navigation/sidebar (de wrappas av `<PrintRoute>` i App.tsx, inte `<Protected>` med Layout).

## Scope (DU äger dessa filer)

- `src/pages/Roller.tsx`
- `src/pages/Verktyg.tsx` (hub-sida)
- `src/pages/Traningsplan.tsx` (print-route)
- `src/pages/Matchblad.tsx` (print-route)
- `src/pages/Motstandaranalys.tsx` (print-route)
- `src/pages/Taktiktavla.tsx`
- `src/components/PrintLayout.tsx` (om finns) eller motsvarande
- `src/data/roster.ts` (om finns) — alternativt `players.ts`
- Komponenter som BARA används av verktyg (RollKort, etc.)

## Rör INTE

- `src/App.tsx` route-definitioner (skicka önskemål)
- `src/pages/Hem.tsx`, `Layout.tsx`, `Login.tsx` (Stream A)
- `src/pages/MatchKommande.tsx`, `src/components/match/*` (Stream B) — men du får LÄSA `src/data/matchplan.ts` (MATCH_META, FORMATION) för att rendera matchblad. Om du behöver ändra där, koordinera.
- Princip-sidor (Stream C)

## Branch
```
git checkout -b feat/D-verktyg
```

## Konkreta uppgifter att börja med

1. **`/verktyg` som hub** — ska visa 4-5 stora kort: Roller & trupp, Träningsplan, Matchblad, Motståndaranalys, Taktiktavla. Varje kort med icon (lucide-react), titel, beskrivning, "Öppna"-knapp.
2. **Polera `/roller`** — rollkort med foto-placeholder, position (LB, CM, ST etc.), 2-3 anvisningar per roll. Lista trupp i botten.
3. **Verifiera A4 print** — öppna `/matchblad`, `/traningsplan`, `/motstandaranalys` i Ctrl+P. Margin, sida-bryt, font-size, ingen header/footer/sidebar. Justera CSS med `@media print` om något är trasigt.
4. **Taktiktavla** — drag-och-släpp spelare på en plan. Spara position till Supabase eller lokalt. Om inte byggd: börja med en enkel SVG-plan + draggable spelare-pucks.
5. **Lägg till print-knappar** — varje verktyg som har en print-route ska ha "Skriv ut"-knapp i `/verktyg`-hub som öppnar print-vyn i ny flik (`window.open('/matchblad', '_blank')`).

## Test

- `npm run dev` på port 8080. Logga in.
- `/verktyg` visar 4-5 kort.
- `/roller` visar rollkort + trupp.
- `/matchblad` Ctrl+P → ren A4-utskrift utan sidebar/header.
- `/traningsplan` Ctrl+P → samma.
- `/taktiktavla` → kan flytta spelare och positioner sparas.
- `npm run build` ska gå igenom.

## Kommunicera med Joel om

- Du vill ändra `src/App.tsx` (nya print-routes eller annat).
- Du vill lägga till foto-upload (Supabase storage).
- Du vill ändra Supabase-schema.
- Du vill ändra `src/data/matchplan.ts` (Stream B äger den).
