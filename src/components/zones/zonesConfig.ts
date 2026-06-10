/**
 * zonesConfig — all data för "Planens spelytor"-animationen.
 *
 * Koordinatsystem (procentbaserat, enligt docs/specs/planindelning.md):
 *   x: 0 = vänster sidlinje, 100 = höger sidlinje
 *   y: 0 = egen kortlinje, 100 = offensiv kortlinje (anfall uppåt på skärmen)
 *
 * Allt här är medvetet utbytbart: färger, etiketter, hovertexter och
 * koordinater kan justeras utan att röra animationslogiken.
 */

/* === Färger — "Champions League tactical analysis", inte övningsgrafik === */
export const ZONE_COLORS = {
  bgTop: "#04130b",
  bgBot: "#020a06",
  grassA: "#0c2918", // gräsränder (ljusare band)
  grassB: "#0a2314", // gräsränder (mörkare band)
  lines: "rgba(244,252,247,0.78)", // vita planlinjer
  linesSoft: "rgba(244,252,247,0.28)",
  corridor: "#4da3ff", // korridorer: blå nyanser
  corridorEdge: "#86c5ff",
  utgang: "#3fd08b", // utgångsytan: grön
  spelyta1: "#62d96e", // spelyta 1: grön
  spelyta2: "#a8e04e", // spelyta 2: grön/gul
  spelyta3: "#e3e84a", // spelyta 3: gul
  assist: "#ff9d45", // assistytan: orange
  gz: "#f5c842", // gyllene zonen: guld
  opponent: "#ff6868", // motståndarens lagdelar (rött = hot, enligt husets färgkod)
  own: "#43e0a0", // egna spelare/löpningar
  ball: "#f8fcf9",
  text: "#e9f5ee",
  textDim: "rgba(233,245,238,0.55)",
} as const;

/* === Korridorer (spec: yttre 0–18, inre 18–38, central 38–62, inre 62–82, yttre 82–100) === */
export interface CorridorDef {
  id: string;
  label: string;
  x0: number;
  x1: number;
}
export const CORRIDORS: CorridorDef[] = [
  { id: "yttre-v", label: "YTTRE", x0: 0, x1: 18 },
  { id: "inre-v", label: "INRE", x0: 18, x1: 38 },
  { id: "central", label: "CENTRAL", x0: 38, x1: 62 },
  { id: "inre-h", label: "INRE", x0: 62, x1: 82 },
  { id: "yttre-h", label: "YTTRE", x0: 82, x1: 100 },
];

/* === Motståndarens lagdelar (exempelpositioner; animeras i DynamicGameSpaceLayer) ===
 * y-värden är linjens planposition. Spelytorna BERÄKNAS ur dessa varje frame —
 * de ligger aldrig på fasta koordinater. */
export const OPPONENT_FORMATION = {
  /** x-positioner för spelarprickar per lagdel. */
  forwards: [40, 60],
  midfield: [16, 38, 62, 84],
  backline: [18, 41, 59, 82],
  /** Exempel-y (spec): forwards 42, mittfält 58, backlinje 76. */
  exampleY: { forwards: 42, midfield: 58, backline: 76 },
} as const;

/* === Assistytan (spec) === */
export const ASSIST_ZONES = {
  left: { x0: 5, x1: 25, y0: 78, y1: 95 },
  right: { x0: 75, x1: 95, y0: 78, y1: 95 },
  /** Cutback-ytor — svagare komplement i inre korridor. */
  cutbackLeft: { x0: 25, x1: 38, y0: 82, y1: 92 },
  cutbackRight: { x0: 62, x1: 75, y0: 82, y1: 92 },
} as const;

/* === Gyllene zonen (spec: x 38–62, y 84–97, centralt framför mål) === */
export const GZ_ZONE = { x0: 38, x1: 62, y0: 84, y1: 97 } as const;

/* === Etiketter & copy (kanonisk vokabulär: "gyllene zonen", "assistytan") === */
export const ZONE_LABELS = {
  title: "Planens spelytor",
  corridorMicro: "Bredd: fem korridorer",
  gameSpaceCaption: "Djup: spelytor uppstår mellan lagdelar",
  assistCaption: "Assistytan: sista passningen före avslut",
  gzCaption: "Gyllene zonen: bästa avslutsytan",
  utgang: "UTGÅNGSYTA",
  spelyta1: "SPELYTA 1",
  spelyta2: "SPELYTA 2",
  spelyta3: "SPELYTA 3",
  assistLeft: "ASSISTYTAN",
  assistRight: "ASSISTYTAN",
  gz: "GYLLENE ZONEN",
  inspel: "Inspel",
  cutback: "Cutback",
  instick: "Instick",
  finalLines: [
    "Bredd skapar korridorer.",
    "Djup skapar spelytor.",
    "Assistytan skapar sista passningen.",
    "Gyllene zonen skapar avslut.",
  ],
} as const;

/* === Hovertexter (TooltipSystem) === */
export interface ZoneTooltip {
  id: "korridorer" | "spelytor" | "assistytan" | "gyllene";
  title: string;
  body: string;
}
export const ZONE_TOOLTIPS: Record<ZoneTooltip["id"], ZoneTooltip> = {
  korridorer: {
    id: "korridorer",
    title: "Korridorer",
    body: "Planens bredd delas i fem korridorer: två yttre, två inre och en central.",
  },
  spelytor: {
    id: "spelytor",
    title: "Spelytor",
    body: "Spelytor uppstår mellan motståndarens lagdelar och förändras när laget flyttar sig.",
  },
  assistytan: {
    id: "assistytan",
    title: "Assistytan",
    body: "Ytan där laget söker sista passningen innan avslut: inspel, instick, cutback eller inlägg.",
  },
  gyllene: {
    id: "gyllene",
    title: "Gyllene zonen",
    body: "Den mest prioriterade avslutsytan centralt framför mål.",
  },
};

/* === Lager-nycklar (LayerToggle) === */
export type LayerKey = "korridorer" | "spelytor" | "assistytan" | "gyllene";
export const LAYER_LABELS: Record<LayerKey, string> = {
  korridorer: "Korridorer",
  spelytor: "Spelytor",
  assistytan: "Assistytan",
  gyllene: "Gyllene zonen",
};

/** Total längd på huvudsekvensen (sekunder). */
export const ZONES_DURATION = 30;
