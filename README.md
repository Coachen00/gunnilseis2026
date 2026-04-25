# Gunnilse IS · Spelmodell 2026

Webbplats för Gunnilse IS spelmodell — identitet, fyra skedena, fasta situationer, roller, matchplaner och tränarverktyg.

Stack: **Vite 6 · React 18 · TypeScript · Tailwind · shadcn/ui · Supabase · React Router**.
Hostas via **Cloudflare Pages** (auto-deploy från `main`).

---

## Lokal utveckling

```bash
npm install
npm run dev          # http://localhost:8080
```

Andra kommandon:

```bash
npm run build        # produktionsbygge → dist/
npm run preview      # förhandsvisa byggd version lokalt
npm run lint         # ESLint
npm run test         # Vitest (engångskörning)
npm run test:watch   # Vitest watch-läge
```

---

## Projektstruktur

```
src/
├── App.tsx               Routing — alla 22 sidor är lazy-loadade
├── pages/                En fil per route (Hem, Spelide, Forsvar, …)
├── components/
│   ├── Layout.tsx        Topbar + animerad bakgrund + footer (alla skyddade sidor)
│   ├── TopNav.tsx        Sticky-nav med dropdowns
│   ├── AuthGuard.tsx     Skyddar routes — kräver session + admin-godkännande
│   ├── match/            Matchplan-flödet (EditableText sparar mot Supabase)
│   ├── sections/         Längre innehållssektioner
│   └── ui/               shadcn-baserade primitiver
├── data/                 Hårdkodat innehåll (identity, principles, phaseCues, matchplan)
├── hooks/                useMatch (Supabase), useInView, use-mobile, use-toast
├── integrations/supabase Auto-genererad supabase-klient + typer
└── test/                 Vitest-suiter
supabase/
├── migrations/           Schema-historik
└── functions/            Edge functions (notify-new-signup, sync-gunnilse-calendar, sync-matchplan)
```

---

## Auth-flöde

1. Användare registrerar sig via `/login` (Supabase Auth → e-post + lösen).
2. Konto skapas i `auth.users` + en rad i `profiles` med `approved=false`.
3. Adminbehöriga ser nya förfrågningar i `/admin` och kan godkänna.
4. Edge function `notify-new-signup` skickar mejl till admin vid ny registrering.
5. `AuthGuard` stoppar oapprover­ade konton från att se innehåll (visar väntar-vy).

För att lägga till en tränare: be hen registrera sig på `/login`, godkänn i `/admin`.

---

## Innehåll & uppdateringar

**Idag:** Mest innehåll ligger som TypeScript-data i `src/data/` — ändringar kräver kod-deploy. Undantag är **Matchplan** (`/match/kommande`), där varje sektion har en `EditableText`-kommentar som autospar mot Supabase-tabellen `match_section_text`.

**Roadmap:** Flytta `identity.ts`, `principles.ts`, `phaseCues.ts` till Supabase-tabeller och bygg redigeringsvyer i `/admin` så icke-tekniska användare kan uppdatera utan deploy.

---

## Deploy

Push till `main` → Cloudflare Pages bygger och deployar automatiskt. Inga manuella steg.

Om Cloudflare-bygget faller över Vite-versionen, säkerställ att `package.json` har `"vite": "^6.0.0"` eller högre (Cloudflare auto-config kräver Vite 6+).

---

## Print-vyer

Dessa routes saknar Layout (nav/footer) för rent A4-tryck:

- `/traningsplan`
- `/matchblad`
- `/motstandaranalys`
- `/taktiktavla`

Använd webbläsarens utskrift (Ctrl+P) → spara som PDF.

---

## Edge functions (Supabase)

| Funktion | Trigger | Syfte |
|---|---|---|
| `notify-new-signup` | DB-webhook vid ny `profiles`-rad | Mejl till admin om nytt konto |
| `sync-gunnilse-calendar` | Cron / manuell | Hämtar Gunnilse-kalender (Laget.se) |
| `sync-matchplan` | Manuell | Importerar extern matchplan-data (legacy, ersatt av inbäddad Matchplan-komponent) |
