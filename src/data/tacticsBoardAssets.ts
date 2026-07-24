import trainingPitchPaintedFallback from "@/assets/tactics/training-pitch-painted.png";
import trainingPitchRealistic from "@/assets/tactics/training-pitch-realistic.png";
import nightPitchRealistic from "@/assets/tactics/night-pitch-realistic.png";
import matchOverviewRealistic from "@/assets/tactics/match-overview-realistic.png";

export type TacticsBoardBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * En scen kan renderas på två sätt:
 *   - `kind: "bitmap"`  → laddar webp/png-bild (binärassets i src/assets/tactics/)
 *   - `kind: "svg"`     → React-komponenten i PaintedScenes.tsx renderas inline
 *
 * Båda lager:
 *   - Sitter alltid bakom interaktionslagret
 *   - Har alltid `pointer-events: none`
 *   - Är 16:9 och skarpa på alla skärmar
 */
export type TacticsBoardAsset = {
  /** Visningsnamn i scen-väljaren. */
  label: string;
  /** Kort beskrivning för accessibility / hint. */
  description: string;
  /** Render-typ. */
  kind: "bitmap" | "svg";
  /** Bitmap: huvud-src (typ webp). Svg: ignoreras. */
  src?: string;
  /** Bitmap: fallback om huvud-src failar (typ png). Svg: ignoreras. */
  fallbackSrc?: string;
  /** Fallback bg-color innan bilden laddat (eller om filtret failar). */
  fallback: string;
  /** Bitmap: object-position. Svg: ignoreras. */
  objectPosition: string;
  /** Interaktionsytans bounds i procent av scenen (där pitch ska sitta). */
  boardBounds: TacticsBoardBounds;
};

export const TACTICS_BOARD_ASSETS = {
  training_pitch: {
    label: "Träningsplan",
    description: "Varm gräsmatta i sommarljus — välbekant träningsmiljö.",
    kind: "bitmap",
    src: trainingPitchRealistic,
    fallbackSrc: trainingPitchPaintedFallback,
    fallback: "#6f9b52",
    objectPosition: "50% 50%",
    boardBounds: { x: 8, y: 14, width: 84, height: 72 },
  },
  whiteboard: {
    label: "Taktisk whiteboard",
    description: "Cream-färgad whiteboard med svag rutnät — premium analysyta.",
    kind: "svg",
    fallback: "#f5efe1",
    objectPosition: "50% 50%",
    boardBounds: { x: 5, y: 6, width: 90, height: 88 },
  },
  night_pitch: {
    label: "Kvällsmatch",
    description: "Fotorealistisk träningsplan under strålkastare.",
    kind: "bitmap",
    src: nightPitchRealistic,
    fallbackSrc: trainingPitchPaintedFallback,
    fallback: "#2a5236",
    objectPosition: "50% 50%",
    boardBounds: { x: 8, y: 14, width: 84, height: 72 },
  },
  match_overview: {
    label: "Matchplan ovanifrån",
    description: "Fotorealistisk helplan sedd från arenans läktare.",
    kind: "bitmap",
    src: matchOverviewRealistic,
    fallbackSrc: trainingPitchPaintedFallback,
    fallback: "#3f8d3f",
    objectPosition: "50% 50%",
    boardBounds: { x: 8, y: 14, width: 84, height: 72 },
  },
  coachboard: {
    label: "Omklädningsrum",
    description: "Mörk krittavla med trä-ram — dramatisk matchgenomgång.",
    kind: "svg",
    fallback: "#1f3b3a",
    objectPosition: "50% 50%",
    boardBounds: { x: 5, y: 6, width: 90, height: 88 },
  },
  neutral_analysis: {
    label: "Neutral analysyta",
    description: "Off-white millimeterpapper — maximal läsbarhet.",
    kind: "svg",
    fallback: "#ede5d3",
    objectPosition: "50% 50%",
    boardBounds: { x: 5, y: 6, width: 90, height: 88 },
  },
  custom_image: {
    label: "Egen bild / print screen",
    description: "Egen uppladdad bild eller print screen som bakgrund — för analysläge.",
    kind: "svg",
    fallback: "#0d1417",
    objectPosition: "50% 50%",
    boardBounds: { x: 5, y: 6, width: 90, height: 88 },
  },
} as const satisfies Record<string, TacticsBoardAsset>;

export type TacticsBoardScene = keyof typeof TACTICS_BOARD_ASSETS;

export const TACTICS_SCENE_ORDER: TacticsBoardScene[] = [
  "training_pitch",
  "whiteboard",
  "night_pitch",
  "match_overview",
  "coachboard",
  "neutral_analysis",
  "custom_image",
];

export function getTacticsBoardAsset(scene: TacticsBoardScene): TacticsBoardAsset {
  return TACTICS_BOARD_ASSETS[scene];
}
