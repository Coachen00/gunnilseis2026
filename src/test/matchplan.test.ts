import { describe, expect, it } from "vitest";
import {
  CALLED_SQUAD,
  MATCH_META,
  MATCH_PRESENTATION_URL,
  FOCUS,
  COHERENCE,
  FORMATION,
  PRACTICAL_INFO,
  SAMLING_TIME,
  computeSamlingTime,
  parseKickoffDate,
  MATCH_KICKOFF_DATE,
  MATCH_KICKOFF_ISO,
  PAST_OPPONENT_NAMES,
} from "@/data/matchplan";
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
  it("MATCH_META har Floda BoIF + avspark + plats", () => {
    expect(MATCH_META.opponent).toBe("Floda BoIF");
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

  it("FORMATION är tom tills Floda-startelvan är satt", () => {
    expect(FORMATION).toHaveLength(0);
    const ids = FORMATION.map((s) => s.id);
    expect(new Set(ids).size).toBe(FORMATION.length);
  });

  it("kallad trupp: ej spikad — tom tills kallelsen är satt", () => {
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(0);
    expect(PRACTICAL_INFO.responsibilities).toEqual(
      expect.arrayContaining([["Kapten", "Bekräftas i kallelse"]])
    );
  });

  it("SAMLING_TIME är 11:30 för Floda (hemma 13:00 → 1h30 före)", () => {
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

  it("parseKickoffDate parsar svenska kickoff-strängar korrekt", () => {
    const d = parseKickoffDate(
      { opponent: "X", venue: "Y", home: true, kickoff: "Lör 30 maj · 13:00", competition: "Z", absent: [] },
      2026
    );
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(4); // maj = index 4
    expect(d?.getDate()).toBe(30);
    expect(d?.getHours()).toBe(13);
    expect(d?.getMinutes()).toBe(0);
  });

  it("parseKickoffDate returnerar null för osparbara strängar", () => {
    expect(
      parseKickoffDate(
        { opponent: "X", venue: "Y", home: true, kickoff: "Söndag · saknar tid", competition: "Z", absent: [] },
        2026
      )
    ).toBeNull();
    expect(
      parseKickoffDate(
        { opponent: "X", venue: "Y", home: true, kickoff: "5 xyz · 13:00", competition: "Z", absent: [] },
        2026
      )
    ).toBeNull();
  });

  it("MATCH_KICKOFF_DATE och MATCH_KICKOFF_ISO är härledda från MATCH_META", () => {
    expect(MATCH_KICKOFF_DATE).not.toBeNull();
    expect(MATCH_KICKOFF_ISO).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    // Robust check: sträng-formen ska representera samma datum som Date-formen
    expect(new Date(MATCH_KICKOFF_ISO).getTime()).toBe(MATCH_KICKOFF_DATE!.getTime());
  });

  it("PAST_OPPONENT_NAMES innehåller alla motståndare med matchdatum före veckans match", () => {
    // Inga manuella listor — alla matcher i SEASON_MATCHES med datum före
    // MATCH_META.kickoff ska finnas i settet, lowercase.
    expect(PAST_OPPONENT_NAMES.has("if vardar/makedonija")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kareby is")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kf velebit")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("ifk björkö")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("hjuviks aik")).toBe(true);
    // Hisingsbacka (5 juni) ligger nu före veckans match (13 juni) → past opponent.
    expect(PAST_OPPONENT_NAMES.has("hisingsbacka fc")).toBe(true);
    // Och INTE Floda själv (det är veckans match) eller framtida motståndare
    expect(PAST_OPPONENT_NAMES.has("floda boif")).toBe(false);
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "kallad-trupp",
      "forra-match",
      "floda",
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

  it("stale Vardar-rad i framtiden blockerar inte Floda som veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-vardar",
          date: "2026-06-03T12:00:00+02:00",
          opponent: "IF Vardar/Makedonija",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Generatorsplan",
        },
      ],
      new Date("2026-06-01T12:00:00+02:00")
    );

    expect(matches.some((match) => match.id === "stale-vardar")).toBe(false);
    expect(matches[0].opponent).toBe("Floda BoIF");
  });

  it("en felaktig match före Floda blockerar inte veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-ytterby-jun",
          date: "2026-06-04T20:15:00+02:00",
          opponent: "Ytterby IS",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Ytterns IP 1 Konstgräs",
        },
      ],
      new Date("2026-06-01T12:00:00+02:00")
    );

    expect(matches[0].opponent).toBe("Floda BoIF");
    expect(matches.some((match) => match.id === "stale-ytterby-jun")).toBe(false);
  });
});
