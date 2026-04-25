# Stream C — NU-uppgifter (spelmodellen → manifesto)

**Tema:** Innehåll · Design · Styrka · Koherens
**Mission den här rundan:** De fyra skedena, fasta situationer, identitet och roller är **klubbens manifesto** — det här är vilka vi är på plan. Sidorna ska kännas som en bok du vill scrolla till slutet, inte som en intern wiki.

**Läs först (i ordning):**
1. `STREAMS/00-COORDINATION.md` (regler för parallellt arbete)
2. `STREAMS/03-spelmodell.md` (din streams scope och ägda filer)
3. `STREAMS/05-DESIGN-LAW.md` (gemensam estetik — icke-förhandlingsbar)

---

## P0 — Måste levereras (i denna ordning)

### 1. Innehållsaudit & cleanup
**Varför:** Innan vi designar måste vi veta vad som faktiskt ska in.
**Vad:** Gå igenom alla dina sidor (`Identitet.tsx`, `Spelide.tsx`, `Forsvar.tsx`, `OmstallningForsvar.tsx`, `Anfall.tsx`, `OmstallningAnfall.tsx`, `Fasta.tsx`, `FastaForsvar.tsx`, `FastaAnfall.tsx`, `Roller.tsx`) plus `src/data/identity.ts`, `principles.ts`, `phaseCues.ts`. Hitta:
- Engelska placeholders, lorem ipsum, "TODO"-strängar — ersätt med svensk text eller ta bort.
- Dubbletter (samma princip beskriven i två sidor med olika ord).
- Avbrutna meningar, halv-skrivna avsnitt.

**Leverans:** Lista upp i PR-body alla fynd och vad du gjorde. Joel kompletterar saknade texter där det behövs.

### 2. Hero-koherens över alla skede-sidor
**Varför:** Just nu varierar herodelarna mellan sidor. Med fyra skeden + fasta situationer + identitet behöver vi en igenkänningseffekt.
**Vad:** Använd `PageHero.tsx` på **alla** spelmodell-sidor med exakt samma struktur:
- Eyebrow (kapitelnummer eller skede-namn): `text-accent text-xs tracking-widest uppercase`
- H1: stor, `font-light tracking-tight`
- Lead: en mening som komprimerar essensen av sidan
- En distinkt visual per skede (ikon, illustration, eller färgaccent från `bg-zone-attack/midfield/defense`)

Varje skedes hero får distinkt **färgaccent** men allt annat identiskt:
- Försvar → `zone-defense` (röd)
- Omställning bakåt → övergång röd→gul
- Anfall → `zone-attack` (grön)
- Omställning framåt → övergång gul→grön
- Fasta situationer → `accent` (guld)
- Identitet → `gunnilse-navy` + `gunnilse-gold`

### 3. Principer som visuella kort, inte text-väggar
**Varför:** `PrincipleCard.tsx` finns redan — använd den konsekvent.
**Vad:** På varje skede-sida (Forsvar, Anfall, etc) — rendera principer från `src/data/principles.ts` som ett **3-kolumns grid** (`md:grid-cols-3 grid-cols-1`). Varje kort: kort titel, en mening, ett verb-cue. Inga längre stycken inuti korten.

**Acceptans:** Försvar-sidan har 6-9 principer i prydligt grid. Mobil = stack. Hover på kort = lyft (+2px translate-y, lite glow med `ring-1 ring-accent/30`).

### 4. Print-version per skede-sida
**Varför:** Coacher delar ofta utskrift med spelarna inför match.
**Vad:** Lägg till `?print=1` query-param på Forsvar/Anfall/etc — när satt: dölj `Layout`-elementen (TopNav, footer, scroll-cues, animationer), lyft brödtext, A4-anpassad bredd. Användare öppnar Ctrl+P → ser ren utskrift.

Alternativ: separata `/print/forsvar`-routes som renderar utan Layout. Diskutera med Joel innan du väljer arkitektur.

---

## P1 — Bör levereras

### 5. ScrollChapter-konsistens
Alla skede-sidor använder `ScrollChapter.tsx` på samma sätt. Sektioner fade:ar in när 30% är i viewport. **Ingen overlap** mellan reveal-zoner — en sektion är klart synlig innan nästa börjar fade in.

### 6. KPIBox och CoachCue komposition
Använd dessa komponenter sparsamt och strategiskt:
- **KPIBox:** för "matchen i siffror" — ex. *"75% av målen kommer från ompositionering inom 5 sek efter bollvinst"*
- **CoachCue:** för korta coach-uttalanden i fältets tonalitet — ex. *"Vi vinner andrabollen — alltid."*

Fördela max 1 KPIBox + 1 CoachCue per sida. Mer än så blir brus.

### 7. Roll-sidan: spelar-roller som tabell + förklarande kort
`Roller.tsx` — tabell med 11 startpositioner, klick på roll → expanderar `RoleCard.tsx` med:
- Vad rollen ska göra i varje skede (4 rader)
- Spelarnamn (om redan känt) eller "att tilldela"
- Kort coach-cue

### 8. Fasta situationer-sidan: 4-kolumns flow
`Fasta.tsx` länkar till `FastaAnfall.tsx` och `FastaForsvar.tsx`. Visualisera som ett **flow** snarare än två länkar:
- Hörnor (anfall/försvar)
- Frisparkar (anfall/försvar)
- Inkast
- Straffar

Använd `SetPieceCard.tsx` per typ. Varje kort har en mini-illustration från `src/assets/`.

---

## P2 — Polish om tid

### 9. Identitet-sidan får en signaturmoment
`Identitet.tsx` — sajtens viktigaste sida för "vilka vi är". Lägg en stor manifesto-quote längst upp (font-light text-5xl/6xl, vänsterställd, max 12 ord), sedan principer + värdeord under.

### 10. Inläsning av principer från Supabase (förberedelse)
Idag är `principles.ts` hårdkodat. Förbered komponenten så den lika gärna kan ta props från ett Supabase-fetch (ändra inte schemat — bara lagra data-shapen flexibel). Detta gör Joel:s framtida CMS-flytt enklare.

---

## Filer du **förväntas** röra

- `src/pages/Identitet.tsx`
- `src/pages/Spelide.tsx`
- `src/pages/Forsvar.tsx`
- `src/pages/OmstallningForsvar.tsx`
- `src/pages/Anfall.tsx`
- `src/pages/OmstallningAnfall.tsx`
- `src/pages/Fasta.tsx`, `FastaAnfall.tsx`, `FastaForsvar.tsx`
- `src/pages/Roller.tsx`
- `src/data/identity.ts`, `principles.ts`, `phaseCues.ts`
- `src/components/PrincipleCard.tsx`, `PrincipleTeaser.tsx`, `RoleCard.tsx`, `SetPieceCard.tsx`, `CoachCue.tsx`, `KPIBox.tsx`, `PageHero.tsx`, `ChapterNumber.tsx`, `ScrollChapter.tsx` — förbättra om behov, men ändra inte deras API utan att kolla att andra streams inte använder dem.

## Filer du **inte rör** (utan att fråga Joel)

- `src/App.tsx`
- `src/components/Layout.tsx`, `TopNav.tsx`, `AuthGuard.tsx`
- `src/components/match/*` (Stream B)
- `src/pages/Match*.tsx`, `Matchblad.tsx`, `Motstandaranalys.tsx`, `Taktiktavla.tsx`, `TrainingPlan.tsx`, `Verktyg.tsx`, `Admin.tsx` (Stream B/D)
- `src/pages/Hem.tsx`, `Login.tsx` (Stream A)
- `tailwind.config.ts`, `vite.config.ts`
- `src/index.css` (delad token-fil — ändring kräver Joel-OK)

---

## Hur du levererar

1. En PR per logisk leverans.
2. Branch: redan på `feat/C-spelmodell` i denna worktree.
3. PR-titel: `[Stream C] Hero-koherens över skede-sidor` (eller motsvarande).
4. Skärmdump i PR-body: före/efter, **per sida** du ändrat (mobil + desktop).
5. Vänta på Joels review innan merge till `main`.
6. När `main` deployas (auto via GitHub Actions) → live på <https://spelmodellen.se>.
