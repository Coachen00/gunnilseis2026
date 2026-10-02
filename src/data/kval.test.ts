import { describe, expect, it } from "vitest";
import {
  DIV4A_TABLE,
  KVAL_FORMAT,
  KVAL_GROUPS,
  KVAL_RULES,
  KVAL_SOURCES,
  KVAL_STATUS,
  KVAL_TIMELINE,
  KVAL_VERIFIED,
  kvalStatus,
  OUR_TEAM,
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

  it("kvalplatsen är säkrad: tvåa, trean kan inte komma ikapp", () => {
    expect(KVAL_STATUS.position).toBe(2);
    expect(KVAL_STATUS.secured).toBe(true);
    expect(KVAL_STATUS.remaining).toBe(1);
  });

  it("kvalStatus säger INTE säkrad när trean fortfarande kan nå oss", () => {
    const table = DIV4A_TABLE.map((r) =>
      r.team === "KF Velebit" ? { ...r, points: 41 } : r
    );
    expect(kvalStatus(table).secured).toBe(false);
  });
});

describe("kval — formatet", () => {
  it("är fastställt: 12 grupper om 4, 36 div 4-lag, tre omgångar", () => {
    expect(KVAL_FORMAT.groups).toBe(12);
    expect(KVAL_FORMAT.teamsPerGroup).toBe(4);
    expect(KVAL_FORMAT.teamsFromDiv4).toBe(36);
    expect(KVAL_FORMAT.steps).toHaveLength(3);
    expect(KVAL_FORMAT.schedule).toHaveLength(3);
    KVAL_FORMAT.schedule.forEach((r) => expect(r.matches).toHaveLength(2));
  });

  it("Göteborg har lag i exakt två grupper med fyra platser vardera", () => {
    expect(KVAL_GROUPS.map((g) => g.id)).toEqual(["grupp-8", "grupp-9"]);
    KVAL_GROUPS.forEach((g) => {
      expect(g.slots).toHaveLength(4);
      expect(g.slots).toContain("Göteborg");
      expect(g.candidates.length).toBeGreaterThan(0);
      g.candidates.forEach((c) => expect(c.status.trim().length).toBeGreaterThan(0));
    });
  });
});

describe("kval — tidslinje och regler", () => {
  it("tidslinjen börjar med vår sista seriematch och slutar med kvalet", () => {
    const matches = KVAL_TIMELINE.filter((m) => m.kind === "match");
    expect(matches.map((m) => m.title)).toEqual(["Floda BoIF borta"]);
    expect(KVAL_TIMELINE.at(-1)?.kind).toBe("kval");
    expect(KVAL_TIMELINE.at(-1)?.date).toBe(KVAL_FORMAT.window.replace(" oktober", " okt"));
  });

  it("regler och källor är ifyllda, verifieringsdatum är satt", () => {
    expect(KVAL_RULES.length).toBeGreaterThanOrEqual(4);
    expect(KVAL_SOURCES.length).toBeGreaterThanOrEqual(3);
    KVAL_SOURCES.forEach((s) => expect(s.url).toMatch(/^https:\/\//));
    expect(KVAL_VERIFIED).toMatch(/^2026-\d{2}-\d{2}$/);
  });
});
