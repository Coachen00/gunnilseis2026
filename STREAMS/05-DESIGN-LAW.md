# Design Law — gemensam estetik & kvalitetsribba för alla streams

**Alla fyra streams (A, B, C, D) MÅSTE läsa och följa detta innan de skriver UI-kod.**
Denna fil är kontraktet som håller sajten koherent när fyra olika fönster jobbar parallellt.

---

## 1. Tema: "Midnight Pitch"

Sajten är **mörk, minimal, skarp**. Gunnilse-IS är ett klassiskt klubbvarumärke (navy + guld) — vi översätter det till en samtida, lugn dark-mode-estetik.

**Kärnpalett (definierad i `src/index.css` — använd alltid via Tailwind-klasser, aldrig hex):**

| Token | Användning |
|---|---|
| `bg-background` (215 30% 6%) | Hela bakgrunden |
| `text-foreground` (220 20% 96%) | All brödtext |
| `bg-card` (217 28% 9%) | Sektioner/kort |
| `text-primary` (blå 212 50% 48%) | Primär CTA, länkar |
| `text-accent` / `bg-accent` (guld 47 78% 56%) | Highlights, ringar, hero-accent |
| `text-destructive` (358 75% 59%) | Fel, varningar, ta-bort |
| `border-border` | Alla kanter |
| `text-muted-foreground` | Sekundär text |

**Klubb-tokens (för identitetsmoment, ej generell UI):**
- `text-gunnilse-navy`, `text-gunnilse-gold`, `text-gunnilse-red`, `text-gunnilse-shield`, `text-gunnilse-warm`

**Spelfält & zoner (för diagram, taktik, fält-illustrationer):**
- `bg-pitch`, `border-pitch-lines`, `bg-pitch-dark`
- `text-zone-attack` (grön), `text-zone-midfield` (gul), `text-zone-defense` (röd)

**Förbjudet:** Inga nya färgvärden i kod (`#xxxxxx` eller `hsl(...)` direkt). Behöver du en ny token → lägg till i `src/index.css` `:root` och i `tailwind.config.ts`, men **stäm av med Joel först** (delad fil = koordinationskonflikt).

---

## 2. Typografi

- Font: **Inter** (laddad via Google Fonts i `index.css`).
- Hierarki: `text-4xl/5xl/6xl` för hero, `text-2xl/3xl` för sektion, `text-base` för brödtext, `text-sm` för meta.
- Vikter: `font-light` (300) för stora display-rubriker, `font-medium` (500) för UI, `font-semibold` (600) för knappar/sektion, `font-bold` (700) för betoning.
- **Ledning:** ge stora rubriker `leading-tight`, brödtext `leading-relaxed`.
- **Letter-spacing:** display-rubriker får gärna `tracking-tight`; SMÅ caps-rubriker (taggar, eyebrows) `tracking-widest uppercase text-xs`.

---

## 3. Spacing & rytm

- Använd Tailwind-skalan (4px-baserad). `gap-4`, `gap-6`, `gap-8`, `py-12`, `py-16`, `py-24` för sektioner.
- **Sektionsrytm:** stora sidor delas i sektioner med `py-16 md:py-24`, max-bredd `max-w-6xl mx-auto px-6`.
- **Kort & paneler:** `rounded-lg` (default), `border border-border`, `bg-card`, `p-6` eller `p-8`.
- **Micro-spacing:** ikoner får `gap-2`, listor `space-y-3`, formulär `space-y-4`.

---

## 4. Komponentlag (återanvänd, inga dubbletter)

Innan du bygger en ny komponent — kolla att den inte redan finns:

**Sidobygg-block (`src/components/`):**
- `PageHero.tsx` — heroes på alla skyddade sidor
- `SectionHeader.tsx` — sektionsöverskrifter
- `ChapterNumber.tsx` — kapitelnumrering
- `ScrollChapter.tsx` — scroll-triggered animation av sektion
- `ScrollCue.tsx` — "scrolla ner"-pil
- `CoachCue.tsx` — coach-quotes/insights
- `KPIBox.tsx` — siffer-highlight
- `PrincipleCard.tsx` / `PrincipleTeaser.tsx` — principer
- `RoleCard.tsx`, `SetPieceCard.tsx`, `TriggerCard.tsx` — innehållskort
- `FootballPitch.tsx`, `InteractiveFootballPitch.tsx`, `SimpleTacticsBoard.tsx` — fält-illustrationer

**Diagram & illustrationer (`src/assets/`):**
- `formation-433.png`, `golden-zone-diagram.png`, `korridorer-diagram.png`, `spelytor-diagram.png`, `spelbarhet-infografik.png`, samt `defensiv-/offensiv-horna.png` etc.

**shadcn-primitiver (`src/components/ui/`):** `button`, `card`, `dialog`, `dropdown-menu`, `tooltip`, `accordion`, `tabs`, `toast` m.fl. — alla redan importerbara.

**Förbjudet:** Bygg inte en `Hero2.tsx`, `MyButton.tsx`, `CardV2.tsx`. Förbättra det som redan finns. Om något genuint saknas — föreslå för Joel innan du bygger.

---

## 5. Animation & motion

- Subtila, syftesburna animationer. **Inga karusell-paradigm, inga snurrande logos.**
- `tailwindcss-animate` finns redan installerad.
- Scroll-triggered reveals: använd befintlig `ScrollChapter.tsx` istället för att rulla egen IntersectionObserver.
- Hover-states: `transition-colors`, `transition-transform`, `duration-200`.
- **Respektera `prefers-reduced-motion`** — för tunga animationer wrap:a med `motion-safe:` Tailwind-modifier.
- Inga animationer på print-routes (`/matchblad`, `/traningsplan`, `/motstandaranalys`, `/taktiktavla`).

---

## 6. Mobile-first (icke-förhandlingsbart)

**Coacher kommer att använda detta från telefonen.** Om något bara funkar på desktop är det en bugg.

- Testa varje ändring vid **375px viewport** (iPhone SE) och **390px** (iPhone 13).
- Tap-targets: minimum 44×44px (Apple HIG). Knappar: `h-10` minst, helst `h-11` på mobil.
- Text: aldrig under `text-sm` (14px) för läsbart innehåll.
- Horisontell scroll = bugg. Använd `overflow-x-auto` bara medvetet i tabeller/diagram.
- Använd `md:` och `lg:` breakpoints — default styling = mobil.
- TopNav är sticky — kontrollera att nya sektioner inte skyms av nav vid anchor-scroll (offset behövs).

---

## 7. Tillgänglighet — minimum

- Alla `<button>`, `<a>`, formulärfält måste vara tabbara med synlig focus ring (`focus-visible:ring-2 focus-visible:ring-ring`).
- Bilder: `alt`-text. Dekorativa: `alt=""`.
- Färgkontrast minimum **4.5:1** för text mot bakgrund (testa med devtools color picker).
- Klickbara element ska vara semantiskt korrekta — `<button>` för actions, `<a>` för navigering. Inga `<div onClick>`.
- Modals/dialogs: använd shadcn `Dialog` (har redan korrekt focus trap).

---

## 8. Innehåll & ton

- **Allt på svenska.** Inga "Lorem ipsum", inga "TODO", inga engelska placeholders i committat innehåll.
- Coachande, varmt, sakligt. Inte säljande, inte byråkratiskt.
- Aktiva verb: "Vinn andrabollen" — inte "Andrabollen ska vinnas".
- Korta meningar. Bryt långa stycken.
- Faktarubriker över bullet-listor.

---

## 9. Print (för Stream D särskilt — andra: rör inte)

Print-routes (`/matchblad`, `/traningsplan`, `/motstandaranalys`, `/taktiktavla`) renderas **utan Layout** (ingen TopNav, ingen footer). Detta är medvetet.

- Print-CSS får aldrig brytas — verifiera Ctrl+P → "Spara som PDF" innan PR.
- Inga animationer i print.
- A4 portrait som default. Margins via `@page { margin: 1.5cm; }` om behövs.

---

## 10. Kvalitetsribba per PR

Innan du öppnar PR — alla streams:

- [ ] `npm run dev` startar utan console-fel på sidor du rört
- [ ] Manuellt klick-test av flödet du ändrat
- [ ] Resize till 375px → layout håller
- [ ] Tab-igenom alla nya interaktiva element
- [ ] `npx tsc --noEmit` är tyst
- [ ] `npm run build` går igenom
- [ ] Inga nya `console.log` i produktionskod
- [ ] Inga nya färgvärden utanför design-tokens
- [ ] Inga engelska placeholders / lorem ipsum

---

## 11. När i tvivel

→ Pinga Joel via chatten. Det är 1000× billigare att fråga än att merga något som bryter koherens. Sajten är liten nog att vi har råd att gå sakta och göra det rätt.
