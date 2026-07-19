# Parallellt arbete — koordinering

> **Aktuellt flöde:** Den här filen beskriver det äldre stream/worktree-upplägget.
> Använd inte stream-branches eller sökvägarna längre. Repo:t ligger i
> `C:\Scripts\fotboll\gunnilseis2026`, `main` är enda aktiva arbetsgren och
> `origin/main` är det som deployas. Följ i stället `README.md`.

> Gamla `STREAMS/*-START-*.txt` är historiska arbetsinstruktioner. De ska inte
> användas som startpromptar för nya jobb.

4 streams (A, B, C, D) jobbar samtidigt på olika delar av `gunnilseis2026`. Varje stream har egen scope, egen git-branch **och egen worktree-katalog**.

## Varför worktrees per stream?

Om flera Claude Code-fönster jobbar i samma working tree byter de hela tiden branch på varandra (vi har redan blivit brända en gång — Stream A och B blandades ihop när de delade `gunnilseis2026-source/`). Med en separat worktree per stream är varje fönsters working tree fryst på sin egen branch och fönstren kan inte kliva på varandras filer.

## Stream → worktree-mappning

| Stream | Fokus | Branch | Worktree-katalog | Brief |
|---|---|---|---|---|
| A | Landningssida & publik vy | `feat/A-landningssida` | `gunnilseis2026-source/` (huvudkatalogen) | `01-landningssida.md` |
| B | Veckans match & matchplan | `feat/B-matchplan` | `gunnilseis2026-source/.worktrees/feat-B-matchplan/` | `02-matchplan.md` |
| C | Spelmodell (principsidor) | `feat/C-spelmodell` | `gunnilseis2026-source/.worktrees/feat-C-spelmodell/` | `03-spelmodell.md` |
| D | Tränarverktyg & utskrifter | `feat/D-verktyg` | `gunnilseis2026-source/.worktrees/feat-D-verktyg/` | `04-verktyg.md` |

`.worktrees/` är `.gitignore`:ad så katalogerna stör inte indexen.

## Hur du startar en stream-session

1. Öppna nytt Claude Code-fönster.
2. `cd` in i den katalog som tillhör streamen (kolumnen ovan). Stå **aldrig** i en annan streams worktree.
3. Säg: *"Läs STREAMS/0X-...md och börja jobba enligt instruktionen. Vi är redan på rätt branch i denna worktree."*
4. Första gången per worktree: `npm install` (varje worktree har egen `node_modules/`).

## Skapa worktree om den saknas

Från huvudkatalogen (`gunnilseis2026-source/`):

```bash
git worktree add .worktrees/feat-B-matchplan feat/B-matchplan
# om branchen inte finns: lägg till -b
git worktree add -b feat/B-matchplan .worktrees/feat-B-matchplan main
```

Lista existerande: `git worktree list`. Ta bort: `git worktree remove .worktrees/feat-X-...`.

## Filer som ALLA streams kan vilja röra (kräver koordinering)

Ändra INTE utan att stämma av med Joel:
- `src/App.tsx` (routes)
- `src/components/Layout.tsx` (nav — formellt ägd av Stream A, andra föreslår)
- `src/lib/supabaseClient.ts`
- `tailwind.config.ts`, `vite.config.ts`
- `supabase/migrations/*.sql`
- `package.json`

## Branch + merge-flöde

1. Stream jobbar i sin worktree på sin branch.
2. Testa lokalt: `npm run dev` (port 8080). Stoppa innan annan stream försöker använda porten — eller välj egen port med `--port`.
3. `git push -u origin feat/X-...` → öppna PR till `main`.
4. Joel reviewar → merge.
5. GitHub Actions (`.github/workflows/deploy.yml`) auto-deployar `main` → GitHub Pages → live på <https://spelmodellen.se>.
6. Efter merge: i huvudkatalogen, `git worktree remove .worktrees/feat-X-...` och `git branch -d feat/X-...`.

## Konfliktshantering

Två streams skriver i samma fil:
1. Senare PR rebasar mot `main` i sin worktree.
2. Löser konflikt manuellt.
3. Pushar igen.

Om en delad fil (App.tsx, Layout, etc.) MÅSTE ändras: pinga Joel innan ändring så kan han säga vilken stream som tar det.

## Test-checklista innan PR

- `npm run dev` startar utan fel i streamens worktree
- Inga console errors på de sidor stream rört
- Inloggning + navigation fungerar fortfarande
- Inga TypeScript-fel: `npx tsc --noEmit` är tyst
- `npm run build` går igenom

## Stack-påminnelse

Vite 6 + React 18 + TS + Tailwind + shadcn/ui + Supabase + GitHub Pages (custom domain spelmodellen.se). Ingen bygg-config-ändring utan koordinering.

## Gemensam designlag

**Alla streams MÅSTE läsa `STREAMS/05-DESIGN-LAW.md` innan UI-ändringar.** Den filen definierar färgtokens, typografi, spacing, mobile-first-regler och tillgänglighet — kontraktet som håller sajten koherent när fyra fönster jobbar parallellt.
