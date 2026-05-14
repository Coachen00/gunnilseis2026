import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MajSpelmodell from "./MajSpelmodell";
import { MAJ_2026_BLOCKS, MAJ_2026_HERO, MAJ_2026_NAV_CARDS } from "@/data/majSpelmodell";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/maj-2026"]}>
      <MajSpelmodell />
    </MemoryRouter>
  );

describe("MajSpelmodell page", () => {
  afterEach(cleanup);

  it("renderar hero med rubriken SÅ SPELAR VI FOTBOLL", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(MAJ_2026_HERO.title);
  });

  it("renderar alla sex navkort som ankarlänkar", () => {
    renderPage();
    for (const card of MAJ_2026_NAV_CARDS) {
      const link = screen.getByRole("link", { name: new RegExp(card.label, "i") });
      expect(link).toHaveAttribute("href", `#${card.id}`);
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

  it("varje block visar både Gör så här och Gör inte så här", () => {
    renderPage();
    const goHere = screen.getAllByText(/^gör så här$/i);
    const dontGoHere = screen.getAllByText(/^gör inte så här$/i);
    expect(goHere.length).toBe(MAJ_2026_BLOCKS.length);
    expect(dontGoHere.length).toBe(MAJ_2026_BLOCKS.length);
  });

  it("varje block har en princip-accordion-trigger med korrekt antal", () => {
    renderPage();
    for (const block of MAJ_2026_BLOCKS) {
      const trigger = screen.getByTestId(`principles-trigger-${block.id}`);
      expect(trigger).toHaveTextContent(new RegExp(`Principer · ${block.principles.length}`));
      // Collapsed by default — slot-komponenter renderas inte än
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
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
