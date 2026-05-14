import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MatchForra from "./MatchForra";
import { FORRA_MATCH } from "@/data/forraMatch";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/match/forra"]}>
      <MatchForra />
    </MemoryRouter>
  );

describe("MatchForra page", () => {
  afterEach(cleanup);

  it("renderar PageHero med opponent + resultat", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(new RegExp(FORRA_MATCH.meta.opponent));
    expect(h1).toHaveTextContent(`${FORRA_MATCH.meta.ourScore}–${FORRA_MATCH.meta.theirScore}`);
  });

  it("formaterar datum-fältet via formatMatchDate (Fre/Mån/Tis... + månad + tid)", () => {
    renderPage();
    // Datum-rubrik finns
    expect(screen.getByText("Datum")).toBeInTheDocument();
    // Det formaterade värdet följer "Xxx D mmm · HH:MM"
    const dateRegex = /(Sön|Mån|Tis|Ons|Tor|Fre|Lör)\s+\d{1,2}\s+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)\s+·\s+\d{2}:\d{2}/;
    const dateNodes = screen.getAllByText(dateRegex);
    expect(dateNodes.length).toBeGreaterThan(0);
  });

  it("renderar minst en reflektions-blockrubrik", () => {
    renderPage();
    const firstBlock = FORRA_MATCH.blocks[0];
    expect(screen.getByText(firstBlock.badge)).toBeInTheDocument();
  });
});
