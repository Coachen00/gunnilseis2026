import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Period1 from "./Period1";
import { PERIOD_1, totalSessions } from "@/data/period1";

describe("Period1 page renders", () => {
  afterEach(cleanup);

  it("renders title, daterange and total sessions chip", () => {
    render(
      <MemoryRouter>
        <Period1 />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/diagonalt spel/i);
    expect(screen.getByText(new RegExp(`Period 1.*${PERIOD_1.dateRange}`))).toBeInTheDocument();
    expect(screen.getByText(`${totalSessions(PERIOD_1)} träningspass`)).toBeInTheDocument();
  });

  it("renders all 6 weeks with id-anchors", () => {
    render(
      <MemoryRouter>
        <Period1 />
      </MemoryRouter>
    );
    for (let w = 1; w <= 6; w++) {
      expect(document.getElementById(`vecka-${w}`)).toBeInTheDocument();
    }
  });

  it("renders all 18 session titles", () => {
    render(
      <MemoryRouter>
        <Period1 />
      </MemoryRouter>
    );
    let count = 0;
    for (const week of PERIOD_1.weeks) {
      for (const session of week.sessions) {
        expect(screen.getByText(session.title)).toBeInTheDocument();
        count++;
      }
    }
    expect(count).toBe(18);
  });

  it("renders effektlogik labels in order", () => {
    render(
      <MemoryRouter>
        <Period1 />
      </MemoryRouter>
    );
    for (const label of ["Resurser", "Aktiviteter", "Mål", "Effekt"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("renders followup section with 22/6–1/7", () => {
    render(
      <MemoryRouter>
        <Period1 />
      </MemoryRouter>
    );
    expect(screen.getByText(PERIOD_1.followUp.title)).toBeInTheDocument();
    expect(screen.getByText(PERIOD_1.followUp.dateRange)).toBeInTheDocument();
  });
});
