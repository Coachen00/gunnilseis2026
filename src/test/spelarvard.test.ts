import { describe, expect, it } from "vitest";
import {
  SPELARVARD_AREAS,
  SPELARVARD_SECTIONS,
  SPELARVARD_TITLE,
} from "@/data/spelarvard";

/**
 * Sanity tests för spelarvårdssektionen ("Ta hand om dig själv").
 *
 * Låser in:
 * - exakt 6 sektioner med unika id och ifyllda rubrik/fråga
 * - 4–6 icke-tomma bullets per sektion
 * - exakt en sektion markerad som FÖRSLAG (sommarschema)
 * - att evidensdelen (kreatin) inte tappas i kosttillskott-sektionen
 */

describe("spelarvard", () => {
  it("har exakt 6 sektioner", () => {
    expect(SPELARVARD_SECTIONS).toHaveLength(6);
  });

  it("alla id är unika", () => {
    const ids = SPELARVARD_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("alla title och question är icke-tomma", () => {
    SPELARVARD_SECTIONS.forEach((s) => {
      expect(s.title.trim().length).toBeGreaterThan(0);
      expect(s.question.trim().length).toBeGreaterThan(0);
    });
  });

  it("varje sektion har 4–6 bullets, alla icke-tomma efter trim", () => {
    SPELARVARD_SECTIONS.forEach((s) => {
      expect(s.bullets.length).toBeGreaterThanOrEqual(4);
      expect(s.bullets.length).toBeLessThanOrEqual(6);
      s.bullets.forEach((b) => expect(b.trim().length).toBeGreaterThan(0));
    });
  });

  it("exakt en sektion är ett förslag, och det är sommarschema", () => {
    const proposals = SPELARVARD_SECTIONS.filter((s) => s.proposal === true);
    expect(proposals).toHaveLength(1);
    expect(proposals[0].id).toBe("sommarschema");
  });

  it("SPELARVARD_TITLE är korrekt", () => {
    expect(SPELARVARD_TITLE).toBe("Ta hand om dig själv");
  });

  it("kosttillskott-sektionen nämner kreatin (evidensdelen)", () => {
    const tillskott = SPELARVARD_SECTIONS.find((s) => s.id === "kosttillskott");
    expect(tillskott).toBeTruthy();
    const text = tillskott!.bullets.join(" ").toLowerCase();
    expect(text).toContain("kreatin");
  });
});

describe("spelarvard — områden (rullgardin)", () => {
  const sectionIds = new Set(SPELARVARD_SECTIONS.map((s) => s.id));

  it("varje områdes sectionIds pekar på en sektion som finns", () => {
    SPELARVARD_AREAS.forEach((a) => {
      a.sectionIds.forEach((id) => expect(sectionIds.has(id)).toBe(true));
    });
  });

  it("varje sektion hör till exakt ett område", () => {
    const counts = new Map<string, number>();
    SPELARVARD_AREAS.forEach((a) =>
      a.sectionIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)),
    );
    SPELARVARD_SECTIONS.forEach((s) => expect(counts.get(s.id)).toBe(1));
  });

  it("alla områden har id, label, emoji och blurb", () => {
    SPELARVARD_AREAS.forEach((a) => {
      expect(a.id.trim().length).toBeGreaterThan(0);
      expect(a.label.trim().length).toBeGreaterThan(0);
      expect(a.emoji.trim().length).toBeGreaterThan(0);
      expect(a.blurb.trim().length).toBeGreaterThan(0);
      expect(a.sectionIds.length).toBeGreaterThan(0);
    });
  });

  it("inbyggt material pekar på en publik /spelarvard/-PDF med titel", () => {
    const builtins = SPELARVARD_SECTIONS.flatMap((s) => s.builtinDocs ?? []);
    expect(builtins.length).toBeGreaterThanOrEqual(3);
    builtins.forEach((b) => {
      expect(b.url.startsWith("/spelarvard/")).toBe(true);
      expect(b.url.endsWith(".pdf")).toBe(true);
      expect(b.kind).toBe("pdf");
      expect(b.title.trim().length).toBeGreaterThan(0);
    });
    const ids = builtins.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
