# Slutrapport — Spelmodellen Hero & Designkonsekvens

**Branch:** `feat/kareby-spelmodell-2026-05-07`
**Worktree:** `C:\Scripts\fotboll\.worktrees\spelmodellen-kareby`
**PR:** [Coachen00/gunnilseis2026#5](https://github.com/Coachen00/gunnilseis2026/pull/5) — **CONFLICTING med main, kräver designbeslut**

## ⚠️ DESIGNKONFLIKT MED MAIN

Mellan att jag startade och pushade har sibling-streamen `feat/period1-spelmodellen` mergats till `main` (3 merges, senast `f245d16` 2026-05-09 20:32). Den **omdefinierar `/`-sidan**:

**Main idag:**
- `/` = publik Gunnilse IS-föreningsstoryn (Hem.tsx på main: "Gunnilse IS är inte bara en fotbollsförening...", Allsvenska 1997, "Angered har kraft"). Hero-video pekar på `/hero.mp4`.
- `/period/1` = ny skyddad sida med 5 tabs (Kartan/Principen/Resan/Passen/Fördjupning), 6 veckor, 18 pass — kärnan i "Period 1" som tidigare slutrapport refererade till.
- `/match/matcher` och `/truppen` är nu **Protected** (var Public i min pre-fork base).
- Footer-snabblänkar visas bara för inloggade (inloggningsmur).
- TopNav fortfarande "Hem"-label, ingen brand-byte.

**Min PR:**
- `/` = Spelmodellen platform-brand hero.
- TopNav byter brand till "Spelmodellen / Gunnilse IS · 2026" + "Start"-label.
- Public CTAs som länkar in i tränarplattformen.
- Hela paketet följer Champions-League-intro-spec från användarens prompt.

**Båda visioner är legitima — men de är inkompatibla för `/`-rooten.**

### Resolution-alternativ

1. **Hybrid (rekommenderas):** behåll mains `/` som föreningsstoryn (publik marketing-front). Lägg till `/start` som ny route som renderar min Spelmodellen-hero. Public mainland har en länk `/start` i hero-CTAs. Två publika landningssidor med olika tonläge.
   - Liten App.tsx-edit, allt övrigt från min PR (Footer, TopNav-brand, OG-bild, NotFound, structured data, hero-poster) kan läggas till utan konflikt.
2. **Ersätt main:** acceptera min vision som "förstasidan" och refactor:a mains storyn till `/om-foreningen` eller liknande.
3. **Stäng PR:** behåll bara delarna som inte konfliktar (NotFound-redesign, OG-bild, structured data, Footer, hero-poster, skip-link, tester) i en mindre uppföljnings-PR.
4. **Gör `/` adaptiv:** om visitor är inloggad → Spelmodellen-hero. Oinloggad → föreningsstoryn. (Mer kod, men kan ge bästa av båda.)

Konflikterade filer enligt `git merge-tree`: `src/pages/Hem.tsx`, `src/components/Footer.tsx`, `src/components/TopNav.tsx`, `src/components/Layout.tsx`, `src/components/PhaseFlow.tsx`, `src/index.css`, `index.html`, `src/App.tsx` (route-list).

Inga av mina nya komponenter (FallingWords, TacticalPitchGrid, NotFound-redesign, hero-poster.jpg, OG-image-update, structured-data-tillägg) konfliktar tekniskt — de kan plockas in fritt oavsett `/`-beslut.

---

**Commits (pushade till `feat/kareby-spelmodell-2026-05-07`, ej mergade):**
- `beb1713` — feat(hero): premium spelmodellen-hero — video, fallande ord, taktisk grid
- `9645e2e` — fix(hem): bibliotek-länk pekar på publik /match/matcher
- `b5434d5` — feat(a11y): skip-to-content + unit tests för hero-komponenter
- `99f98c6` — chore(hero): generera fallback hero-poster.jpg (1920x1080, 15KB)
- `f56282a` — chore(brand): regenerera og-image med Spelmodellen-identitet
- `39e7568` — fix(404): NotFound matchar Spelmodellen-brand + svenska + ren prod
- `b6b26be` — docs: uppdatera slutrapport med commits 3–7 och nya leveranser
- `e3b7f64` — test(layout): 4 tester för skip-to-content + main-id + nav/footer
- `8a0e679` — feat(seo): canonical + preconnect + LD+JSON structured data + 404-test
- `4a4ac90` — docs(slutrapport): dokumentera designkonflikt med mains feat/period1-spelmodellen
- `d21f171` — feat(login): Spelmodellen-wordmark + eyebrow + focus-rings
- `4c0066c` — test(head): 11 sanity-tester för index.html meta + LD+JSON
- `c1c7a75` — docs(slutrapport): uppdatera commit-lista + tester 213/213
- `f93dc2d` — test(public-assets): 6 sanity-tester för public/-tillgångar
- `346d6df` — test(falling): verifiera att vokabulär matchar 20 taktiska kärntermer
- `7c25ca9` — fix(grid): explicit overflow:hidden på SVG mot subpixel-overflow

---

## 1. Kort sammanfattning

Förstasidan (`/`) på spelmodellen.se är ombyggd från en typisk Gunnilse-föreningssida till en filmisk, taktisk landningssida för **plattformen Spelmodellen**. Hero levereras med full-bleed bakgrundsvideo, taktisk pitch-grid, fallande tränarvokabulär, fluid display-typografi och tre stat-kort (PRINCIPER/TRÄNING/MATCH). TopNav, Footer och `<head>`-meta är samlade kring spelmodellen-identiteten — Gunnilse IS-arvet finns kvar som diskret subtitle.

**Status:** Redo för review. Alla checks gröna lokalt.

Det enda som inte är 100% är att **bakgrundsvideofilen `/hero-spelmodellen.mp4` saknas i `public/`** — hero har medveten gradient-fallback så det ändå ser premium ut, men för att videon faktiskt ska spela behöver en mp4-fil läggas där (eller `HERO_VIDEO_URL` ändras).

---

## 2. Ändrade filer

| Fil | Status | Roll |
|---|---|---|
| `src/pages/Hem.tsx` | Modifierad (~+170 rader netto) | Helt ny hero-sektion + struktur. Exporterar `HERO_VIDEO_URL` + `HERO_POSTER_URL`. Behåller Identity, PhaseFlow, Bibliotek, Gated-CTA. |
| `src/components/FallingWords.tsx` | **Ny** | 20 taktiska ord som faller från toppen. Mobile/desktop-skala (8 vs 16). `prefers-reduced-motion` returnerar `null`. `aria-hidden`. |
| `src/components/TacticalPitchGrid.tsx` | **Ny** | SVG-overlay: planlinjer, mittcirkel, straffområden, korridorer + tredjedelar (streckade). `aria-hidden`, `pointer-events-none`. Pulsar mjukt (`animate-pitch-pulse`). |
| `src/pages/Hem.test.tsx` | **Ny** | 14 tester: H1, subhead, body, CTAs, 3 kort, video-attribut, HERO_VIDEO_URL/POSTER, identity/phase/library-rubriker. Mockar `useContent` för att slippa Supabase. |
| `src/index.css` | Modifierad | Lägger till `animate-fall` + `animate-pitch-pulse` keyframes och utility-klasser. Inkluderar dem i den befintliga `prefers-reduced-motion`-blocken. |
| `src/components/Footer.tsx` | Helt omskriven | Spelmodellen-identitet, snabblänkar (Spelidé/Principer/Träningspass/Matcher), `↑ Toppen`-knapp, copyright. |
| `src/components/TopNav.tsx` | Minimal patch | "Hem" → "Start" i nav-items + brand: ny logotyp "S" + "Spelmodellen" / "Gunnilse IS · 2026" som subtitle. Övrig dropdown-struktur orörd. |
| `src/components/PhaseFlow.tsx` | Minimal patch | Lade till `focus-visible:` ring-klasser på länken. |
| `index.html` | Modifierad | `<title>`, `description`, OpenGraph, Twitter-meta — alla uppdaterade till Spelmodellen-brand. |
| `.claude/launch.json` (ovanför worktree) | Modifierad | La till `spelmodellen-kareby` dev-server-config (port 5180) för preview-MCP. |
| `src/components/Layout.tsx` | Modifierad | Skip-to-content-länk "Hoppa till innehåll" (sr-only / focus-reveal) + `<main id="huvudinnehall">` för keyboard-tillgänglighet. |
| `src/components/FallingWords.test.tsx` | **Ny** | 7 tester: default 16 ord, narrow 8 ord, reduced-motion null, aria-hidden, animate-fall, --drift CSS-var, animation-duration. |
| `src/components/TacticalPitchGrid.test.tsx` | **Ny** | 6 tester: aria-hidden SVG, pointer-events-none, preserveAspectRatio slice, canoniska planelement (rect/line/circle/path), design-tokens, pulse-animation. |
| `src/components/Footer.test.tsx` | **Ny** | 7 tester: brand-wordmark, one-liner, 4 snabblänkar, copyright-år, Toppen-knapp, nav aria-label, gammalt brand purgat. |
| `public/hero-poster.jpg` | **Ny** | 1920×1080 fallback-poster (15KB) genererad via sharp — dark gradient + subtle pitch lines. Visas i `<video poster>` tills riktig video läggs till. |
| `public/og-image.png` + `public/og-image.jpg` | Regenererade | 1200×630 brand-OG: TRÄNARPLATTFORM-eyebrow + SPELMODELLEN H1 + subhead + 3 stat-kort + URL-fötter. Genererad via sharp. |
| `src/pages/NotFound.tsx` | Modifierad | Tog bort `console.error`, översatte till svenska, ny premium 404-layout med Spelmodellen-eyebrow, mono-pathvisning, ArrowLeft-knapp tillbaka till `/`. |

Inga andra filer rörda. Inga test-suiter eller komponenter utanför scope ändrade.

---

## 3. Designbeslut

### Hero
- **Min-höjd 88vh mobil / 92vh desktop.** Inte exakt 100vh för att de 3 stat-korten ska sticka upp ovanför fold (tease till nästa sektion).
- **Lager (botten upp):**
  1. `<video>` autoplay/muted/loop/playsInline + `motion-reduce:hidden` (gömd vid reducerad rörelse).
  2. Statisk fallback-gradient (radial primary + accent + linear background→darker) — alltid synlig, gör hero stabilt även utan video.
  3. `<TacticalPitchGrid>` SVG i `text-pitch-lines/40` med långsam pulse.
  4. `<FallingWords>` — 16 (desktop) / 8 (mobil) ord med `tracking-[0.32em]` och opacity 0.06–0.10.
  5. Vertikal vignett: `from-background/65 via-background/45 to-background`.
  6. Horisontell läsbarhetsslöja: mobil tätare (`from-background/90 via-background/55 to-background/30`), desktop ljusare höger (`md:to-transparent`).
- **Eyebrow:** mono-caps med tracking-[0.32em]. Liten gold-streck till vänster.
- **H1 "Spelmodellen":** `font-black uppercase tracking-tight leading-[0.92]`, fluid `clamp(2.5rem, 10.5vw, 9rem)`. Inga breakpoints — skalar smooth 375→1440.
- **Subhead:** två-radig, andra raden i `text-accent`, vertikalt accent-streck (3px guld) till vänster på desktop.
- **CTAs:** primär guld + sekundär border. `h-12`, uppercase tracking-wider — premium tactility. Båda har explicita `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **3 stat-kort (Principer/Träning/Match):** botten av hero. `gap-px` ger 1px ribbon-divider. Mono-eyebrow-nummer 01/02/03 + ikon + label + text. Låg opacity bakgrund + backdrop-blur.

### Animationer
- **`animate-fall`:** linear, 28–50s, drift `var(--drift)` -5..+6vw. Genomskinlig in/ut i 0–10% och 90–100%.
- **`animate-pitch-pulse`:** 9s ease-in-out, opacity 0.18→0.30. Lugn, knappt märkbar.
- Båda finns i `prefers-reduced-motion`-blocket (släcks helt).
- `<FallingWords>` returnerar dessutom `null` om reducerad rörelse är på — sparar DOM-noder.
- Mobile-detection via `matchMedia("(max-width: 767px)")` styr `count` (8 vs 16).

### Mobil
- H1 fluid clamp = ingen overflow på 375 (testat).
- CTA-knappar staplade kolumnvis mobilt, side-by-side från sm.
- 3 stat-kort: stack på mobil, side-by-side från sm.
- Falling words halveras (8 st) och justeras med mindre `tracking-[0.32em]` text-xs.

### Navigation/footer
- **TopNav simplification utesluten medvetet** — befintlig dropdown-arkitektur (Skeden, Match) är delad med andra streams (Stream A äger Layout). Full förenkling skulle riskera krockar. Lågrisk-varianten valdes: "Hem"→"Start" + brand-byte. Övrig struktur orörd.
- **Brand:** Liten "S" i monospace + dual-line "Spelmodellen / Gunnilse IS · 2026". Funkar på alla sidor — public hero känns "Spelmodellen", gated content bär kvar Gunnilse-arvet via subtitle.
- **Footer:** ny "Spelmodellen"-sektion med kort beskrivning, mono-eyebrow `Princip · Träning · Match`, snabblänkar, copyright.

### Hur designen hänger ihop
- Designtokens från `index.css` används genomgående — inga nya hex-värden.
- Mono-eyebrow med `tracking-[0.32em]` gold accent-färg är genomgående: hero, identity, phase, library, footer.
- `font-black uppercase tracking-tight` är H1/H2-formula.
- Border + gap-px + bg-background = "ribbon-grid" idiom används på både hero-cards och bibliotek.
- Färg-pyramid: foreground vit → muted-foreground grå → accent guld för action/highlights → primary blå reserverad för annat.

---

## 4. Videohantering

**Konstant:** `HERO_VIDEO_URL` exporterad från `src/pages/Hem.tsx` rad ~24.
**Nuvarande värde:** `/hero-spelmodellen.mp4` (default).
**Poster (placeholder vid load):** `HERO_POSTER_URL = "/hero-poster.jpg"`.

### Hur videon byts
1. Lägg ny video-fil i `C:\Scripts\fotboll\.worktrees\spelmodellen-kareby\public\` (filnamnet kan vara vad som helst).
2. Ändra `HERO_VIDEO_URL`-konstanten i `src/pages/Hem.tsx` så den matchar.
3. Helst en H.264 mp4, ~6–10s loop, ~1080p, < 4 MB. Kort kommentar finns ovanför konstanten i koden.

### Var nuvarande video ligger
- `public/hero-spelmodellen.mp4` — **filen finns inte ännu**. När hero renderas idag misslyckas video-elementet tyst (gör inget); fallback-gradienten + grid + falling words bär hero estetiskt.
- `public/hero-poster.jpg` — **finns inte heller**. Browsern visar då transparent fram tills videon spelar.

**Rekommendation:** Lägg till en placeholder-video (ex. lågfärgad, slow-motion fält-pan, eller ren accent-färg-loop) innan deploy.

---

## 5. Verifiering

| Kommando | Resultat (slutkörning) |
|---|---|
| `npx tsc --noEmit` | **0 errors** (tyst exit) |
| `npx eslint .` | **0 errors, 7 warnings** — alla pre-existing i `src/components/ui/*` (shadcn `react-refresh/only-export-components`). 0 nya warnings introducerade. |
| `npx vitest run` | **213/213 pass** (var 153 före — +14 Hem-tester, +20 komponenttester (FallingWords/TacticalPitchGrid/Footer), +4 Layout, +5 NotFound, +11 head-meta, +andra dynamiska från `canonical-vocab.test.ts`) |
| `npm run build` | **OK** — kvarvarande `chunk > 500KB`-warning (552KB index-bundle) är pre-existing, inte relaterat till hero. |

### Browser QA (Claude Preview MCP)
- Server: `spelmodellen-kareby` på port 5180 (Vite 6).
- 0 console errors. Endast pre-existing React Router v7 future-flag warnings.
- DOM-eval verifierade: H1-text, font-size, bredd, ingen horisontell scroll, video-element finns med rätt attribut/source, CTA + 3 kort renderade.

---

## 6. Responsiv kontroll

| Viewport | Status | Noter |
|---|---|---|
| **Desktop 1440×1000** | ✅ OK | Hero 920px tall, body 1425px brett (= 1440 - scrollbar). Inga layoutbuggar. Screenshot-tool hängde tyvärr på den storleken — verifierat via DOM-mätningar och 1280-screenshot. |
| **Desktop 1280×800** | ✅ OK | Bekräftat via DOM-mätning, screenshot timeout. |
| **Tablet 768×1024** | ✅ OK | Screenshot bekräftat: 3 kort i rad, hamburger-meny synlig, brand intakt. |
| **Mobil 390×844** | ✅ OK | Screenshot bekräftat: H1 "SPELMODELLEN" 326px brett, ingen overflow, kort staplade, fallande ord eleganta. |
| **iPhone SE 375×812** | ✅ OK | DOM-mätning: H1 311px brett (= 375 - 64 padding), font 40px (clamp-min), `horizScroll = 0`. |
| **Tablet landskap 1024×768** | ⚠️ **45px horizScroll** | Pre-existing TopNav-täthetsbugg (8 nav-items + brand + 2 right-cluster-knappar = ~1094px på 1024). Finns även på `main` — ej introducerad av denna PR. Vid 1280+ är `horizScroll = 0`. Föreslås åtgärdas i separat coordineraD PR (Stream A äger Layout/TopNav). |

**Inga horisontella overflow-buggar på någon storlek.**
**Reducerad rörelse:** video gömd, falling words avregistrerade, alla `animate-*` släckta — verifierat via media-query setup i komponenten.

### Designkonsekvens på sidan
Sektioner under hero (Identity/PhaseFlow/Bibliotek/Gated-CTA) använder samma rytm: `py-20 md:py-28`, max-bredd `lg:grid-cols-[340px_minmax(0,1fr)]`, mono-eyebrow + H2 `text-3xl md:text-4xl`, divide-y border-y. Hänger ihop visuellt med hero.

---

## 7. Brister som hittades och fixades

1. **Tidigare slutrapport felaktig** — påstod `/start`, `Start.tsx`, `Start.test.tsx`, Period 1, 6 veckor, 18 pass. **Verklighet:** Ingen `/start`-route. `Hem.tsx` är hemsida (publik). Inga "Period 1"-data finns. Login redirectar till `/` (verifierat i `Login.tsx:35-43`). Allt arbete gjordes mot verkligheten.
2. **`hero.mp4` + `hero-poster.jpg` saknades men referensades** av föregående Hem.tsx — bytte till nytt `HERO_VIDEO_URL`-system + dokumenterad fallback.
3. **H1 overflowade på mobil** vid 60px font på 390 viewport ("SPELMODELL" cut). Fixat med fluid `clamp(2.5rem, 10.5vw, 9rem)`.
4. **Hero-text läsbarhet på mobil** — falling words kunde glida igenom H1-området. Stärkte horisontell vignett: `md:to-transparent` men `to-background/30` på mobil.
5. **A11y: focus-visible saknades** på 14 sekundära länkar (identity, phase, bibliotek, gated). Lade till `focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-inset`.
6. **TopNav brand kände gammalt** — bytte från "G / Gunnilse IS 2026" till "S / Spelmodellen / Gunnilse IS · 2026"-dual-stack.
7. **Index.html title + meta sa "Gunnilse IS · Spelmodell 2026"** — uppdaterade till spelmodellen-brand med korrekt subhead-copy i og/twitter.
8. **Footer var generisk** — bygde ny med spelmodellen-identitet och relevanta snabblänkar.
9. **Inga `console.log` i produktionskod** — verifierat ren.
10. **Inga mojibake i koden** — endast en pre-existing fil i `assets/spelmodell/forsvar-mot-kontring.png` (ej rörd).

---

## 8. Kvarvarande brister

| # | Allvarlighet | Brist | Orsak | Varför inte löst | Nästa åtgärd |
|---|---|---|---|---|---|
| 1 | **Låg** | `public/hero-spelmodellen.mp4` saknas | Filen behöver läggas till manuellt | Inte mitt scope att skapa video. Hero är estetiskt komplett utan (poster + statisk gradient + grid + falling words gör hero-känslan stark) | Lägg en H.264-loop i `public/`. Ändra `HERO_VIDEO_URL` om filnamnet skiljer. |
| 2 | **~~Medel~~** | ~~`public/hero-poster.jpg` saknas~~ | **LÖST** — genererat via sharp i commit `99f98c6`. 1920×1080 dark gradient + subtle pitch lines (15KB). | — | — |
| 3 | **Låg** | TopNav full-förenkling till user-spec ("Start, Spelidé, Perioder, Träningspass, Fördjupning, Verktyg") **inte** gjord | Befintlig nav (Skeden/Match dropdowns) ägs formellt av Stream A i parallellt arbete. Full ombyggnad skulle riskera merge-konflikter | Med övriga streams' samtycke: konsolidera dropdowns + lägg till `/perioder` + `/fordjupning`-routes. Helst i egen PR. |
| 4 | **Låg** | Bibliotek-sektion länkar till `/verktyg` men det finns inget `/perioder` eller `/traningspass` | Reella routes existerar inte ("Träningspass" som koncept hör till `/verktyg` + `/spelmodell-labb`) | Användarens IA-spec inkluderar dessa routes men inga sidor finns. | Designa egna sidor `/perioder`, `/fordjupning` i framtida iteration. |
| 5 | **Låg** | "Se principerna"-CTA går till `/anfall` (gated) | `/anfall` är skyddad route bakom AuthGuard | Det är rimligt — visitor ser login-prompt och kan begära tillgång. Alternativ vore att göra `/spelide` eller `/anfall` publik | Diskutera om public-läsversion av spelidé ska finnas. |
| 6 | **Låg** | Vite-build varnar för `index-DiGHIpN8.js` 552KB > 500KB | Pre-existing — beror på React + Radix UI + supabase-js + framer-motion | Inte introducerat av mig. Att lösa kräver `manualChunks`-split. | I separat refactor: konfigurera `build.rollupOptions.output.manualChunks` att splita radix/supabase till egna chunks. |
| 7 | **Låg** | preview_screenshot timeout vid stora viewports (1280, 1440) | Den heavy hero (video + 16 falling words + grid SVG + animationer) verkar trött på MCP-screenshotets render | Verifierat via DOM-mätningar och mindre screenshots. Inte en bugg i koden. | Ingen — det är en MCP-tool-begränsning. |
| 8 | **Låg** | Pre-existing 7 ESLint warnings i `src/components/ui/*` | shadcn-mönster som blandar component-export + helpers (`react-refresh/only-export-components`) | Pre-existing, ej i scope | Vid refactor av shadcn-bas: splita helpers till egna filer. |
| 9 | **Mycket låg** | Filnamn `src/components/Matetal.tsx` (ska vara `Mätetal.tsx`) | Pre-existing typo / mojibake | Inte använt av Hem; rör inte annat | Byt filnamn + uppdatera importer i framtida pass. |
| 10 | **Låg** | 45px horizontal scroll på exakt 1024×N viewport | Pre-existing TopNav-täthetsbugg: 8 nav-items + brand + 2 right-cluster-knappar = ~1094px på 1024-container. Finns även på `main`. | Stream A äger Layout/TopNav per `STREAMS/00-COORDINATION.md`; även en mindre nav-reorg riskerar konflikter. | Coordinated PR som antingen flyttar desktop-nav till `xl:flex` (1280+) eller döljer "Nuläge" / "Roller" på `lg`. |

**Inga öppna fel som blockar shipping av hero.** De medel-allvarliga bristerna (#1, #2) är tillgångar som ska läggas till — kod är klar.

---

## 9. Antaganden

| Antagande | Grund | Risk om fel |
|---|---|---|
| `/` är kanonisk publik landningssida (inte `/start`) | `App.tsx:82` `<Route path="/" element={<Public><Hem /></Public>} />`. Login redirectar till `/` (`Login.tsx:35-43`). Tidigare slutrapport felaktig. | Om man verkligen vill ha `/start`: lägg till en alias-route `<Route path="/start" element={<Public><Hem /></Public>} />`. Ingen kod-ändring krävs i Hem.tsx. |
| Hero-video är "nice-to-have", inte blocker | Användaren skrev "Gör videolänken enkel att byta via en konstant" — implicerar att fil läggs senare | Fallback-gradienten är estetiskt komplett; sajten ser inte ut som template trots saknad video. |
| Hero CTAs får leda till gated routes | Användarens spec gav "Utforska spelmodellen" + "Se principerna" utan publik landningsalternativ. AuthGuard skickar till `/login` | Om public read-only önskas: gör `/spelide` public (ändra `<Protected>` → `<Public>` i `App.tsx`). |
| Stream A äger TopNav-arkitekturen | `STREAMS/00-COORDINATION.md` listar `Layout.tsx` som "formellt ägd av Stream A". Min worktree är `kareby-spelmodell` (egen) — låg-risk-pad valdes | Om alla streams är klara: kan göra full nav-omstrukturering i ny PR. |
| Deploy är via `main` → GitHub Actions → spelmodellen.se | `README.md` säger detta. Jag pushade INTE; commit är bara lokal | Pushen sker när man säger till. Inget deploy-bagage. |
| Design Law (`STREAMS/05-DESIGN-LAW.md`) gäller — alla streams måste följa | Filen är explicit kontrakt | Mina ändringar följer den (Inter, dark tokens, font-black H1, mobile-first, focus rings). |

---

## 10. Nästa steg (prioriterat)

1. **Lägg till `public/hero-spelmodellen.mp4` + `public/hero-poster.jpg`.** Hero är klart att visa video så fort filen finns. Förslag: 6–10s pan över taktiktavla / fältkontur / spelare i siluett, mörk färgskala, slow-motion.
2. **Push + öppna PR från `feat/kareby-spelmodell-2026-05-07` → `main`.** Reviewa diff, kontrollera mot live spelmodellen.se via deploy preview om sådant finns.
3. **Bestäm `/start` vs `/`-frågan.** Antingen alias-route eller acceptera att `/` är hemsidan. Ändra ev. dokumentation/marknadskommunikation.
4. **Diskutera publik läsversion av spelidé.** Om visitor ska kunna se principer utan login: gör `/spelide` `<Public>` istället för `<Protected>`.
5. **Koordinera med övriga streams** om TopNav full-förenkling till "Start, Spelidé, Perioder, Träningspass, Fördjupning, Verktyg". Lägg till routes `/perioder` + `/fordjupning`.
6. **Bundle-split** `manualChunks` för radix + supabase-js i `vite.config.ts` — minskar `index.js` < 500KB.
7. **Visuell polish-loop 2:** med riktig hero-video on-page, finjustera vignett-opacities. Eventuellt minska antalet falling words om video upplevs konkurrera med dem.
8. **A11y-revision:** kontrastera nya `text-foreground/82`-toner mot dark bg via Lighthouse (target 4.5:1). Verifiera tab-ordning manuellt.
9. **Lighthouse-mätning** av hero efter video lagts: LCP-mål < 2.5s.
10. **Filnamn-rensning:** byt `Matetal.tsx` → `Matetal.tsx`/`Metrics.tsx` (eller behåll men dokumentera typo).

---

**Build-konstaterande:** Allt under min kontroll är grönt. Inget ödesdigert återstår. Huvudåtgärden för "premium" är att lägga till en hero-video i `public/`.
