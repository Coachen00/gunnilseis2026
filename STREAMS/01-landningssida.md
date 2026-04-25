# Stream A — Landningssida & publik vy

## Repo
`C:\Scripts\fotboll\Material\Gunnilse\matcher\gunnilseis2026-source\`

## Läs först
- `C:\Users\joel.sjoqvist\.claude\projects\C--Scripts-fotboll\memory\project_canonical_repo.md`
- `STREAMS/00-COORDINATION.md` (i denna repo)

## Mål
Sajten ska kännas som en **publik landningssida** för utomstående (föräldrar, spelare som inte loggat in) — samtidigt som arbetssidor (matchplan, verktyg, roller) fortfarande kräver auth. Just nu kräver `/` (Hem) inloggning. Det ska ändras.

## Scope (DU äger dessa filer)

- `src/pages/Hem.tsx`
- `src/pages/Login.tsx`
- `src/components/Layout.tsx` (nav, header, footer)
- `src/components/AuthGuard.tsx` (om publik vy ska existera utan att bryta auth-pattern)
- `src/components/PageHero.tsx`
- `src/components/ScrollChapter.tsx`
- `src/components/ChapterNumber.tsx`
- `src/components/PrincipleTeaser.tsx`
- `src/components/ScrollCue.tsx`
- `src/components/PhaseFlow.tsx`
- Hero-relaterad CSS i `src/index.css` om det krävs

## Rör INTE

- `src/App.tsx` route-definitioner (skicka önskemål till Joel istället)
- `src/pages/MatchKommande.tsx`, `src/components/match/*` (Stream B)
- `src/pages/Identitet*`, `src/pages/Forsvar`, `src/pages/Anfall`, `src/pages/Fasta`, `src/pages/Spelide` (Stream C)
- `src/pages/Roller`, `src/pages/Verktyg`, print-routes (Stream D)
- Supabase-tabeller eller edge functions

## Branch
```
git checkout -b feat/A-landningssida
```

## Konkreta uppgifter att börja med

1. **Gör `/` (Hem) tillgänglig utan login.** Tre alternativ:
   - Skapa en `<PublicRoute>`-wrapper (motsvarighet till `<Protected>`) och flytta Hem dit. Ändring i App.tsx → koordinera med Joel.
   - Eller: gör `<AuthGuard>` valfritt med en `requireAuth={false}`-prop.
   - Joel väljer.
2. **Lägg till "Logga in" / "Registrera"-CTA** i Layout-headern för icke-inloggade. För inloggade: visa namn + "Logga ut".
3. **Säkerställ att Hem-länkarna** till /forsvar, /anfall, /spelide etc. leder till login-prompt om man inte är inloggad — inte trasig sida eller blank skärm.
4. **Polera hero-copy** om något känns off — kolla med Joel innan stora textändringar.
5. **Föräldra-perspektivet**: lägg till en kort sektion på Hem som förklarar "Vad är detta?" för någon som inte vet vem Gunnilse IS är.

## Test

- `npm run dev` på port 8080.
- Öppna inkognito (utloggad) → `/` ska visa Hem direkt utan redirect till login.
- Klicka in på princip-sida → ska kräva login.
- Logga in → header ska visa namn + utloggning.
- `npm run build` ska gå igenom utan TS-fel.

## Kommunicera med Joel om

- Du vill ändra `src/App.tsx` (routes).
- Du vill ändra på Layout som påverkar hur arbetssidor ser ut.
- Du vill lägga till nya beroenden (`npm install`).
