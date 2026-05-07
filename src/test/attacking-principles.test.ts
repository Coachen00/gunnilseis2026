import { describe, expect, it } from "vitest";
import { ATTACKING_PRINCIPLES, findAttackingPrinciple } from "@/data/attackingPrinciples";

/**
 * Integritetstester för anfallsprinciperna.
 *
 * 5 principer i fast ordning — varje princip måste ha alla fält ifyllda
 * eftersom UI:t förlitar sig på dem. Ändras antalet eller ordningen är det
 * en avsiktlig modelländring och testen ska uppdateras tillsammans med
 * /anfall-sidans struktur och navigationen i TopNav.
 */

const EXPECTED_SLUGS = [
  "skydda-mot-kontring",
  "spela-in",
  "spela-ut",
  "ta-med-framat",
  "fyll-pa-box",
] as const;

describe("ATTACKING_PRINCIPLES", () => {
  it("har exakt 5 principer", () => {
    expect(ATTACKING_PRINCIPLES).toHaveLength(5);
  });

  it("är i fast ordning 1-5", () => {
    ATTACKING_PRINCIPLES.forEach((p, i) => {
      expect(p.order).toBe(i + 1);
    });
  });

  it("har förväntade slugs i rätt ordning", () => {
    expect(ATTACKING_PRINCIPLES.map((p) => p.slug)).toEqual([...EXPECTED_SLUGS]);
  });

  it.each(ATTACKING_PRINCIPLES.map((p) => [p.slug, p] as const))(
    "%s har alla obligatoriska fält ifyllda",
    (_slug, p) => {
      expect(p.headline.trim().length).toBeGreaterThan(0);
      expect(p.oneLiner.trim().length).toBeGreaterThan(20);
      expect(p.forklaring.trim().length).toBeGreaterThan(50);
      expect(p.tittaEfter.length).toBeGreaterThanOrEqual(2);
      expect(p.goraDetta.length).toBeGreaterThanOrEqual(2);
      expect(p.matchExempel.motstandare.trim().length).toBeGreaterThan(0);
      expect(p.matchExempel.situation.trim().length).toBeGreaterThan(20);
      expect(p.ovning.rubrik.trim().length).toBeGreaterThan(0);
      expect(p.ovning.beskrivning.trim().length).toBeGreaterThan(20);
      expect(p.coachrop.length).toBeGreaterThanOrEqual(1);
      p.coachrop.forEach((rop) => expect(rop.trim().length).toBeGreaterThan(0));
    }
  );

  it("findAttackingPrinciple returnerar rätt princip", () => {
    expect(findAttackingPrinciple("spela-in")?.order).toBe(2);
    expect(findAttackingPrinciple("inte-en-riktig-slug")).toBeUndefined();
  });
});
