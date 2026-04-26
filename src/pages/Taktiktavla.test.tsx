import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
  });

  it("mounts the full board markup and cleans up the injected script", async () => {
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

    const cleanupSpy = vi.fn();
    window.__cleanupTacticBoard = cleanupSpy;
    unmount();

    expect(cleanupSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector("#pitch")).not.toBeInTheDocument();
  });
});
