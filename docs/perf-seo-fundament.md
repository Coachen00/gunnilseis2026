# Perf, mobil, asset & SEO — 2026-05-15

Insats för att flytta laddtid på spelmodellen.se från "indie Vite-SPA" mot
solid mobile-first. Inga frameworkbyten, inga edge-hosting-experiment,
inga 3D-effekter — bara verkliga laddtidsvinster.

## Före / efter

### JavaScript-bundle

| Mått                            | Före      | Efter                                                |
|---------------------------------|-----------|------------------------------------------------------|
| Största chunk (raw)             | 664 kB    | 188 kB (supabase) — entry-chunk: 43 kB               |
| Största chunk (gzip)            | 202 kB    | 50 kB (supabase) — entry-chunk: 13 kB                |
| Cache-bara vendor-chunks        | 0         | 8 (`react`, `router`, `query`, `motion`, `charts`, `supabase`, `radix`, `icons`, `vendor`) |
| Render-blocking JS init (gzip)  | 202 kB    | ~13 kB (entry) + lazy route                           |

Vendor-split → varje deploy med oförändrade libs återanvänder browser-cache.

### Bilder (`src/assets/`)

| Mått                  | Före    | Efter                            |
|-----------------------|---------|----------------------------------|
| Total storlek         | 22.9 MB | 1.58 MB (WebP) + AVIF för tunga  |
| Reduktion             | —       | **−93 %**                        |
| Bilder i `dist/`      | 11.1 MB | 0.57 MB (endast importerade)     |
| `<img>` med lazy/async| Nej     | Ja, alla utom hero/expanderade   |

Skript: `scripts/convert-images.mjs` (idempotent — kör om för att regenerera).

### Video & iframes

- YouTube-iframes: `loading="lazy"` — ingen embed laddas innan elementet är nära viewport.
- HTML5-`<video>`: `preload="metadata"` + `playsInline` — ingen autoladd av filmer i listor.
- `TrainingVideo`: thumbnail-pattern kvar (klick → öppna YouTube i ny flik) → inga embeds alls på listor.

### Fonts (Google Fonts)

- Preconnect kvar (parallelliserar DNS/TLS).
- Stylesheet laddas via `preload as=style` + `media="print" onload=this.media='all'` → icke-blocking.
- `<noscript>` fallback för JS-fritt klientside.
- Tappat weight 800 (bara 2 träffar — `font-extrabold` → `font-bold`).
- `display=swap` redan på plats → ingen FOIT.

### SEO

- `usePageMeta` hook + `<RouteMeta>` i App → per-route title, description, canonical, OG, Twitter.
- Skyddade rutter: `<meta name="robots" content="noindex, nofollow">` (i tillägg till `Disallow` i robots.txt).
- `public/robots.txt`: blockerar alla auth-only rutter, allow only `/` + assets.
- `public/sitemap.xml`: refererar publik landningssida.
- Structured data (JSON-LD i `index.html`):
  - `SportsTeam` (Gunnilse IS)
  - `Organization`
  - `WebSite` med `inLanguage: sv-SE`

### Mobil

- `viewport` meta-tag kvar (`width=device-width, initial-scale=1`).
- Verifierat: ingen horisontell scroll på 375×812 (mobile preset) eller 1280×800 (desktop).
- 13 interaktiva element på `/` — inga under 28 px höjd (target-size OK).
- Bilder har `loading="lazy"` + `decoding="async"` → ingen huvudtrådsblockering.
- Video-element + iframe har explicit `aspect-video` → ingen CLS-hopp.

## Vad som *inte* gjordes (medvetet)

- **Ingen migration till Next/Astro** (för stor risk inom femtimmars-fönstret).
- **Ingen PWA / Service Worker** (skapar cache-invalidation-risk → kräver mer test).
- **`<picture>` med AVIF-fallback** är inte wireinat ännu — AVIF-filerna finns
  men `import` använder bara WebP. Nästa steg om man vill ner ytterligare 30–40 %.
- **Inga changes på Login** (LCP-page för oinloggade — eget arbete).

## Build-storlek totalt

```
dist/   → 2.1 MB (var 16 MB)
```

## Vidare arbete

1. **Bygg `<Picture>`-komponent** som väljer AVIF → WebP → original via `<picture><source srcSet=…>`.
2. **Self-host Inter/JetBrains** under `public/fonts/` med `font-display: swap` + `unicode-range` subset (sparar 2 round-trips till fonts.gstatic.com).
3. **Preload hero-bild** (om man lägger till en) med `<link rel="preload" as="image">`.
4. **Mät i Lighthouse mobile** efter deploy — förvänta LCP < 1.5 s på 4G när hero är text-baserad.
5. **PWA**: manifest + Workbox för cache-first av statiska tillgångar.
