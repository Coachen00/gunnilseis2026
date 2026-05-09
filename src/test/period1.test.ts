import { describe, expect, it } from "vitest";
import {
  PERIOD_1,
  PERIOD_1_PRINCIPLES,
  PERIOD_1_REFERENCES,
  PERIOD_1_TIMELINE,
  aggregateCommonErrors,
  aggregateCues,
  aggregateKpis,
  totalSessions,
} from "@/data/period1";

describe("Period 1 — datamodellens grundstruktur", () => {
  it("har exakt 6 veckor", () => {
    expect(PERIOD_1.weeks).toHaveLength(6);
  });

  it("har exakt 3 pass per vecka", () => {
    for (const week of PERIOD_1.weeks) {
      expect(week.sessions).toHaveLength(3);
    }
  });

  it("har totalt exakt 18 pass", () => {
    expect(totalSessions(PERIOD_1)).toBe(18);
  });

  it("varje pass går mån/ons/tor i ordning", () => {
    for (const week of PERIOD_1.weeks) {
      expect(week.sessions.map((s) => s.day)).toEqual(["Måndag", "Onsdag", "Torsdag"]);
    }
  });

  it("varje pass har de 4 obligatoriska blocken", () => {
    for (const week of PERIOD_1.weeks) {
      for (const session of week.sessions) {
        expect(session.activation.length).toBeGreaterThan(0);
        expect(session.exercise1.length).toBeGreaterThan(0);
        expect(session.exercise2.length).toBeGreaterThan(0);
        expect(session.game.length).toBeGreaterThan(0);
      }
    }
  });

  it("varje vecka har en KPI och tema", () => {
    for (const week of PERIOD_1.weeks) {
      expect(week.kpi.length).toBeGreaterThan(0);
      expect(week.theme.length).toBeGreaterThan(0);
      expect(week.learningGoal.length).toBeGreaterThan(0);
    }
  });

  it("effektlogik har 4 block i rätt ordning: Resurser → Aktiviteter → Mål → Effekt", () => {
    expect(PERIOD_1.effectLogic.map((b) => b.label)).toEqual([
      "Resurser",
      "Aktiviteter",
      "Mål",
      "Effekt",
    ]);
    for (const block of PERIOD_1.effectLogic) {
      expect(block.items.length).toBeGreaterThan(0);
    }
  });

  it("timeline matchar veckonumren", () => {
    expect(PERIOD_1_TIMELINE.map((t) => t.week)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("uppföljning 22/6–1/7 finns med", () => {
    expect(PERIOD_1.followUp.dateRange).toBe("22/6–1/7");
    expect(PERIOD_1.followUp.bullets.length).toBeGreaterThan(0);
    expect(PERIOD_1.followUp.selfRating.length).toBeGreaterThanOrEqual(5);
  });

  it("detaljrouten är /period/1", () => {
    expect(PERIOD_1.detailRoute).toBe("/period/1");
  });

  it("har 10 principer med childFriendly + detail + grafik", () => {
    expect(PERIOD_1_PRINCIPLES).toHaveLength(10);
    for (const p of PERIOD_1_PRINCIPLES) {
      expect(p.childFriendly.length).toBeGreaterThan(0);
      expect(p.detail.length).toBeGreaterThan(0);
      expect(p.slug.length).toBeGreaterThan(0);
    }
  });

  it("har 3 inspirationskällor (Bødø/City/GAIS)", () => {
    expect(PERIOD_1_REFERENCES).toHaveLength(3);
    expect(PERIOD_1_REFERENCES.map((r) => r.team)).toEqual([
      "Bodø/Glimt",
      "Manchester City",
      "GAIS",
    ]);
  });

  it("aggregateKpis returnerar 6 KPIs i veckoordning", () => {
    const kpis = aggregateKpis(PERIOD_1);
    expect(kpis).toHaveLength(6);
    expect(kpis.map((k) => k.week)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("aggregateCues + aggregateCommonErrors returnerar unika sorterade listor", () => {
    const cues = aggregateCues(PERIOD_1);
    const errors = aggregateCommonErrors(PERIOD_1);
    expect(cues.length).toBeGreaterThan(0);
    expect(errors.length).toBeGreaterThan(0);
    expect(new Set(cues).size).toBe(cues.length);
    expect(new Set(errors).size).toBe(errors.length);
  });
});
