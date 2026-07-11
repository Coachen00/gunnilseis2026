/* Sommaruppstart 2026 — återstartsplan inför första höstmatchen lördag 8/8.
 *
 * Källa: material/Sommaruppstart 2026.docx. Statiskt innehåll bor här; den
 * dynamiska arbetsdelen (spelarstatus, bekräftelser, checklista) sparas per
 * användare i localStorage via src/lib/sommaruppstartLocal.ts.
 */

/* =========================================================================
   SPELARSTATUS — fyra arbetsgrupper + oklassad pool
   ========================================================================= */

export type AvailabilityStatus =
  | "oklassad"
  | "startklar"
  | "tillganglig"
  | "tranar"
  | "ej";

export const STATUS_META: Record<
  AvailabilityStatus,
  { label: string; short: string; blurb: string; accent: "green" | "blue" | "amber" | "rose" | "slate" }
> = {
  startklar: {
    label: "Startklar 90",
    short: "90",
    blurb: "Redo att spela 90 minuter 8/8.",
    accent: "green",
  },
  tillganglig: {
    label: "Tillgänglig 45–60",
    short: "45–60",
    blurb: "Tillbaka, men inte automatiskt 90-minutersspelare.",
    accent: "blue",
  },
  tranar: {
    label: "Tränar – ej matchklar",
    short: "Tränar",
    blurb: "Kan träna men ska inte räknas till matchtruppen ännu.",
    accent: "amber",
  },
  ej: {
    label: "Ej tillgänglig / osäker",
    short: "Ej",
    blurb: "Borta, oavsvarad status eller tillbaka efter 8/8.",
    accent: "rose",
  },
  oklassad: {
    label: "Oklassad",
    short: "?",
    blurb: "Inte bedömd ännu — dra in i rätt grupp.",
    accent: "slate",
  },
};

/** Ordning på arbetsgrupperna i tavlan (oklassad-poolen renderas separat). */
export const STATUS_ORDER: AvailabilityStatus[] = ["startklar", "tillganglig", "tranar", "ej"];

/** Frö-status + ev. notis per spelare, härlett ur dokumentets tillgänglighetsläge.
 *  Namn matchar src/data/squad.ts. Spelare utan post startar som "oklassad".
 *  Allt går att flytta i UI:t; detta är bara förvalet vid första besöket. */
export const SEED_STATUS: Record<string, { status: AvailabilityStatus; note?: string }> = {
  // Bra tillgänglighet → startklar
  "Yosef Ismail": { status: "startklar" },
  "Rayan Fedaila": { status: "startklar" },
  "Haris Avdiu": { status: "startklar" },
  "Pascal Jabbour": { status: "startklar" },
  "Vedad Dzambegovic": { status: "startklar" },
  "Aldin Zeljkovic": { status: "startklar" },
  "Idris Abdi": { status: "startklar" },
  "Benjamin Arapovic": { status: "startklar" },

  // Tillbaka men kräver belastningskontroll → tillgänglig 45–60
  "Ihab Naser": { status: "tillganglig", note: "Tillbaka 4/8." },
  "Leodon Johansson": { status: "tillganglig", note: "Tillbaka 5/8." },
  "Meysam Hoseni": { status: "tillganglig", note: "Borta till 2/8." },
  "Nayef Mohammad": { status: "tillganglig", note: "Borta 20/7–31/7." },

  // Osäkra — ska bekräfta innan de räknas → ej / osäker
  "Ahmad Aljafari": { status: "ej", note: "Tillbaka slutet juli — bekräfta status." },
  "Måns Orwén": { status: "ej", note: "Borta runt 1/8 — bekräfta matchveckan." },
  "Daniel Matin": { status: "ej", note: "Jobbar hemma, foten styr." },
  "Parsa Ahang": { status: "ej", note: "Borta 24/6–15/7, ev. utlandsresa." },
  "Ayub Ahmed": { status: "ej", note: 'Svarat "vet inte".' },

  // Ej till första matchen
  "Ahmad Soheyl Matin": { status: "ej", note: "Tillbaka 31/8." },
  "Rinor Zenullah": { status: "ej", note: "Tillbaka 12/8." },
};

/* =========================================================================
   BEKRÄFTELSE-TRACKER — tre obligatoriska frågor
   ========================================================================= */

export type ConfirmKey = "hemma" | "minuter" | "skadefri";

export const CONFIRM_QUESTIONS: { key: ConfirmKey; short: string; full: string }[] = [
  { key: "hemma", short: "Hemma 3–8/8", full: "Är du i Göteborg 3/8, 5/8, 6/8 och 8/8?" },
  { key: "minuter", short: "90 min 8/8", full: "Kan du spela 90 minuter den 8/8?" },
  { key: "skadefri", short: "Skadefri", full: "Har du skada, smärta eller något som begränsar dig just nu?" },
];

/* =========================================================================
   UTGÅNGSPUNKT
   ========================================================================= */

export const HERO = {
  eyebrow: "Sommaren 2026 · Uppstart",
  title: "VÄGEN TILL 8/8",
  matchDate: "Lördag 8 augusti",
  lead:
    "Målet är inte bara att samla ihop en trupp till första matchen. Målet är att så många som möjligt ska vara fysiskt, taktiskt och mentalt redo att spela 90 minuter.",
};

export const UTGANGSPUNKT = {
  intro:
    "Vi skiljer på tre saker. En spelare kan vara hemma men ändå inte redo. En kan vara tillbaka 4–5/8 men behöva mjukare belastning. En kan säga sig vara tillgänglig men ha tränat för lite. Planeringen bygger därför på både närvaro och beredskap.",
  distinctions: [
    { n: "01", title: "Hemma?", desc: "Är spelaren i Sverige / Göteborg." },
    { n: "02", title: "Kan träna?", desc: "Är spelaren fysiskt igång." },
    { n: "03", title: "Matchredo 90?", desc: "Klarar spelaren 90 minuter den 8/8." },
  ],
  conclusion:
    "Det föreslagna lägret 31/7–2/8 bör inte vara huvudblocket — för många är borta eller på väg tillbaka. Kör helgen som frivillig uppstart. Det verkliga blocket ligger måndag 3/8, onsdag 5/8 och torsdag 6/8, med match lördag 8/8.",
};

/* =========================================================================
   PROGNOS PER DATUM
   ========================================================================= */

export type PrognosRow = {
  datum: string;
  aktivitet: string;
  bedomning: string;
  tone: "slate" | "amber" | "blue" | "green" | "rose";
};

export const PROGNOS: PrognosRow[] = [
  { datum: "Tisdag 28/7", aktivitet: "Första uppstart", bedomning: "För få för huvudblock. Bra för screening, bollkontakt och lätt återstart.", tone: "slate" },
  { datum: "Fre 31/7–sön 2/8", aktivitet: "Föreslagen lägerhelg", bedomning: "Inte optimal som huvudläger. Använd som frivillig uppstartshelg.", tone: "amber" },
  { datum: "Måndag 3/8", aktivitet: "Första riktiga träningsveckan", bedomning: "Bra kollektiv återstart. Fokus på struktur, inte maxbelastning.", tone: "blue" },
  { datum: "Onsdag 5/8", aktivitet: "Nyckelpass", bedomning: "Bästa passet för matchlik träning. Flest bör vara tillbaka.", tone: "green" },
  { datum: "Torsdag 6/8", aktivitet: "Matchförberedande pass", bedomning: "Roller, fasta situationer, startelva, matchplan.", tone: "blue" },
  { datum: "Fredag 7/8", aktivitet: "Lätt aktivering / digital genomgång", bedomning: "Kort, tydligt, låg belastning.", tone: "slate" },
  { datum: "Lördag 8/8", aktivitet: "Första match", bedomning: "Matchtrupp finns, men 90-minutersgruppen är troligen mindre än total närvaro.", tone: "rose" },
];

/* =========================================================================
   KALENDER + CHECKLISTA (dynamisk avbockning)
   ========================================================================= */

export type CalStep = {
  id: string;
  date: string;
  title: string;
  detail: string;
  load: "Egen" | "Låg" | "Medel" | "Hög" | "Match";
};

export const KALENDER: CalStep[] = [
  { id: "egen", date: "25/6–27/7", title: "Egenperiod / semesteransvar", detail: "Håll igång kroppen. Kom inte tillbaka från noll.", load: "Egen" },
  { id: "uppstart", date: "Tis 28/7", title: "Statuskontroll och återintroduktion", detail: "Screena status och återintroducera boll och löpning kontrollerat. 60–75 min med individuell minutgräns.", load: "Medel" },
  { id: "lager-fre", date: "Fre 31/7", title: "Uppstartshelg – dag 1", detail: "Träning + gemensam mat + spelidégenomgång.", load: "Medel" },
  { id: "lager-lor", date: "Lör 1/8", title: "Uppstartshelg – dag 2", detail: "Välj gym/prehab eller kontrollerat taktiskt bollpass. Ingen dubbel hård dos.", load: "Medel" },
  { id: "lager-son", date: "Sön 2/8", title: "Återhämtningsdag", detail: "Återhämtning: ingen kollektiv belastning. Endast promenad och individuell rörlighet vid behov.", load: "Låg" },
  { id: "ma", date: "Mån 3/8", title: "Kollektiv återstart", detail: "Återetablera spelmodell i lätt–medel intensitet utan ny tung bendos.", load: "Låg" },
  { id: "on", date: "Ons 5/8", title: "Veckans viktigaste pass", detail: "Mest matchlik träning. Bygg startelva, testa relationer. 90 min.", load: "Hög" },
  { id: "to", date: "Tor 6/8", title: "Matchförberedande pass", detail: "Matchplan, roller, fasta situationer. Tydligt, inte tungt. 65–75 min.", load: "Låg" },
  { id: "fr", date: "Fre 7/8", title: "Lätt aktivering / digital genomgång", detail: "Startelva, roller, första 15 min, scenarier. Mycket lätt.", load: "Låg" },
  { id: "match", date: "Lör 8/8", title: "Första match", detail: "Organiserade, tydliga, mentalt stabila.", load: "Match" },
];

/* =========================================================================
   PASSUPPLÄGG — uppstart, lägerhelg, matchvecka
   ========================================================================= */

export type Pass = {
  id: string;
  date: string;
  title: string;
  tag: string;
  totaltid?: string;
  syfte?: string[];
  upplagg?: { namn: string; tid?: string; text: string }[];
  punkter?: { rubrik: string; rader: string[] }[];
  accent: "amber" | "blue" | "green" | "rose" | "slate";
};

export const PASS: Pass[] = [
  {
    id: "pass-2807",
    date: "Tisdag 28/7",
    title: "Kontrollerad uppstart",
    tag: "Återstart, inte hårt pass",
    totaltid: "60–75 min",
    accent: "slate",
    syfte: [
      "Samla gruppen och kontrollera fysisk status",
      "Identifiera skador och riskspelare",
      "Starta bollkontakt och återkoppla till spelmodellen",
      "Sätta riktningen mot 8/8",
    ],
    upplagg: [
      { namn: "Samling", tid: "10 min", text: "Tydlig riktning: första match 8/8. Alla ska veta vad vi bygger mot." },
      { namn: "Screening", tid: "10 min", text: "Tränat? Ont? Springa max? Spela 90 min 8/8? Behöver du anpassning?" },
      { namn: "Bollaktivering", tid: "15 min", text: "Rondo, passning, scanning, första touch." },
      { namn: "Spelmodell", tid: "25 min", text: "Låg–medel intensitet. Avstånd, positioner, spelbarhet, organisation." },
      { namn: "Kort spel", tid: "10 min", text: "5v5 eller 6v6. Begränsad volym. Intensitet utan att slita." },
    ],
    punkter: [
      {
        rubrik: "Individuell minutgräns",
        rader: [
          "Startklar: avsluta senast efter 75 min",
          "Tillgänglig 45–60: avsluta senast efter 60 min och gör ingen extra löpdos",
          "Tränar – ej matchklar: individuell dos beslutas efter screening",
          "Alla: avsluta direkt om farten sjunker eller tekniken försämras",
        ],
      },
    ],
  },
  {
    id: "pass-lager",
    date: "Fre 31/7–sön 2/8",
    title: "Uppstartshelg",
    tag: "Uppstart – inte huvudläger",
    accent: "amber",
    syfte: [
      "Samla de som är hemma och skapa fart in i matchveckan",
      "Fokus: gemenskap, begrepp, spelidé, kroppskontroll, fysisk status, ansvar",
    ],
    upplagg: [
      { namn: "Fredag 31/7", text: "Träning + gemensam mat + spelidégenomgång. Medel belastning." },
      { namn: "Lördag 1/8", text: "Välj gym/prehab eller kontrollerat taktiskt bollpass. Ingen dubbel hård dos eller hårt smålagsspel efter gym." },
      { namn: "Söndag 2/8", text: "Verklig återhämtning utan kollektiv belastning. Endast promenad och individuell rörlighet vid behov." },
    ],
  },
  {
    id: "pass-0308",
    date: "Måndag 3/8",
    title: "Kollektiv återstart",
    tag: "Låg — kontrollerat",
    accent: "blue",
    syfte: [
      "Samla så många som möjligt och återetablera spelmodellen",
      "Få igång matchrytmen, identifiera vilka som är redo för full belastning",
      "Håll passet lätt–medel utan ny tung bendos efter uppstartshelgen",
    ],
    punkter: [
      {
        rubrik: "Fokus",
        rader: [
          "Stäng centralt, aldrig in i oss",
          "Korta avstånd mellan lagdelar",
          "Kontringsskydd",
          "Spel in i första och andra ytan",
          "Återerövring efter bolltapp",
        ],
      },
    ],
  },
  {
    id: "pass-0508",
    date: "Onsdag 5/8",
    title: "Veckans viktigaste pass",
    tag: "Hög — matchlik",
    totaltid: "90 min",
    accent: "green",
    syfte: [
      "Skapa matchintensitet och testa relationer",
      "Bygga startelva, träna press/återerövring/anfallshot",
      "Få svar på vilka som kan spela 90 minuter",
    ],
    upplagg: [
      { namn: "Aktivering", tid: "6 min", text: "Rörlighet, acceleration, boll." },
      { namn: "Höghastighetsdos", tid: "6 min", text: "4 × 20 m med full vila. Stoppa om farten sjunker eller tekniken försämras." },
      { namn: "Rondo", tid: "12 min", text: "Scanning, press, bolltempo, återerövring." },
      { namn: "Spelmodell", tid: "20 min", text: "8v8 eller 9v9 med riktning. Spelavstånd och triggers." },
      { namn: "Matchspel", tid: "30 min", text: "10v10 eller 11v11 om antalet räcker. Matchlik intensitet." },
      { namn: "Fasta situationer", tid: "10 min", text: "Defensiv/offensiv hörna, frispark, inkastprinciper." },
      { namn: "Avslut", tid: "6 min", text: "Roller, ansvar, matchbudskap." },
    ],
    punkter: [
      {
        rubrik: "Nyckelprinciper",
        rader: [
          "Vi stänger centralt först och styr utåt",
          "Vi vinner första och andra boll",
          "Vi återerövrar direkt efter bolltapp",
          "Vi hotar bakom när triggern kommer",
          "Vi fyller boxen när vi kommer till assistytan",
        ],
      },
    ],
  },
  {
    id: "pass-0608",
    date: "Torsdag 6/8",
    title: "Matchförberedande pass",
    tag: "Låg — tydligt, inte tungt",
    totaltid: "65–75 min",
    accent: "blue",
    syfte: [
      "Sätta matchplanen och tydliggöra roller",
      "Träna fasta situationer, skapa trygghet, hålla spelarna fräscha",
    ],
    upplagg: [
      { namn: "Upplägg", text: "Lätt uppvärmning → rondo låg volym → positionsspel → 11v11-organisation → fasta situationer → matchplan." },
    ],
    punkter: [
      {
        rubrik: "Tre matchbudskap",
        rader: [
          "Vi försvarar centralt först",
          "Vi hotar bakom när triggern kommer",
          "Vi accepterar inte passivitet efter bolltapp",
        ],
      },
    ],
  },
  {
    id: "pass-0708",
    date: "Fredag 7/8",
    title: "Lätt aktivering / digital genomgång",
    tag: "Mycket lätt",
    accent: "slate",
    syfte: [
      "30–40 min lätt aktivering, eller endast digital genomgång, eller individuell rörlighet/prehab",
    ],
    punkter: [
      {
        rubrik: "Innehåll",
        rader: [
          "Startelva, roller, fasta situationer",
          "Första 15 minuterna",
          "Vad gör vi vid 1–0? Vid 0–1?",
          "Vad gör vi om det står 0–0 efter 70 minuter?",
        ],
      },
    ],
  },
  {
    id: "pass-0808",
    date: "Lördag 8/8",
    title: "Första match",
    tag: "Match",
    accent: "rose",
    syfte: ["Inte spela perfekt — vara organiserade, tydliga och mentalt stabila."],
    punkter: [
      {
        rubrik: "Matchmål",
        rader: [
          "Stark första kvart",
          "Kompakt försvar, tydligt kontringsskydd",
          "Aggressiv återerövring",
          "Hot bakom backlinjen",
          "Hålla ihop sista 30 minuterna",
        ],
      },
    ],
  },
];

/* =========================================================================
   GYM- & FYSPLAN
   ========================================================================= */

export const GYM_SOMMAR: { period: string; fokus: string }[] = [
  { period: "25/6–14/7", fokus: "Basstyrka, allmän löpning, skadeförebyggande" },
  { period: "15/7–27/7", fokus: "Fotbollsstyrka, intervaller, bål, höft, baksida" },
  { period: "28/7–2/8", fokus: "Återstart, screening, lätt styrka" },
  { period: "3/8–8/8", fokus: "Matchform, explosivitet, ingen tung träningsvärk" },
];

export const GYM_MATCHVECKA: { dag: string; gym: string }[] = [
  { dag: "Måndag 3/8", gym: "Lätt prehab efter träning" },
  { dag: "Tisdag 4/8", gym: "Vila, rörlighet, egen aktivering" },
  { dag: "Onsdag 5/8", gym: "Snabbhet i fotbollspasset, inget tungt gym" },
  { dag: "Torsdag 6/8", gym: "Lätt aktivering, bål, höft, gummiband" },
  { dag: "Fredag 7/8", gym: "Frivillig rörlighet" },
  { dag: "Lördag 8/8", gym: "Match" },
];

export const GYM_REGEL = "Ingen spelare ska få träningsvärk av gymmet under matchveckan.";

export const EGENPERIOD_KRAV: { omrade: string; krav: string }[] = [
  { omrade: "Full plan", krav: "Följ den kompletta individuella dosen med planerad återhämtning." },
  { omrade: "Underhåll", krav: "Följ underhållsnivån när fyra huvudpassdagar inte ryms." },
  { omrade: "Minsta effektiva dos", krav: "Följ miniminivån med två kompakta helkroppspass." },
  { omrade: "Rapportering", krav: "Meddela skada, sjukdom eller problem direkt" },
];

export const EGENPERIOD_BUDSKAP =
  "Välj Full plan, Underhåll eller Minsta effektiva dos i den individuella modellen. Du behöver inte vara i toppform när vi startar, men du får inte komma tillbaka från noll.";

/* =========================================================================
   MENTALITET
   ========================================================================= */

export const MENTALITET = {
  ledarbudskap: "Vi startar höstsäsongen innan första matchen. Inte när domaren blåser.",
  kravSpelare: [
    "Kom tillbaka tränad, inte nollställd",
    "Meddela skada direkt",
    "Var ärlig med fysisk status",
    "Säg inte att du är redo om du inte är redo",
    "Förstå att 90 minuter måste förtjänas",
  ],
  kravLedare: [
    "Var tydlig, ge korta instruktioner",
    "Förstärk rätt beteenden",
    "Straffa inte ärlighet — belöna ansvar",
    "Välj spelare utifrån både kvalitet och beredskap",
  ],
  sentLandande: '"Du är viktig, men vi måste stegra dig klokt."',
};

/* =========================================================================
   BESLUT
   ========================================================================= */

export const BESLUT: string[] = [
  "31/7–2/8 används som uppstartshelg, inte huvudläger.",
  "Huvudblocket läggs 3/8–6/8.",
  "Onsdag 5/8 är veckans viktigaste pass.",
  "Torsdag 6/8 används för matchplan, roller och fasta situationer.",
  "Spelare som inte bekräftat status ska inte räknas som startspelare.",
];

/* =========================================================================
   EFFEKTLOGIK
   ========================================================================= */

export type EffektRow = { resurs: string; aktivitet: string; mal: string; effekt: string };

export const EFFEKTLOGIK: EffektRow[] = [
  { resurs: "Spelare som är hemma", aktivitet: "Träning 3/8, 5/8, 6/8", mal: "Matchklar stomme", effekt: "Starkare höststart" },
  { resurs: "Spelare med osäker status", aktivitet: "Obligatorisk bekräftelse", mal: "Korrekt truppbild", effekt: "Mindre planeringsbrus" },
  { resurs: "Gym och prehab", aktivitet: "Screening och underhåll", mal: "Färre skador", effekt: "Högre tillgänglighet" },
  { resurs: "Spelmodell", aktivitet: "Korta princippass", mal: "Tydligare beslut", effekt: "Bättre kollektiv prestation" },
  { resurs: "Mentalitet", aktivitet: "Ansvar, ärlighet, tydliga krav", mal: "Rätt spelare i rätt belastning", effekt: "Stabilare matchgenomförande" },
];

export const NASTA_HANDLING = {
  intro:
    "Skicka ett obligatoriskt meddelande till alla spelare, särskilt de osäkra. Tre frågor, ett svarsdatum. Efter svaren delas spelarna in i fyra grupper.",
  fragor: [
    "Är du i Göteborg 3/8, 5/8, 6/8 och 8/8?",
    "Kan du spela 90 minuter den 8/8: ja, nej eller osäker?",
    "Har du skada, smärta eller något som begränsar dig just nu?",
  ],
};

export const SLUTREK =
  "Bygg inte återstarten runt 31/7–2/8 — den helgen är för tidig och osäker. Den verkliga återstarten byggs runt 3/8–6/8. Det viktigaste nu är att minska osäkerheten: nästa handling är inte fler idéer, utan exakta besked från spelarna.";
