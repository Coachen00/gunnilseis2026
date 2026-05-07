import { describe, expect, it } from "vitest";
import { MATCH_META, FOCUS, COHERENCE, FORMATION } from "@/data/matchplan";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";

/**
 * Sanity tests för matchplanen.
 *
 * Veckans matchplan är statisk i koden (per beslut 2026-05-07). Testerna
 * låser in:
 * - att MATCH_META är ifylld med riktig motståndare/avspark
 * - att FOCUS har 1-5 punkter
 * - att COHERENCE har förväntade sektions-id (matchar genvägar i sidofältet)
 * - att FORMATION har exakt 11 spelare
 */

describe("matchplan", () => {
  it("MATCH_META har Kareby + avspark + plats", () => {
    expect(MATCH_META.opponent).toBe("Kareby IS");
    expect(MATCH_META.kickoff).toMatch(/19:00/);
    expect(MATCH_META.venue).toBeTruthy();
    expect(MATCH_META.competition).toContain("Division 4A");
  });

  it("FOCUS har 1-5 punkter, var och en är icke-tom", () => {
    expect(FOCUS.length).toBeGreaterThanOrEqual(1);
    expect(FOCUS.length).toBeLessThanOrEqual(5);
    FOCUS.forEach((f) => expect(f.trim().length).toBeGreaterThan(0));
  });

  it("FORMATION har 11 spelare med unika id", () => {
    expect(FORMATION).toHaveLength(11);
    const ids = FORMATION.map((s) => s.id);
    expect(new Set(ids).size).toBe(11);
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "forra-match",
      "kareby",
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
});
