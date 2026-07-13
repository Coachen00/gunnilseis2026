# VAR FÖRBEREDD — implementationsplan (plankontrakt)

Självbärande plan. Exekverande agent har INTE konversationskontexten — allt som behövs står här.

## Mål

Ny fristående app `var-forberedd/` (denna mapp) i fotboll-repot. Pedagogiskt system för Joels spelarutbildningsplan/spelmodell. Visuell linje = Föreningsportalen (GFF grafisk identitet, referens: `C:\Scripts\App_föreningsutvecklaren`). Innehållskälla = `../process/5 upphöjt i fem/`.

## Stack (härma föreningsportalen)

- React + TypeScript + Vite (npm). Ingen Tailwind, inget shadcn, ingen router-lib.
- Styling: vanlig CSS med designtokens i `src/index.css` + per-vy CSS.
- Nav: state-driven (`useState<Section>` i `App.tsx`), sidebar + topbar.
- Data: localStorage-repository + seed-data i `src/data/seed.ts`. Ingen Supabase, ingen auth.
- Roller: segmented control i topbar — `huvudtranare | tranarteam | spelare`. Ingen login.

## Designtokens (kopiera exakt in i src/index.css :root)

```
--paper:#f1f0ee; --paper-tint:#e9e8e5; --card:#fff; --card-2:#f7f6f4; --beige:#f1dfd3;
--ink:#231f20; --ink-soft:#443f40; --ink-mute:#6b6566; --line:#e2e0dd; --line-strong:#cfccc8;
--navy:#0b2d44; --navy-2:#11425f; --navy-3:#15577d;
--bla:#007ac2; --bla-700:#00598c; --bla-bright:#2b9cd8; --bla-glow:#7fc4ea; --bla-soft:#dceef9;
--gul:#f2c200; --gul-bright:#fed41d; --gul-soft:#fdf2c2; --clay:#c2492f; --clay-soft:#f6ddd4;
--done-fg:#155e3f; --done-bg:#d6efdf;
--r-sm:10px; --r-md:16px; --r-lg:22px; --r-xl:30px;
--ease:cubic-bezier(0.22,1,0.36,1);
```
- Skuggor: navy-tonade, `--shadow-sm/md/lg` med rgba(11,45,68,…).
- Typografi: `--display`/`--sans`: `'Grandview','Saira',ui-sans-serif,system-ui,'Segoe UI',sans-serif`. Kopiera woff2-filer från `C:\Scripts\App_föreningsutvecklaren\public\fonts\` till `public/fonts/` + samma @font-face. h1–h4 Grandview Bold, letter-spacing -0.02em. Bas 16px/1.5.
- Fokusring: 3px `--gul-bright` outline + navy halo. `prefers-reduced-motion` respekteras.
- Kort: 1px `--line`-border, `--r-md`, hover translateY(-2px)+shadow-md. Knappar: `.primary-action` blå gradient min-height 44px, `.secondary-action` card-2. Statuspills med prick-indikator.
- Layout: app-shell CSS grid 292px sidebar + 1fr. Sidebar mörk navy-gradient, grupperad nav. Brytpunkter 1080/860/720/640/520 — sidebar blir horisontell nav-rad <1080px.

## Kärnhierarki (fasta begrepp — använd exakt dessa i UI-copy)

Var förberedd → Lärprogram → Lärsteg → Spelområde → Tränaruppdrag → Matchbevis.
Tvärgående lager: fem identiteter, utvecklingsområden, träningsmetodik, material, progression/status, analys, tränarteamets ansvar, kaskad HT→team→spelare.

## Datamodell (src/domain/types.ts)

Alla entiteter har `id: string`. Statusenum (exakt dessa 6): `Ej påbörjat | Pågår | Delvis förstått | Visat i träning | Visat i match | Etablerat`.

- `Identitet`: namn, kortForklaring, beskrivning, varfor, beteenden[], missforstand[], coachrop[], matchexempel[], larstegIds[], uppdragIds[], matchbevisIds[]
- `Larprogram`: titel, beskrivning, larstegIds[] (ordnade)
- `Larsteg`: stegnummer, titel, sammanfattning, syfte, varforHar, forkunskaper, gemensamForstaelse, begrepp[] {term, forklaring}, forstaelseHT, forstaelseTeam, forstaelseSpelare, beteenden[], identitetIds[], huvudomrade: SpelomradeId, stodomraden[], traningsformer[], visualiseringar[], coachrop[], befintligtMaterial: materialIds[], saknatMaterial[], uppdragIds[], matchbevisIds[], missforstand[], status, progression: 0–100, nastaSteg (fritext)
- `Spelomrade` (4 fasta: anfall, forsvar, omstallning, fasta): namn, principer: `Princip[]` med `niva: super|huvud|sub|roll` + `parentId?`, beteenden[], coachrop[], traningsformer[], bilder[]
- `Traneruppdrag`: titel, syfte, ansvarigRoll, forberedelser, observera, fragor[], coachrop[], forstarkBeteenden[], traningsformer[], nar, larstegId, status, kommentarer[] {roll, text, datum}, nastaAktion
- `Matchbevis`: situation, vadViSer, beteende, kvalitet, uppfoljning, utfall: `uppnått|delvis|ej uppnått|—`, datum, typ: `match|träningsmatch|träning`, kommentar, materialRef, larstegId, identitetIds[]
- `Material`: titel, typ (bild|video|dokument|länk), url, beskrivning, taggar[]
- `Observation`: roll, text, datum, larstegId?, uppdragId?
- `AppState`: { larprogram, larsteg[], identiteter[], spelomraden[], uppdrag[], matchbevis[], material[], observationer[], aktivtLarstegId }

Repository (`src/store/repository.ts`): load = localStorage `var-forberedd:v1` annars seed; save vid varje mutation; `resetTillSeed()`. React context + reducer eller enkel useState-store i `src/store/useAppState.tsx`.

## Seed-innehåll (src/data/seed.ts) — extrahera ur ../process/5 upphöjt i fem/

- 5 identiteter ur `bibliotek/identitet.md` (Dueller, Andrabollsspel, Ta ytan, Prata med passningen, Scanning) inkl. G/IG-observerbara beteenden.
- 7 lärsteg ur `sju-stegsmodell-var-forberedd.md`: 1 Idé och riktning, 2 Identitet och standard, 3 Spelmodell och skeden, 4 Principer, 5 Sub-principer och rollcues, 6 Arbetssätt och insats, 7 Lärloop och förankring.
- Spelområde anfall: principer ur `skeden/1-anfallsspel.md` (5 huvudprinciper + subprinciper). Övriga tre områden: skapa med namn + tomma principlistor (partial state visas i UI).
- Grundtext översikt ur `00-grundkarta-var-forberedd.md` + `00-karnan.md`.
- Fyll fält som saknas i källorna med tom sträng/tom lista — ALDRIG hitta på fotbollsinnehåll.

## Vyer (sektioner i App.tsx, lazy per vy)

1. `oversikt` — Var förberedd hem: aktuellt lärsteg, progression per lärsteg (7 pills/ring), vad är etablerat/pågår/saknas, nästa steg-kort.
2. `larprogram` — stepper/rail över 7 lärsteg med status, klick → detalj.
3. `larsteg` — detaljvy: sektioner för alla Larsteg-fält, grupperade (Förståelse HT/team/spelare, Identiteter, Spelområden, Uppdrag, Matchbevis, Material, Missförstånd, Status). HT-roll: redigera inline. Andra roller: läs.
4. `identiteter` — 5 kort → detalj med alla fält + kopplade lärsteg/uppdrag/bevis.
5. `spelomraden` — 4 områden, principhierarki (super→huvud→sub→roll) som indenterad lista/träd.
6. `uppdrag` — lista m. statusfilter, skapa/redigera, kommentar + nästa aktion.
7. `matchbevis` — lista, registrera bevis (koppling lärsteg + identiteter), utfall + uppföljning.
8. Rollstyrning: `spelare` ser förenklad översikt + aktuellt lärsteg (begrepp, beteenden, coachrop, "vad förväntas") — ingen admin. `tranarteam` ser uppdrag/observationer/matchbevis + läs lärsteg. `huvudtranare` allt + redigering.

Varje vy: empty state (vad+varför+CTA), error state (role=alert), partial state (t.ex. spelområde utan principer: "Inga principer ännu — Lägg till princip"). Loading behövs ej med lokal data utom lazy-Suspense-fallback.

CTA-copy med verb: "Skapa lärsteg", "Lägg till tränaruppdrag", "Registrera matchbevis", "Markera som visat", "Föreslå nästa steg", "Öppna material".

## Steg (sekventiella, ett subagent-jobb per steg)

Testgate efter varje steg: `npm run build` grönt (tsc + vite). Steg 2+: `npx vitest run` grönt.

1. **Scaffold + designsystem + skal.** Vite react-ts, index.css med tokens ovan, app-shell (sidebar/topbar/rollväxlare), tomma vy-stubbar med nav. Acceptans: build grönt, alla 7 sektioner nåbara, rollväxlare byter roll-state.
2. **Datamodell + repository + seed.** types.ts, repository, useAppState, seed extraherad ur källfilerna. 1 vitest: seed laddar, round-trip localStorage, 5 identiteter + 7 lärsteg + 4 områden finns. Acceptans: test grönt.
3. **Översikt + lärprogram + lärstegsdetalj** (läsläge + HT-redigering av textfält/status). Acceptans: alla §3-fält renderas, statusbyte persisterar.
4. **Identitetsvy + spelområdesvy** inkl. principhierarki + partial states. Acceptans: anfallsprinciper ur seed syns i träd; tomma områden visar CTA.
5. **Tränaruppdrag + matchbevis** CRUD + kopplingar till lärsteg/identiteter + kommentarer/nästa aktion + utfall. Acceptans: skapa/redigera/statusa persisterar; bevis syns på kopplat lärsteg.
6. **Rollvyer.** Spelarens förenklade vy, tränarteamets arbetsyta (observationer, veckans uppdrag). Acceptans: spelare ser ingen redigering; team kan registrera observation + matchbevis.
7. **Polish:** empty/error/partial överallt, tangentbordsnav + fokusring, mobil ≤520px, kontrast AA. Acceptans: manuell browserverifiering.

## INTE i scope (bygg inte)

Auth/login, Supabase/moln, statistik/analysgrafer, AI-generering, videouppladdning (endast URL-fält), export, PWA/service worker, materialbibliotek som egen fullvy (material hanteras inline på lärsteg/bevis), fler lärprogram än ett.

## Gotchas

- Sökvägar innehåller mellanslag + svenska tecken — citera alltid.
- Repot är INTE git-initierat och ligger i OneDrive. `node_modules` funkar men är segt i OneDrive — acceptera.
- Kopiera INTE kod rakt av från App_föreningsutvecklaren (annan domän) — bara tokens/CSS-mönster.
- Hitta aldrig på fotbollsinnehåll — seed endast från källfilerna, luckor lämnas tomma (partial state är en feature).
- UI-språk: svenska. Kodidentifierare: svenska utan åäö (larsteg, forstaelse).
