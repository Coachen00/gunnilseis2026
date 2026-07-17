export type SpelmodellLevelId =
  | "novis"
  | "level-1"
  | "level-2"
  | "level-3"
  | "level-4"
  | "level-5"
  | "advanced";

export interface SpelmodellLevel {
  id: SpelmodellLevelId;
  label: string;
  purpose: string;
  concepts: readonly string[];
  playerOutcome: string;
  mapIds: readonly string[];
}

export const LIVE_PHASE_IDS = [
  "Försvarsspel",
  "Övergång till anfall",
  "Anfallsspel",
  "Övergång till försvar",
] as const;

export interface SpelmodellSpecialLayer {
  id: "identitet" | "fasta-situationer" | "malvaktsperspektiv";
  label: "Identitet" | "Fasta situationer · död boll" | "Målvaktsperspektiv · tvärgående";
  purpose: string;
}

export const SPELMODELL_SPECIAL_LAYERS: readonly SpelmodellSpecialLayer[] = [
  {
    id: "identitet",
    label: "Identitet",
    purpose: "Det som ska följa med i alla skeden: mod, disciplin, arbetsinsats och lagbeteende.",
  },
  {
    id: "fasta-situationer",
    label: "Fasta situationer · död boll",
    purpose: "Hörnor, frisparkar, inkast och avsparkar när bollen är stilla.",
  },
  {
    id: "malvaktsperspektiv",
    label: "Målvaktsperspektiv · tvärgående",
    purpose: "Målvaktens blick och beslut som går tvärs genom hela modellen.",
  },
] as const;

export const SPELMODELL_LEVELS: readonly SpelmodellLevel[] = [
  {
    id: "novis",
    label: "Novis",
    purpose: "Lär dig se planen, bollen och den närmaste lösningen innan tempot blir högt.",
    concepts: [
      "Planens ytor",
      "Korridorer",
      "Gyllene zonen",
      "Assistytan",
      "Spelbredd",
      "Speldjup",
      "Spelavstånd",
      "Spelbarhet",
      "Boll",
      "Medspelare",
      "Motståndare",
      "Mål",
    ],
    playerOutcome: "Jag ser boll, medspelare, motståndare och mål och hittar min plats på planen.",
    mapIds: [
      "planens-ytor",
      "korridorer",
      "spelytor",
      "assistytan",
      "gyllene-zonen",
      "orientering",
    ],
  },
  {
    id: "level-1",
    label: "Level 1",
    purpose: "Känn igen vilket levande skede laget är i innan du väljer handling.",
    concepts: LIVE_PHASE_IDS,
    playerOutcome: "Jag vet om vi försvarar, vinner boll, anfaller eller tappar boll.",
    mapIds: [
      "forsvarsspel",
      "overgang-till-anfall",
      "anfallsspel",
      "overgang-till-forsvar",
    ],
  },
  {
    id: "level-2",
    label: "Level 2",
    purpose: "Koppla varje skede till första spelarhandlingen.",
    concepts: [
      "Skydda mitten först",
      "Säkra första passningen",
      "Spela framåt när läget finns",
      "Pressa direkt efter bolltapp",
    ],
    playerOutcome: "Jag väljer en enkel första handling som hjälper laget i rätt riktning.",
    mapIds: [
      "forsvarsspel",
      "overgang-till-anfall",
      "anfallsspel",
      "overgang-till-forsvar",
      "identitet",
    ],
  },
  {
    id: "level-3",
    label: "Level 3",
    purpose: "Använd planens ytor för att förstå var laget ska vara starkt.",
    concepts: [
      "Spelbar i rätt korridor",
      "Rättvänd i spelyta 2",
      "Assistytan före avslut",
      "Skydda gyllene zonen",
    ],
    playerOutcome: "Jag hittar ytan som hjälper nästa aktion i stället för att bara följa bollen.",
    mapIds: [
      "korridorer",
      "spelytor",
      "assistytan",
      "gyllene-zonen",
    ],
  },
  {
    id: "level-4",
    label: "Level 4",
    purpose: "Gör rätt tillsammans med spelarna närmast dig.",
    concepts: [
      "Spelavstånd i lagdel",
      "Understöd och täckning",
      "Tajming i djupled",
      "Återerövring eller falla hem",
    ],
    playerOutcome: "Jag hjälper spelarna runt mig så att laget hänger ihop i nästa skifte.",
    mapIds: [
      "spelytor",
      "korridorer",
      "overgang-till-anfall",
      "overgang-till-forsvar",
    ],
  },
  {
    id: "level-5",
    label: "Level 5",
    purpose: "Läs signaler och välj rätt risk för laget.",
    concepts: [
      "Signal före aktion",
      "Byta tempo",
      "Säkra när vi behöver kontroll",
      "Hjälpa nästa spelare att se lösningen",
    ],
    playerOutcome: "Jag anpassar mitt beslut till signal, tempo och vad laget behöver just nu.",
    mapIds: [
      "forsvarsspel",
      "overgang-till-anfall",
      "anfallsspel",
      "overgang-till-forsvar",
      "identitet",
      "malvaktsperspektiv",
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    purpose: "Bär hela modellen och gör den tydlig för andra runt dig.",
    concepts: [
      "Identitet",
      "Fasta situationer · död boll",
      "Målvaktsperspektiv · tvärgående",
      "Leda laget genom skifterna",
    ],
    playerOutcome: "Jag kan hålla ihop levande skeden, speciallager och lagets gemensamma språk.",
    mapIds: [
      "identitet",
      "fasta-situationer",
      "malvaktsperspektiv",
      "forsvarsspel",
      "overgang-till-anfall",
      "anfallsspel",
      "overgang-till-forsvar",
    ],
  },
] as const;

export const LEGACY_LEVEL_TO_SPELMODELL_LEVEL_ID: Record<0 | 1 | 2 | 3, SpelmodellLevelId> = {
  0: "novis",
  1: "level-1",
  2: "level-2",
  3: "level-3",
};
