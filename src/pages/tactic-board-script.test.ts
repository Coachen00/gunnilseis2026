import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import boardMarkup from "./tactic-board-markup.html?raw";
import boardScript from "./tactic-board-script.js?raw";

type RectSize = {
  left: number;
  top: number;
  width: number;
  height: number;
};

declare global {
  interface Window {
    __cleanupTacticBoard?: () => void;
    applyFormation?: (team: string, formation: string) => void;
    captureFrameState?: () => { pieces: Array<{ id: string; x: number; y: number }> };
    applyFrameState?: (frame: unknown) => void;
    getMousePos?: (event: { clientX: number; clientY: number }) => { x: number; y: number };
    setPieceCenter?: (piece: HTMLElement, x: number, y: number) => void;
    syncCanvasesToPitch?: () => void;
  }
}

const contextMock = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  rect: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  setLineDash: vi.fn(),
  strokeText: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn((text: string) => ({ width: text.length * 6 })),
};

function mockPitchRect(rect: RectSize) {
  const pitch = document.querySelector<HTMLElement>("#pitch");
  if (!pitch) throw new Error("Missing #pitch");
  pitch.getBoundingClientRect = () =>
    ({
      ...rect,
      x: rect.left,
      y: rect.top,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      toJSON: () => rect,
    }) as DOMRect;
}

function runBoardScript(rect: RectSize) {
  document.body.innerHTML = boardMarkup;
  mockPitchRect(rect);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(contextMock as unknown as CanvasRenderingContext2D);
  vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    }
  );

  const execute = new Function(boardScript);
  execute();
}

describe("tactic-board-script logical coordinates", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.__cleanupTacticBoard?.();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("keeps formation player coordinates stable after resize", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.applyFormation?.("home", "4-4-2");
    const player = document.querySelector<HTMLElement>("#home-0");
    expect(player).toBeTruthy();

    const before = { x: player?.dataset.x, y: player?.dataset.y };
    mockPitchRect({ left: 80, top: 140, width: 1680, height: 1440 });
    window.syncCanvasesToPitch?.();

    expect({ x: player?.dataset.x, y: player?.dataset.y }).toEqual(before);
  });

  it("maps mouse position against the interaction board bounds", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    expect(window.getMousePos?.({ clientX: 500, clientY: 500 })).toEqual({
      x: 50,
      y: 50,
    });
  });

  it("saves and reloads frame positions as logical coordinates", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    const player = document.querySelector<HTMLElement>("#home-0");
    expect(player).toBeTruthy();
    window.setPieceCenter?.(player as HTMLElement, 25, 30);

    const frame = window.captureFrameState?.();
    window.setPieceCenter?.(player as HTMLElement, 80, 90);
    window.applyFrameState?.(frame);

    expect(Number(player?.dataset.x)).toBeCloseTo(25);
    expect(Number(player?.dataset.y)).toBeCloseTo(30);
  });
});
