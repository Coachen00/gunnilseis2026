

# Ny navigation: "Skeden" + "Match" med undermenyer

## Mål
Strukturera om toppmenyn så att alla taktiska sidor samlas under **Skeden** (med faser och underfaser), och lägg till en ny sektion **Match** för matchnära innehåll.

## 1. Ny menystruktur

Toppnav blir (ersätter dagens platta lista):

```text
Hem · Spelidé · Skeden ▾ · Match ▾ · Roller & Trupp · Verktyg
```

### Skeden ▾ (dropdown med 4 fasgrupper + fasta)
```text
ANFALL                          → /anfall
  ├ Speluppbyggnad              → /anfall#speluppbyggnad
  ├ Skapa                       → /anfall#skapa
  └ Avsluta                     → /anfall#avsluta

OMSTÄLLNING TILL FÖRSVAR        → /omstallning-forsvar
  ├ Direkt (motpress)           → /omstallning-forsvar#direkt
  └ Tillbaka till kontroll      → /omstallning-forsvar#kontroll

FÖRSVAR                         → /forsvar
  ├ Högt försvar                → /forsvar#hogt
  ├ Medelhögt försvar           → /forsvar#medel
  └ Lågt försvar                → /forsvar#lagt

OMSTÄLLNING TILL ANFALL         → /omstallning-anfall
  ├ Kontring                    → /omstallning-anfall#kontring
  └ Starta speluppbyggnad       → /omstallning-anfall#uppbyggnad

FASTA — FÖRSVAR                 → /fasta/forsvar
  ├ Hörnor · Inläggsfrisparkar · Inkast · Avspark

FASTA — ANFALL                  → /fasta/anfall
  ├ Hörnor · Inläggsfrisparkar · Inkast · Avspark
```

### Match ▾ (ny sektion)
```text
Förra matchen                   → /match/forra
Veckans match                   → /match/kommande
Samlade tankar (sista perioden) → /match/reflektioner
```

## 2. Sid- & route-förändringar

**Nya routes:**
- `/omstallning-forsvar` — egen sida (idag en sektion på `/forsvar`)
- `/omstallning-anfall` — egen sida (idag en sektion på `/anfall`)
- `/fasta/forsvar` och `/fasta/anfall` — splittar `/fasta` i defensivt/offensivt
- `/match/forra`, `/match/kommande`, `/match/reflektioner` — tre nya matchsidor (placeholder-innehåll med tydlig struktur, redo att fyllas)

**Anchors på befintliga sidor:**
- `/anfall` får `id="speluppbyggnad"`, `id="skapa"`, `id="avsluta"` på respektive sektion
- `/forsvar` får `id="hogt"`, `id="medel"`, `id="lagt"` på respektive höjd-sektion

**Behålls oförändrat:** Hem, Spelidé, Roller & Trupp, Verktyg, alla print-sidor, auth.

## 3. Komponenter

**Ny:** `NavDropdown.tsx` — desktop hover-/klick-dropdown med kolumner (Skeden = 5 kolumner, Match = 1 kolumn). Mörkt tema, hairline border, Gold underline på aktiv grupp.

**Uppdateras:**
- `TopNav.tsx` — ersätt platt navItems-array med strukturerad `navTree` (top-items + barn). Desktop = `NavDropdown`, mobil = expanderbar accordion-lista.
- `App.tsx` — registrera 7 nya routes.

**Nya sidor (skelett, klara att fyllas):**
- `src/pages/OmstallningForsvar.tsx`, `OmstallningAnfall.tsx` — flyttar/återanvänder befintliga sektioner från `TacticsSections.tsx`.
- `src/pages/FastaForsvar.tsx`, `FastaAnfall.tsx` — splittar nuvarande `Fasta.tsx`.
- `src/pages/MatchForra.tsx`, `MatchKommande.tsx`, `MatchReflektioner.tsx` — nya sidor med `PageHero` + tomma sektioner per underrubrik.

## 4. Vad du får
- En tydlig hierarki: **Skeden** samlar all spel-taktik, **Match** samlar matchnära reflektion.
- Dropdown-meny med faser + underfaser direkt synliga — snabb navigation utan att klicka in på sidor först.
- Befintligt innehåll behålls och länkas in på rätt plats; nya match-sidor är skelett du kan fylla.
- Konsekvent mörk minimalistisk design — dropdowns följer Midnight Pitch-temat.

