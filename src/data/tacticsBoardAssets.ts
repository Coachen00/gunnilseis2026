import trainingPitchPainted from "@/assets/tactics/training-pitch-painted.webp";
import trainingPitchPaintedFallback from "@/assets/tactics/training-pitch-painted.png";

export type TacticsBoardBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TacticsBoardAsset = {
  src: string;
  fallbackSrc: string;
  fallback: string;
  objectPosition: string;
  boardBounds: TacticsBoardBounds;
};

export const TACTICS_BOARD_ASSETS = {
  training_pitch: {
    src: trainingPitchPainted,
    fallbackSrc: trainingPitchPaintedFallback,
    fallback: "#6f9b52",
    objectPosition: "50% 50%",
    boardBounds: {
      x: 8,
      y: 14,
      width: 84,
      height: 72,
    },
  },
} as const satisfies Record<string, TacticsBoardAsset>;

export type TacticsBoardScene = keyof typeof TACTICS_BOARD_ASSETS;

export function getTacticsBoardAsset(scene: TacticsBoardScene): TacticsBoardAsset {
  return TACTICS_BOARD_ASSETS[scene];
}
