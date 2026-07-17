# Spelmodellen och privata Storyn Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygg om spelmodellens pedagogiska hierarki till Novis–Advanced och separera Storyn samt privat utvecklingsmaterial till ett ägarområde för exakt `leojsjoqvist@gmail.com`.

**Architecture:** Publika spelardata modelleras i en separat nivådefinition som renderas av en kompakt nivåtrappa och återanvändbara konceptkartor. Privat Storyn laddas via en separat lazy route efter en strikt e-postgrind; dess data importeras aldrig av `/spelmodell` eller startsidan. Den befintliga fyrdelningen av levande skeden behålls, medan fasta situationer och identitet fortsätter vara separata lager.

**Tech Stack:** React, TypeScript, React Router, Supabase Auth, Supabase/Postgres RLS, Vitest, Bun, Vite, befintligt designsystem med Tailwind-klasser.

## Global Constraints

- Publik spelmodell är spelarriktad och ska vara tillgänglig via befintlig skyddad spelar-/laginloggning.
- Storyn och privat utvecklingsmaterial är endast tillgängligt för exakt Supabase-e-post `leojsjoqvist@gmail.com`.
- Delad åtkomst, andra admins och e-postvarianter får inte ge ägaråtkomst.
- Spelmodellen har exakt sju nivåer: `Novis`, `Level 1`, `Level 2`, `Level 3`, `Level 4`, `Level 5`, `Advanced`.
- Level 1 innehåller exakt fyra levande skeden; fasta situationer är död boll och inte ett levande skede.
- Identitet och målvaktsperspektiv är tvärgående, inte egna skeden.
- Matchlogiken är `Spelprincip → Matchtillstånd → Prioritering → Beteende`.
- Ingen privat Storyn-text får importeras i publika spelmodellens statiska datafiler.
- Befintliga användarändringar i `.github/workflows/sync-svenskalag.yml`, `.github/workflows/test.yml`, `STREAMS/00-COORDINATION.md` och `var-forberedd/src/App.tsx` får inte inkluderas i implementationens commits.
- Push sker endast till `Coachen00/gunnilseis2026`, branch `main`, efter lokal test, build, diffkontroll, CI/deploy och livekontroll.

---

### Task 1: Lås ägaridentiteten och bygg testbar ägargrind

**Files:**
- Modify: `src/lib/owner.ts`
- Create: `src/components/OwnerOnly.tsx`
- Create: `src/components/OwnerOnly.test.tsx`
- Modify: `src/hooks/useAuthSession.ts` only if a reusable exact-owner hook is needed

**Interfaces:**
- `isOwnerEmail(email: string | null | undefined): boolean` returns true only for the normalized exact address `leojsjoqvist@gmail.com`.
- `OwnerOnly` consumes the current Supabase session and renders children only for the owner; shared-access state never qualifies.
- `OwnerOnly` produces loading, denied and allowed render states for routes and navigation.

- [ ] **Step 1: Write failing unit tests** for exact match, uppercase/whitespace normalization, null, username-only, same-domain other user, shared-access-only and allowed owner session.

```tsx
expect(isOwnerEmail(" leojsjoqvist@gmail.com ")).toBe(true);
expect(isOwnerEmail("leojsjoqvist@GMAIL.COM")).toBe(true);
expect(isOwnerEmail("leojsjoqvist")).toBe(false);
expect(isOwnerEmail("leojsjoqvist+test@gmail.com")).toBe(false);
expect(isOwnerEmail("annan@gmail.com")).toBe(false);
```

- [ ] **Step 2: Run the focused tests and verify they fail** with the current username/domain-wildcard implementation.

Run: `bun run test -- src/components/OwnerOnly.test.tsx`

Expected: FAIL because `owner.ts` currently accepts username and address variants.

- [ ] **Step 3: Implement the exact owner predicate** using `email?.trim().toLowerCase() === "leojsjoqvist@gmail.com"`; remove the username fallback and wildcard behavior.

- [ ] **Step 4: Implement `OwnerOnly`** using the real Supabase session, not `getSharedAccessUser()`. Show a neutral loading state while the session resolves and a non-private denied state for every non-owner.

- [ ] **Step 5: Run focused tests and verify they pass.**

Run: `bun run test -- src/components/OwnerOnly.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the isolated auth boundary.**

```bash
git add src/lib/owner.ts src/components/OwnerOnly.tsx src/components/OwnerOnly.test.tsx src/hooks/useAuthSession.ts
git commit -m "fix(auth): restrict private story to exact owner email"
```

### Task 2: Define the player-facing level and concept model

**Files:**
- Create: `src/data/spelmodellLevels.ts`
- Create: `src/data/spelmodellLevels.test.ts`
- Modify: `src/components/LevelBadge.tsx`
- Create: `src/components/spelmodell/ConceptMap.tsx`
- Create: `src/components/spelmodell/LevelPath.tsx`

**Interfaces:**
- `type SpelmodellLevelId = "novis" | "level-1" | "level-2" | "level-3" | "level-4" | "level-5" | "advanced"`.
- `SpelmodellLevel` contains `id`, `label`, `purpose`, `concepts`, `playerOutcome`, and `mapIds`.
- `ConceptMap` renders an accessible labelled visual map from a typed node/edge definition and a text fallback.
- `LevelPath` renders the seven levels in order and exposes the selected level to the page.

- [ ] **Step 1: Write data tests** asserting exactly seven ordered levels, exact labels, Novis concept coverage, and Level 1's four live phases.

```ts
expect(SPELMODELL_LEVELS.map((level) => level.label)).toEqual([
  "Novis", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Advanced",
]);
expect(SPELMODELL_LEVELS[0].concepts).toEqual(expect.arrayContaining([
  "Planens ytor", "Korridorer", "Gyllene zonen", "Assistytan",
  "Spelbredd", "Speldjup", "Spelavstånd", "Spelbarhet",
]));
expect(LIVE_PHASE_IDS).toHaveLength(4);
expect(SPECIAL_LAYERS).toEqual(expect.arrayContaining(["Identitet", "Fasta situationer"]));
```

- [ ] **Step 2: Run the focused data tests and verify they fail.**

Run: `bun run test -- src/data/spelmodellLevels.test.ts`

Expected: FAIL because the new level data does not exist.

- [ ] **Step 3: Add the seven-level data model** with player-language descriptions and the foundational Novis concepts. Keep factual content aligned with `docs/specs/planindelning.md` and existing corridor/zone diagrams.

- [ ] **Step 4: Add typed concept-map definitions** for planens ytor, korridorer, gyllene zonen, assistytan, spelbredd/speldjup, spelavstånd and spelbarhet. Each map must include a plain-text fallback so the relationship is understandable without the visual.

- [ ] **Step 5: Extend `LevelBadge`** from the legacy 0–3 model to the seven labels without breaking existing call sites; migrate old badge usages to explicit new ids where they refer to the player-facing ladder.

- [ ] **Step 6: Implement `LevelPath` and `ConceptMap`** with keyboard focus, visible selected state, semantic headings, `aria-current` and minimum 44px interactive targets.

- [ ] **Step 7: Run focused tests and typecheck.**

Run: `bun run test -- src/data/spelmodellLevels.test.ts && bun x tsc --noEmit`

Expected: PASS with no type errors.

- [ ] **Step 8: Commit the content model and reusable visuals.**

```bash
git add src/data/spelmodellLevels.ts src/data/spelmodellLevels.test.ts src/components/LevelBadge.tsx src/components/spelmodell/ConceptMap.tsx src/components/spelmodell/LevelPath.tsx
git commit -m "feat(spelmodell): add seven-level player learning path"
```

### Task 3: Rebuild the public Spelmodell page around the level path

**Files:**
- Modify: `src/pages/MajSpelmodell.tsx`
- Modify: `src/pages/MajSpelmodell.test.tsx`
- Modify: `src/components/maj2026/GrundenSection.tsx`
- Modify: `src/data/majSpelmodell.ts`
- Modify: `src/data/grunden.ts`

**Interfaces:**
- `/spelmodell` remains the player-facing protected route.
- The page renders `LevelPath`, a level detail region, concept maps in Novis, `Så arbetar du med spelmodellen`, four live phases, and separate cross-cutting/dead-ball layers.
- Existing phase blocks retain their content but are presented through the new hierarchy and shared match-state template.

- [ ] **Step 1: Add failing page tests** for seven level labels, Novis concepts/maps, the `Så arbetar du med spelmodellen` heading, four live phase labels, dead-ball wording, and absence of private Storyn cards/text.

```tsx
expect(screen.getByRole("heading", { name: "Så arbetar du med spelmodellen" })).toBeInTheDocument();
expect(screen.getByText("Novis")).toBeInTheDocument();
expect(screen.getByText("Advanced")).toBeInTheDocument();
expect(screen.getByText("Fasta situationer · död boll")).toBeInTheDocument();
expect(screen.queryByText("Det jag vill göra")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the focused page tests and verify they fail** against the current mixed hierarchy and public Storyn section.

Run: `bun run test -- src/pages/MajSpelmodell.test.tsx`

Expected: FAIL on the new hierarchy and private-content absence assertions.

- [ ] **Step 3: Replace the current public Storyn section** with the player-facing level orientation; remove private Storyn cards and narrative from `/spelmodell`.

- [ ] **Step 4: Render Novis concept maps and Level 1 phase orientation** before deeper material. Keep the exact four live phases and identify `Identitet · tvärgående`, `Fasta situationer · död boll` and `Målvaktsperspektiv · tvärgående` as special layers.

- [ ] **Step 5: Add `Så arbetar du med spelmodellen`** immediately after the level overview, using the seven-step simple-language workflow from the spec.

- [ ] **Step 6: Apply the shared template** `Spelprincip → Matchtillstånd → Prioritering → Beteende` to each live phase, including result, time, opponent pressure, player status and numerical advantage/disadvantage as match-state inputs.

- [ ] **Step 7: Preserve and place existing player content** for principles, quick actions, training and film under the relevant level instead of duplicating the same concept in unrelated sections.

- [ ] **Step 8: Run focused page tests, all tests, typecheck and build.**

Run: `bun run test -- src/pages/MajSpelmodell.test.tsx && bun run test && bun x tsc --noEmit && bun x vite build`

Expected: all tests pass, typecheck exits 0, Vite build exits 0.

- [ ] **Step 9: Commit the public player model.**

```bash
git add src/pages/MajSpelmodell.tsx src/pages/MajSpelmodell.test.tsx src/components/maj2026/GrundenSection.tsx src/data/majSpelmodell.ts src/data/grunden.ts
git commit -m "feat(spelmodell): reorganize player model by learning levels"
```

### Task 4: Remove private Storyn from public navigation and create owner-only route

**Files:**
- Create: `src/pages/Storyn.tsx`
- Create: `src/pages/Storyn.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/TopNav.tsx`
- Modify: `src/pages/Hem.tsx`
- Modify: `src/components/Footer.tsx` if it exposes the private link

**Interfaces:**
- `/storyn` is a lazy-loaded route wrapped by `OwnerOnly` and the existing `Layout`/`ErrorBoundary` pattern.
- `Storyn` renders private headings and the `Var förberedd` narrative only after owner access is confirmed.
- Public home and player navigation contain no private Storyn link or private narrative.

- [ ] **Step 1: Write failing route/component tests** for owner allowed, non-owner denied, shared access denied, public home private-text absence and owner-only navigation visibility.

- [ ] **Step 2: Run focused tests and verify they fail** because the private route and removal do not yet exist.

Run: `bun run test -- src/pages/Storyn.test.tsx src/components/TopNav.test.tsx`

Expected: FAIL on route and visibility assertions.

- [ ] **Step 3: Extract the private Storyn presentation** from `MajSpelmodell.tsx` into `Storyn.tsx`. Keep the six private work areas and the standards → leadership → training culture → principle → match state → priority → behavior → observation → learning chain.

- [ ] **Step 4: Add the lazy `/storyn` route** in `src/App.tsx` with an owner-only wrapper that never treats shared access as sufficient.

- [ ] **Step 5: Make TopNav owner-aware** so the Storyn entry appears only for the exact owner session; do not show a misleading disabled item to players.

- [ ] **Step 6: Remove the public Storyn block** from `Hem.tsx` and any footer/global links. The public home may keep a neutral link to the player-facing Spelmodell, but no private Storyn copy.

- [ ] **Step 7: Add owner denied/loading states** that contain no private text and provide a safe navigation path.

- [ ] **Step 8: Run focused tests and full verification.**

Run: `bun run test -- src/pages/Storyn.test.tsx src/components/TopNav.test.tsx && bun run test && bun x tsc --noEmit && bun x vite build`

Expected: all tests pass, typecheck and build exit 0.

- [ ] **Step 9: Commit the private route boundary.**

```bash
git add src/pages/Storyn.tsx src/pages/Storyn.test.tsx src/App.tsx src/components/TopNav.tsx src/pages/Hem.tsx src/components/Footer.tsx
git commit -m "feat(storyn): add owner-only private narrative route"
```

### Task 5: Add server-side private storage boundary if Storyn is persisted

**Files:**
- Inspect and use existing Supabase migration directory under `supabase/migrations/`
- Create: `supabase/migrations/20260717120000_create_private_storyn.sql` only if the existing project has no suitable private content table
- Create or modify: `src/data/privateStoryn.ts` as a repository that fetches private sections after owner verification
- Create or modify: `src/data/privateStoryn.test.ts`

**Interfaces:**
- `PrivateStorynSection` has `slug`, `title`, `body`, `sortOrder` and optional `updatedAt`.
- `getPrivateStorynSections()` returns only rows allowed by Supabase RLS.
- No private body text is included in `MajSpelmodell.tsx`, `Hem.tsx`, public data files or the initial public bundle.

- [ ] **Step 1: Inspect existing Supabase schema and content patterns** before creating a table; reuse an existing private content mechanism if it already exists.

- [ ] **Step 2: Write a failing repository/RLS test or local query contract** asserting that owner rows are scoped to the exact authenticated user and shared access has no Supabase session.

- [ ] **Step 3: Add the minimal migration or repository change** with an RLS policy based on `auth.jwt() ->> 'email' = 'leojsjoqvist@gmail.com'`; do not seed private prose into a public Git-tracked file.

- [ ] **Step 4: Load private sections only in `Storyn.tsx`** after `OwnerOnly` has resolved access, with loading, empty and error states.

- [ ] **Step 5: Run the repository tests and inspect the generated build chunks** to verify the public chunk contains no private Storyn body text.

Run: `bun run test -- src/data/privateStoryn.test.ts && bun x vite build; rg -n "Det jag vill göra|Det jag förstår|Det jag missar|Idéer under utveckling" dist/assets dist/index.html`

Expected: tests pass; the public asset scan does not find private Storyn text in the public entry/chunks. Any authenticated owner-only fetch remains server-controlled by RLS.

- [ ] **Step 6: Commit only the schema/repository boundary if required.**

```bash
git add supabase/migrations src/data/privateStoryn.ts src/data/privateStoryn.test.ts src/pages/Storyn.tsx
git commit -m "feat(storyn): secure private narrative storage"
```

### Task 6: Final regression, deployment and live verification

**Files:**
- Modify only files proven necessary by failing tests.
- Do not stage unrelated pre-existing changes listed in Global Constraints.

**Interfaces:**
- GitHub Actions deploys `main` to GitHub Pages with `public/CNAME` set to `spelmodellen.se`.
- Live routes to verify: `/`, `/spelmodell`, `/storyn`.

- [ ] **Step 1: Inspect the final diff and status.**

Run: `git status --short; git diff --check; git diff HEAD~1 --stat`

Expected: only implementation/spec/plan files relevant to this work are committed; the four pre-existing unrelated modifications remain unstaged.

- [ ] **Step 2: Run the full local gate.**

Run: `bun run test && bun x tsc --noEmit && bun x vite build`

Expected: all tests pass, typecheck exits 0 and build exits 0.

- [ ] **Step 3: Push the correct repository and branch.**

```bash
git remote -v
git branch --show-current
git push origin main
```

Expected: remote is `Coachen00/gunnilseis2026`, branch is `main`, push succeeds without force.

- [ ] **Step 4: Wait for GitHub Actions test and Pages deploy** and inspect their final statuses using the repository workflow checks.

Expected: CI and deploy succeed for the pushed commit.

- [ ] **Step 5: Verify the live public player page** at `https://spelmodellen.se/spelmodell` in a fresh browser context after the deploy completes.

Check: seven level labels, Novis concept maps, `Så arbetar du med spelmodellen`, four live phases, dead-ball separation, and no private Storyn prose or private link.

- [ ] **Step 6: Verify the live owner route** with the existing owner Supabase session.

Check: `/storyn` shows `Storyn` at the top, `Var förberedd`, private work areas and the narrative chain.

- [ ] **Step 7: Verify a non-owner/shared session** cannot see `/storyn`, the Storyn nav item or private prose, and receives a safe denied state.

- [ ] **Step 8: Record the final deployed commit and URLs** in the handoff response only after browser evidence confirms the live DOM, not merely a successful build.
