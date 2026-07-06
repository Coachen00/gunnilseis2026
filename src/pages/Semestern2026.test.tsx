import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Semestern2026 from "./Semestern2026";
import { SQUAD, STAFF } from "@/data/squad";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@/hooks/useSquad", () => ({
  useSquad: () => ({
    players: SQUAD,
    staff: STAFF,
    loading: false,
    usingFallback: true,
  }),
}));

describe("Semestern2026 personliga scheman", () => {
  it("följer aktuell trupp och visar rätt träningsroll för nya/behållna spelare", () => {
    const { container } = renderWithProviders(<Semestern2026 />, { routerProps: { initialEntries: ["/semestern-2026"] } });
    const playerButtons = Array.from(container.querySelectorAll("[data-radix-collection-item]")).map(
      (button) => button.textContent ?? ""
    );

    expect(screen.getByText(`${SQUAD.length} spelare visas i semesterlistan.`)).toBeInTheDocument();
    for (const player of SQUAD) {
      expect(playerButtons.some((text) => text.includes(player.name))).toBe(true);
    }

    expect(playerButtons.some((text) => text.includes("Josef Abdmasih"))).toBe(false);
    expect(playerButtons.some((text) => text.includes("Kamal Fekhouri") && text.includes("Målvakt"))).toBe(true);
    expect(playerButtons.some((text) => text.includes("Mustafa Ayoub") && text.includes("Mittfältare"))).toBe(true);
    expect(playerButtons.some((text) => text.includes("Sabarr Janneh") && text.includes("Mittback"))).toBe(true);
  });
});
