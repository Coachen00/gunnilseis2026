# Period 2 Implementation Plan

Spec: `docs/superpowers/specs/2026-07-21-period-2-design.md` (läs den först — den är facit för allt innehåll).

## Global Constraints

- Branch: `feat/period-2`. Ingen merge till main — PR öppnas i slutet.
- Testgate efter varje task: `bun run test && bun x tsc --noEmit && bun x vite build` → exit 0.
- Rör inte `src/data/matchplan.ts`, `src/data/tavlingar.ts` eller truppdata.
- Inga nya beroenden, inga nya GraphicType-värden, inga nya grafikkomponenter.
- Svenska i allt användarvänt innehåll. Ton och stil: härma Period 1 exakt.
- Inga kodkommentarer utom icke-uppenbara VARFÖR.

## Task 1: Data — period2.ts + breddat Period.id

**Filer:** Skapa `src/data/period2.ts`, `src/data/period2.test.ts`. Ändra `src/data/period1.ts` (endast raden `id: "period-1"` i interfacet `Period` → `id: "period-1" | "period-2"`).

- Läs `src/data/period1.ts` i sin helhet — struktur, ton, meningslängd och fältanvändning är facit.
- `period2.ts` importerar typerna (`Period`, `Week`, `Session`, `GraphicType`, `EffectLogicBlock`, `Principle`, `Reference`) från `./period1` och exporterar: `PERIOD_2: Period`, `PERIOD_2_TIMELINE` (6 poster, labels = veckoteman ur specen), `PERIOD_2_COACH_LANGUAGE`, `PERIOD_2_PRINCIPLES: Principle[]` (8 st enligt specens tabell; skriv `detail` på tränarnivå i Period 1-ton), `PERIOD_2_REFERENCES: Reference[]` (Liverpool, Atalanta, GAIS enligt specen).
- 6 veckor × 3 pass (mån/ons/tor) med datum exakt enligt specen. Varje `Session` fyller alla fält: `purpose`, `principle`, `activation`, `exercise1`, `exercise2`, `game`, `coachingCues` (3–6 st, återanvänd periodens coach language + veckospecifika), `positiveReinforcement` (2–3), `commonErrors` (2–4), `progression`, `matchConnection`, `kpi`, `graphic`. Övningarna ska vara konkreta spelformer i Period 1-stil (t.ex. "4v4+3 i tre korridorer: poäng vid återerövring inom 5 sekunder") och bygga veckans tema enligt spec.
- `effectLogic`: 4 block (Resurser/Aktiviteter/Mål/Effekt) med 5–6 punkter vardera, press/omställningstema, samma korthuggna stil som Period 1.
- `followUp` enligt specen.
- `period2.test.ts` (vitest, samma stil som `src/data/sommaruppstart.test.ts`): 6 veckor; 18 pass totalt (`totalSessions`); veckonummer 1–6 unika; varje veckas sessions har day-sekvensen Måndag/Onsdag/Torsdag; datumen matchar exakt listan ur specen (hårdkoda förväntad lista i testet); alla `kpi` icke-tomma; `id === "period-2"`; `detailRoute === "/period/2"`; alla `coachingCues`-listor icke-tomma; `PERIOD_2_TIMELINE` har 6 poster i veckoordning.

**Acceptans:** testgate grönt. `git add src/data/period2.ts src/data/period2.test.ts src/data/period1.ts && git commit -m "feat(period2): add autumn period data with press and transition themes"`.

## Task 2: Komponentprops — WeekJourney + PeriodTimeline

**Filer:** Ändra `src/components/period/WeekJourney.tsx`, `src/components/period/PeriodTimeline.tsx`.

- `WeekJourney`: ny optional prop `period` med default `PERIOD_1` (behåll importen). Rendera `period.weeks`.
- `PeriodTimeline`: ny optional prop `timeline` med default `PERIOD_1_TIMELINE`. Typen: `{ week: number; label: string }[]` (readonly-kompatibel — använd `ReadonlyArray`).
- Inga andra ändringar. Befintliga anrop utan props ska fungera oförändrat (Period1.test.tsx är facit).

**Acceptans:** testgate grönt, särskilt `src/pages/Period1.test.tsx`. Commit: `refactor(period): accept period data as props in shared components`.

## Task 3: Sida — Period2.tsx + route + korslänkar

**Filer:** Skapa `src/pages/Period2.tsx`, `src/pages/Period2.test.tsx`. Ändra `src/App.tsx`, `src/pages/Period1.tsx`, `src/pages/MajSpelmodell.tsx`.

- `Period2.tsx`: kopiera `src/pages/Period1.tsx` rakt av och byt: alla `PERIOD_1*`-importer → `PERIOD_2*` från `@/data/period2`; alla interna länkar `/period/1` → `/period/2` (behåll query/anchor-mönstret `?tab=passen#vecka-N`); hero- och flikintro-copy skrivs om till press/omställningstemat (kort, samma ton — "Resan – sex veckor" behålls); `WeekJourney` får `period={PERIOD_2}` och `to="/period/2?tab=passen"`; `PeriodTimeline` får `timeline={PERIOD_2_TIMELINE}`. Lägg överst i filen en kommentar: `// ponytail: medveten kopia av Period1.tsx — parametrisera till PeriodPage först när period 3 finns.`
- I Kartan-fliken: länk tillbaka till Period 1 ("Period 1 – Diagonalt spel" → `/period/1`).
- `src/App.tsx`: lazy route `/period/2` med `Protected routeName="Period 2"`, samma mönster som `/period/1` (rad ~158).
- `src/pages/Period1.tsx`: i uppföljningssektionen (followUp), lägg en länk "Nästa period: Vinna bollen och slå till →" till `/period/2`. Minsta möjliga ingrepp.
- `src/pages/MajSpelmodell.tsx`: där `/period/1` länkas, lägg motsvarande länk till `/period/2` i samma visuella mönster.
- `Period2.test.tsx`: kopiera upplägget från `src/pages/Period1.test.tsx`, byt data/route. Testa: sidan renderar med Period 2-titel; fliknavigering fungerar; `?tab=passen` visar pass; länk till `/period/1` finns.

**Acceptans:** testgate grönt (inkl. Period1.test.tsx oförändrat grönt). Commit: `feat(period2): add period 2 page, route and cross links`.

## Task 4: Verifiering + PR (görs av huvudloopen, inte exekveraren)

- Full testgate + `bun x vite build`.
- Diff-granskning mot spec.
- Push + PR mot main. Ingen auto-merge.

## Vad som INTE ingår

- Ingen parametrisering av Period1.tsx till gemensam PeriodPage (först vid period 3).
- Inga nya grafikkomponenter eller GraphicType-värden.
- Inga ändringar i matchdata, truppdata, navigation (TopNav) eller Hem.
- Ingen Supabase/migrering. Ingen ändring av Storyn/spelmodellsidor utöver MajSpelmodell-länken.
