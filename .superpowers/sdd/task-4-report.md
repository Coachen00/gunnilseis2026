# Task 4-rapport

## Status

Implementerad med bevarade exporter och datatyper för befintligt UI.

## Ändringar

- 28/7 är statuskontroll och 60–75 min återintroduktion med individuella minutgränser.
- 1/8 undviker dubbel hård dos; 2/8 är verklig återhämtning; 3/8 är låg/lätt–medel utan tung bendos.
- 5/8 behåller hög belastning och får en begränsad höghastighetsdos med kvalitetsstopp.
- 6–7/8 ligger kvar på låg belastning inför match.
- Egenperioden använder nivåerna Full plan, Underhåll och Minsta effektiva dos; det gamla kravet om två löp- och två styrkepass är borttaget.

## TDD och verifiering

- RED: `npm test -- src/data/sommaruppstart.test.ts` — 5 av 6 tester föll på saknade krav.
- GREEN: `npm test -- src/data/sommaruppstart.test.ts` — 6 av 6 passerade.
- Regression: `npm test` — 31 testfiler, 365 tester passerade.
- Build: `npm run build` — passerade.
- Diff: `git diff --check` — passerade.

## Concerns

Inga kända blockerare. Belastningsnivån `Låg` för 3/8 används för att förhindra tre medel/högdagar inom fyra dygn; detaljtexten förtydligar att fotbollsinnehållet kan vara lätt–medel utan ny tung bendos.
