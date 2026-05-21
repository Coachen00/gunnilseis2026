import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MajSpelmodell from "./MajSpelmodell";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_HERO,
  MAJ_2026_NAV_CARDS,
  MAJ_2026_PRINCIPLE_MEDIA,
} from "@/data/majSpelmodell";

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
      // FilmLibrary lägger till parallella länkar med samma label-text
      // (snabb-nav chips för #film-<id>). Vi accepterar att flera matchar
      // och kollar att MINST en pekar på block-ankaret #<id>.
      const links = screen.getAllByRole("link", { name: new RegExp(card.label, "i") });
      expect(links.length).toBeGreaterThan(0);
      const blockAnchor = links.find((link) => link.getAttribute("href") === `#${card.id}`);
      expect(blockAnchor).toBeDefined();
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
    // Triggers finns för alla 6 block
    for (const block of MAJ_2026_BLOCKS) {
      const trigger = screen.getByTestId(`block-trigger-${block.id}`);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(trigger).toHaveTextContent(new RegExp(block.title, "i"));
    }
    // Gör så här / Gör inte så här ska INTE finnas — det ligger i collapsed AccordionContent
    expect(screen.queryByText(/^gör så här$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^gör inte så här$/i)).not.toBeInTheDocument();
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

  it("sorterar Björkö-spellistans klipp efter titel till rätt princip", () => {
    expect(MAJ_2026_PRINCIPLE_MEDIA.forsvarsspel.medel).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/ByjV5xoRi64",
          label: "försvar. styr mot yttre korridor för att vi",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA["overgang-anfall"].kontring).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/fD5GS8Ez4pc",
          label: "Omställning till anfall, kontring. mål",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA["overgang-forsvar"].direkt).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/YhS2r2rip8A",
          label: "omställning till försvar. direkt reaktion",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA.anfallsspel["spela-ut"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/l1H5hwu3CNQ",
          label: "anfallsspel. Spelvändning, fram, avslut",
        }),
        expect.objectContaining({
          src: "https://youtu.be/FNiuGVbptI4",
          label: "anfall. In, in, ut",
        }),
        expect.objectContaining({
          src: "https://youtu.be/JIi84a_FrY0",
          label: "anfallsspel. Spelvändning.mp4",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA.anfallsspel["ta-med-framat"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/5Ub2i3J9rdQ",
          label: "Anfallsspel. In, ut, fram, mål.",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA.anfallsspel["fyll-pa-box"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/MtKIJtFnU6E",
          label: "Anfall. In, ut, fram, box. MÅL",
        }),
      ])
    );
    expect(MAJ_2026_PRINCIPLE_MEDIA.identitet.andrabollsspel).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "https://youtu.be/q5Y4ThoZqK4",
          label: "Identitet. 2a boll, Ihab, bollvinst",
        }),
      ])
    );
  });
});
