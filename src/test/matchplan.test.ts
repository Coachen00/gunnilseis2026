import { describe, expect, it } from "vitest";
import {
  CALLED_SQUAD,
  MATCH_META,
  MATCH_PRESENTATION_URL,
  MATCH_SCHEDULE,
  FOCUS,
  COHERENCE,
  FORMATION,
  PRACTICAL_INFO,
  SAMLING_TIME,
  computeSamlingTime,
  kickoffOffset,
  parseKickoffDate,
  MATCH_KICKOFF_DATE,
  MATCH_KICKOFF_ISO,
  PAST_OPPONENT_NAMES,
  resolveWeeklyMatch,
  SEASON_BREAK,
  type MatchMeta,
} from "@/data/matchplan";
import { SQUAD } from "@/data/squad";
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
  it("MATCH_META pekar på veckans match Fässbergs IF (träningsmatch hemma)", () => {
    expect(MATCH_META.opponent).toBe("Fässbergs IF");
    expect(MATCH_META.kickoff).toMatch(/13:00/);
    expect(MATCH_META.venue).toContain("Hjällbovallen");
    expect(MATCH_META.competition).toBe("Träningsmatch");
    expect(MATCH_META.home).toBe(true);
  });

  it("SEASON_BREAK är avstängt när truppen är kallad", () => {
    expect(SEASON_BREAK.active).toBe(false);
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

  it("15 spelare kallade mot Fässberg, Idris fortsatt kapten", () => {
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(15);
    // Inga dubbletter i kallad trupp
    const all = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench];
    expect(new Set(all).size).toBe(all.length);
    // Kaptenen måste vara kallad — annars är rollkortet fel
    expect(all).toContain("Idris Abdi");
    // Minst en målvakt i truppen
    expect(all.some((n) => SQUAD.find((p) => p.name === n)?.position === "GK")).toBe(true);
    expect(PRACTICAL_INFO.responsibilities).toEqual(
      expect.arrayContaining([["Kapten", "Idris Abdi"]])
    );
  });

  it("alla kallade namn finns i truppen (stavning matchar squad.ts)", () => {
    const squadNames = new Set(SQUAD.map((p) => p.name));
    const unknown = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench].filter(
      (n) => !squadNames.has(n)
    );
    expect(unknown).toEqual([]);
  });

  it("SAMLING_TIME är 11:30 för Fässberg (hemma 13:00 → 1h30 före)", () => {
    expect(SAMLING_TIME).toBe("11:30");
  });

  it("MATCH_SCHEDULE härleds ur avspark, inte hardkodade tider", () => {
    const times = MATCH_SCHEDULE.map((s) => s.time);
    expect(times[0]).toBe(SAMLING_TIME);
    expect(times).toContain("12:20 – 12:50"); // aktivering: avspark -40 → -10
    expect(times).toContain("12:50 – 12:57"); // ner + sista instruktion
    expect(times[times.length - 1]).toBe("13:00"); // avspark
    // Byt avspark → schemat följer med
    const kvall: MatchMeta = {
      opponent: "X", venue: "Y", home: true, kickoff: "Fre 18 sep · 19:00",
      competition: "Z", absent: [],
    };
    expect(kickoffOffset(-40, kvall)).toBe("18:20");
    expect(kickoffOffset(0, kvall)).toBe("19:00");
    expect(kickoffOffset(-40, { ...kvall, kickoff: "Söndag · saknar tid" })).toBe("");
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
    // MATCH_META.kickoff (Fässberg 1 aug) ska finnas i settet, lowercase.
    expect(PAST_OPPONENT_NAMES.has("if vardar/makedonija")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kareby is")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("kf velebit")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("ifk björkö")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("hjuviks aik")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("hisingsbacka fc")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("floda boif")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("ytterby is")).toBe(true);
    // Stenkullen (27 juni) ligger före veckans match (Fässberg 1 aug) → past opponent.
    expect(PAST_OPPONENT_NAMES.has("stenkullen goik")).toBe(true);
    // Men INTE Fässberg själv — veckans egna motståndare får aldrig flaggas som stale.
    expect(PAST_OPPONENT_NAMES.has("fässbergs if")).toBe(false);
  });

  it("resolveWeeklyMatch hittar träningsmatchen mot Fässberg (1 aug)", () => {
    const wm = resolveWeeklyMatch();
    expect(wm?.opponent).toBe("Fässbergs IF");
    expect(wm?.id).toBe("2026-08-01-fassbergs");
  });

  it("COHERENCE har förväntade sektioner i ordning", () => {
    const ids = COHERENCE.map((s) => s.id);
    expect(ids).toEqual([
      "forutsattningar",
      "kallad-trupp",
      "forra-match",
      "motstandare",
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

  it("stale Vardar-rad i framtiden blockerar inte veckans match (Fässberg)", () => {
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
    expect(matches[0].opponent).toBe("Fässbergs IF");
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

    expect(matches[0].opponent).toBe("Fässbergs IF");
    expect(matches.some((match) => match.id === "stale-ytterby-jun")).toBe(false);
  });
});
