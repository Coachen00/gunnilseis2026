# Stream D — NU-uppgifter (tränarverktyg → matchdagskvalitet)

**Tema:** Användarvänlighet · Modernitet · Effekt
**Mission den här rundan:** Verktygen (`/matchblad`, `/traningsplan`, `/motstandaranalys`, `/taktiktavla`, `/admin`) är där coachen jobbar mellan match och träning. De ska fungera **lika bra på telefon som på dator**, vara **printbara till perfekt A4** och kännas snabba.

**Läs först (i ordning):**
1. `STREAMS/00-COORDINATION.md` (regler för parallellt arbete)
2. `STREAMS/04-verktyg.md` (din streams scope och ägda filer)
3. `STREAMS/05-DESIGN-LAW.md` (gemensam estetik — icke-förhandlingsbar, särskilt §9 om print)

---

## P0 — Måste levereras (i denna ordning)

### 1. Print-audit av alla print-routes
**Varför:** Coacher skriver ut matchblad och träningsplan till spelarna. Bryts CSS:en på print = onödig friktion.
**Vad:** För **var och en** av `/matchblad`, `/traningsplan`, `/motstandaranalys`, `/taktiktavla`:
1. Öppna i browser, Ctrl+P → "Spara som PDF"
2. Verifiera: ingen TopNav, ingen footer, ingen scroll-cue. A4 portrait. Marginaler 1.5cm-ish.
3. Innehållet får inte beskäras höger/vänster.
4. Fixa print-CSS via `@media print { … }` i `src/index.css` om något behöver tweakas — eller per-route style-block.
5. Lägg till `@page { size: A4; margin: 1.5cm; }` om det saknas.

**Leverans:** Skärmdumpar av PDF för alla fyra routes i PR-body, "före/efter" om du fixade något.

### 2. "Skriv ut som PDF"-knapp på print-routes
**Vad:** Stor, tydlig knapp uppe till höger på varje print-route som triggar `window.print()`. Med en liten hjälptext under: *"Spara som PDF i utskriftsdialogen — välj 'Spara som PDF' som skrivare."*
Knappen syns inte i print (`@media print { .print-button { display: none; } }`).

### 3. Mobile coach-flow för `/motstandaranalys`
**Varför:** Coachen analyserar motståndaren från soffan på söndagskvällen — på telefon.
**Vad:** Strukturera `Motstandaranalys.tsx` som en formulär-flow med tydliga fält (inte free-text-vägg):
- Motståndarens formation (dropdown 4-3-3 / 4-4-2 / 3-5-2 / 5-3-2 / annat)
- Stjärnspelare (3 fält: nummer, namn, vad gör hen)
- Fasta situationer — anfall (textarea, korta punkter)
- Fasta situationer — försvar (textarea)
- Svagheter att utnyttja (textarea)
- Vår plan (textarea)

Använd shadcn `Form` + `Input` + `Textarea`. Alla fält tab-bara, alla har labels, alla autosaves om vi har Supabase-tabell för det (kolla med Joel om tabell `opponent_analysis` finns).

### 4. `/admin` — godkänn nya tränare på 1 klick
**Vad:** Just nu antar jag att admin har en lista med pending users. Förbättra:
- Lista pending-rader med `Card`-baserad layout (avatar/namn/email/registreringstid)
- En "Godkänn"-knapp per rad → POST till Supabase, optimistic UI ("Godkänd ✓"), 2-sek toast
- En "Avvisa"-knapp som kräver bekräftelsedialog (shadcn `AlertDialog`)
- Tomt läge: *"Inga väntande tränare just nu. När någon registrerar sig på /login dyker de upp här."*

---

## P1 — Bör levereras

### 5. `/taktiktavla` — drag-and-drop med snapshot
**Varför:** Det här är det "wow"-verktyg som differentierar oss från en wiki.
**Vad:**
- Använd befintlig `InteractiveFootballPitch.tsx` eller `SimpleTacticsBoard.tsx`.
- Spelarpjäser ska gå att dra runt. Lägg position som state.
- Knapp "Spara position" → serialiserar position till query-string (kort, base64). URL kan delas.
- "Återställ till 4-3-3" / "Återställ till 5-3-2"-knappar.
- Pil-ritning mellan spelare (P2-feature) — om svårt, hoppa det denna runda.

### 6. `/traningsplan` — strukturerad övnings-lista
**Vad:** Form med:
- Datum & klockslag (date input, `inputMode="numeric"`)
- Plats (text)
- Tema (dropdown: Pass-mottagning / Press / Anfall i sista tredjedelen / etc — eller fritext)
- Övningar — repeat-block med: Namn, Tid (min), Beskrivning, Yta (textarea), Coach-fokus (textarea)
- Nedladdas/skrivs ut som A4-träningskort

Använd `TrainingDay.tsx` om relevant.

### 7. `/matchblad` — koppla till matchplan
Om Stream B's `/match/kommande` har en aktiv match → matchbladet pre-fill:as automatiskt med formation, startelva och fokuspunkter. Koordinera med Stream B om data-källa.

---

## P2 — Polish om tid

### 8. Inputmode-pass över alla formulär
Alla numeriska fält (tröjnummer, tid, datum) får `inputMode="numeric"`, datum-fält får `type="date"`. Ger rätt mobiltangentbord direkt.

### 9. Tab-ordning är logisk i alla formulär
Tab:a igenom varje formulär från topp till botten — ingen hoppar runt slumpmässigt.

### 10. Verktygsöversikt-sida
`Verktyg.tsx` — landningssida för "/verktyg" med korten:
- Matchblad
- Träningsplan
- Motståndaranalys
- Taktiktavla

Varje kort: ikon, kort beskrivning, "Öppna"-länk. Stiligt, konsekvent med `PrincipleCard.tsx` look.

---

## Filer du **förväntas** röra

- `src/pages/Matchblad.tsx`
- `src/pages/TrainingPlan.tsx`
- `src/pages/Motstandaranalys.tsx`
- `src/pages/Taktiktavla.tsx`
- `src/pages/Admin.tsx`
- `src/pages/Verktyg.tsx`
- `src/components/InteractiveFootballPitch.tsx`, `SimpleTacticsBoard.tsx`, `TrainingDay.tsx`
- `src/index.css` (endast `@media print` blocket, om det behöver tweakas — koordinera först)

## Filer du **inte rör** (utan att fråga Joel)

- `src/App.tsx`
- `src/components/Layout.tsx`, `TopNav.tsx`, `AuthGuard.tsx`
- `src/components/match/*` (Stream B)
- `src/pages/Match*.tsx` (Stream B)
- `src/pages/Forsvar.tsx`, `Anfall.tsx`, `Fasta*.tsx`, `Identitet.tsx`, `Roller.tsx`, `Spelide.tsx`, `Omstallning*.tsx` (Stream C)
- `src/pages/Hem.tsx`, `Login.tsx` (Stream A)
- `tailwind.config.ts`, `vite.config.ts`

---

## Hur du levererar

1. En PR per logisk leverans.
2. Branch: redan på `feat/D-verktyg` i denna worktree.
3. PR-titel: `[Stream D] Print-audit + skriv-ut-knapp` (eller motsvarande).
4. **Skärmdumpar i PR-body:**
   - Skärm-vy (mobil + desktop)
   - PDF-utskrift (print preview)
5. Vänta på Joels review innan merge till `main`.
6. När `main` deployas (auto via GitHub Actions) → live på <https://spelmodellen.se>.
