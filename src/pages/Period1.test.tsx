import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Period1 from "./Period1";
import { PERIOD_1, PERIOD_1_PRINCIPLES, PERIOD_1_REFERENCES } from "@/data/period1";
import { routerFuture } from "@/test/test-utils";

const renderAt = (path = "/period/1") =>
  render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <Period1 />
    </MemoryRouter>
  );

describe("Period1 page", () => {
  afterEach(cleanup);

  it("renders title and the 5 tabs", () => {
    renderAt();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/diagonalt spel/i);
    for (const label of ["Kartan", "Principen", "Resan", "Passen", "Fördjupning"]) {
      expect(screen.getByRole("tab", { name: new RegExp(label) })).toBeInTheDocument();
    }
  });

  it("Kartan-tab visar översikt utan att rendera alla 18 pass", () => {
    renderAt();
    expect(screen.getByText("18", { selector: "dd" })).toBeInTheDocument();
    // Inget av sessionsrubrikerna ska finnas i DOM på Kartan
    expect(screen.queryByText(PERIOD_1.weeks[0].sessions[0].title)).not.toBeInTheDocument();
  });

  it("Passen-tab via ?tab=passen renderar ankare för alla 6 veckor", () => {
    renderAt("/period/1?tab=passen");
    for (let w = 1; w <= 6; w++) {
      expect(document.getElementById(`vecka-${w}`)).toBeInTheDocument();
    }
  });

  it("Principen-tab via ?tab=principen visar 10 principkort", () => {
    renderAt("/period/1?tab=principen");
    for (const principle of PERIOD_1_PRINCIPLES) {
      expect(screen.getByRole("heading", { level: 3, name: principle.title })).toBeInTheDocument();
    }
  });

  it("Fördjupning-tab via ?tab=fordjupning visar effektlogik, referenser och uppföljning", () => {
    renderAt("/period/1?tab=fordjupning");
    for (const label of ["Resurser", "Aktiviteter", "Mål", "Effekt"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    for (const ref of PERIOD_1_REFERENCES) {
      expect(screen.getByRole("heading", { level: 3, name: new RegExp(ref.team) })).toBeInTheDocument();
    }
    expect(screen.getByText(PERIOD_1.followUp.title)).toBeInTheDocument();
  });

});
