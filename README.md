# Gunnilse IS · Spelmodell 2026

Webbplats för Gunnilse IS spelmodell — identitet, fyra skedena, fasta situationer, roller, matchplaner och tränarverktyg.

Stack: **Vite 6 · React 18 · TypeScript · Tailwind · shadcn/ui · Supabase · React Router**.
Hostas på **[spelmodellen.se](https://spelmodellen.se)** via **GitHub Pages** — auto-deploy från `main` via GitHub Actions (`.github/workflows/deploy.yml`).

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

Push till `main` → GitHub Actions (`.github/workflows/deploy.yml`) bygger med Bun, kopierar `dist/index.html` till `dist/404.html` (SPA-fallback för React Router) och deployar till GitHub Pages. Live på <https://spelmodellen.se>.

**DNS:** spelmodellen.se peker mot GitHubs Pages-IP:er via 4 A-records hos Loopia. `public/CNAME` innehåller `spelmodellen.se` så GitHub vet vilken host som ska serveras.

**Manuell deploy / re-deploy:** Actions-tab → "Deploy to GitHub Pages" → "Run workflow".

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
| `sync-gunnilse-calendar` | Cron / manuell | Synkar **alla** matcher från svenskalag.se till `matches`-tabellen. Status (upcoming/played) härleds från datum. Respekterar `manual_override`. |
| `sync-gunnilse-squad` | Cron / manuell | Synkar truppen + ledarstaben från svenskalag.se till `players`-tabellen. |
| `sync-matchplan` | Manuell | Importerar extern matchplan-data (legacy, ersatt av inbäddad Matchplan-komponent) |

### Deploya truppen + matcher (Fas 2-uppsättning)

```bash
# Kör migration (skapar players-tabellen)
supabase db push

# Deploya nya edge function
supabase functions deploy sync-gunnilse-squad
supabase functions deploy sync-gunnilse-calendar

# Test-kör
supabase functions invoke sync-gunnilse-squad
supabase functions invoke sync-gunnilse-calendar
```

### Cron (Fas 3 — automatisk uppdatering)

Tre alternativ:

1. **Supabase pg_cron** (kräver Pro-plan): Lägg till en SQL-migration:
   ```sql
   select cron.schedule('sync-squad', '0 5 * * *',
     $$ select net.http_post('https://<project>.supabase.co/functions/v1/sync-gunnilse-squad',
        headers := jsonb_build_object('Authorization', 'Bearer <anon-key>'),
        body := '{}'::jsonb) $$);
   select cron.schedule('sync-calendar', '0 5 * * *',
     $$ select net.http_post('https://<project>.supabase.co/functions/v1/sync-gunnilse-calendar',
        headers := jsonb_build_object('Authorization', 'Bearer <anon-key>'),
        body := '{}'::jsonb) $$);
   ```

2. **GitHub Action** (gratis): Lägg till `.github/workflows/sync.yml` som anropar funktionerna varje natt med `curl`.

3. **Extern cron** (cron-job.org, EasyCron): Pinga edge-function-URL:erna enligt schema.

### Fallback-logik

Om Supabase `players` eller `matches` är tom använder frontenden statisk data från `src/data/squad.ts` och `src/data/season.ts`. En liten gul "Fallback-data"-pille visas på sidorna tills första syncen körts.
