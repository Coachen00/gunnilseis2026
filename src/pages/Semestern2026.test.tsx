import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Semestern2026 from "./Semestern2026";
import type { Player } from "@/data/squad";
import { renderWithProviders } from "@/test/test-utils";

const players: Player[] = [
  { name: "Ali Målvakt", position: "GK" },
  { name: "Dani Försvarare", position: "DEF" },
  { name: "Mira Mittfältare", position: "MID" },
  { name: "Frej Anfallare", position: "FWD" },
];

vi.mock("@/hooks/useSquad", () => ({
  useSquad: () => ({ players, staff: [], loading: false, usingFallback: true }),
}));

function renderPage() {
  return renderWithProviders(<Semestern2026 />, { routerProps: { initialEntries: ["/semestern-2026"] } });
}

describe("Semestern2026 personliga scheman", () => {
  it("visar rubrik, fyra valbara veckor och tre neutrala nivåer", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Personliga träningsscheman" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Frej Anfallare/i }));

    for (const week of [1, 2, 3, 4]) {
      expect(screen.getByRole("button", { name: `Vecka ${week}` })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Full plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Underhåll" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Minsta effektiva dos" })).toBeInTheDocument();
  });

  it("visar handling, vila och stoppregel från modellen för vald vecka och position", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Frej Anfallare/i }));
    fireEvent.click(screen.getByRole("button", { name: "Vecka 4" }));

    const fullPlan = screen.getByRole("article", { name: "Full plan" });
    expect(within(fullPlan).getByText("Hel vilodag")).toBeInTheDocument();
    expect(within(fullPlan).getByText("6 × 30 m")).toBeInTheDocument();
    expect(within(fullPlan).getAllByText(/Intensitet:/i).length).toBeGreaterThan(0);
    expect(within(fullPlan).getAllByText(/Vila:/i).length).toBeGreaterThan(0);
    expect(within(fullPlan).getAllByText(/Stoppregel:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/90–100 %/i).length).toBeGreaterThan(0);
  });

  it("ger varje spelaroll positionsspecifik text", () => {
    renderPage();

    for (const [name, role] of [
      ["Ali Målvakt", "målvakt"],
      ["Dani Försvarare", "mittback"],
      ["Mira Mittfältare", "mittfältare"],
      ["Frej Anfallare", "forward"],
    ]) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(name, "i") }));
      expect(screen.getByText(new RegExp(`tränar som ${role}`, "i"))).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: new RegExp(name, "i") }));
    }
  });

  it("tar bort nedsättande copy och gamla riskdoser", () => {
    renderPage();
    expect(screen.queryByText(/Chipstuttar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/12 x 20 sek maxnära/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/16 x 50 m/i)).not.toBeInTheDocument();
  });
});
