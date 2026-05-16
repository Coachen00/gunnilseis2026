import { describe, expect, it } from "vitest";
import { TACTICS_BOARD_ASSETS } from "./tacticsBoardAssets";

describe("TACTICS_BOARD_ASSETS", () => {
  it("defines the training pitch bitmap scene with stable board bounds", () => {
    expect(TACTICS_BOARD_ASSETS.training_pitch).toMatchObject({
      fallback: "#6f9b52",
      objectPosition: "50% 50%",
      boardBounds: {
        x: 8,
        y: 14,
        width: 84,
        height: 72,
      },
    });
    expect(TACTICS_BOARD_ASSETS.training_pitch.src).toContain("training-pitch-painted.webp");
    expect(TACTICS_BOARD_ASSETS.training_pitch.fallbackSrc).toContain("training-pitch-painted.png");
  });
});
