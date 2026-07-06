# fotboll · gunnilseis2026 (spelmodellen.se)

> Tunn projekt-CLAUDE. Djup: invoke skill `fotboll`.

## When to touch
Bun + Vite-sajt för spelmodellen.se. Live match-/truppdata + matchplan.

## Local test

Run before pushing — fast gate (speglar CI):
```bash
bun install --frozen-lockfile && bun run test && bunx tsc --noEmit && bunx vite build
```

## Top gotchas
1. **origin/main-regeln** — live match-/truppdata redigeras/byggs BARA från `origin/main`, aldrig worktree/branch (fel motståndare shippades 2026-06-05 från stale worktree).
2. **Veckans match = `src/data/matchplan.ts` → `MATCH_META.opponent`** — single source of truth; kickoff/ISO/samlingstid härleds därifrån.
3. **Bun, inte npm** — README säger npm men CI/deploy kör Bun med `--frozen-lockfile`. Dev-port 8080. Deploy = push `main` → GitHub Pages.
