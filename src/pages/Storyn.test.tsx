import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Storyn from "./Storyn";

afterEach(cleanup);

function renderPage() {
  return render(
    <MemoryRouter>
      <Storyn />
    </MemoryRouter>
  );
}

describe("Storyn", () => {
  it("öppnar med berättelsen om hur vi spelar, före modellkapitlen", () => {
    renderPage();

    const eyebrows = screen.getAllByText(/^Storyn \d\d$/).map((el) => el.textContent);
    expect(eyebrows[0]).toBe("Storyn 01");

    const headings = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(headings.slice(0, 3)).toEqual(["Så spelar vi", "Varför", "Nittio minuter"]);
    expect(headings.indexOf("Så spelar vi")).toBeLessThan(headings.indexOf("Riktning"));
  });

  it("namnger det höga aggressiva försvarsspelet och triggern", () => {
    renderPage();

    expect(screen.getByText(/högt och aggressivt/)).toBeInTheDocument();
    expect(screen.getByText(/tre korridorer/)).toBeInTheDocument();
    expect(screen.getByText(/väntar på triggern/)).toBeInTheDocument();
  });

  it("behåller modellkapitlen efter berättelsen", () => {
    renderPage();

    expect(screen.getAllByText("Riktning").length).toBeGreaterThan(0);
    expect(screen.getByText(/Standard, ledarskap, träning/)).toBeInTheDocument();
  });
});
