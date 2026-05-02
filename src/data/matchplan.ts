/* Data för Veckans match: motståndare, fokus, formation och matchplan. */

export type MatchMeta = {
  opponent: string;
  venue: string;
  home: boolean;
  kickoff: string;
  competition: string;
  weather?: string;
  absent: string[];
};

export type FormationSlot = {
  id: string;
  n: number;
  name: string;
  label: string;
  x: number; // 0-100, bredd
  y: number; // 0-100, djup (0 = vår MV-linje)
};

export type CoherenceSection = {
  id: string;
  num: string;
  title: string;
  eyebrow: string;
  principles?: string[];
  bullets?: string[];
  roles?: [string, string][];
  note?: string;
};

export const MATCH_META: MatchMeta = {
  opponent: "Velebit",
  venue: "Gunnilseplan",
  home: true,
  kickoff: "Lör 2 maj · 13:00",
  competition: "Hemma · 13:00",
  weather: "",
  absent: [],
};

export const FOCUS: string[] = [
  "Dueller upp. Andrabollar fortsätt. Djupled alltid.",
  "Samla först. Lås bollsida. Tryck deras vänster.",
  "In-ut-fram-box. Låst? Ta djupt inkast och vinn högt.",
];

export const FORMATION: FormationSlot[] = [
  { id: "gk", n: 1, name: "1", label: "MV", x: 50, y: 8 },
  { id: "lb", n: 2, name: "2", label: "VB", x: 14, y: 28 },
  { id: "lcb", n: 3, name: "3", label: "VMB", x: 36, y: 23 },
  { id: "rcb", n: 4, name: "4", label: "HMB", x: 64, y: 23 },
  { id: "rb", n: 5, name: "5", label: "HB", x: 86, y: 28 },
  { id: "ldm", n: 6, name: "6", label: "DM", x: 38, y: 48 },
  { id: "rdm", n: 8, name: "8", label: "DM", x: 62, y: 48 },
  { id: "am", n: 10, name: "10", label: "AM", x: 50, y: 63 },
  { id: "lw", n: 11, name: "11", label: "VY", x: 16, y: 82 },
  { id: "st", n: 9, name: "9", label: "FW", x: 50, y: 86 },
  { id: "rw", n: 7, name: "7", label: "HY", x: 84, y: 82 },
];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "Genomgång 11.45. Uppvärmning 12.15-12.45. Match 13.00.",
      "4-2-1-3.",
      "Kapten: Ado.",
    ],
  },
  {
    id: "identitet",
    num: "02",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Duellerna måste upp flera nivåer.",
      "Andrabollsspelet är bättre: visa det i match.",
      "Sluta möt boll hela tiden: spring bakom även utan boll.",
    ],
  },
  {
    id: "forsvar",
    num: "03",
    title: "Försvar",
    eyebrow: "Samla -> lås -> vinn",
    principles: ["Samla först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Ingen tokpress innan vi är kompakta.",
      "Bollvinnarpress först när linjerna är höga och lagdelarna korta.",
      "Styr mot deras vänster. YB på YB. Lås bollsida. Stoppa spelvändning.",
    ],
  },
  {
    id: "anfall",
    num: "04",
    title: "Anfall",
    eyebrow: "In-ut-fram-box",
    principles: ["In", "Ut", "Fram", "Box"],
    bullets: [
      "In i spelyta 1/2: hitta rättvänd.",
      "Ut: flytta blocket och isolera kanten.",
      "Fram: hota spelyta 3 med djupled.",
      "In i box: första, straffpunkt, bortre, cutback och andraboll.",
    ],
  },
  {
    id: "last",
    num: "05",
    title: "Om det låser sig",
    eyebrow: "Territorium",
    principles: ["Djupt inkast", "Vinn högt", "Oorganiserat försvar"],
    bullets: [
      "Spela inte fast centralt.",
      "Ta djupt inkast/långsida.",
      "Vinn bollen högt när de går anfall -> försvar.",
    ],
  },
  {
    id: "omst-forsvar",
    num: "06",
    title: "Omställning försvar",
    eyebrow: "Direkt eller indirekt",
    principles: ["Direkt", "Indirekt"],
    bullets: [
      "Direkt: nära, samlade, täckning bakom.",
      "Indirekt: utdragna, centralt tapp, rättvänd motståndare.",
      "Fel bild: samla, centrera, lås nästa boll.",
    ],
  },
  {
    id: "omst-anfall",
    num: "07",
    title: "Omställning anfall",
    eyebrow: "Ut ur gröten",
    principles: ["Diagonal utgång", "Djupled", "Box"],
    bullets: [
      "Första passningen bort från het yta.",
      "Rättvänd söker diagonal, djupled eller spelvändning.",
      "Ytter/9:a löper direkt. Övriga fyller box eller säkrar andraboll.",
    ],
  },
  {
    id: "fasta",
    num: "08",
    title: "Fasta",
    eyebrow: "Kort ansvar",
    principles: ["Haris/Gelo", "Hybrid", "Andraboll"],
    bullets: [
      "Försvar: hörna, inläggsfrispark, målchansfrispark, inkast. Första kontakt + andraboll.",
      "Anfall: hörnor och inläggsfrisparkar Haris/Gelo. Målchansfrispark: bestäm själva.",
      "Inkast: djupt = tryck + direkt återerövring.",
    ],
  },
  {
    id: "ovrigt",
    num: "09",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Ado"],
      ["Hörnor", "Haris / Gelo"],
      ["Inläggsfrispark", "Haris / Gelo"],
      ["Målchansfrispark", "Bestäm själva"],
      ["Matchstart", "13.00"],
    ],
  },
];
