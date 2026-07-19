# Task 3b: Integrera nivåtrappan i den publika spelmodellens topp

Implementera bara den publika spelmodellens pedagogiska topp i `src/pages/MajSpelmodell.tsx` och dess test `src/pages/MajSpelmodell.test.tsx`. Använd befintliga exports från `src/data/spelmodellLevels.ts`, `src/components/spelmodell/LevelPath.tsx` och `src/components/spelmodell/ConceptMap.tsx`. Ändra inte auth, Storyn-route, tactic-board-filer eller `var-forberedd/src/App.tsx`.

## Krav

- Sidan visar de sju nivåerna i ordning: Novis, Level 1, Level 2, Level 3, Level 4, Level 5, Advanced.
- Novis visar de beslutade grundbegreppen och minst en riktig ConceptMap med textfallback.
- Lägg `Så arbetar du med spelmodellen` direkt efter nivåöversikten med enkelt språk.
- Ta bort den nuvarande publika privata Storyn-sektionen/korten ur `/spelmodell`; inga texter som `Det jag vill göra`, `Det jag förstår`, `Det jag missar` eller `Idéer under utveckling` får renderas där.
- Behåll Storyn som en senare separat routeuppgift, men visa inte privat berättelse på spelarens sida.
- Behåll de fyra levande skedena och märk fasta situationer som död boll samt identitet/målvakt som tvärgående.
- Lägg in eller behåll matchlogiken `Spelprincip → Matchtillstånd → Prioritering → Beteende` i den publika orienteringen.

## TDD/verifiering

Utöka testerna först med assertions för sju nivåer, Novis, `Så arbetar du med spelmodellen`, fyra live-skeden, dead-ball och frånvaro av privata Storyn-rubriker.

Run: `bun run test -- src/pages/MajSpelmodell.test.tsx`

Efter implementation: `bun run test -- src/pages/MajSpelmodell.test.tsx && bun x tsc --noEmit`

Commit: `git add src/pages/MajSpelmodell.tsx src/pages/MajSpelmodell.test.tsx && git commit -m "feat(spelmodell): add player level orientation"`

Skriv rapport till `.superpowers/sdd/task-3b-report.md`. Bevara alla orelaterade ändringar och stage endast de två uppgiftsfilerna.
