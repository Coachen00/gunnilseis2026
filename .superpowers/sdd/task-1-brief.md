# Task 1: Lås ägaridentiteten och bygg testbar ägargrind

Läs detta som ensam kravkälla för uppgiften.

## Scope

Ändra `src/lib/owner.ts` så att ägargrinden endast godkänner den exakta normaliserade Supabase-adressen `leojsjoqvist@gmail.com`. Skapa `src/components/OwnerOnly.tsx` som använder en riktig Supabase-session; delad åtkomst får aldrig kvalificera. Skapa `src/components/OwnerOnly.test.tsx`.

## Required behavior

- `isOwnerEmail(email: string | null | undefined): boolean` trimmar och gör adressen gemen och returnerar true endast för `leojsjoqvist@gmail.com`.
- `leojsjoqvist@gmail.com` och ` LeoJSjoqvist@GMAIL.COM ` godkänns.
- `leojsjoqvist`, `leojsjoqvist+test@gmail.com`, annan användare, null och undefined nekas.
- Shared-access-token/-user räknas inte som ägarinloggning.
- `OwnerOnly` visar loading utan privat text, children för ägarsession, och neutral denied-vy för alla andra.
- Följ befintliga auth-/designmönster. Ändra inte orelaterade arbetsfiler.

## Test command

`bun run test -- src/components/OwnerOnly.test.tsx`

Kör även `bun x tsc --noEmit` efter implementationen.

## Reporting

Skriv full rapport till `.superpowers/sdd/task-1-report.md` med ändrade filer, commit-hash, testkommandon och exakt resultat. Committera ändringen med:

`git add src/lib/owner.ts src/components/OwnerOnly.tsx src/components/OwnerOnly.test.tsx src/hooks/useAuthSession.ts && git commit -m "fix(auth): restrict private story to exact owner email"`

Du arbetar inte ensam i repot. Ändra eller återställ inte andras orelaterade ändringar.
