import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Verktyg from "./Verktyg";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/verktyg"]}>
      <Verktyg />
    </MemoryRouter>
  );

describe("Verktyg page", () => {
  afterEach(cleanup);

  it("renderar alla 5 tränarverktyg som länkar", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Spelmodell-labb/i })).toHaveAttribute(
      "href",
      "/spelmodell-labb"
    );
    expect(screen.getByRole("link", { name: /Träningsplan/i })).toHaveAttribute(
      "href",
      "/traningsplan"
    );
    expect(screen.getByRole("link", { name: /Matchblad/i })).toHaveAttribute(
      "href",
      "/matchblad"
    );
    expect(screen.getByRole("link", { name: /Motståndaranalys/i })).toHaveAttribute(
      "href",
      "/motstandaranalys"
    );
    expect(screen.getByRole("link", { name: /Taktiktavla/i })).toHaveAttribute(
      "href",
      "/taktiktavla"
    );
  });
});
