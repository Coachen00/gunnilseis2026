# Task 3b fix: finish and commit current public model integration

The previous worker left the intended Task 3b changes uncommitted in `src/pages/MajSpelmodell.tsx` and `src/pages/MajSpelmodell.test.tsx`. Inspect the current diff relative to `5478f54`, run the focused tests, and make only fixes needed for the Task 3b brief.

Requirements: seven labels, Novis concepts/map fallback, `Så arbetar du med spelmodellen` immediately after level overview, no private Storyn cards/text, four live phases, dead-ball separation, tvärgående identity/goalkeeper, and match flow/factors. Preserve unrelated changes and stage only the two target files.

Commands:

`bun run test -- src/pages/MajSpelmodell.test.tsx`

`bun x tsc --noEmit`

Commit exactly:

`git add src/pages/MajSpelmodell.tsx src/pages/MajSpelmodell.test.tsx && git commit -m "feat(spelmodell): add player level orientation"`

Write report to `.superpowers/sdd/task-3b-report.md` with exact tests/output and concerns. Do not modify any other file.
