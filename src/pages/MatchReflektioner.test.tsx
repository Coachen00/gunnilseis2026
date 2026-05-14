import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MatchReflektioner from "./MatchReflektioner";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/match/reflektioner"]}>
      <MatchReflektioner />
    </MemoryRouter>
  );

describe("MatchReflektioner page", () => {
  afterEach(cleanup);

  it("renderar PageHero med titel", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/samlade tankar/i);
  });

  it("renderar de tre sektionerna med rätt badges", () => {
    renderPage();
    // Badges visas + förekommer även i sektionsrubriker → getAllByText
    expect(screen.getAllByText(/Mönster/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Trend/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nästa steg/).length).toBeGreaterThan(0);
  });
});
