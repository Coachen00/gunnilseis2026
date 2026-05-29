import { describe, expect, it } from "vitest";
import { CALLED_SQUAD, MATCH_META, MATCH_PRESENTATION_URL, FOCUS, COHERENCE, FORMATION, PRACTICAL_INFO, SAMLING_TIME, computeSamlingTime } from "@/data/matchplan";
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
 * - att FORMATION inte råkar visa föregående match när startelvan saknas
 */

describe("matchplan", () => {
  it("MATCH_META har Hjuviks AIK + avspark + plats", () => {
    expect(MATCH_META.opponent).toBe("Hjuviks AIK");
    expect(MATCH_META.kickoff).toMatch(/13:00/);
    expect(MATCH_META.venue).toContain("Hjällbovallen");
    expect(MATCH_META.competition).toContain("Division 4A");
    expect(MATCH_META.home).toBe(true);
  });

  it("veckans match har redigerbar presentationslänk", () => {
    expect(MATCH_PRESENTATION_URL).toContain("claude.ai/design/p/");
    expect(MATCH_PRESENTATION_URL).toContain("Matchgenomg");
  });

  it("FOCUS har 1-5 punkter, var och en är icke-tom", () => {
    expect(FOCUS.length).toBeGreaterThanOrEqual(1);
    expect(FOCUS.length).toBeLessThanOrEqual(5);
    FOCUS.forEach((f) => expect(f.trim().length).toBeGreaterThan(0));
  });

  it("FORMATION är tom tills Hjuviks-startelvan är satt", () => {
    expect(FORMATION).toHaveLength(0);
    const ids = FORMATION.map((s) => s.id);
    expect(new Set(ids).size).toBe(FORMATION.length);
  });

  it("kallad trupp är 16 spelare för Hjuviks och Ado är kapten", () => {
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(16);
    expect(CALLED_SQUAD.bench).toEqual(
      expect.arrayContaining(["Ali Carneil", "Pascal Jabbour", "Leodon Johansson", "Yosef Ismail"])
    );
    expect(PRACTICAL_INFO.responsibilities).toEqual(
      expect.arrayContaining([["Kapten", "Ado"]])
    );
  });

  it("SAMLING_TIME är 11:30 för Hjuviks (hemma 13:00 → 1h30 före)", () => {
    expect(SAMLING_TIME).toBe("11:30");
  });

  it("computeSamlingTime räknar 1h30 hemma och 1h45 borta", () => {
    expect(
      computeSamlingTime({
        opponent: "X",
        venue: "Y",
        home: true,
        kickoff: "Lör 30 maj · 13:00",
        competition: "Z",
        absent: [],
      })
    ).toBe("11:30");
    expect(
      computeSamlingTime({
        opponent: "X",
        venue: "Y",
        home: false,
        kickoff: "Fre 22 maj · 19:15",
        competition: "Z",
        absent: [],
      })
    ).toBe("17:30");
    expect(
      computeSamlingTime({
        opponent: "X",
        venue: "Y",
        home: true,
        kickoff: "Söndag · saknar tid",
        competition: "Z",
        absent: [],
      })
    ).toBe("Se kallelse");
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "kallad-trupp",
      "forra-match",
      "hjuviks",
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

  it("stale Vardar-rad i framtiden blockerar inte Hjuviks som veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-vardar",
          date: "2026-05-29T12:00:00+02:00",
          opponent: "IF Vardar/Makedonija",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Generatorsplan",
        },
      ],
      new Date("2026-05-27T12:00:00+02:00")
    );

    expect(matches.some((match) => match.id === "stale-vardar")).toBe(false);
    expect(matches[0].opponent).toBe("Hjuviks AIK");
  });

  it("en felaktig match före Hjuviks blockerar inte veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-ytterby-may",
          date: "2026-05-28T20:15:00+02:00",
          opponent: "Ytterby IS",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Ytterns IP 1 Konstgräs",
        },
      ],
      new Date("2026-05-27T12:00:00+02:00")
    );

    expect(matches[0].opponent).toBe("Hjuviks AIK");
    expect(matches.some((match) => match.id === "stale-ytterby-may")).toBe(false);
  });
});
