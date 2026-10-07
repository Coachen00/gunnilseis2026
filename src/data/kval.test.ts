import { describe, expect, it } from "vitest";
import {
  BERGDALEN_AWAY,
  BERGDALEN_AWAY_STREAK,
  BERGDALEN_FORM,
  BERGDALEN_HOME,
  BERGDALEN_MATCHES,
  DIV4A_TABLE,
  KVAL_FIXTURES,
  KVAL_RULES,
  KVAL_SOURCES,
  KVAL_STATUS,
  KVAL_TEAMS,
  KVAL_TIEBREAK,
  KVAL_VERIFIED,
  kvalStatus,
  OUR_FIXTURES,
  OUR_TEAM,
  pointsPerMatch,
  splitRecord,
} from "./kval";
import { SEASON_MATCHES, seasonRecord } from "./season";

describe("kval — tabellen", () => {
  it("har 12 lag i placeringsordning med giltiga poäng", () => {
    expect(DIV4A_TABLE).toHaveLength(12);
    DIV4A_TABLE.forEach((r, i) => {
      expect(r.pos).toBe(i + 1);
      expect(r.won + r.drawn + r.lost).toBe(r.played);
      expect(r.won * 3 + r.drawn).toBe(r.points);
    });
    for (let i = 1; i < DIV4A_TABLE.length; i++) {
      expect(DIV4A_TABLE[i - 1].points).toBeGreaterThanOrEqual(DIV4A_TABLE[i].points);
    }
  });

  it("stämmer med season.ts för Gunnilse", () => {
    // Tabellraden och matchlistan är två källor för samma sak — de får inte glida isär.
    const rec = seasonRecord(SEASON_MATCHES.filter((m) => m.competition === "Division 4A Herr"));
    const us = DIV4A_TABLE.find((r) => r.team === OUR_TEAM)!;
    expect(us.played).toBe(rec.played.length);
    expect(us.won).toBe(rec.wins);
    expect(us.drawn).toBe(rec.draws);
    expect(us.lost).toBe(rec.losses);
    expect(us.goalsFor).toBe(rec.goalsFor);
    expect(us.goalsAgainst).toBe(rec.goalsAgainst);
  });

  it("serien är färdigspelad: tvåa, säkrad", () => {
    expect(KVAL_STATUS.position).toBe(2);
    expect(KVAL_STATUS.secured).toBe(true);
    expect(KVAL_STATUS.remaining).toBe(0);
  });

  it("kvalStatus säger INTE säkrad när trean fortfarande kan nå oss", () => {
    const table = DIV4A_TABLE.map((r) => (r.team === "Hjuviks AIK" ? { ...r, played: 21, points: 44 } : r));
    expect(kvalStatus(table).secured).toBe(false);
  });
});

describe("kval — grupp 9", () => {
  it("fyra lag med giltiga facit, sorterade på poäng per match", () => {
    expect(KVAL_TEAMS).toHaveLength(4);
    KVAL_TEAMS.forEach((t) => {
      expect(t.won + t.drawn + t.lost).toBe(t.played);
      expect(t.won * 3 + t.drawn).toBe(t.points);
    });
    const ppm = KVAL_TEAMS.map(pointsPerMatch);
    expect([...ppm].sort((a, b) => b - a)).toEqual(ppm);
  });

  it("bästa kvallag och div 3-laget har två hemmamatcher — stämmer med spelordningen", () => {
    KVAL_TEAMS.forEach((t) => {
      const homes = KVAL_FIXTURES.filter((f) => f.home === t.team).length;
      expect(homes).toBe(t.homeGames);
    });
  });

  it("alla möter alla en gång, två matcher per omgång", () => {
    expect(KVAL_FIXTURES).toHaveLength(6);
    const pairs = new Set(KVAL_FIXTURES.map((f) => [f.home, f.away].sort().join("|")));
    expect(pairs.size).toBe(6);
    [1, 2, 3].forEach((r) => expect(KVAL_FIXTURES.filter((f) => f.round === r)).toHaveLength(2));
  });

  it("våra tre matcher har datum, tid och plan; bara en hemma", () => {
    expect(OUR_FIXTURES).toHaveLength(3);
    OUR_FIXTURES.forEach((f) => {
      expect(f.date).toBeTruthy();
      expect(f.kickoff).toMatch(/^\d{2}:\d{2}$/);
      expect(f.venue).toBeTruthy();
    });
    expect(OUR_FIXTURES.filter((f) => f.home === OUR_TEAM)).toHaveLength(1);
  });
});

describe("kval — Bergdalens IK", () => {
  it("22 matcher som summerar till sluttabellen: 7–3–12, 38–60, 24 p", () => {
    expect(BERGDALEN_MATCHES).toHaveLength(22);
    const all = splitRecord(BERGDALEN_MATCHES);
    expect([all.won, all.drawn, all.lost, all.gf, all.ga, all.points]).toEqual([7, 3, 12, 38, 60, 24]);
    const team = KVAL_TEAMS.find((t) => t.team === "Bergdalens IK")!;
    expect(all.points).toBe(team.points);
  });

  it("hemma 6–1–4 (22–21), borta 1–2–8 (16–39)", () => {
    expect([BERGDALEN_HOME.won, BERGDALEN_HOME.drawn, BERGDALEN_HOME.lost, BERGDALEN_HOME.gf, BERGDALEN_HOME.ga]).toEqual([6, 1, 4, 22, 21]);
    expect([BERGDALEN_AWAY.won, BERGDALEN_AWAY.drawn, BERGDALEN_AWAY.lost, BERGDALEN_AWAY.gf, BERGDALEN_AWAY.ga]).toEqual([1, 2, 8, 16, 39]);
  });

  it("nio bortamatcher utan seger sedan 18 april: 0–1–8, 8–36", () => {
    const s = BERGDALEN_AWAY_STREAK;
    expect([s.played, s.won, s.drawn, s.lost, s.gf, s.ga]).toEqual([9, 0, 1, 8, 8, 36]);
  });

  it("formen är de sex sista matcherna", () => {
    expect(BERGDALEN_FORM).toHaveLength(6);
    expect(BERGDALEN_FORM.at(-1)?.opponent).toBe("Uddevalla");
  });
});

describe("kval — regler och källor", () => {
  it("är ifyllda, verifieringsdatum är satt", () => {
    expect(KVAL_TIEBREAK[0]).toBe("Målskillnad");
    expect(KVAL_RULES.length).toBeGreaterThanOrEqual(3);
    expect(KVAL_SOURCES.length).toBeGreaterThanOrEqual(3);
    KVAL_SOURCES.forEach((s) => expect(s.url).toMatch(/^https:\/\//));
    expect(KVAL_VERIFIED).toMatch(/^2026-\d{2}-\d{2}$/);
  });
});
