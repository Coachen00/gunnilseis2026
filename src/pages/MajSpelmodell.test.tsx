import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import MajSpelmodell from "./MajSpelmodell";
import { routerFuture } from "@/test/test-utils";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_HERO,
  MAJ_2026_NAV_CARDS,
  MAJ_2026_PRINCIPLE_MEDIA,
} from "@/data/majSpelmodell";
import { SPELMODELL_LEVELS } from "@/data/spelmodellLevels";

const REQUIRED_PRINCIPLE_FIELDS = [
  "definition",
  "matchSignal",
  "playerAction",
  "teamAction",
  "trainingAction",
  "matchMetric",
] as const;

const renderPage = (route = "/spelmodell") =>
  render(
    <MemoryRouter initialEntries={[route]} future={routerFuture}>
      <MajSpelmodell />
    </MemoryRouter>
  );

describe("MajSpelmodell page", () => {
  afterEach(cleanup);

  it("renderar hero med canonical rubrik för spelmodellen", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(MAJ_2026_HERO.title);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Så spelar Gunnilse");
  });

  it("visar nivåöversikten med exakt sju nivåer i rätt ordning", () => {
    renderPage();

    const levelOverview = screen.getByTestId("level-overview-section");
    const levelButtons = within(levelOverview).getAllByRole("button");

    expect(levelButtons.map((button) => button.textContent?.trim())).toEqual(
      SPELMODELL_LEVELS.map((level) => level.label)
    );
  });

  it("visar Novis med konceptkarta/textfallback och Level 1 med exakt fyra levande skeden", () => {
    renderPage();

    const noviceOverview = screen.getByTestId("novice-overview");
    for (const term of [
      "Planens ytor",
      "Korridorer",
      "Gyllene zonen",
      "Assistytan",
      "Spelbredd",
      "Speldjup",
      "Spelavstånd",
      "Spelbarhet",
    ]) {
      expect(within(noviceOverview).getAllByText(term).length).toBeGreaterThan(0);
    }
    expect(within(noviceOverview).getByRole("heading", { name: /textversion av novis-kartan/i })).toBeInTheDocument();

    const livePhases = screen.getByTestId("live-phases-overview");
    expect(within(livePhases).getAllByRole("link")).toHaveLength(4);
    expect(within(livePhases).getByText("Försvarsspel")).toBeInTheDocument();
    expect(within(livePhases).getByText("När vi vinner bollen")).toBeInTheDocument();
    expect(within(livePhases).getByText("Anfallsspel")).toBeInTheDocument();
    expect(within(livePhases).getByText("När vi tappar bollen")).toBeInTheDocument();
  });

  it("placerar Så arbetar du med spelmodellen direkt efter nivåöversikten", () => {
    renderPage();

    const levelOverview = screen.getByTestId("level-overview-section");
    const howItWorks = screen.getByTestId("spelmodell-how-it-works");

    expect(levelOverview.nextElementSibling).toBe(howItWorks);
    expect(within(howItWorks).getByRole("heading", { name: /så arbetar du med spelmodellen/i })).toBeInTheDocument();
    for (const step of ["Spelprincip", "Matchtillstånd", "Prioritering", "Beteende"]) {
      expect(within(howItWorks).getByText(step)).toBeInTheDocument();
    }
    expect(within(howItWorks).getByText(/resultat/i)).toBeInTheDocument();
    expect(within(howItWorks).getByText(/tid/i)).toBeInTheDocument();
    expect(within(howItWorks).getByText(/motståndarpress/i)).toBeInTheDocument();
    expect(within(howItWorks).getByText(/spelarstatus/i)).toBeInTheDocument();
    expect(within(howItWorks).getByText(/numerär/i)).toBeInTheDocument();
  });

  it("visar fasta situationer separat och markerar identitet och målvaktsperspektiv som tvärgående lager", () => {
    renderPage();

    const specialLayers = screen.getByTestId("special-layers-overview");
    expect(within(specialLayers).getByText("Fasta situationer · död boll")).toBeInTheDocument();
    expect(within(specialLayers).getByText("Identitet")).toBeInTheDocument();
    expect(within(specialLayers).getByText("Målvaktsperspektiv · tvärgående")).toBeInTheDocument();
  });

  it("legacy-url /maj-2026 renderar samma huvudmodell utan krasch", () => {
    renderPage("/maj-2026");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Så spelar Gunnilse");
  });

  it("renderar alla navkort som ankarlänkar", () => {
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

  it("renderar alla modellsektioner med korrekt id för scrollankare", () => {
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

  it("håller privat Storyn-copy borta från den publika spelmodellen", () => {
    renderPage();
    for (const hiddenText of [
      "Det jag vill göra",
      "Det jag förstår",
      "Det jag missar",
      "Idéer under utveckling",
    ]) {
      expect(screen.queryByText(hiddenText)).not.toBeInTheDocument();
    }
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

  it("visar anfallssekvensen stegvis och kan starta animationen", () => {
    renderPage();
    fireEvent.click(screen.getByTestId("block-trigger-anfallsspel"));

    const play = screen.getByTestId("tactical-play-anfallsspel");
    expect(play).toHaveAttribute("aria-label", "Spela sekvens");
    expect(screen.getByTestId("tactical-step-anfallsspel-5")).toHaveTextContent("Fyll boxen");

    fireEvent.click(play);

    expect(play).toHaveAttribute("aria-label", "Pausa sekvens");
    expect(document.querySelector('.tactical-visual[data-playing="true"]')).toBeInTheDocument();
  });

  it("alla block har minst en princip definierad", () => {
    for (const block of MAJ_2026_BLOCKS) {
      expect(block.principles.length).toBeGreaterThanOrEqual(1);
      for (const p of block.principles) {
        expect(p.id).toMatch(/^[a-z0-9-]+$/);
        expect(p.label.length).toBeGreaterThan(0);
        expect(p.oneLiner.length).toBeGreaterThan(0);
        for (const field of REQUIRED_PRINCIPLE_FIELDS) {
          expect(p[field].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("varje levande skede visar samma arbetskedja med matchtillståndets faktorer", () => {
    renderPage();

    for (const blockId of ["forsvarsspel", "overgang-anfall", "anfallsspel", "overgang-forsvar"]) {
      fireEvent.click(screen.getByTestId(`block-trigger-${blockId}`));
      const flowStrip = screen.getByTestId(`flow-strip-${blockId}`);

      for (const label of ["Spelprincip", "Matchtillstånd", "Prioritering", "Beteende"]) {
        expect(within(flowStrip).getByText(label)).toBeInTheDocument();
      }

      expect(within(flowStrip).getByText(/resultat/i)).toBeInTheDocument();
      expect(within(flowStrip).getByText(/tid/i)).toBeInTheDocument();
      expect(within(flowStrip).getByText(/motståndarpress/i)).toBeInTheDocument();
      expect(within(flowStrip).getByText(/spelarstatus/i)).toBeInTheDocument();
      expect(within(flowStrip).getByText(/numerär/i)).toBeInTheDocument();
    }
  });

  it("visar ordlista och håller störande interncopy borta från huvudmodellen", () => {
    renderPage();
    for (const term of ["Spelmodell", "Spelidé", "Princip", "Roll", "Trigger", "Scanning", "Positionering", "Press", "Understöd", "Spelvändning", "Yta", "Tredje man", "Omställning", "Spelbarhet", "Relationer"]) {
      expect(screen.getAllByRole("heading", { name: term }).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText(new RegExp("pseudo" + "kontring", "i"))).not.toBeInTheDocument();
    const hiddenPlaceholderPattern = new RegExp(
      ["saknat under" + "lag", "missing " + "input", "behöver " + "fyllas"].join("|"),
      "i"
    );
    expect(screen.queryByText(hiddenPlaceholderPattern)).not.toBeInTheDocument();
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
