import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ANFALLSPRINCIPER,
  FASTA_SITUATIONER,
  FORMATION,
  FORSVARSPRINCIPER,
  NAR_GOR,
  SPELPRINCIPER_PDF,
} from "./spelprinciper2026";

const inPublic = (url: string) => existsSync(join(process.cwd(), "public", url));

describe("spelprinciper 2026", () => {
  it("tre i försvar, tre i anfall, fyra fasta", () => {
    expect(FORSVARSPRINCIPER.map((p) => p.num)).toEqual([1, 2, 3]);
    expect(ANFALLSPRINCIPER.map((p) => p.num)).toEqual([1, 2, 3]);
    expect(FASTA_SITUATIONER).toHaveLength(4);
    expect(FORMATION.phases).toHaveLength(4);
  });

  it("varje princip har text, coachrop och minst en film", () => {
    for (const p of [...FORSVARSPRINCIPER, ...ANFALLSPRINCIPER]) {
      expect(p.lead.length).toBeGreaterThan(0);
      expect(p.steps.length).toBeGreaterThan(0);
      expect(p.calls.length).toBeGreaterThan(0);
      expect(p.films.length).toBeGreaterThan(0);
    }
  });

  it("alla tolv filmer, deras posters och PDF:en finns i public/", () => {
    const films = [
      FORMATION.film,
      ...FORSVARSPRINCIPER.flatMap((p) => p.films),
      ...ANFALLSPRINCIPER.flatMap((p) => p.films),
      ...FASTA_SITUATIONER.map((f) => f.film),
    ];
    expect(new Set(films.map((f) => f.src)).size).toBe(12);
    for (const f of films) {
      expect(inPublic(f.src), f.src).toBe(true);
      expect(inPublic(f.poster), f.poster).toBe(true);
    }
    expect(inPublic(SPELPRINCIPER_PDF)).toBe(true);
  });

  it("när–gör-tabellen har PDF:ens 20 rader", () => {
    expect(NAR_GOR).toHaveLength(20);
  });
});
