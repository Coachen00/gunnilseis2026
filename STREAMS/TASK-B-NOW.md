# Stream B — NU-uppgifter (matchplan-flödet → world-class)

**Tema:** Användarvänlighet · Modernitet · Effekt
**Mission den här rundan:** Gör `/match/kommande` och systerflöden till det skarpaste verktyg en svensk fotbollscoach använt. Friktionsfritt, tydligt, snabbt — på telefon såväl som dator.

**Läs först (i ordning):**
1. `STREAMS/00-COORDINATION.md` (regler för parallellt arbete)
2. `STREAMS/02-matchplan.md` (din streams scope och ägda filer)
3. `STREAMS/05-DESIGN-LAW.md` (gemensam estetik — icke-förhandlingsbar)

---

## P0 — Måste levereras (i denna ordning)

### 1. Spar-status synlig i varje `EditableText`
**Varför:** Coachen som skriver på telefonen 10 min före match måste *veta* att texten landat i Supabase.
**Vad:** I `src/components/match/EditableText.tsx` (eller `src/components/EditableText.tsx`) lägg till en liten status-indikator: `Skriver…` (debounce-fönster) → `Sparar…` (request flygande) → `Sparat ✓` (3 sek) → fade. Vid fel: `Kunde inte spara — försök igen` med klickbar retry.
**Acceptans:** Stäng fliken under "Sparar…" — texten finns vid reload (Supabase tog emot). Slå av wifi → fältet visar fel-state och queue retryar när nät kommer tillbaka.

### 2. "Förra matchen → som mall"
**Varför:** Matchplaner liknar varandra vecka till vecka. Att börja från blank ruta varje måndag är slöseri.
**Vad:** På `/match/kommande` — knapp uppe till höger: **"Hämta från förra matchen"**. Läser senaste rader ur `match_section_text` (per sektion) och pre-fill:ar nuvarande matchens fält. **Skriver inte över** redan ifylld text utan att fråga.
**Acceptans:** Tom matchplan → klicka knapp → 9 sektioner pre-filled från förra matchen. Bekräftelsetoast.

### 3. Mobil-redigering känns rätt
**Vad:**
- `EditableText` har `min-h-[44px]` för enkel tap.
- På fokus: scrolla fältet i viewport (smooth, med offset för sticky TopNav).
- Inputmode-hints där relevant: `inputMode="numeric"` för tröjnummer, `inputMode="text"` för fri text (default).
- iOS: ingen zoom-in vid focus → text-storlek minst `text-base` (16px) på inputs.
**Acceptans:** Hela `/match/kommande` redigerbar smidigt på iPhone (375px). Inga sektioner som behöver horisontell scroll.

### 4. "Sparat senast" tidsstämpel
**Vad:** I `MatchHeader.tsx` — diskret rad: *"Senast uppdaterad: 12:34 idag"* (relativt format: "för 2 minuter sedan", "igår 18:42"). Updateras live när någon `EditableText` autosparas.
**Acceptans:** Header visar relativ tid; uppdateras inom 2 sek efter senaste autospar.

---

## P1 — Bör levereras

### 5. Genvägar i sidofält scrollar med rätt offset
Sticky TopNav döljer ofta sektionsrubrik vid anchor-scroll. Lägg `scroll-mt-20` (eller motsvarande offset) på alla sektion-anchors i `Matchplan.tsx`. Verifiera: klicka "Anfall" i sidofält → rubriken **"Anfall"** är fullt synlig.

### 6. Formation-tooltip
Hover över spelare i `Formation.tsx` → tooltip med roll-anvisning (kort cue, 1-2 meningar) hämtad från `src/data/matchplan.ts` `FORMATION` eller `src/data/principles.ts`. Använd shadcn `Tooltip`.

### 7. "Kopiera matchplan som text"
Knapp som kopierar hela matchplanen som strukturerad text till urklipp (för limning i WhatsApp till spelarna). Format:
```
GUNNILSE vs MOTSTÅNDARE — fredag 19:00, Kviberg 5

ANFALL
[texten i anfallssektionen]

FÖRSVAR
[texten i försvarssektionen]
…
```

---

## P2 — Polish om tid

### 8. Undo på `EditableText` (Cmd/Ctrl+Z)
Vid fokus i ett fält ska Cmd+Z rulla tillbaka senaste autospar — inte hela browser-historik. Spara senaste 5 versioner i memory per fält.

### 9. Matchhistorik
`/match/historik` — kort lista över tidigare matcher (datum, motståndare, resultat om finns). Klick → läser den matchplanens `match_section_text` read-only.

### 10. "Skriv ut matchplan"-knapp
Uppe till höger på `/match/kommande` → öppnar `/matchblad` i ny flik med samma match förvald. (Stream D äger `/matchblad`-rendering — om det inte funkar redan, koordinera via Joel.)

---

## Filer du **förväntas** röra

- `src/components/match/EditableText.tsx` (eller motsvarande)
- `src/components/match/Matchplan.tsx`
- `src/components/match/MatchHeader.tsx`
- `src/components/match/Formation.tsx`
- `src/pages/MatchKommande.tsx`
- `src/data/matchplan.ts`
- `src/hooks/useMatch.ts`

## Filer du **inte rör** (utan att fråga Joel)

- `src/App.tsx`
- `src/components/Layout.tsx`, `TopNav.tsx`, `AuthGuard.tsx`
- `src/lib/supabaseClient.ts`
- Alla `src/pages/*.tsx` förutom `Match*`-prefix
- `tailwind.config.ts`, `vite.config.ts`
- `supabase/migrations/*.sql` (vill du ändra schema → koordinera)

---

## Hur du levererar

1. En PR per logisk leverans (P0.1, P0.2 etc — inte allt-i-en).
2. Branch: redan på `feat/B-matchplan` i denna worktree.
3. PR-titel: `[Stream B] Spar-status i EditableText` (eller motsvarande).
4. Skärmdump i PR-body: före/efter, mobil + desktop.
5. Vänta på Joels review innan merge till `main`.
6. När `main` deployas (auto via GitHub Actions) → live på <https://spelmodellen.se>.
