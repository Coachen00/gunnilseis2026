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
    captureFrameState?: () => { pieces: Array<{ id: string; x: number; y: number; scale?: number | null }> };
    applyFrameState?: (frame: unknown) => void;
    getMousePos?: (event: { clientX: number; clientY: number }) => { x: number; y: number };
    setPieceCenter?: (piece: HTMLElement, x: number, y: number) => void;
    syncCanvasesToPitch?: () => void;
    undoBoard?: () => void;
    redoBoard?: () => void;
    saveBoardState?: () => void;
    deletePiece?: (piece: HTMLElement) => void;
    addBall?: () => void;
    addTrainingObject?: (kind: string) => void;
    resizeTrainingObject?: (idOrPiece: string | HTMLElement, delta: number) => void;
    clearTrainingMaterial?: () => void;
    importBackgroundImage?: (input: HTMLInputElement) => void;
    clearBackgroundImage?: () => void;
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
    localStorage.clear();
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

  it("undoes and redoes formation changes", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.applyFormation?.("home", "4-4-2");
    const player = document.querySelector<HTMLElement>("#home-5");
    const before = { x: player?.dataset.x, y: player?.dataset.y };

    window.applyFormation?.("home", "4-3-3");
    const after = { x: player?.dataset.x, y: player?.dataset.y };
    expect(after).not.toEqual(before);

    window.undoBoard?.();
    expect({ x: player?.dataset.x, y: player?.dataset.y }).toEqual(before);

    window.redoBoard?.();
    expect({ x: player?.dataset.x, y: player?.dataset.y }).toEqual(after);
  });

  it("removes deleted balls together with their drawings and links", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.addBall?.();
    const ball = document.querySelector<HTMLElement>(".piece.ball");
    expect(ball).toBeTruthy();

    window.deletePiece?.(ball as HTMLElement);
    expect(document.querySelector(".piece.ball")).toBeNull();

    window.undoBoard?.();
    expect(document.querySelector(".piece.ball")).toBeTruthy();
  });

  it("saves board state to localStorage and restores it on next mount", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.applyFormation?.("home", "4-3-3");
    window.saveBoardState?.();

    const raw = localStorage.getItem("gunnilse:taktiktavla:state:standalone");
    expect(raw).toBeTruthy();

    const player = document.querySelector<HTMLElement>("#home-5");
    const saved = { x: player?.dataset.x, y: player?.dataset.y };

    window.__cleanupTacticBoard?.();
    document.body.innerHTML = "";

    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });
    const restored = document.querySelector<HTMLElement>("#home-5");
    expect({ x: restored?.dataset.x, y: restored?.dataset.y }).toEqual(saved);
  });

  it("exposes the generalized training-object API on window", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    expect(typeof window.addTrainingObject).toBe("function");
    expect(typeof window.resizeTrainingObject).toBe("function");
    expect(typeof window.clearTrainingMaterial).toBe("function");
    expect(typeof window.importBackgroundImage).toBe("function");
    expect(typeof window.clearBackgroundImage).toBe("function");
  });

  it("resizes a training object within the 0.45–2.4 clamp via resizeTrainingObject", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.addBall?.();
    const ball = document.querySelector<HTMLElement>(".piece.ball");
    expect(ball).toBeTruthy();
    expect(ball?.dataset.scale).toBe("1");

    window.resizeTrainingObject?.(ball as HTMLElement, 0.15);
    expect(Number(ball?.dataset.scale)).toBeCloseTo(1.15);

    for (let i = 0; i < 20; i++) window.resizeTrainingObject?.(ball as HTMLElement, 0.5);
    expect(Number(ball?.dataset.scale)).toBeLessThanOrEqual(2.4);

    for (let i = 0; i < 20; i++) window.resizeTrainingObject?.(ball as HTMLElement, -0.5);
    expect(Number(ball?.dataset.scale)).toBeGreaterThanOrEqual(0.45);
  });

  it("clears all training material via clearTrainingMaterial but keeps players", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.applyFormation?.("home", "4-4-2");
    window.addBall?.();
    window.addTrainingObject?.("cone");
    expect(document.querySelector(".piece.ball")).toBeTruthy();
    expect(document.querySelector(".piece.cone")).toBeTruthy();

    window.clearTrainingMaterial?.();

    expect(document.querySelector(".piece.ball")).toBeNull();
    expect(document.querySelector(".piece.cone")).toBeNull();
    expect(document.querySelector("#home-0")).toBeTruthy();

    window.undoBoard?.();
    expect(document.querySelector(".piece.ball")).toBeTruthy();
    expect(document.querySelector(".piece.cone")).toBeTruthy();
  });

  it("persists and restores training-object scale through capture/apply frame state", () => {
    runBoardScript({ left: 80, top: 140, width: 840, height: 720 });

    window.addBall?.();
    const ball = document.querySelector<HTMLElement>(".piece.ball");
    window.resizeTrainingObject?.(ball as HTMLElement, 0.3);
    expect(Number(ball?.dataset.scale)).toBeCloseTo(1.3);

    const frame = window.captureFrameState?.();
    const ballEntry = frame?.pieces.find((p) => p.id === ball?.id);
    expect(ballEntry?.scale).toBeCloseTo(1.3);

    window.resizeTrainingObject?.(ball as HTMLElement, -0.3);
    expect(Number(ball?.dataset.scale)).toBeCloseTo(1.0);

    window.applyFrameState?.(frame);
    const restoredBall = document.querySelector<HTMLElement>(".piece.ball");
    expect(Number(restoredBall?.dataset.scale)).toBeCloseTo(1.3);
  });
});
