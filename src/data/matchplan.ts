/* Data för Veckans match: motståndare, fokus, formation och matchplan.
 *
 * Senast uppdaterad 2026-05-17 inför IF Vardar/Makedonija
 * (borta · Generatorsplan · fredag 22 maj 19:15).
 * Förra match: IFK Björkö (hemma · 2026-05-16).
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
  opponent: "IF Vardar/Makedonija",
  venue: "Generatorsplan",
  home: false,
  kickoff: "Fre 22 maj · 19:15",
  competition: "Division 4A Herr",
  weather: "",
  absent: [],
};

export const MATCH_PRESENTATION_URL =
  "https://claude.ai/design/p/faf88e6c-cc30-4de1-83a3-2914a1267e48?file=veckans-match%2FMatchgenomg%C3%A5ng+-+Mall.html&via=share";

/* Matchdagsschema — visas i hero och i praktisk-info-block.
 * Samling sker på Hjällbovallen (Gunnilses hemmaplan) före avresa till
 * Generatorsplan där matchen spelas. */
export const MATCH_SCHEDULE: Array<{ time: string; label: string; note?: string }> = [
  { time: "17:30", label: "Samling", note: "Hjällbovallen" },
  { time: "Före avresa/uppvärmning", label: "Genomgång" },
  { time: "18:35 – 19:05", label: "Aktivering" },
  { time: "19:05 – 19:12", label: "Ner + sista instruktion" },
  { time: "19:12", label: "Upp + sista löpningar" },
  { time: "19:15", label: "Avspark" },
];

/* Matchplan i korthet — fyra kort som spelaren scannar precis före avspark. */
export type PlanCard = {
  id: string;
  eyebrow: string;
  title: string;
  bullets: string[];
  accent: "red" | "blue" | "amber" | "green";
};

export const MATCH_PLAN_SHORT: PlanCard[] = [
  {
    id: "forsvar",
    eyebrow: "Utan boll",
    title: "Så försvarar vi",
    accent: "red",
    bullets: [
      "Stäng mitten först — särskilt borta när de vill spela igång rytmen.",
      "YB på YB. Lås bollsida och stoppa spelvändning.",
      "Vinn andrabollen som lag — närmaste attackerar, övriga tätar.",
    ],
  },
  {
    id: "anfall",
    eyebrow: "Med boll",
    title: "Så anfaller vi",
    accent: "blue",
    bullets: [
      "Skydda kontring — 6:an står, MB håller avstånd.",
      "Spela in centralt → ut → ta med framåt.",
      "Fyll boxen vid inlägg: 9 straffp, motsatt ytter bortre, 8 första, 10 cutback.",
    ],
  },
  {
    id: "omstallning",
    eyebrow: "I sekunden",
    title: "Så ställer vi om",
    accent: "amber",
    bullets: [
      "Bollvinst: första tanken framåt — diagonal eller djup.",
      "Bolltapp: närmaste pressar inom 1 sekund — jakten startar direkt.",
      "Forwarden styr första pressen så resten kan flytta efter.",
    ],
  },
  {
    id: "fasta",
    eyebrow: "Stillastående",
    title: "Fasta situationer",
    accent: "green",
    bullets: [
      "Anfall: ansvar och variant bekräftas på genomgången.",
      "Försvar: hybrid (zon + 2 man) + andraboll.",
      "Inkast djupt = tryck + direkt återerövring.",
    ],
  },
];

/* Praktisk info — visas längst ner på Veckans match. */
export const PRACTICAL_INFO = {
  kit: "Bortamatch på konstgräs — följ kallelsen och ta med rätt skor/överdrag.",
  responsibilities: [
    ["Kapten", "Bekräftas i kallelse"],
    ["Hörnor", "Bekräftas på genomgång"],
    ["Inläggsfrispark", "Bekräftas på genomgång"],
    ["Målchansfrispark", "Bekräftas på genomgång"],
  ] as const,
  gatheringNote: "Samling och avresa bekräftas i kallelsen. Mental start före uppvärmning.",
} as const;

export const CALLED_SQUAD = {
  starting: [],
  bench: [],
} as const;

export const FOCUS: string[] = [
  "Starta som bortalag med lugn kropp: korta avstånd, tydlig röst och första duellen direkt.",
  "Skydda mitten och tvinga spelet utåt — låt inte Vardar/Makedonija hitta rättvänd spelare mellan våra lagdelar.",
  "Vid bollvinst: första blicken framåt, hota diagonalt och fyll på innan de hinner samla sig.",
];

export const FORMATION: FormationSlot[] = [];

export const COHERENCE: CoherenceSection[] = [
  {
    id: "forutsattningar",
    num: "01",
    title: "Veckans match",
    eyebrow: "Kontext",
    bullets: [
      "IF Vardar/Makedonija borta · Generatorsplan · fredag 22 maj 19:15.",
      "Samling 17:45. Genomgång och uppvärmning sker på plats.",
      "Startelva och roller läggs in när kallelsen är satt.",
    ],
  },
  {
    id: "kallad-trupp",
    num: "02",
    title: "Kallad trupp",
    eyebrow: "Spelare",
    principles: ["Kommer", "Startelva", "Avbytare"],
    bullets: [
      "Kallad trupp för IF Vardar/Makedonija är inte inlagd än.",
      "När kallelsen är satt ska startelva, avbytare och fasta ansvar fyllas i här.",
      "Alla ska veta sin första uppgift innan uppvärmningen börjar.",
    ],
  },
  {
    id: "forra-match",
    num: "03",
    title: "Förra match — IFK Björkö",
    eyebrow: "Vad vi tar med till Vardar/Makedonija",
    principles: ["Reflektion", "Energi", "Nästa aktion"],
    bullets: [
      "Vi spelade IFK Björkö hemma lördag 16 maj.",
      "Resultat och detaljerade reflektioner fylls i av tränaren på /match/forra.",
      "Nu flyttar vi fokus direkt till nästa prestation: IF Vardar/Makedonija borta.",
    ],
  },
  {
    id: "vardar-makedonija",
    num: "04",
    title: "Vad vi vet om Vardar/Makedonija",
    eyebrow: "Motståndaren",
    bullets: [
      "Nästa match är borta på Generatorsplan.",
      "Vardar/Makedonija ligger på undre halvan men gör mål — vi behöver vara kompakta och vakna i första duellen.",
      "Stäng mitten först. Låt dem inte spela mellan två av oss.",
      "Detaljerad scoutning + formation/hot/svagheter: se /motstandaranalys när tränarstaben har fyllt i den.",
    ],
    note: "Vardar/Makedonija-specifika anpassningar (formation, hot, var vi pressar) fylls i på /motstandaranalys.",
  },
  {
    id: "identitet",
    num: "05",
    title: "Identitet",
    eyebrow: "Veckans krav",
    principles: ["Dueller", "Andrabollar", "Djupled"],
    bullets: [
      "Borta = vi tar med oss egen rytm, egen röst och egen intensitet.",
      "Andrabollsspelet vinner vi som lag — närmaste attackerar, övriga tätar.",
      "Nästa aktion är viktigare än förra situationen.",
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
      "Styr pressen åt en sida (kolla motståndaranalys för rätt sida mot Vardar/Makedonija).",
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
      ["Kapten", "Bekräftas i kallelse"],
      ["Hörnor", "Bekräftas på genomgång"],
      ["Inläggsfrispark", "Bekräftas på genomgång"],
      ["Målchansfrispark", "Bekräftas på genomgång"],
      ["Matchstart", "19:15"],
      ["Bortaplan", "Generatorsplan"],
    ],
  },
];
