import { describe, expect, it } from "vitest";
import {
  PLAN_LEVELS,
  ROLE_PLANS,
  TRAINING_WEEKS,
  getRoleForPlayer,
  getSchedule,
  type TrainingRole,
} from "./individualTraining";

describe("individual training model", () => {
  it("defines four progressive weeks with volume, speed and guidance", () => {
    expect(TRAINING_WEEKS).toHaveLength(4);
    expect(TRAINING_WEEKS.map((week) => week.id)).toEqual([1, 2, 3, 4]);
    expect(TRAINING_WEEKS.every((week) =>
      week.label && week.volumeRange && week.speedTarget && week.guidance,
    )).toBe(true);
    expect(TRAINING_WEEKS.map((week) => week.speedTarget)).toEqual([
      "85–90 %",
      "90–92 %",
      "92–95 %",
      "95–97 %",
    ]);
  });

  it("uses neutral plan-level names", () => {
    expect(PLAN_LEVELS.map((level) => level.label)).toEqual([
      "Full plan",
      "Underhåll",
      "Minsta effektiva dos",
    ]);
    expect(JSON.stringify(PLAN_LEVELS).toLowerCase()).not.toMatch(
      /lat|svag|dålig|maxnära|nära max/,
    );
  });

  it.each(Object.keys(ROLE_PLANS) as TrainingRole[])(
    "keeps the full %s plan within the weekly load contract",
    (role) => {
      const schedule = getSchedule(role, "full", 1);
      const trainingDays = new Set(
        schedule.filter((item) => item.sessionType !== "recovery" && item.sessionType !== "rest")
          .map((item) => item.day),
      );
      const strength = schedule.filter((item) => item.sessionType === "strength");
      const sprint = schedule.filter((item) => item.sessionType === "sprint");

      expect(trainingDays.size).toBeLessThanOrEqual(5);
      expect(schedule.some((item) => item.sessionType === "rest")).toBe(true);
      expect(strength.map((item) => item.day)).toEqual(["Måndag", "Fredag"]);
      expect(sprint).toHaveLength(2);
      expect(sprint.map((item) => item.dose)).toEqual(ROLE_PLANS[role].sprintDoses);
    },
  );

  it("places strength sessions 48–72 hours apart", () => {
    const strengthDays = getSchedule("midfielder", "full", 1)
      .filter((item) => item.sessionType === "strength")
      .map((item) => item.day);
    expect(strengthDays).toEqual(["Måndag", "Fredag"]);
  });

  it("adds a stop rule to every high-intensity item", () => {
    const highIntensity = getSchedule("forward", "full", 4)
      .filter((item) => item.intensity === "high");
    expect(highIntensity.length).toBeGreaterThan(0);
    expect(highIntensity.every((item) => item.stopRule.trim().length > 0)).toBe(true);
  });

  it("uses the prescribed days for maintenance and minimum plans", () => {
    expect(new Set(getSchedule("defender", "maintenance", 2).map((item) => item.day)))
      .toEqual(new Set(["Måndag", "Onsdag", "Fredag"]));
    const minimum = getSchedule("defender", "minimum", 2);
    expect(minimum.filter((item) => item.sessionType === "strength")).toHaveLength(2);
    expect(minimum.filter((item) => item.sessionType === "conditioning")).toHaveLength(2);
  });

  it("maps player positions to training roles", () => {
    expect(getRoleForPlayer({ name: "A", position: "GK" })).toBe("goalkeeper");
    expect(getRoleForPlayer({ name: "B", position: "DEF" })).toBe("defender");
    expect(getRoleForPlayer({ name: "C", position: "MID" })).toBe("midfielder");
    expect(getRoleForPlayer({ name: "D", position: "FWD" })).toBe("forward");
  });
});
