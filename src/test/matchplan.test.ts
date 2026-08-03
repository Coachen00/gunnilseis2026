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
  TRIAL_PLAYERS,
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
  it("MATCH_META pekar på veckans match Partille IF FK (seriematch borta)", () => {
    expect(MATCH_META.opponent).toBe("Partille IF FK");
    expect(MATCH_META.kickoff).toMatch(/15:00/);
    expect(MATCH_META.venue).toContain("Lexby");
    expect(MATCH_META.competition).toBe("Division 4A Herr");
    expect(MATCH_META.home).toBe(false);
  });

  it("SEASON_BREAK är avstängt när serien rullar", () => {
    expect(SEASON_BREAK.active).toBe(false);
    expect(SEASON_BREAK.lastResult).toContain("2–4");
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

  it("kallelsen till Partille är inte satt än — inga stale namn kvar", () => {
    // Kallelsen läggs in när den går ut. Tills dess ska listorna vara tomma
    // så sidan visar "Kallelse kommer" i stället för förra matchens trupp.
    expect(CALLED_SQUAD.starting).toHaveLength(0);
    expect(CALLED_SQUAD.bench).toHaveLength(0);
    expect(PRACTICAL_INFO.responsibilities).toEqual(
      expect.arrayContaining([["Kapten", "Idris Abdi"]])
    );
  });

  it("när en kallelse väl är ifylld är den intern-konsistent", () => {
    const all = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench];
    if (all.length === 0) return;
    // Inga dubbletter i kallad trupp
    expect(new Set(all).size).toBe(all.length);
    // Kaptenen måste vara kallad — annars är rollkortet fel
    expect(all).toContain("Idris Abdi");
    // Minst en målvakt i truppen
    expect(all.some((n) => SQUAD.find((p) => p.name === n)?.position === "GK")).toBe(true);
  });

  it("alla kallade namn finns i truppen eller är registrerade provspelare", () => {
    const squadNames = new Set(SQUAD.map((p) => p.name));
    const unknown = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench].filter(
      (n) => !squadNames.has(n) && !TRIAL_PLAYERS.has(n)
    );
    expect(unknown).toEqual([]);
  });

  it("provspelare står bara i TRIAL_PLAYERS, aldrig i SQUAD", () => {
    // squad.ts speglar Gunnilses egen trupp på svenskalag.se — en inlånad
    // spelare som hamnar där dyker upp på /truppen och i syncen.
    const squadNames = new Set(SQUAD.map((p) => p.name));
    for (const n of TRIAL_PLAYERS) expect(squadNames.has(n)).toBe(false);
    // Och en provspelare som inte längre kallas ska städas bort ur listan —
    // gäller bara när en kallelse faktiskt är ifylld.
    const called = new Set([...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench]);
    if (called.size > 0) {
      for (const n of TRIAL_PLAYERS) expect(called.has(n)).toBe(true);
    }
  });

  it("SAMLING_TIME är 13:30 för Partille (avspark 15:00 → 1h30 före)", () => {
    expect(SAMLING_TIME).toBe("13:30");
  });

  it("MATCH_SCHEDULE härleds ur avspark, inte hardkodade tider", () => {
    const times = MATCH_SCHEDULE.map((s) => s.time);
    expect(times[0]).toBe(SAMLING_TIME);
    expect(times).toContain("14:20 – 14:50"); // aktivering: avspark -40 → -10
    expect(times).toContain("14:50 – 14:57"); // ner + sista instruktion
    expect(times[times.length - 1]).toBe("15:00"); // avspark
    // Byt avspark → schemat följer med
    const kvall: MatchMeta = {
      opponent: "X", venue: "Y", home: true, kickoff: "Fre 18 sep · 19:00",
      competition: "Z", absent: [],
    };
    expect(kickoffOffset(-40, kvall)).toBe("18:20");
    expect(kickoffOffset(0, kvall)).toBe("19:00");
    expect(kickoffOffset(-40, { ...kvall, kickoff: "Söndag · saknar tid" })).toBe("");
  });

  it("computeSamlingTime räknar 1h30 före avspark, hemma som borta", () => {
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
    ).toBe("17:45");
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
    // Stenkullen (27 juni) och Fässberg (1 aug) ligger före veckans match → past opponents.
    expect(PAST_OPPONENT_NAMES.has("stenkullen goik")).toBe(true);
    expect(PAST_OPPONENT_NAMES.has("fässbergs if")).toBe(true);
    // Men INTE Partille själv — veckans egna motståndare får aldrig flaggas som
    // stale, trots vårmötet 18 april.
    expect(PAST_OPPONENT_NAMES.has("partille if fk")).toBe(false);
  });

  it("resolveWeeklyMatch hittar höstpremiären mot Partille (8 aug), inte vårmötet", () => {
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
