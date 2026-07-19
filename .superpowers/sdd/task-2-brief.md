# Task 2: Define the player-facing level and concept model

Läs detta som ensam kravkälla för uppgiften.

## Scope

Skapa `src/data/spelmodellLevels.ts`, `src/data/spelmodellLevels.test.ts`, `src/components/spelmodell/ConceptMap.tsx` och `src/components/spelmodell/LevelPath.tsx`. Uppdatera `src/components/LevelBadge.tsx` från legacy 0–3 till den nya spelartrappan utan att göra orelaterad refaktorering.

## Required interfaces

- `type SpelmodellLevelId = "novis" | "level-1" | "level-2" | "level-3" | "level-4" | "level-5" | "advanced"`.
- `SpelmodellLevel` ska innehålla `id`, `label`, `purpose`, `concepts`, `playerOutcome` och `mapIds`.
- Exportera en ordnad `SPELMODELL_LEVELS` med exakt etiketter `Novis`, `Level 1`, `Level 2`, `Level 3`, `Level 4`, `Level 5`, `Advanced`.
- Exportera `LIVE_PHASE_IDS` med exakt fyra levande skeden: försvarsspel, övergång till anfall, anfallsspel, övergång till försvar.
- Exportera speciallager för `Identitet`, `Fasta situationer · död boll` och `Målvaktsperspektiv · tvärgående`.
- Novis ska täcka `Planens ytor`, `Korridorer`, `Gyllene zonen`, `Assistytan`, `Spelbredd`, `Speldjup`, `Spelavstånd`, `Spelbarhet` samt boll/medspelare/motståndare/mål.
- ConceptMap ska ha typed nodes/edges och en textfallback; gör inte visualiseringen beroende av Mermaid-runtime.
- LevelPath ska ha keyboard navigation, `aria-current`, tydlig selected-state och minst 44px klickyta.

## Content rules

Nivåerna ska vara spelarriktade och enkelt skrivna. Använd `docs/specs/planindelning.md` samt befintliga `KorridorerDiagram`, `GoldenZoneDiagram` och `SpelytorDiagram` som källor. Level 1 är endast fyra levande skeden; fasta situationer är död boll och identitet/målvakt är tvärgående.

## Tests

Skriv data- och komponenttester för exakt ordning, Novis-begreppen, de fyra live-skedena, speciallagren, ConceptMap-textfallback och LevelPath selected/aria-state.

Run: `bun run test -- src/data/spelmodellLevels.test.ts`

Run after implementation: `bun run test -- src/data/spelmodellLevels.test.ts && bun x tsc --noEmit`

## Commit/report

Commit:

`git add src/data/spelmodellLevels.ts src/data/spelmodellLevels.test.ts src/components/LevelBadge.tsx src/components/spelmodell/ConceptMap.tsx src/components/spelmodell/LevelPath.tsx && git commit -m "feat(spelmodell): add seven-level player learning path"`

Write full report to `.superpowers/sdd/task-2-report.md` with files, commit, tests, output and concerns. You are not alone in the codebase; preserve unrelated modifications and do not revert others.
