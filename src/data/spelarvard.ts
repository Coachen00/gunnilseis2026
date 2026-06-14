/* Spelarvård — "Ta hand om dig själv".
 *
 * Innehållsmodell + copy för spelarvårdssektionen på Veckans match.
 * Riktar sig direkt till spelaren: vi-form, kort, scannbart från mobilen.
 *
 * KÄLLOR (extern idrottsforskning, EJ klubbmaterial):
 *   - Styrketräning & skaderisk (≈1/3 akuta, ≈1/2 överbelastning):
 *     Lauersen et al. 2014, "The effectiveness of exercise interventions
 *     to prevent sports injuries" (metaanalys, Br J Sports Med).
 *   - Sömn & skaderisk hos unga idrottare (<8h ⇒ ~1,7× skaderisk):
 *     Milewski et al. 2014 (J Pediatr Orthop).
 *   - Kost & kosttillskott (evidensnivå kreatin/koffein/D-vitamin m.m.):
 *     IOC Consensus Statement on Dietary Supplements (Maughan et al. 2018,
 *     Br J Sports Med) + IOC consensus on nutrition for athletes.
 * Råden är generella forskningsrön, inte individuell medicinsk rådgivning.
 */

import type { DocKind } from "@/hooks/useSpelarvardDocs";

/**
 * Inbyggt material — ligger som statisk asset i public/ och visas i samma
 * galleri som admin-uppladdat. Kräver ingen Supabase, ingen uppladdning:
 * materialet finns direkt för spelaren. Admin kan inte ta bort inbyggt
 * material via UI:t (det hör till bygget) men kan komplettera med eget.
 */
export type BuiltinDoc = {
  id: string; // stabil, unik
  title: string;
  kind: DocKind;
  url: string; // publik sökväg, t.ex. /spelarvard/gymmet.pdf
  caption?: string;
};

export type SpelarvardSection = {
  id: string; // kebab-case, unik
  title: string; // rubrik
  question: string; // spelarens fråga
  bullets: string[]; // 4–6 korta punkter
  proposal?: boolean; // true endast för sommartävlingen-delen, renderas som "Förslag"-badge
  builtinDocs?: BuiltinDoc[]; // material som följer med bygget
};

/** Område = grupp av avsnitt, valbart i rullgardinen högst upp på sidan. */
export type SpelarvardArea = {
  id: string;
  emoji: string;
  label: string;
  blurb: string; // kort beskrivning under rullgardinen
  sectionIds: string[];
};

export const SPELARVARD_TITLE = "Ta hand om dig själv";

export const SPELARVARD_INTRO =
  "Kläder och skor har ni koll på — det här är nästa nivå: kroppen mellan matcherna.";

export const SPELARVARD_SECTIONS: SpelarvardSection[] = [
  {
    id: "kostlara",
    title: "Enkel kostlära",
    question: "Vad äter jag för att prestera?",
    bullets: [
      "Kolhydrater är bränslet — fyll på dagarna före och på matchdag: pasta, ris, potatis, bröd.",
      "Protein 1,6–2 g per kg kroppsvikt om dagen, spritt över dagen — 20–40 g per mål (ägg, kyckling, kvarg, bönor).",
      "Matchdag: rejäl måltid 3–4 h före avspark, sen ett lätt kolhydratsnack 1–2 h före (banan, smörgås).",
      "Efter match och träning: kolhydrat + protein inom en timme — det är då tanken fylls.",
      "Vätska: ljus urin = du ligger rätt. Drick ca en halv liter sista timmen före avspark.",
    ],
    builtinDocs: [
      {
        id: "kost-for-motorn",
        title: "Kost för motorn",
        kind: "pdf",
        url: "/spelarvard/kost-for-motorn.pdf",
        caption: "Presentation — så fyller du tanken inför match och träning.",
      },
      {
        id: "kost-bransle",
        title: "Kost & bränsle",
        kind: "pdf",
        url: "/spelarvard/kost-bransle.pdf",
        caption: "Presentation — bränslet som håller dig igång hela matchen.",
      },
    ],
  },
  {
    id: "kosttillskott",
    title: "Kosttillskott",
    question: "Vilka är vetenskapligt bevisade?",
    bullets: [
      "Stark evidens: kreatin monohydrat (3–5 g varje dag — mest beforskade tillskottet, ger styrka + upprepade sprinter).",
      "Koffein ca 3 mg per kg 45–60 min före — testa på träning först, aldrig nära läggdags.",
      "D-vitamin oktober–april i Sverige — brist är vanligt här. Proteinpulver är bekvämlighet när maten inte hinns med, inte magi.",
      "Svag eller ingen evidens: BCAA, fettförbrännare, pre-workout-blandningar — spara pengarna. Mat först, tillskott sen.",
      "Under 18? Skippa tillskotten — maten räcker hela vägen.",
      "Antidoping: du ansvarar själv för vad du stoppar i dig (RF:s regler) — använder du tillskott, välj batch-testade produkter.",
    ],
  },
  {
    id: "somn",
    title: "Sömn",
    question: "Hur viktigt är det egentligen?",
    bullets: [
      "Viktigaste återhämtningen som finns — viktigare än alla tillskott ihop.",
      "Sikta på 8–9 h. Under 8 h ger tydligt ökad skaderisk hos unga idrottare (ca 1,7× enligt forskningen).",
      "Sömnen styr sprint, beslut, inlärning av spelmoment och immunförsvar — allt vi vill ha på planen.",
      "Rutin: samma läggtid, mörkt och svalt rum, skärmen bort sista timmen, ingen koffein efter ca kl 15.",
      "Powernap 20–30 min funkar bra. Natten före match börjar kvällen innan — bygg vanan.",
    ],
  },
  {
    id: "gym",
    title: "Kompletterande träning",
    question: "Gym — är det något att ha?",
    bullets: [
      "Ja, tydligt: styrketräning minskar akuta skador med ungefär en tredjedel och halverar överbelastningsskador (stor forskningsgenomgång).",
      "Starkare = snabbare sprint, högre hopp, vinner fler dueller och tål mer fotbollsträning.",
      "Under säsong räcker 1–2 pass i veckan på 30–45 min.",
      "Lägg inte ett tungt benpass de sista 48 h före match.",
    ],
    builtinDocs: [
      {
        id: "gymmet",
        title: "Gymmet",
        kind: "pdf",
        url: "/spelarvard/gymmet.pdf",
        caption: "Presentation — så tränar du smart på gymmet.",
      },
    ],
  },
  {
    id: "gymovningar",
    title: "Bra övningar på gymmet",
    question: "Vad ska jag köra — och tänka på?",
    bullets: [
      "Bas för fotbollsspelare: knäböj, rumänska marklyft (RDL), utfall/step-ups, höftlyft.",
      "Skadeskydd alla borde köra: Nordic hamstring (baksida lår), Copenhagen (ljumskar) och enbenta vadpress.",
      "Överkropp och bål: press + drag + planka/sidoplanka.",
      "Teknik före vikt — tungt = 3–4 set × 4–8 reps med kontroll, öka långsamt.",
      "Ont ≠ bra. Fråga staben hellre än gissa.",
    ],
  },
  {
    id: "sommarschema",
    title: 'Sommarschema — "Use it or lose it"',
    question: "Hur håller vi formen — och vinner serien?",
    proposal: true,
    bullets: [
      "Sommaruppehållet är där serier vinns. Konditionen börjar tappas efter 2–3 veckor utan stimulans — men underhålls med 2–3 pass i veckan.",
      "Enkel veckomall: 1× intervaller (t.ex. 4×4 min eller 10×30/30 sek), 1× styrka (gympasset ovan), 1× boll/teknik eller spel + valfri löptur.",
      "Vill vi vinna serien? Sommaren är vår edge — use it or lose it.",
      'Tävlingsförslag "Sommarkungen 👑" i Kungen-anda: varje genomfört pass = poäng (självrapport i gruppchatten), topp tre hyllas vid uppstarten.',
      "Förslag — bekräftas av staben innan det gäller.",
    ],
  },
];

export const SPELARVARD_SOURCE_NOTE =
  "Råden bygger på etablerad idrottsforskning. Fråga tränarstaben om du vill ha källorna.";

/**
 * Områden för rullgardinen. Ordningen styr listan; första området visas
 * som standard. Varje sectionId måste finnas i SPELARVARD_SECTIONS.
 */
export const SPELARVARD_AREAS: SpelarvardArea[] = [
  {
    id: "kost",
    emoji: "🍽️",
    label: "Kost & bränsle",
    blurb: "Vad du äter och dricker — och vilka tillskott som faktiskt är bevisade.",
    sectionIds: ["kostlara", "kosttillskott"],
  },
  {
    id: "somn",
    emoji: "😴",
    label: "Sömn & återhämtning",
    blurb: "Den viktigaste återhämtningen som finns — viktigare än alla tillskott ihop.",
    sectionIds: ["somn"],
  },
  {
    id: "gym",
    emoji: "🏋️",
    label: "Gym & styrka",
    blurb: "Komplettera fotbollen med styrka: starkare kropp, färre skador, snabbare spel.",
    sectionIds: ["gym", "gymovningar"],
  },
  {
    id: "sommar",
    emoji: "☀️",
    label: "Sommar",
    blurb: "Håll formen under uppehållet — sommaren är där serier vinns.",
    sectionIds: ["sommarschema"],
  },
];
