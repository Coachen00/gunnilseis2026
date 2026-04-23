

# Mörkt premium-tema + språkstädning ("rum" → "korridor")

Två förändringar i ett svep: byt hela visuella temat till en mörk, minimalistisk och vassare design, och rensa bort ordet "rum" till förmån för "korridor" överallt.

## 1. Språk: bort med "rum"

Endast två ställen använder "rum" idag:

- **`src/pages/Hem.tsx`** (rad 103) — "Vi delar planen i inre och yttre rum…" → **"Vi delar planen i inre och yttre korridorer…"**
- **`src/components/sections/TacticsSections.tsx`** (rad 349) — Spelytor-subtitle: "Planen är som fyra rum… i just det rummet." → **"Planen är fyra korridorer. Vi vill veta var bollen är, och vad vi ska göra i just den korridoren."**

(Övriga 71 träffar på "rum" är false positives — `crumb`, `serum`, etc.)

## 2. Nytt visuellt tema — "Midnight Pitch"

Riktning: **mörkt, minimalistiskt, högt kontrast, lugnt**. Mindre färg, mer typografi, vassare kanter.

### Färgpalett (ersätter nuvarande ljust beige tema)
```text
Bakgrund         #0A0E14   nästan svart, en aning blå
Yta (kort)       #11161E   subtilt upphöjd
Yta hover        #161C26
Border           #1F2630   hårfin, knappt synlig
Text primär      #F4F5F7   varm vit, ej ren #fff
Text sekundär    #8A93A2   sval grå
Text muted       #5A6373
Accent (Gold)    #E8C547   bibehålls — men används mycket sparsamt
Primary (Navy)   #3B6FB8   ljusare för kontrast mot mörk bg
Destructive      #E5484D
```

Borttaget: gradient-mesh i flera färger, varma toner, glow-effekter. Behålls: Gunnilse Gold som **enda** accentfärg (siffror, scroll-cue, nyckelord, hover-underlines).

### Designprinciper
- **Hairline borders** (`1px solid #1F2630`) istället för shadows
- **Inga gradient-fyllda kort** — flata mörka ytor
- **Typografi som hjälte**: större kontrast mellan rubrik (vit) och brödtext (grå). Tightare letter-spacing på rubriker (`-0.04em`).
- **Mono-accent**: använd `font-mono` på siffror ("01", "02", KPI-värden) för en teknisk/redaktionell känsla.
- **Hover = underline-svep i Gold**, inte färgskift på hela knappen.
- **Borttagna mjuka rundningar**: `rounded-2xl` → `rounded-lg` (8px) eller `rounded-none` på vissa element för vassare uttryck.

### Bakgrund (AnimatedBackground)
- Gradient-mesh tonas ner från opacity `0.18` → `0.06`
- Partiklar: från 24 → 12, mindre och bara i Gold (knappt synliga)
- Blobbar: behåll men byt till djup-blå/svart i stället för Navy/Gold/Secondary
- Lägg till en subtil **noise/grain-overlay** (SVG turbulence, opacity 0.03) — ger filmisk premium-känsla

### Komponenter som justeras
- `src/index.css` — alla CSS-variabler för dark mode som default (ingen `dark:`-prefix behövs, hela appen blir mörk)
- `tailwind.config.ts` — uppdatera `gunnilse`-tokens, lägg till `surface`/`surface-hover` semantiska färger
- `src/components/AnimatedBackground.tsx` — ny dämpad version
- `src/components/TopNav.tsx` — mörkare bg, tunnare border, Gold underline-indikator i stället för fylld pill
- `src/components/ChapterNumber.tsx` — outline-tal blir Gold med 15% opacity, font-mono
- `src/components/PrincipleTeaser.tsx` — flat mörk yta, hairline border, Gold accent endast på "Se alla 5 →"-länken
- `src/components/PageHero.tsx` — större typografi, mer luft, ingen gradient
- `src/components/Footer.tsx` — tonas ner till nästan-svart
- `src/components/SectionHeader.tsx` — eyebrow blir uppercase mono i Gold

## Tekniska detaljer
- **Filer redigerade:** `src/index.css`, `tailwind.config.ts`, `src/components/AnimatedBackground.tsx`, `src/components/TopNav.tsx`, `src/components/ChapterNumber.tsx`, `src/components/PrincipleTeaser.tsx`, `src/components/PageHero.tsx`, `src/components/Footer.tsx`, `src/components/SectionHeader.tsx`, `src/pages/Hem.tsx`, `src/components/sections/TacticsSections.tsx`.
- **Inga nya dependencies.** SVG-grain läggs inline i `AnimatedBackground`.
- **Behålls oförändrat:** routing, alla sidors innehåll/struktur, taktiska komponenter (FootballPitch, GIGTemplate etc. — de ärver färger via CSS-variabler), auth, alla verktygssidor.
- **Memory-uppdatering:** Core-regeln "Theme: Gunnilse IS brand (Navy, Gold, White)" uppdateras till "Theme: Midnight Pitch — mörk minimalistisk, Gold som enda accent".

## Vad du får
- En mycket mörkare, lugnare och vassare sida — premium-känsla i stil med moderna sport- och designportföljer.
- Konsekvent språk: "korridor" överallt, aldrig "rum".
- Samma struktur, samma innehåll, samma funktionalitet — bara ett dramatiskt nytt uttryck.

