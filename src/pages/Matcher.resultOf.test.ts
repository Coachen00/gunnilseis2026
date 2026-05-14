import { describe, expect, it } from "vitest";
import { resultOf } from "./Matcher";
import type { SeasonMatch } from "@/data/season";

const baseMatch: SeasonMatch = {
  id: "test-1",
  date: "2026-05-08T19:00:00",
  opponent: "Test FC",
  competition: "Division 4",
  homeAway: "home",
  venue: "Hemmaplan",
};

describe("resultOf", () => {
  it("returnerar null när vårt mål saknas", () => {
    expect(resultOf({ ...baseMatch, theirScore: 1 })).toBeNull();
  });

  it("returnerar null när motståndarens mål saknas", () => {
    expect(resultOf({ ...baseMatch, ourScore: 1 })).toBeNull();
  });

  it("returnerar null när båda mål saknas", () => {
    expect(resultOf(baseMatch)).toBeNull();
  });

  it("klassar 3-1 som vinst (W)", () => {
    expect(resultOf({ ...baseMatch, ourScore: 3, theirScore: 1 })).toEqual({
      outcome: "W",
      us: 3,
      them: 1,
    });
  });

  it("klassar 1-3 som förlust (L)", () => {
    expect(resultOf({ ...baseMatch, ourScore: 1, theirScore: 3 })).toEqual({
      outcome: "L",
      us: 1,
      them: 3,
    });
  });

  it("klassar 2-2 som oavgjort (D)", () => {
    expect(resultOf({ ...baseMatch, ourScore: 2, theirScore: 2 })).toEqual({
      outcome: "D",
      us: 2,
      them: 2,
    });
  });

  it("klassar 0-0 som oavgjort (D)", () => {
    expect(resultOf({ ...baseMatch, ourScore: 0, theirScore: 0 })).toEqual({
      outcome: "D",
      us: 0,
      them: 0,
    });
  });
});
