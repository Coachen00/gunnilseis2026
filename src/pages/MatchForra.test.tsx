import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MatchForra from "./MatchForra";
import { getForraMatch } from "@/data/forraMatch";
import { routerFuture } from "@/test/test-utils";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/match/forra"]} future={routerFuture}>
      <MatchForra />
    </MemoryRouter>,
  );

describe("MatchForra page", () => {
  afterEach(cleanup);

  it("renderar PageHero med senaste matchens opponent (auto från season.ts)", () => {
    renderPage();
    const latest = getForraMatch();
    if (!latest) {
      // Edge case: ingen spelad match än — sidan visar tom state
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent(/ingen spelad match/i);
      return;
    }
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(new RegExp(latest.meta.opponent));
    if (latest.meta.ourScore != null && latest.meta.theirScore != null) {
      expect(h1).toHaveTextContent(`${latest.meta.ourScore}–${latest.meta.theirScore}`);
    }
  });

  it("formaterar datum-fältet via formatMatchDate (Fre/Mån/Tis... + månad + tid)", () => {
    renderPage();
    if (!getForraMatch()) return; // ingen match att visa
    expect(screen.getByText("Datum")).toBeInTheDocument();
    const dateRegex = /(Sön|Mån|Tis|Ons|Tor|Fre|Lör)\s+\d{1,2}\s+(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)\s+·\s+\d{2}:\d{2}/;
    const dateNodes = screen.getAllByText(dateRegex);
    expect(dateNodes.length).toBeGreaterThan(0);
  });

  it("renderar minst en reflektions-blockrubrik", () => {
    renderPage();
    const latest = getForraMatch();
    if (!latest || latest.blocks.length === 0) return;
    expect(screen.getByText(latest.blocks[0].badge)).toBeInTheDocument();
  });
});
