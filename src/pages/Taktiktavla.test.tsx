import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Taktiktavla from "./Taktiktavla";

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
      <MemoryRouter>
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
});
