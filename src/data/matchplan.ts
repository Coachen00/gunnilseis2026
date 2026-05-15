/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad inför IFK Björkö (hemma · Hjällbovallen 2 Konstgräs · 13:00).
 * Förra match: Kareby IS (borta · 1–1).
 */

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
  opponent: "IFK Björkö",
  venue: "Hjällbovallen 2 Konstgräs",
  home: true,
  kickoff: "Lör 16 maj · 13:00",
  competition: "Hemma · Division 4A Herr",
  weather: "",
  absent: [],
};

export const CALLED_SQUAD = {
  starting: [
    "Ali",
    "Pascal",
    "Rinor",
    "Sabarr",
    "Vedad",
    "Ahmed",
    "Ado",
    "Hosam",
    "Ihab",
    "Kamal",
    "Haris",
  ],
  bench: ["Daniel", "Rayan", "Galvan", "Idriss", "Aldin"],
} as const;

export const FOCUS: string[] = [
  "Starta matchen som hemmalag: högt fokus, korta avstånd och tydlig röst direkt.",
  "Försvara tillsammans: skydda mitten, lås bollsida och vinn andrabollen.",
  "När vi vinner bollen: titta framåt, hitta Haris eller spelvänd via Hosam/Ihab/Kamal.",
];

export const FORMATION: FormationSlot[] = [
  { id: "gk", n: 1, name: "Ali", label: "MV", x: 50, y: 8 },
  { id: "lb", n: 2, name: "Pascal", label: "VB", x: 14, y: 28 },
  { id: "lcb", n: 3, name: "Rinor", label: "VMB", x: 36, y: 23 },
  { id: "rcb", n: 4, name: "Sabarr", label: "HMB", x: 64, y: 23 },
  { id: "rb", n: 5, name: "Vedad", label: "HB", x: 86, y: 28 },
  { id: "ldm", n: 6, name: "Ahmed", label: "DM", x: 38, y: 48 },
  { id: "rdm", n: 8, name: "Ado", label: "DM", x: 62, y: 48 },
  { id: "lam", n: 10, name: "Hosam", label: "V10", x: 24, y: 66 },
  { id: "cam", n: 11, name: "Ihab", label: "10", x: 50, y: 68 },
  { id: "ram", n: 7, name: "Kamal", label: "H10", x: 76, y: 66 },
  { id: "st", n: 9, name: "Haris", label: "FW", x: 50, y: 86 },
];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "IFK Björkö hemma · Hjällbovallen 2 Konstgräs · lördag 16 maj 13:00.",
      "Genomgång + uppvärmning på plats. Samling enligt kallelse.",
      "Startelva enligt kallad uppställning: 4-2-3-1.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Startelva", "Avbytare"],
    bullets: [
      "Start: Ali · Pascal, Rinor, Sabarr, Vedad · Ahmed, Ado · Hosam, Ihab, Kamal · Haris.",
      "Avbytare: Daniel, Rayan, Galvan, Idriss, Aldin.",
      "Alla vet sin första uppgift innan uppvärmningen börjar.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Förra match — Kareby 1–1",
    eyebrow: "Vad vi tar med till Björkö",
    principles: ["Box-fyllnad", "Spelvändning", "Defensiv balans"],
    bullets: [
      "Kareby borta slutade 1–1 — vi är fortsatt obesegrade i seriespelet.",
      "Detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Veckans tre fokuspunkter inför Björkö ligger i sidospalten.",
    ],
  },
  {
    id: "bjorko",
    num: "04",
    title: "Vad vi vet om Björkö",
    eyebrow: "Motståndaren",
    bullets: [
      "Vi spelar hemma — vi sätter tonen med energi, dueller och andrabollar.",
      "Stäng mitten först. Låt dem inte spela mellan två av oss.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys (fylls i av tränarstaben).",
    ],
    note: "Björkö-specifika anpassningar (formation, hot, var vi pressar) ligger på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Hemma = vi äger första 20 minuterna med kropp, röst och löpningar.",
      "Andrabollsspelet vinner vi som lag — närmaste attackerar, övriga tätar.",
      "Haris hotar djupet. Trean bakom fyller på och är redo för andrabollen.",
    ],
  },
  {
    id: "anfall",
    num: "06",
    title: "Anfall — fem principer",
    eyebrow: "I ordning",
    principles: ["Skydda kontring", "Spela in", "Spela ut", "Framåt", "Box"],
    bullets: [
      "1. Skydda mot kontring — 6:an står kvar centralt, mittbackarna håller avstånd till varandra.",
      "2. Spela in bollen — sök rättvänd medspelare i halvytan, mellan deras led.",
      "3. Spela ut — trångt centralt? Vänd via 6/MB till motsatt ytter och spela in på nya sidan.",
      "4. Ta med framåt — yta öppen? Driv eller passa framåt med fart, inte i sidled.",
      "5. Fyll på i box — minst 4 av oss i/runt boxen vid inlägg. 9 straffp, motsatt ytter bortre, 8 första, 10 cutback, 1 hänger 18 m.",
    ],
  },
  {
    id: "forsvar",
    num: "07",
    title: "Försvar",
    eyebrow: "Samla → lås → vinn",
    principles: ["Samla först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Ingen tokpress innan vi är kompakta. Bollvinnarpress först när linjerna är höga.",
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Björkö).",
      "YB på YB — lås bollsida, stoppa spelvändning.",
    ],
  },
  {
    id: "omst-forsvar",
    num: "08",
    title: "Omställning försvar",
    eyebrow: "Direkt eller indirekt",
    principles: ["Direkt", "Indirekt"],
    bullets: [
      "Direkt: nära, samlade, täckning bakom — närmaste pressar inom 1 sek.",
      "Indirekt: utdragna, centralt tapp, rättvänd motståndare → samla, centrera, lås nästa boll.",
      "Forwarden är vår första försvarare.",
    ],
  },
  {
    id: "omst-anfall",
    num: "09",
    title: "Omställning anfall",
    eyebrow: "Ut ur gröten",
    principles: ["Diagonal utgång", "Djupled", "Box"],
    bullets: [
      "Första passningen bort från het yta.",
      "Rättvänd söker diagonal, djupled eller spelvändning.",
      "Ytter/9 löper direkt. Övriga fyller box eller säkrar andraboll.",
    ],
  },
  {
    id: "fasta",
    num: "10",
    title: "Fasta",
    eyebrow: "Kort ansvar",
    principles: ["Haris/Gelo", "Hybrid", "Andraboll"],
    bullets: [
      "Försvar: hörna, inläggsfrispark, målchansfrispark, inkast — hybrid (zon + 2 man) + andraboll.",
      "Anfall: hörnor och inläggsfrisparkar Haris/Gelo. Målchansfrispark: bestäm själva.",
      "Inkast: djupt = tryck + direkt återerövring.",
    ],
  },
  {
    id: "roller",
    num: "11",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Ado"],
      ["Hörnor", "Haris / Gelo"],
      ["Inläggsfrispark", "Haris / Gelo"],
      ["Målchansfrispark", "Bestäm själva"],
      ["Matchstart", "13:00"],
      ["Hemmaplan", "Hjällbovallen"],
    ],
  },
];
