import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Taktiktavla from "./Taktiktavla";
import { routerFuture } from "@/test/test-utils";

declare global {
  interface Window {
    __tacticBoardCleaned?: boolean;
  }
}

vi.mock("./tactic-board-script.js?raw", () => ({
  default: "window.__cleanupTacticBoard = () => { window.__tacticBoardCleaned = true; };",
}));

describe("Taktiktavla", () => {
  afterEach(() => {
    cleanup();
    delete window.__cleanupTacticBoard;
    delete window.__tacticBoardCleaned;
    delete window.html2canvas;
  });

  it("mounts the bitmap backdrop before the interaction layer and cleans up the injected script", async () => {
    window.html2canvas = vi.fn();

    const { unmount } = render(
      <MemoryRouter future={routerFuture}>
        <Taktiktavla />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /matchdagens taktiktavla/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(document.querySelector("#pitch")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.querySelectorAll(".tactics-backdrop__image")).toHaveLength(1);
    });

    const backdrop = document.querySelector(".tactics-backdrop");
    const backdropImage = document.querySelector(".tactics-backdrop__image");
    const pitch = document.querySelector("#pitch");

    expect(backdrop).toBeInTheDocument();
    expect(backdropImage).toBeInTheDocument();
    expect(backdrop).toHaveStyle({ pointerEvents: "none" });
    expect(backdrop?.querySelector("svg")).not.toBeInTheDocument();
    expect(pitch).toHaveClass("tactics-interaction-layer");
    expect(backdrop?.compareDocumentPosition(pitch as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(document.querySelector(".tactics-board")?.firstElementChild).toHaveAttribute(
      "id",
      "tactics-backdrop-root"
    );

    const cleanupSpy = vi.fn();
    window.__cleanupTacticBoard = cleanupSpy;
    await act(async () => {
      unmount();
      await Promise.resolve();
    });

    expect(cleanupSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector("#pitch")).not.toBeInTheDocument();
    expect(document.querySelector(".tactics-backdrop__image")).not.toBeInTheDocument();
  });

  it("matches the supplied corridor, play-zone and thirds geometry", async () => {
    window.html2canvas = vi.fn();

    const { unmount } = render(
      <MemoryRouter future={routerFuture}>
        <Taktiktavla />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.querySelector("#layer-korridorer")).toBeInTheDocument();
    });

    const corridors = Array.from(document.querySelectorAll<HTMLElement>("#layer-korridorer .corridor-band"));
    expect(corridors).toHaveLength(5);
    expect(corridors.map((corridor) => corridor.style.left)).toEqual(["0%", "20.35%", "36.53%", "63.47%", "79.65%"]);
    expect(corridors.map((corridor) => corridor.style.width)).toEqual(["20.35%", "16.18%", "26.94%", "16.18%", "20.35%"]);

    const thirds = Array.from(document.querySelectorAll<HTMLElement>("#layer-tredjedelar .third-band"));
    expect(thirds).toHaveLength(3);
    expect(thirds.map((third) => third.style.top)).toEqual(["0%", "33.3333%", "66.6667%"]);
    expect(thirds.map((third) => third.style.height)).toEqual(["33.3333%", "33.3334%", "33.3333%"]);
    const playZones = Array.from(document.querySelectorAll<HTMLElement>("#layer-spelytor .play-zone"));
    expect(playZones).toHaveLength(4);
    expect(playZones.map((zone) => zone.style.top)).toEqual(["66.6667%", "50%", "33.3333%", "0%"]);
    expect(playZones.map((zone) => zone.style.height)).toEqual(["33.3333%", "16.6667%", "16.6667%", "33.3333%"]);
    expect(document.querySelector("#layer-spelytor .attack-direction-label")).toHaveTextContent("ANFALL");

    const goldenZones = Array.from(document.querySelectorAll<HTMLElement>("#layer-golden .golden-zone"));
    expect(goldenZones).toHaveLength(2);
    expect(goldenZones[0]).toHaveStyle({ left: "5%", width: "10%" });
    expect(goldenZones[1]).toHaveStyle({ right: "5%", width: "10%" });
    expect(document.querySelectorAll("#layer-golden .assist-zone")).toHaveLength(6);

    await act(async () => {
      unmount();
      await Promise.resolve();
    });
  });
});
