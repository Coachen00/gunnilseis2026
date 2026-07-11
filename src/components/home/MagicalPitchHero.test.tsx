import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MagicalPitchHero from "./MagicalPitchHero";

vi.mock("@/hooks/useAuthSession", () => ({
  useAuthSession: () => ({ isAuthed: false, loading: false }),
}));

vi.mock("./HomeCalendarBoard", () => ({ default: () => null }));

describe("MagicalPitchHero", () => {
  it("keeps every welcome image mounted for gap-free crossfades", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MagicalPitchHero />
      </MemoryRouter>,
    );

    expect(screen.getAllByTestId("welcome-image")).toHaveLength(6);
  });
});
