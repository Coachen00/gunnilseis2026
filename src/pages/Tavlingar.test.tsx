import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Tavlingar from "./Tavlingar";
import { DUMLE_CUP_PLAYERS, rankPlayers } from "@/data/tavlingar";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/tavlingar"]}>
      <Tavlingar />
    </MemoryRouter>
  );

describe("Tävlingar — Dumle CUP (individuell totalräkning)", () => {
  afterEach(cleanup);

  const section = () => {
    renderPage();
    const heading = screen.getByRole("heading", { name: /dumle cup/i });
    const sec = heading.closest("section");
    expect(sec).not.toBeNull();
    return within(sec as HTMLElement);
  };

  it("renderar en rad per spelare — inte lagkort", () => {
    const s = section();
    const rows = s.getAllByRole("row").slice(1); // hoppa över thead-raden
    expect(rows).toHaveLength(DUMLE_CUP_PLAYERS.length);
    expect(s.queryByText(/lag svarta/i)).toBeNull();
    expect(s.queryByText(/lag grön/i)).toBeNull();
  });

  it("spelare som spelade i svarta laget har 14 p och delar förstaplats", () => {
    const s = section();
    const ranked = rankPlayers(DUMLE_CUP_PLAYERS);
    const leaders = ranked.filter((p) => p.rank === 1);
    expect(leaders).toHaveLength(10);
    expect(leaders.every((p) => p.total === 14)).toBe(true);
    // Ali finns exakt en gång (dubbletten borttagen)
    expect(s.getAllByText(/^Ali$/)).toHaveLength(1);
  });

  it("Elias har ingen registrerad poäng och visas med streck", () => {
    const s = section();
    const eliasRow = s.getByText("Elias").closest("tr");
    expect(eliasRow).not.toBeNull();
    expect(within(eliasRow as HTMLElement).getByText("–")).toBeInTheDocument();
  });

  it("data: 20 spelare totalt, 10×14p + 9×8p + Elias utan poäng", () => {
    expect(DUMLE_CUP_PLAYERS).toHaveLength(20);
    expect(DUMLE_CUP_PLAYERS.filter((p) => p.scores[0] === 14)).toHaveLength(10);
    expect(DUMLE_CUP_PLAYERS.filter((p) => p.scores[0] === 8)).toHaveLength(9);
    expect(DUMLE_CUP_PLAYERS.find((p) => p.name === "Elias")?.scores[0]).toBeNull();
  });
});
