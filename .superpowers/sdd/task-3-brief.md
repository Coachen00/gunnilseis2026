# Task 3: Rebuild the public Spelmodell page around the level path

Läs detta som ensam kravkälla för uppgiften.

## Scope

Integrera den nya modellen i `src/pages/MajSpelmodell.tsx`, uppdatera `src/pages/MajSpelmodell.test.tsx`, `src/components/maj2026/GrundenSection.tsx`, `src/data/majSpelmodell.ts` och `src/data/grunden.ts` vid behov. `/spelmodell` ska fortsatt vara spelarens skyddade sida.

## Required public result

- Sidan visar exakt sju nivåer i ordning: `Novis`, `Level 1`, `Level 2`, `Level 3`, `Level 4`, `Level 5`, `Advanced`.
- Novis visar konceptkartor/textfallback för planens ytor, korridorer, gyllene zonen, assistytan, spelbredd, speldjup, spelavstånd och spelbarhet.
- Rubriken `Så arbetar du med spelmodellen` ligger direkt efter nivåöversikten och har enkel stegvis förklaring.
- Level 1 visar exakt fyra levande skeden: försvarsspel, när vi vinner bollen, anfallsspel, när vi tappar bollen.
- Fasta situationer visas separat som `Fasta situationer · död boll`.
- Identitet och målvaktsperspektiv märks som tvärgående lager, inte skeden.
- Ingen privat Storyn-text eller privat Storyn-kort finns på `/spelmodell`.
- Varje levande skede använder/visar `Spelprincip → Matchtillstånd → Prioritering → Beteende`, inklusive resultat, tid, motståndarpress, spelarstatus och numerär.
- Behåll befintligt player content, principer, quick actions, träning och film men placera dem under tydlig nivåhierarki utan onödig duplicering.

## Tests first

Utöka `MajSpelmodell.test.tsx` med assertions för nivåetiketter, Novisbegrepp, `Så arbetar du med spelmodellen`, fyra live-skeden, dead-ball text, tvärgående lager och frånvaro av `Det jag vill göra`, `Det jag förstår`, `Det jag missar`, `Idéer under utveckling`.

Run red: `bun run test -- src/pages/MajSpelmodell.test.tsx`

Run green: `bun run test -- src/pages/MajSpelmodell.test.tsx && bun run test && bun x tsc --noEmit && bun x vite build`

## Commit/report

Commit:

`git add src/pages/MajSpelmodell.tsx src/pages/MajSpelmodell.test.tsx src/components/maj2026/GrundenSection.tsx src/data/majSpelmodell.ts src/data/grunden.ts && git commit -m "feat(spelmodell): reorganize player model by learning levels"`

Write full report to `.superpowers/sdd/task-3-report.md` with files, tests, output, commit and concerns. Do not touch or stage unrelated user changes, especially tactic-board files and `var-forberedd/src/App.tsx`.
