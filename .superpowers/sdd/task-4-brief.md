# Task 4: Ta bort privat Storyn från spelarna och skapa ägarväg

Läs detta som ensam kravkälla för uppgiften.

## Scope

Skapa `src/pages/Storyn.tsx` och `src/pages/Storyn.test.tsx`. Ändra `src/App.tsx`, `src/components/TopNav.tsx`, `src/pages/Hem.tsx` och vid behov `src/components/Footer.tsx`. Använd `OwnerOnly` och `isOwnerEmail` från tidigare task; shared access får aldrig kvalificera.

## Required result

- Lazy route `/storyn` finns.
- Route och innehåll är owner-only för exakt `leojsjoqvist@gmail.com` med riktig Supabase-session.
- Storyn visar högst upp rubriken `Storyn` och den privata berättelsen `Var förberedd`.
- Privata arbetsrubriker finns: `Det jag vill göra`, `Det jag förstår`, `Det jag missar`, `Idéer under utveckling`, `Frågor jag återkommer till`, `Från standards till matchobservation`.
- Storyn visar kedjan standards → ledarskap → träningskultur → spelprincip → matchtillstånd → prioritering → beteende → observation → lärande.
- `/spelmodell` och `/` visar inte privat Storyn-copy och visar inte Storyn-länk för spelare/shared access.
- Loading och denied states innehåller ingen privat text och har säker navigering tillbaka.
- Utloggning/navigering bort från route lämnar ingen privat vy kvar.

## Tests

Mocka Supabase session och shared access i tester. Täck owner allowed, annan user denied, shared access denied, private text absence from public page/home, owner-only nav and route presence.

Run: `npm run test -- --run src/pages/Storyn.test.tsx src/components/TopNav.test.tsx src/pages/MajSpelmodell.test.tsx`

Run after implementation: samma fokuserade testkommando + `node_modules/.bin/tsc.exe --noEmit`.

## Commit/report

Commit:

`git add src/pages/Storyn.tsx src/pages/Storyn.test.tsx src/App.tsx src/components/TopNav.tsx src/pages/Hem.tsx src/components/Footer.tsx && git commit -m "feat(storyn): add owner-only private narrative route"`

Stage endast ändrade relevanta filer. Skriv full rapport till `.superpowers/sdd/task-4-report.md`. Bevara alla orelaterade ändringar.
