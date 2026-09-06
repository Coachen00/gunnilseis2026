import { describe, expect, it } from "vitest";
import { remainingMatches, SEASON_MATCHES } from "@/data/season";
import { remainingTrainings, TRAINING_SCHEDULE } from "@/data/teamCalendar";

describe("kvar av säsongen (startsidan)", () => {
  const now = new Date("2026-09-06T12:00:00+02:00");

  it("räknar träningar efter idag ur kalendern", () => {
    const t = remainingTrainings(now);
    expect(t).toHaveLength(12);
    expect(t[0].id).toBe("training-2026-09-07");
    expect(t[t.length - 1].id).toBe("training-2026-10-01");
  });

  it("räknar matcher efter idag, sista är Floda borta 4 okt", () => {
    const m = remainingMatches(SEASON_MATCHES, now);
    expect(m).toHaveLength(4);
    expect(m[0].id).toBe("2026-09-12-vardar-makedonija");
    expect(m[m.length - 1].id).toBe("2026-10-04-floda");
  });

  it("veckorytmen är mån/ons/tors 18:30 på Hjällbovallen", () => {
    expect(TRAINING_SCHEDULE.days).toEqual(["Måndag", "Onsdag", "Torsdag"]);
    expect(TRAINING_SCHEDULE.time).toBe("18:30");
  });
});
