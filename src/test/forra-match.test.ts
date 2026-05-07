import { describe, expect, it } from "vitest";
import { FORRA_MATCH, getForraMatch } from "@/data/forraMatch";
import { lastPlayedMatch, SEASON_MATCHES } from "@/data/season";

/**
 * Sanity tests för förra match-data.
 *
 * FORRA_MATCH (Velebit 2 maj 1-0) levereras från `src/data/forraMatch.ts` med
 * placeholders (truppen + reflektioner) som tränaren fyller i. Detta test ser
 * till att strukturen alltid är konsistent — even om innehållet är tomt.
 */

describe("FORRA_MATCH", () => {
  it("är kopplad till Velebit-matchen 2 maj", () => {
    expect(FORRA_MATCH.meta.id).toBe("2026-05-02-velebit");
    expect(FORRA_MATCH.meta.opponent).toBe("KF Velebit");
    expect(FORRA_MATCH.meta.ourScore).toBe(1);
    expect(FORRA_MATCH.meta.theirScore).toBe(0);
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

describe("getForraMatch", () => {
  it("returnerar Velebit när det är senast spelade matchen", () => {
    const fixedNow = new Date("2026-05-07T12:00:00+02:00");
    const fm = getForraMatch(fixedNow);
    expect(fm).not.toBeNull();
    expect(fm?.meta.id).toBe("2026-05-02-velebit");
    expect(lastPlayedMatch(SEASON_MATCHES, fixedNow)?.id).toBe("2026-05-02-velebit");
  });

  it("returnerar null innan första matchen", () => {
    const fixedNow = new Date("2026-01-01T00:00:00+01:00");
    expect(getForraMatch(fixedNow)).toBeNull();
  });
});
