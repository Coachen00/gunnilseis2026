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
  it("anger forskningsförankrade dosintervall för kost och vätska", () => {
    const kost = SPELARVARD_SECTIONS.find((s) => s.id === "kostlara")!;
    const text = kost.bullets.join(" ");

    expect(text).toMatch(/1,6–2,2 g protein per kg kroppsvikt och dag/);
    expect(text).toMatch(/3–8 g kolhydrat per kg kroppsvikt och dag/);
    expect(text).toMatch(/belastning/);
    expect(text).toMatch(/individuellt/);
    expect(text).toMatch(/under 2 procent kroppsmassaförlust/);
  });

  it("anger säkra ramar för tillskott och koffein", () => {
    const tillskott = SPELARVARD_SECTIONS.find((s) => s.id === "kosttillskott")!;
    const text = tillskott.bullets.join(" ");

    expect(text).toMatch(/kreatin monohydrat.*3–5 g varje dag/i);
    expect(text).toMatch(/batch-testade produkter/i);
    expect(text).toMatch(/Koffein är valfritt/i);
    expect(text).toMatch(/individuellt/i);
    expect(text).toMatch(/sömn/i);
  });

  it("anger 7–9 timmars sömn och RPE 7–9 för tung styrka", () => {
    const somn = SPELARVARD_SECTIONS.find((s) => s.id === "somn")!;
    const gymovningar = SPELARVARD_SECTIONS.find((s) => s.id === "gymovningar")!;

    expect(somn.bullets.join(" ")).toMatch(/7–9 h/);
    expect(gymovningar.bullets.join(" ")).toMatch(/RPE 7–9/);
  });

  it("ger tre träningsalternativ och minst en hel vilodag", () => {
    const sommar = SPELARVARD_SECTIONS.find((s) => s.id === "sommarschema")!;
    const text = sommar.bullets.join(" ");

    expect(text).toMatch(/Full plan/);
    expect(text).toMatch(/Underhåll/);
    expect(text).toMatch(/Miniminivå/);
    expect(text).toMatch(/minst en hel vilodag/i);
    expect(text).not.toMatch(/underhålls med 2–3 pass i veckan/i);
  });

  it("beskriver skadeprevention som riskminskning, inte garanti", () => {
    const gym = SPELARVARD_SECTIONS.find((s) => s.id === "gym")!;
    const text = gym.bullets.join(" ").toLowerCase();

    expect(text).toMatch(/minska risken|riskminskning|bygga kapacitet/);
    expect(text).not.toMatch(/skadeskydd/);
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
