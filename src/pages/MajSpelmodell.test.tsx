import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MajSpelmodell from "./MajSpelmodell";
import { MAJ_2026_BLOCKS, MAJ_2026_HERO, MAJ_2026_NAV_CARDS } from "@/data/majSpelmodell";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

const renderPage = () =>
  renderWithProviders(<MajSpelmodell />, { routerProps: { initialEntries: ["/maj-2026"] } });

describe("MajSpelmodell page", () => {
  afterEach(cleanup);

  it("renderar hero med rubriken SÅ SPELAR VI FOTBOLL", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(MAJ_2026_HERO.title);
  });

  it("renderar alla sex navkort som ankarlänkar", () => {
    renderPage();
    for (const card of MAJ_2026_NAV_CARDS) {
      const links = screen.getAllByRole("link", { name: new RegExp(card.label, "i") });
      const matching = links.filter((l) => l.getAttribute("href") === `#${card.id}`);
      expect(matching.length).toBeGreaterThan(0);
    }
  });

  it("renderar alla sex blocksektioner med korrekt id för scrollankare", () => {
    renderPage();
    for (const block of MAJ_2026_BLOCKS) {
      expect(document.getElementById(block.id)).toBeInTheDocument();
    }
  });

  it("renderar effektlogik-rubrikerna Resurser, Aktiviteter, Mål, Effekt", () => {
    renderPage();
    for (const label of ["Resurser", "Aktiviteter", "Mål", "Effekt"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("renderar snabbversionen DETTA SKA DU GÖRA PÅ PLANEN", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /detta ska du göra på planen/i })).toBeInTheDocument();
  });

  it("varje block är en kollapsad accordion-trigger by default — inget block-innehåll syns på initial render", () => {
    renderPage();
    for (const block of MAJ_2026_BLOCKS) {
      const trigger = screen.getByTestId(`block-trigger-${block.id}`);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(trigger).toHaveTextContent(new RegExp(block.title, "i"));
    }
    expect(screen.queryByText(/^gör så här$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^gör inte så här$/i)).not.toBeInTheDocument();
  });

  it("BlockFilterBar finns och innehåller alla sex blocknavn", () => {
    renderPage();
    const filter = screen.getByLabelText(/filter — hoppa till block/i);
    for (const block of MAJ_2026_BLOCKS) {
      const inside = filter.querySelectorAll(`a[href="#${block.id}"]`);
      expect(inside.length).toBeGreaterThan(0);
    }
  });

  it("alla block har minst en princip definierad", () => {
    for (const block of MAJ_2026_BLOCKS) {
      expect(block.principles.length).toBeGreaterThanOrEqual(1);
      for (const p of block.principles) {
        expect(p.id).toMatch(/^[a-z0-9-]+$/);
        expect(p.label.length).toBeGreaterThan(0);
        expect(p.oneLiner.length).toBeGreaterThan(0);
      }
    }
  });
});
