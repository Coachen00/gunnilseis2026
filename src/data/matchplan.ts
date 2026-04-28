/* Data för Veckans match — byts per match.
 * Motståndare, trupp, formation och matchplanens koherens-sektioner.
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
  x: number; // 0–100, bredd
  y: number; // 0–100, djup (0 = vår MV-linje)
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
  "Stäng centrala ytor tidigt mot ett målglatt Velebit.",
  "Var noggranna i återerövringen när vi tappar boll.",
  "Attackera ytorna bakom dem när de fyller på framåt.",
];

export const FORMATION: FormationSlot[] = [
  { id: "gk", n: 1, name: "1", label: "MV", x: 50, y: 8 },
  { id: "lb", n: 2, name: "2", label: "VB", x: 15, y: 28 },
  { id: "lcb", n: 3, name: "3", label: "VMB", x: 37, y: 22 },
  { id: "rcb", n: 4, name: "4", label: "HMB", x: 63, y: 22 },
  { id: "rb", n: 5, name: "5", label: "HB", x: 85, y: 28 },
  { id: "dm", n: 6, name: "6", label: "CM-6", x: 50, y: 45 },
  { id: "lcm", n: 10, name: "10", label: "CM-10", x: 32, y: 55 },
  { id: "rcm", n: 9, name: "9", label: "CM-9", x: 68, y: 55 },
  { id: "lw", n: 11, name: "11", label: "VY", x: 15, y: 78 },
  { id: "st", n: 7, name: "7", label: "FW", x: 50, y: 82 },
  { id: "rw", n: 8, name: "8", label: "HY", x: 85, y: 78 },
];

export const COHERENCE: CoherenceSection[] = [
  { id: "forutsattningar", num: "01", title: "Förutsättningar", eyebrow: "Kontext",
    bullets: ["Hemmamatch lördag 2 maj klockan 13.00.", "Velebit ligger trea i tabellen.", "De är ett målglatt lag — vi behöver vara kompakta, aggressiva och noggranna i våra omställningar."] },
  { id: "identitet", num: "02", title: "Identitet — och varför", eyebrow: "Vem vi är",
    principles: ["Duellspel", "Andrabollsspel", "Fasta situationer", "Avstånd mellan linjerna"],
    bullets: ["Vi pressar högt och jagar åt samma håll.", "Vi försvarar gyllene zonen — inget skott från mitten.", "Vi spelar framåt så fort det är på.", "Håll koll på avstånden mellan linjerna i planens djup — kompakt i försvar, stöd i anfall."] },
  { id: "forsvar", num: "03", title: "Försvarsspel", eyebrow: "När de har bollen",
    principles: ["Tre korridorer", "Splitta planen", "Aldrig på insidan"],
    bullets: ["Hög press på utspel — FW stänger lång bana.", "Mellanblock om de passerar — jaga åt samma håll.", "Lågt block i box: hybridförsvar."] },
  { id: "omst-anfall", num: "04", title: "Omställning → anfall", eyebrow: "Vi vinner bollen",
    principles: ["Kontra först", "Annars uppbyggnad", "Fyra alternativ"] },
  { id: "anfall", num: "05", title: "Anfallsspel — gyllene femman", eyebrow: "Vi har bollen",
    principles: ["Spelbarhet", "Avstånd", "Bredd", "Djup", "Övertal"] },
  { id: "omst-forsvar", num: "06", title: "Omställning → försvar", eyebrow: "Vi tappar bollen",
    principles: ["Direkt återerövring", "Indirekt återerövring"] },
  { id: "fasta-forsvar", num: "07", title: "Försvar mot fasta", eyebrow: "Deras hörna",
    principles: ["Fyra zoner", "Övriga markering", "Diagonal utgång"] },
  { id: "fasta-anfall", num: "08", title: "Anfall från fasta", eyebrow: "Vår hörna",
    note: "Adnan går igenom inför match." },
  { id: "ovrigt", num: "09", title: "Övriga roller", eyebrow: "Ansvar",
    roles: [["Kapten","1"],["Straff","1"],["Frispark","1"],["Hörnor V","1"],["Hörnor H","1"]] },
];
