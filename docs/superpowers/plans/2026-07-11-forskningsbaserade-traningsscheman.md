# Forskningsbaserade träningsscheman Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harmonisera webbplatsens individuella träning, återstart, spelarvård och PDF-material till en forskningsbaserad fyraveckorsmodell för friska seniorspelare.

**Architecture:** En ny ren datamodul äger veckoprogression, positionsvarianter, ambitionsnivåer och stoppregler. De befintliga sidorna fortsätter använda nuvarande komponenter men läser konsekventa ordinationer. Spelarvård, återstart och PDF-material uppdateras mot samma dosintervall utan nya runtime-beroenden eller backendändringar.

**Tech Stack:** React 18.3, TypeScript 5.8, Vite 6, Vitest 3.2, Testing Library, Tailwind 3.4, Python/reportlab och Poppler för PDF-verifiering.

## Global Constraints

- Målgruppen är friska seniorspelare; kvarstående smärta, akut skada eller sjukdom hänvisas till individuell bedömning.
- Vecka 1–4 använder cirka 60–70, 70–80, 80–90 och 90–100 procent av full planerad veckovolym.
- Full plan innehåller två styrkepass, två sprintexponeringar, ett HIIT/RST-pass, högst ett lugnt aerobt pass och minst en helt ledig dag.
- Högintensiva moment samlas; sprint genomförs utvilad och stoppas vid tydligt fart- eller tekniktapp.
- Ambitionsnivåerna heter full plan, underhåll och miniminivå; stigmatiserande copy får inte förekomma.
- Befintliga designkomponenter och tokens återanvänds. Inga nya runtime-beroenden eller backendändringar.

---

### Task 1: Ren träningsmodell med kontraktstester

**Files:**
- Create: `src/data/individualTraining.ts`
- Create: `src/data/individualTraining.test.ts`

**Interfaces:**
- Produces: `TrainingRole`, `PlanLevel`, `TrainingWeek`, `ROLE_PLANS`, `PLAN_LEVELS`, `TRAINING_WEEKS`, `getSchedule(role, level, week)` och `getRoleForPlayer(player)`.
- `TrainingWeek` innehåller `id`, `label`, `volumeRange`, `speedTarget` och `guidance`.
- Varje `ScheduleItem` innehåller `day`, `sessionType`, `title`, `dose`, `intensity`, `recovery` och `stopRule`.

- [ ] **Step 1: Skriv tester som kräver fyra progressionsveckor, minst en hel vilodag, högst fem träningsdagar, två styrkepass och två sprintinslag i full plan.**

Testerna ska dessutom kräva neutrala nivånamn, 48–72 timmar mellan styrkepassen, positionsspecifika sprintdoser och stoppregel på alla högintensiva pass.

- [ ] **Step 2: Kör `npm test -- src/data/individualTraining.test.ts` och verifiera FAIL eftersom modulen saknas.**

- [ ] **Step 3: Implementera den minsta rena datamodulen.**

Full plan fördelas måndag styrka + acceleration, onsdag HIIT/RST, fredag styrka + maxfart och söndag lugn aerob/teknik; tisdag och lördag är återhämtning och torsdag helt ledig. Underhåll använder måndag, onsdag och fredag. Miniminivå använder två helkroppspass med kort konditionsdos. Veckans volym och fart styrs av `TRAINING_WEEKS`; inga texter använder `maxnära`, `nära max` utan procent/RPE eller nedvärderande etiketter.

- [ ] **Step 4: Kör det riktade testet och verifiera PASS.**

- [ ] **Step 5: Commit `src/data/individualTraining.ts` och testet med `feat: add evidence-based individual training model`.**

### Task 2: Personliga scheman använder modellen

**Files:**
- Modify: `src/pages/Semestern2026.tsx`
- Create: `src/pages/Semestern2026.test.tsx`

**Interfaces:**
- Consumes: Task 1:s exporter utan att duplicera doser i sidkomponenten.
- Produces: en tillgänglig spelarsida där varje vald nivå och vecka visar syfte, dos, intensitet, vila och stoppregel.

- [ ] **Step 1: Skriv sidtester.**

Mocka `useSquad` med en spelare per roll. Verifiera rubriken, fyra valbara veckor, de tre neutrala nivåerna, minst en synlig vilodag, positionsspecifik text, stoppregel och att `Chipstuttar`, `12 x 20 sek maxnära` samt `16 x 50 m` saknas.

- [ ] **Step 2: Kör `npm test -- src/pages/Semestern2026.test.tsx` och verifiera FAIL mot gammal UI/copy.**

- [ ] **Step 3: Ersätt lokala träningskonstanter och `getSchedule` med Task 1:s modell.**

Behåll accordions, spelargruppering, befintliga tokens och personliga positionsnoter. Lägg till en kompakt veckoväljare före schemat och visa viktig handling före bakgrundsförklaring. Använd riktiga knappar/labels, synlig fokusmarkering och minst 44 px klickyta.

- [ ] **Step 4: Kör sidtestet och verifiera PASS.**

- [ ] **Step 5: Commit med `feat: revise personal summer schedules`.**

### Task 3: Harmonisera spelarvårdens råd

**Files:**
- Modify: `src/data/spelarvard.ts`
- Modify: `src/test/spelarvard.test.ts`
- Modify: `src/pages/Spelarvard.test.tsx` endast om befintliga exakta copyassertions kräver det.

**Interfaces:**
- Consumes: dosintervallen i designspecifikationen.
- Produces: konsekventa råd om träningsvecka, styrka, sprint, återhämtning, kolhydrat, protein, vätska, koffein och kreatin.

- [ ] **Step 1: Lägg till tester för följande exakta säkerhetsgränser.**

Testerna kräver 1,6–2,2 g protein/kg/dag, belastningsstyrda 3–8 g kolhydrat/kg/dag, vätskeindividualisering med målet under 2 procent kroppsmassaförlust, kreatin 3–5 g/dag, batchtestade tillskott, 7–9 timmars sömn, RPE 7–9 för tung styrka och minst en hel vilodag.

- [ ] **Step 2: Kör `npm test -- src/test/spelarvard.test.ts` och verifiera FAIL.**

- [ ] **Step 3: Uppdatera endast berörda bullets i `SPELARVARD_SECTIONS`.**

Ersätt den motsägande normen 2–3 pass/vecka med tre tydliga alternativ som matchar Task 1. Beskriv koffein som valfritt, individuellt prövat och sömnpåverkande. Formulera skadeprevention som riskminskning/kapacitetsbyggande, aldrig garanti.

- [ ] **Step 4: Kör båda spelarvårdstesterna och verifiera PASS.**

- [ ] **Step 5: Commit med `fix: align player care advice with training plan`.**

### Task 4: Gradvis kollektiv återstart

**Files:**
- Modify: `src/data/sommaruppstart.ts`
- Create: `src/data/sommaruppstart.test.ts`

**Interfaces:**
- Produces: kalender och pass som går från kontrollerad återintroduktion till match utan tre medel/högdagar staplade inom fyra dygn.

- [ ] **Step 1: Skriv tester som kräver återhämtningsdag efter tvådagarsbelastning, individuella minutgränser, definierad sprintdos och låg belastning senast 48 timmar före match.**

Testerna kräver också att egenperioden hänvisar till samma full/underhåll/miniminivå som Task 1 och att gamla motsägande `2 löp + 2 styrka`-kravet saknas.

- [ ] **Step 2: Kör `npm test -- src/data/sommaruppstart.test.ts` och verifiera FAIL.**

- [ ] **Step 3: Revidera `KALENDER`, berörda `PASS`, periodtexter och fysiska rekommendationer.**

28/7 används som statuskontroll och 60–75 min återintroduktion. Lägerhelgens andra dag sänks eller separerar gym/prehab från hårt smålagsspel; 2/8 är verklig återhämtning och 3/8 lätt/medel utan ny tung bendos. 5/8 behåller högsta fotbollsspecifika belastningen; 6–7/8 taperas. Ange begränsad höghastighetsdos och stoppa vid fart-/tekniktapp.

- [ ] **Step 4: Kör det riktade testet och verifiera PASS.**

- [ ] **Step 5: Commit med `fix: progress summer restart load safely`.**

### Task 5: Uppdatera PDF-materialet

**Files:**
- Modify: `public/spelarvard/gymmet.pdf`
- Modify: `public/spelarvard/kost-bransle.pdf`
- Modify: `public/spelarvard/kost-for-motorn.pdf`
- Temporary only: `tmp/pdfs/` för rendering och extraktion; ta bort efter verifiering.

**Interfaces:**
- Produces: tre fristående, läsbara PDF:er vars råd matchar webbcopy och designspecifikation.

- [ ] **Step 1: Extrahera nuvarande PDF-text och skriv maskinella assertions.**

Assertions kräver att gym-PDF:n innehåller 48–72 timmars återhämtning, RPE 7–9, sprint före kondition och stopp vid kvalitetstapp. Kost-PDF:erna ska innehålla protein 1,6–2,2 g/kg/dag, kolhydrat 3–8 g/kg/dag efter belastning, under 2 procent kroppsmassaförlust, natrium per liter och återhämtning utan en absolut 30-minutersgräns.

- [ ] **Step 2: Kör assertions mot befintliga PDF:er och verifiera minst ett FAIL per dokument.**

- [ ] **Step 3: Generera om presentationerna med reportlab, samma stabila filnamn och en gemensam visuell mall.**

Använd A4 landscape, tydlig svensk typografi, WCAG-liknande kontrast, sidnummer och källsida. Gym-PDF:n beskriver två helkroppspass, progression, RPE, vila, sprintordning och matchnära taper. Kost-PDF:erna delar ansvar: `kost-bransle` är snabb match-/träningsguide; `kost-for-motorn` är fördjupning om energi, vätska, protein och tillskott. Undvik dubblerade motstridiga tabeller.

- [ ] **Step 4: Kör textassertions igen och verifiera PASS.**

- [ ] **Step 5: Rendera samtliga sidor till PNG med Poppler och inspektera alla montage för klippning, överlapp, kontrast och läsbarhet.**

- [ ] **Step 6: Commit de tre PDF:erna med `docs: update evidence-based player guides`.**

### Task 6: Integrerad slutverifiering

**Files:**
- Modify: endast filer med verifierade fel inom uppgiftens omfattning.

**Interfaces:**
- Consumes: alla tidigare tasks.
- Produces: verifierad webbupplevelse och en dokumenterad ren diff.

- [ ] **Step 1: Kör `npm test` och åtgärda endast regressionsfel orsakade av ändringarna.**
- [ ] **Step 2: Kör `npm run lint` och verifiera inga nya fel.**
- [ ] **Step 3: Kör `npm run build` och verifiera lyckat produktionsbygge.**
- [ ] **Step 4: Starta sidan och öppna `/semestern-2026`, `/spelarvard` och `/sommaruppstart` i mobil- och desktopviewport.**
- [ ] **Step 5: Kontrollera tangentbord, fokus, accordions, nivå-/veckoval, lång copy och att alla tre PDF-länkar öppnas.**
- [ ] **Step 6: Sök repoöverskridande efter `Chipstuttar`, `maxnära`, `16 x 50 m`, motsägande veckonormer och absoluta skadegarantier; verifiera noll oavsiktliga träffar i aktiva råd.**
- [ ] **Step 7: Kör `git diff --check`, granska hela diffen och verifiera att `public/gz-preview.html` och andra användarfiler är orörda.**
- [ ] **Step 8: Commit eventuella verifieringsfixar separat med `fix: resolve training plan verification findings`.**
