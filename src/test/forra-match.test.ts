import { describe, expect, it } from "vitest";
import { FORRA_MATCH, getForraMatch, REFLECTIONS } from "@/data/forraMatch";
import { lastPlayedMatch, SEASON_MATCHES } from "@/data/season";

/**
 * Sanity tests för förra-match-data.
 *
 * FORRA_MATCH är NU dynamisk — den följer `getForraMatch()` som hämtar
 * senast spelade matchen från `season.ts`. Innehållet kommer från
 * `REFLECTIONS`-map per match-id, med auto-summary-shell som fallback.
 */

describe("FORRA_MATCH (dynamisk)", () => {
  it("är synkad med senast spelade match från season.ts", () => {
    const last = lastPlayedMatch(SEASON_MATCHES, new Date());
    if (!last) {
      // Säsongen har inte börjat — FORRA_MATCH ska peka på första matchen som fallback
      expect(FORRA_MATCH.meta.id).toBe(SEASON_MATCHES[0].id);
      return;
    }
    expect(FORRA_MATCH.meta.id).toBe(last.id);
  });

  it("har 6 strukturerade reflektionsblock", () => {
    expect(FORRA_MATCH.blocks).toHaveLength(6);
    const titles = FORRA_MATCH.blocks.map((b) => b.badge);
    expect(titles).toEqual([
      "Bra",
      "Förbättra",
      "Anfall",
      "Försvar",
      "Omställningar",
      "Fasta",
    ]);
  });

  it("har konsistent typ — bullets är arrayer även när tomma", () => {
    FORRA_MATCH.blocks.forEach((b) => {
      expect(Array.isArray(b.bullets)).toBe(true);
    });
    expect(Array.isArray(FORRA_MATCH.truppen)).toBe(true);
    expect(Array.isArray(FORRA_MATCH.larDomar)).toBe(true);
  });
});

describe("REFLECTIONS-map", () => {
  it("har manuell reflektion för Velebit, Kareby och Björkö", () => {
    expect(REFLECTIONS["2026-05-02-velebit"]).toBeDefined();
    expect(REFLECTIONS["2026-05-08-kareby"]).toBeDefined();
    expect(REFLECTIONS["2026-05-16-ifk-bjorko"]).toBeDefined();
  });
});

describe("getForraMatch — datum-känslig", () => {
  it("returnerar Velebit när 7 maj är 'idag' (senaste spelade)", () => {
    const fixedNow = new Date("2026-05-07T12:00:00+02:00");
    const fm = getForraMatch(fixedNow);
    expect(fm).not.toBeNull();
    expect(fm?.meta.id).toBe("2026-05-02-velebit");
    expect(lastPlayedMatch(SEASON_MATCHES, fixedNow)?.id).toBe("2026-05-02-velebit");
  });

  it("returnerar Kareby när 10 maj är 'idag'", () => {
    const fixedNow = new Date("2026-05-10T12:00:00+02:00");
    const fm = getForraMatch(fixedNow);
    expect(fm?.meta.id).toBe("2026-05-08-kareby");
    expect(fm?.meta.ourScore).toBe(1);
    expect(fm?.meta.theirScore).toBe(1);
  });

  it("returnerar Björkö när 17 maj är 'idag' (efter senaste spelade)", () => {
    const fixedNow = new Date("2026-05-17T12:00:00+02:00");
    const fm = getForraMatch(fixedNow);
    expect(fm?.meta.id).toBe("2026-05-16-ifk-bjorko");
    expect(fm?.meta.ourScore).toBe(3);
    expect(fm?.meta.theirScore).toBe(1);
  });

  it("returnerar null innan första matchen", () => {
    const fixedNow = new Date("2026-01-01T00:00:00+01:00");
    expect(getForraMatch(fixedNow)).toBeNull();
  });

  it("rullar automatiskt när nästa match är spelad — ingen kod-redigering", () => {
    // Innan Vardar (22 maj) → Björkö är senaste
    const before = new Date("2026-05-21T12:00:00+02:00");
    expect(getForraMatch(before)?.meta.id).toBe("2026-05-16-ifk-bjorko");
    // Efter Vardar (23 maj) → Vardar är senaste (även om Vardar saknar score)
    const after = new Date("2026-05-23T12:00:00+02:00");
    expect(getForraMatch(after)?.meta.id).toBe("2026-05-22-vardar-makedonija");
  });
});
