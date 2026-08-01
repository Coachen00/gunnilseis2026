import { describe, expect, it } from "vitest";
import { goalMinutes } from "@/components/home/MatchRadar";
import { isPlayed, matchOutcome, SEASON_MATCHES, seasonRecord } from "@/data/season";

const series = SEASON_MATCHES.filter((m) => m.competition === "Division 4A Herr");
const record = seasonRecord(series);

describe("seasonRecord", () => {
  it("räknar bara matcher med resultat", () => {
    expect(record.played.length).toBe(series.filter(isPlayed).length);
    expect(record.wins + record.draws + record.losses).toBe(record.played.length);
  });

  it("sorterar spelade matcher nyast först", () => {
    const dates = record.played.map((m) => new Date(m.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("klassar vinst, oavgjort och förlust", () => {
    expect(matchOutcome({ ...record.played[0], ourScore: 2, theirScore: 1 })).toBe("vinst");
    expect(matchOutcome({ ...record.played[0], ourScore: 1, theirScore: 1 })).toBe("oavgjord");
    expect(matchOutcome({ ...record.played[0], ourScore: 0, theirScore: 1 })).toBe("forlust");
  });
});

/* Matchradarns målminutsdiagram är handinlagd research per 15-minutersfönster.
 * Totalerna MÅSTE stämma med season.ts, annars visar sektionen två olika
 * omfattningar bredvid varandra — precis den tvetydighet den ska undvika. */
describe("målminutsdiagrammet mot season.ts", () => {
  it("summerar till samma seriemål som de spelade matcherna", () => {
    expect(goalMinutes.reduce((sum, b) => sum + b.for, 0)).toBe(record.goalsFor);
    expect(goalMinutes.reduce((sum, b) => sum + b.against, 0)).toBe(record.goalsAgainst);
  });
});
