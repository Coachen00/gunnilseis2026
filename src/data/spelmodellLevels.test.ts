import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { within } from "@testing-library/react";
import { Fragment, createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LevelBadge from "@/components/LevelBadge";
import ConceptMap, {
  type ConceptMapEdge,
  type ConceptMapNode,
} from "@/components/spelmodell/ConceptMap";
import LevelPath from "@/components/spelmodell/LevelPath";
import {
  LIVE_PHASE_IDS,
  SPELMODELL_LEVELS,
  SPELMODELL_SPECIAL_LAYERS,
} from "./spelmodellLevels";

afterEach(cleanup);

describe("SPELMODELL_LEVELS", () => {
  it("exports the exact seven-step player learning order", () => {
    expect(SPELMODELL_LEVELS.map((level) => level.label)).toEqual([
      "Novis",
      "Level 1",
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5",
      "Advanced",
    ]);
  });

  it("covers the required novice concepts and simple match anchors", () => {
    const novice = SPELMODELL_LEVELS.find((level) => level.id === "novis");

    expect(novice?.concepts).toEqual(
      expect.arrayContaining([
        "Planens ytor",
        "Korridorer",
        "Gyllene zonen",
        "Assistytan",
        "Spelbredd",
        "Speldjup",
        "Spelavstånd",
        "Spelbarhet",
        "Boll",
        "Medspelare",
        "Motståndare",
        "Mål",
      ])
    );
  });

  it("keeps the four live phases isolated from special layers", () => {
    expect(LIVE_PHASE_IDS).toEqual([
      "Försvarsspel",
      "Övergång till anfall",
      "Anfallsspel",
      "Övergång till försvar",
    ]);

    expect(SPELMODELL_SPECIAL_LAYERS.map((layer) => layer.label)).toEqual([
      "Identitet",
      "Fasta situationer · död boll",
      "Målvaktsperspektiv · tvärgående",
    ]);
  });
});

describe("ConceptMap", () => {
  const nodes: ConceptMapNode[] = [
    {
      id: "novis",
      label: "Novis",
      kind: "level",
      detail: "Lär dig se planen först.",
    },
    {
      id: "planens-ytor",
      label: "Planens ytor",
      kind: "concept",
      detail: "Bredd, djup och viktiga avslutsytor.",
    },
  ];

  const edges: ConceptMapEdge[] = [
    {
      from: "novis",
      to: "planens-ytor",
      label: "börjar med",
    },
  ];

  it("renders a text fallback without Mermaid runtime dependencies", () => {
    render(
      createElement(ConceptMap, {
        title: "Spelmodellens karta",
        nodes,
        edges,
        fallbackTitle: "Textversion av kartan",
      })
    );

    const fallbackHeading = screen.getByRole("heading", { name: "Textversion av kartan" });
    const fallbackSection = fallbackHeading.parentElement;

    expect(fallbackHeading).toBeInTheDocument();
    expect(fallbackSection).not.toBeNull();
    expect(within(fallbackSection as HTMLElement).getByText(/novis → planens ytor/i)).toBeInTheDocument();
    expect(within(fallbackSection as HTMLElement).getAllByText("Novis").length).toBeGreaterThan(0);
    expect(within(fallbackSection as HTMLElement).getAllByText("Planens ytor").length).toBeGreaterThan(0);
  });
});

describe("LevelPath", () => {
  it("marks the selected level with aria-current and selected state", () => {
    const onSelect = vi.fn();

    render(
      createElement(LevelPath, {
        levels: SPELMODELL_LEVELS,
        selectedLevelId: "level-2",
        onSelect,
      })
    );

    const selected = screen.getByRole("button", { name: "Level 2" });

    expect(selected).toHaveAttribute("aria-current", "step");
    expect(selected).toHaveAttribute("data-selected", "true");
    expect(selected.className).toContain("min-h-11");
  });

  it("supports keyboard navigation across the level path", () => {
    const onSelect = vi.fn();

    render(
      createElement(LevelPath, {
        levels: SPELMODELL_LEVELS,
        selectedLevelId: "level-2",
        onSelect,
      })
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "Level 2" }), { key: "ArrowRight" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Level 2" }), { key: "Home" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Level 2" }), { key: "End" });

    expect(onSelect).toHaveBeenNthCalledWith(1, "level-3");
    expect(onSelect).toHaveBeenNthCalledWith(2, "novis");
    expect(onSelect).toHaveBeenNthCalledWith(3, "advanced");
  });
});

describe("LevelBadge", () => {
  it("maps legacy numeric levels onto the new player ladder labels", () => {
    render(
      createElement(
        Fragment,
        null,
        createElement(LevelBadge, { level: 0 }),
        createElement(LevelBadge, { level: 3 })
      )
    );

    expect(screen.getByText("Novis")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
  });
});
