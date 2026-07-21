import { describe, expect, it } from "vitest";
import { totalSessions } from "./period1";
import { PERIOD_2, PERIOD_2_TIMELINE } from "./period2";

const EXPECTED_DATES = [
  "3/8",
  "5/8",
  "6/8",
  "10/8",
  "12/8",
  "13/8",
  "17/8",
  "19/8",
  "20/8",
  "24/8",
  "26/8",
  "27/8",
  "31/8",
  "2/9",
  "3/9",
  "7/9",
  "9/9",
  "10/9",
];

describe("Period 2 – Vinna bollen och slå till", () => {
  it("har id och detailRoute enligt spec", () => {
    expect(PERIOD_2.id).toBe("period-2");
    expect(PERIOD_2.detailRoute).toBe("/period/2");
  });

  it("har 6 veckor med 18 pass totalt", () => {
    expect(PERIOD_2.weeks).toHaveLength(6);
    expect(totalSessions(PERIOD_2)).toBe(18);
  });

  it("har unika veckonummer 1–6", () => {
    expect(PERIOD_2.weeks.map((w) => w.weekNumber)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("varje vecka följer dag-sekvensen Måndag/Onsdag/Torsdag", () => {
    for (const week of PERIOD_2.weeks) {
      expect(week.sessions.map((s) => s.day)).toEqual(["Måndag", "Onsdag", "Torsdag"]);
    }
  });

  it("datumen matchar exakt höstplanens veckostarter", () => {
    const dates = PERIOD_2.weeks.flatMap((w) => w.sessions.map((s) => s.date));
    expect(dates).toEqual(EXPECTED_DATES);
  });

  it("alla kpi-fält är ifyllda på vecko- och passnivå", () => {
    for (const week of PERIOD_2.weeks) {
      expect(week.kpi.length).toBeGreaterThan(0);
      for (const session of week.sessions) {
        expect(session.kpi.length).toBeGreaterThan(0);
      }
    }
  });

  it("alla pass har minst en coaching cue", () => {
    for (const week of PERIOD_2.weeks) {
      for (const session of week.sessions) {
        expect(session.coachingCues.length).toBeGreaterThan(0);
      }
    }
  });

  it("PERIOD_2_TIMELINE har 6 poster i veckoordning", () => {
    expect(PERIOD_2_TIMELINE).toHaveLength(6);
    expect(PERIOD_2_TIMELINE.map((t) => t.week)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
