import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Period2 from "./Period2";
import { PERIOD_2, PERIOD_2_PRINCIPLES, PERIOD_2_REFERENCES } from "@/data/period2";
import { routerFuture } from "@/test/test-utils";

const renderAt = (path = "/period/2") =>
  render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <Period2 />
    </MemoryRouter>
  );

describe("Period2 page", () => {
  afterEach(cleanup);

  it("renders title and the 5 tabs", () => {
    renderAt();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/vinna bollen/i);
    for (const label of ["Kartan", "Principen", "Resan", "Passen", "Fördjupning"]) {
      expect(screen.getByRole("tab", { name: new RegExp(label) })).toBeInTheDocument();
    }
  });

  it("Kartan-tab visar översikt utan att rendera alla 18 pass och länkar tillbaka till Period 1", () => {
    renderAt();
    expect(screen.getByText("18", { selector: "dd" })).toBeInTheDocument();
    expect(screen.queryByText(PERIOD_2.weeks[0].sessions[0].title)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /period 1 – diagonalt spel/i })).toHaveAttribute(
      "href",
      "/period/1"
    );
  });

  it("Passen-tab via ?tab=passen renderar ankare för alla 6 veckor", () => {
    renderAt("/period/2?tab=passen");
    for (let w = 1; w <= 6; w++) {
      expect(document.getElementById(`vecka-${w}`)).toBeInTheDocument();
    }
  });

  it("Principen-tab via ?tab=principen visar 8 principkort", () => {
    renderAt("/period/2?tab=principen");
    for (const principle of PERIOD_2_PRINCIPLES) {
      expect(screen.getByRole("heading", { level: 3, name: principle.title })).toBeInTheDocument();
    }
  });

  it("Fördjupning-tab via ?tab=fordjupning visar effektlogik, referenser och uppföljning", () => {
    renderAt("/period/2?tab=fordjupning");
    for (const label of ["Resurser", "Aktiviteter", "Mål", "Effekt"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    for (const ref of PERIOD_2_REFERENCES) {
      expect(screen.getByRole("heading", { level: 3, name: ref.team })).toBeInTheDocument();
    }
    expect(screen.getByText(PERIOD_2.followUp.title)).toBeInTheDocument();
  });
});
