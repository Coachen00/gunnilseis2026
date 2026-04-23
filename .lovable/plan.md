

# Förtydligande + ny enkel taktiktavla

## Vad jag gör med bilderna (förtydligat)

**Helt nya bilder** — inte bara ramar/färger runtomkring. Varje av de 12 PNG-filerna ritas om från grunden i Midnight Pitch-stil:

- **Bevaras (informationen):** formationen, spelarpositioner, pilar (passning/löpning/press), zoner, korridorer, principen som visas.
- **Bevaras (spelarbrickor):** cirklar med nummer/positionsbokstav (VM, MV, IB osv) där det förekommer.
- **Tas bort:** spelarnamn, gamla färger, gamla bakgrunder, gamla typsnitt, gammal stil.
- **Ny visuell stil:** mörk plan (#0F1419), hairline-linjer, Gold-spelare hemma, Navy-spelare borta, mono uppercase-etiketter.

Resultat: samma taktiska information, helt nytt utseende, ingen kvar av den gamla bildstilen.

## Ny enklare taktiktavla med flyttbara pluppar

Utöver bildregenereringen bygger jag en **ny, enkel taktiktavla** som ersätter dagens komplexa `Taktiktavla.tsx` (som har ritverktyg, lager, timeline, animationer m.m. — för mycket).

### Den nya tavlan
```text
┌─────────────────────────────────────┐
│  Formation: [4-3-3] [4-4-2] [3-5-2] │  ← byt formation
│  [Återställ]  [Rensa namn]          │
├─────────────────────────────────────┤
│                                     │
│         ⬤ Mörk fotbollsplan         │
│         (Midnight Pitch-stil)       │
│                                     │
│         11 Gold-pluppar (hemma)     │
│         11 Navy-pluppar (motst.)    │
│         1 vit boll                  │
│                                     │
│   → dra med fingret/musen           │
│   → dubbelklick = döp om            │
│                                     │
└─────────────────────────────────────┘
```

### Funktioner (medvetet få)
- **Dra spelare** med mus/touch — flyter mjukt, snäpper inte.
- **Välj formation** för hemmalaget (4-3-3, 4-4-2, 3-5-2, 4-2-3-1).
- **Visa/dölj motståndare** (toggle).
- **Visa/dölj korridorer** (toggle, samma 5 korridorer som i resten av sidan).
- **Dubbelklicka en plupp** → liten input för att döpa (annars bara nummer).
- **Återställ** → tillbaka till vald formations grundpositioner.

### Vad den INTE har (avsiktligt borttaget)
- Inga ritverktyg (linjer, vågor, rektanglar)
- Ingen timeline / animationer / play-knapp
- Inga lager-toggles utöver korridorer + motståndare
- Ingen koner-meny
- Ingen zoom-läge

Det är en **renodlad pluppmatta** för snabb taktiksnack — inte en komplett illustrator.

## Genomförande

1. **Generera 12 nya bilder** (Gemini 3 Pro Image) → ersätter filerna i `src/assets/` enligt stilguiden i förra planen. Visuell QA per bild.
2. **Skapa `src/components/SimpleTacticsBoard.tsx`** — ny komponent med flyttbara pluppar (Framer Motion `drag`, samma teknik som `InteractiveFootballPitch.tsx` men förenklad och med båda lagen + ball).
3. **Skriv om `src/pages/Taktiktavla.tsx`** — ersätt nuvarande tunga implementation med `<SimpleTacticsBoard />` + en kort instruktionsruta.
4. **Behåll oförändrat:** routing, alla andra sidor, navigation, auth.

## Tekniska detaljer
- Bilder: använder `lovable_ai.py` med `--image --model google/gemini-3-pro-image-preview`, 1024×1280 px, sparar över befintliga filer i `src/assets/`.
- Tavlan: bygger på Framer Motion (redan installerad), inga nya beroenden.
- Pluppar: 32×32 px, hairline border, Gold/Navy fyllning, mono-siffror — matchar Midnight Pitch.
- Touch-stöd: `dragMomentum={false}`, `touch-none` på containern.

## Vad du får
- 12 helt omgjorda taktiska bilder i enhetlig mörk stil — gammal stil försvinner helt.
- En ny, mycket enklare taktiktavla med flyttbara pluppar — fokus på snabb användning, inte avancerade verktyg.
- Den gamla komplexa tavlan ersätts (innehållet i den var aldrig avsett att sparas).

