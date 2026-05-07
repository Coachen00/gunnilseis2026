/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad inför Kareby (fre 8 maj 19:00, borta · Kareby Hed).
 * Förra match: KF Velebit (lör 2 maj, hemma · 1–0). Reflektioner i `forraMatch.ts`.
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
  opponent: "Kareby IS",
  venue: "Kareby Hed",
  home: false,
  kickoff: "Fre 8 maj · 19:00",
  competition: "Borta · Division 4A Herr",
  weather: "",
  absent: [],
};

export const FOCUS: string[] = [
  "Skydda mot kontring först. Balans bakom bollen alltid.",
  "Spela in i halvyta. När det är trångt — vänd och spela in på nya sidan.",
  "Fyll på minst 4 i/runt boxen vid varje inlägg.",
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
      "Kareby IS borta · Kareby Hed · fre 8 maj 19:00.",
      "Genomgång + uppvärmning på plats. Avresa enligt kallelse.",
      "Formation: 4-2-1-3.",
    ],
  },
  {
    id: "forra-match",
    num: "02",
    title: "Förra match — Velebit 1–0",
    eyebrow: "Vad vi tar med till Kareby",
    principles: ["Box-fyllnad", "Spelvändning", "Defensiv balans"],
    bullets: [
      "Vinst 1–0 hemma 2 maj — femte raka utan förlust (4V 1O, 11/15 möjliga).",
      "Detaljerade reflektioner: se /match/forra (fylls i av tränaren).",
      "Veckans tre fokuspunkter inför Kareby ligger i sidospalten — princip 1, 2/3 och 5.",
    ],
  },
  {
    id: "kareby",
    num: "03",
    title: "Vad vi vet om Kareby",
    eyebrow: "Motståndaren",
    bullets: [
      "Borta på Kareby Hed — räkna med kortare och tightare plan: kortare avstånd mellan oss, mer en-touch i mottagningen.",
      "Hemmalag fredag kväll — räkna med tidig och hög press första 15 min. Princip 1 (skydda kontring) blir extra viktig från start.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys (fylls i av tränarstaben).",
    ],
    note: "Kareby-specifika anpassningar (formation, hot, var vi pressar) ligger på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "04",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Borta = duellerna avgör första 20 min. Vi får inte hamna på efterkälken.",
      "Andrabollsspelet vinner vi som lag — närmaste attackerar, övriga tätar.",
      "Yttrar och 9:a löper i djupled vid varje bollvinst — alltid.",
    ],
  },
  {
    id: "anfall",
    num: "05",
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
    num: "06",
    title: "Försvar",
    eyebrow: "Samla → lås → vinn",
    principles: ["Samla först", "Höga linjer", "Tre korridorer"],
    bullets: [
      "Ingen tokpress innan vi är kompakta. Bollvinnarpress först när linjerna är höga.",
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Kareby).",
      "YB på YB — lås bollsida, stoppa spelvändning.",
    ],
  },
  {
    id: "omst-forsvar",
    num: "07",
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
    num: "08",
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
    num: "09",
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
    num: "10",
    title: "Roller",
    eyebrow: "Ansvar",
    roles: [
      ["Kapten", "Ado"],
      ["Hörnor", "Haris / Gelo"],
      ["Inläggsfrispark", "Haris / Gelo"],
      ["Målchansfrispark", "Bestäm själva"],
      ["Matchstart", "19:00"],
    ],
  },
];
