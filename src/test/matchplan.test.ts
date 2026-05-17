import { describe, expect, it } from "vitest";
import { CALLED_SQUAD, MATCH_META, FOCUS, COHERENCE, FORMATION } from "@/data/matchplan";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";
import { ensureWeeklyMatch } from "@/hooks/useSeasonMatches";

/**
 * Sanity tests för matchplanen.
 *
 * Veckans matchplan är statisk i koden (per beslut 2026-05-07). Testerna
 * låser in:
 * - att MATCH_META är ifylld med riktig motståndare/avspark
 * - att FOCUS har 1-5 punkter
 * - att COHERENCE har förväntade sektions-id (matchar genvägar i sidofältet)
 * - att FORMATION/kallad trupp inte råkar visa föregående match när kallelsen saknas
 */

describe("matchplan", () => {
  it("MATCH_META har Ytterby IS + avspark + plats", () => {
    expect(MATCH_META.opponent).toBe("Ytterby IS");
    expect(MATCH_META.kickoff).toMatch(/20:15/);
    expect(MATCH_META.venue).toContain("Ytterns IP");
    expect(MATCH_META.competition).toContain("Division 4A");
  });

  it("FOCUS har 1-5 punkter, var och en är icke-tom", () => {
    expect(FOCUS.length).toBeGreaterThanOrEqual(1);
    expect(FOCUS.length).toBeLessThanOrEqual(5);
    FOCUS.forEach((f) => expect(f.trim().length).toBeGreaterThan(0));
  });

  it("FORMATION är tom tills Ytterby-kallelsen är satt", () => {
    expect(FORMATION).toHaveLength(0);
    const ids = FORMATION.map((s) => s.id);
    expect(new Set(ids).size).toBe(FORMATION.length);
  });

  it("kallad trupp är inte återanvänd från Björkö-matchen", () => {
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(0);
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "kallad-trupp",
      "forra-match",
      "ytterby",
      "identitet",
      "anfall",
      "forsvar",
      "omst-forsvar",
      "omst-anfall",
      "fasta",
      "roller",
    ]);
  });

  it("anfall-sektionen i matchplanen listar de 5 anfallsprinciperna", () => {
    const anfall = COHERENCE.find((s) => s.id === "anfall");
    expect(anfall).toBeTruthy();
    expect(anfall?.bullets?.length).toBe(ATTACKING_PRINCIPLES.length);
  });

  it("gammal kommande Björkö-rad kan inte ersätta Ytterby som veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-bjorko",
          date: "2026-05-19T12:00:00+02:00",
          opponent: "IFK Björkö",
          homeAway: "home",
          competition: "Division 4A Herr",
          venue: "Hjällbovallen 1 Gräs",
        },
      ],
      new Date("2026-05-17T12:00:00+02:00")
    );

    expect(matches.some((match) => match.opponent === "IFK Björkö")).toBe(false);
    expect(matches[0].opponent).toBe("Ytterby IS");
  });
});
