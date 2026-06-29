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
  resolveWeeklyMatch,
  SEASON_BREAK,
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
  it("MATCH_META pekar på nästa match Partille IF FK (höstpremiär borta) under uppehållet", () => {
    expect(MATCH_META.opponent).toBe("Partille IF FK");
    expect(MATCH_META.kickoff).toMatch(/15:00/);
    expect(MATCH_META.venue).toContain("Lexby");
    expect(MATCH_META.competition).toContain("Division 4A");
    expect(MATCH_META.home).toBe(false);
  });

  it("SEASON_BREAK är aktivt under sommaruppehållet", () => {
    expect(SEASON_BREAK.active).toBe(true);
    expect(SEASON_BREAK.lastResult).toContain("6–0");
    expect(SEASON_BREAK.trainingResumes).toMatch(/28 juli/);
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

  it("FORMATION är tom tills en startelva spikas (ingen XI utsatt)", () => {
    expect(FORMATION).toHaveLength(0);
    // Formationsplan får aldrig visas utan utsatt startelva
    expect(FORMATION.length).toBe(CALLED_SQUAD.starting.length);
  });

  it("ingen trupp kallad under uppehållet, Idris fortsatt kapten", () => {
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(0);
    // Inga dubbletter i kallad trupp
    const all = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench];
    expect(new Set(all).size).toBe(all.length);
    expect(PRACTICAL_INFO.responsibilities).toEqual(
      expect.arrayContaining([["Kapten", "Idris Abdi"]])
    );
  });

  it("SAMLING_TIME är 13:15 för Partille (borta 15:00 → 1h45 före)", () => {
    expect(SAMLING_TIME).toBe("13:15");
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
    // MATCH_META.kickoff (Partille 8 aug) ska finnas i settet, lowercase.
    expect(PAST_OPPONENT_NAMES.has("if vardar/makedonija")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kareby is")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kf velebit")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("ifk björkö")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("hjuviks aik")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("hisingsbacka fc")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("floda boif")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("ytterby is")).toBe(true);
    // Stenkullen (27 juni) ligger nu före veckans match (Partille 8 aug) → past opponent.
    expect(PAST_OPPONENT_NAMES.has("stenkullen goik")).toBe(true);
    // Men INTE Partille själv — trots att vi mötte dem hemma i premiären (18 apr).
    // Veckans egna motståndare får aldrig flaggas som stale.
    expect(PAST_OPPONENT_NAMES.has("partille if fk")).toBe(false);
  });

  it("resolveWeeklyMatch väljer höstpremiären mot Partille (8 aug), inte premiären (18 apr)", () => {
    const wm = resolveWeeklyMatch();
    expect(wm?.opponent).toBe("Partille IF FK");
    expect(wm?.id).toBe("2026-08-08-partille");
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "kallad-trupp",
      "forra-match",
      "partille",
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

  it("stale Vardar-rad i framtiden blockerar inte veckans match (Partille)", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-vardar",
          date: "2026-06-24T12:00:00+02:00",
          opponent: "IF Vardar/Makedonija",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Generatorsplan",
        },
      ],
      new Date("2026-06-20T12:00:00+02:00")
    );

    expect(matches.some((match) => match.id === "stale-vardar")).toBe(false);
    expect(matches[0].opponent).toBe("Partille IF FK");
  });

  it("en stale Ytterby-rad efter att matchen spelats blockerar inte veckans match", () => {
    const matches = ensureWeeklyMatch(
      [
        {
          id: "stale-ytterby-jun",
          date: "2026-06-24T13:00:00+02:00",
          opponent: "Ytterby IS",
          homeAway: "away",
          competition: "Division 4A Herr",
          venue: "Ytterns IP 1 Konstgräs",
        },
      ],
      new Date("2026-06-20T12:00:00+02:00")
    );

    expect(matches[0].opponent).toBe("Partille IF FK");
    expect(matches.some((match) => match.id === "stale-ytterby-jun")).toBe(false);
  });
});
