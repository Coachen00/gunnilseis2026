

# Spelmodell 2026 — Storytelling-redesign

## Mål
Förvandla startsidan från en statisk länkgrid till en **berättande resa** genom Gunnilse IS spelmodell, där principer och förståelse står i centrum. Besökaren ska *vilja* fortsätta scrolla.

## 1. Ny rubrik & positionering (Hem)
- Byt ut `Träningsmatcher Vinter / Vår 2026` mot **`Spelmodell 2026`**.
- Ny eyebrow: `Gunnilse IS · Vår identitet på planen`.
- Ny ingress fokuserad på *principer*, inte matchschema:
  > "Så här försvarar vi. Så här anfaller vi. Så här ställer vi om. Fem principer per skede — en gemensam förståelse för hela laget."

## 2. Storytelling-struktur på Hem (ersätter dagens 6-kortsgrid)
Sidan blir en **scrollberättelse i kapitel**, inte en meny. Varje kapitel är en full-bleed sektion med eget visuellt språk:

```text
┌─────────────────────────────────────────┐
│  HERO — "Spelmodell 2026"               │  ← stor, lugn, eyebrow + 1 mening
│  ↓ scroll-cue (pulserande pil)          │
├─────────────────────────────────────────┤
│  KAPITEL 1 — "Vår identitet"            │  ← 5 ord som definierar oss
│  Stora typografiska statements          │     (Duell · Omställning · Rörelse...)
├─────────────────────────────────────────┤
│  KAPITEL 2 — "De fyra skedena"          │  ← visuell intro till spelets faser
│  Försvar → Omst.→Anfall → Omst.→Försvar │
├─────────────────────────────────────────┤
│  KAPITEL 3 — "När vi försvarar"         │  ← 4-3-3, princip-teaser, CTA→/forsvar
│  Stort tal "01", princip 1 av 5 visad   │
├─────────────────────────────────────────┤
│  KAPITEL 4 — "När vi anfaller"          │  ← 3-2-2-3, princip-teaser, CTA→/anfall
├─────────────────────────────────────────┤
│  KAPITEL 5 — "Fasta situationer"        │  ← kort teaser, CTA→/fasta
├─────────────────────────────────────────┤
│  KAPITEL 6 — "Roller & verktyg"         │  ← 2 kompakta kort (Roller, Verktyg)
├─────────────────────────────────────────┤
│  AVSLUT — "Spelmodellen är levande"     │  ← citat-känsla, signatur
└─────────────────────────────────────────┘
```

Princip-teasers (kapitel 3–5) visar **1 princip i klartext** + "Se alla 5 →" länk. Det skapar nyfikenhet utan att dumpa allt på Hem.

## 3. Nya komponenter
- **`ScrollChapter`** — full-bleed sektion (`min-h-[80vh]`), centrerad innehåll, fade-in vid scroll (IntersectionObserver).
- **`ChapterNumber`** — stort outline-tal ("01", "02"...) i Gold som bakgrundselement, ger visuell rytm.
- **`PrincipleTeaser`** — visar 1 vald princip stort (citat-stil) + länk till full sida.
- **`ScrollCue`** — diskret pulserande nedåtpil under hero.
- **`PhaseFlow`** — horisontell visualisering av de fyra spelskedena (kapitel 2).

## 4. Varje undersida får också storytelling-intro
Försvar/Anfall/Fasta börjar med en **kort principiell ingress** (1–2 meningar om *varför*) innan diagrammen. Idag hoppar de rakt in i taktik. Ger förståelse före detaljer.

## 5. Visuell polering
- Större typografisk kontrast på Hem: rubriker `text-5xl→text-7xl`, brödtext `text-lg`, gott om luft (`py-32` mellan kapitel).
- Subtila scroll-triggade fade/slide-in via befintlig `animate-fade-in` + IntersectionObserver-hook.
- Gold-accent används sparsamt — bara på siffror, scroll-cue och nyckelord.
- Behåll AnimatedBackground men sänk opaciteten ytterligare (texten är nu hjälten).

## Tekniska detaljer
- **Filer som skapas:** `ScrollChapter.tsx`, `ChapterNumber.tsx`, `PrincipleTeaser.tsx`, `ScrollCue.tsx`, `PhaseFlow.tsx`, `hooks/useInView.ts`.
- **Filer som skrivs om:** `src/pages/Hem.tsx` (komplett ny struktur), `src/pages/Forsvar.tsx`, `src/pages/Anfall.tsx`, `src/pages/Fasta.tsx` (lägga till storytelling-intro överst).
- **Filer som justeras:** `src/index.css` (lägg till `animate-fade-in-up` keyframe + scroll-cue puls), `src/components/AnimatedBackground.tsx` (sänk opacity från 0.35 → 0.18).
- **Behålls oförändrat:** TopNav, Footer, alla taktiska komponenter (GIGTemplate, FootballPitch etc.), routing, auth, alla verktygssidor.
- Inga nya dependencies — IntersectionObserver är inbyggd i webbläsaren.

## Vad användaren får
- En startsida som **berättar** istället för listar.
- Tydligt fokus på *principer & förståelse* (kapitelrubriker, princip-teasers).
- Stark scroll-drivkraft via kapitelstruktur, stora siffror, fade-in-animationer och scroll-cue.
- Bevarad åtkomst till alla undersidor via CTA i varje kapitel + topmenyn.

