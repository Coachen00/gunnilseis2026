import { describe, expect, it } from "vitest";
import { TACTICS_BOARD_ASSETS, TACTICS_SCENE_ORDER } from "./tacticsBoardAssets";

describe("TACTICS_BOARD_ASSETS", () => {
  it("defines the training pitch scene with stable board bounds", () => {
    expect(TACTICS_BOARD_ASSETS.training_pitch).toMatchObject({
      kind: "svg",
      fallback: "#6f9b52",
      objectPosition: "50% 50%",
      boardBounds: {
        x: 8,
        y: 14,
        width: 84,
        height: 72,
      },
    });
  });

  it("keeps every scene svg-renderad så inga planlinjer bakas in i bakgrunden", () => {
    for (const scene of TACTICS_SCENE_ORDER) {
      const asset = TACTICS_BOARD_ASSETS[scene];
      expect(asset.kind, scene).toBe("svg");
      expect(asset.src, scene).toBeUndefined();
    }
  });
});
