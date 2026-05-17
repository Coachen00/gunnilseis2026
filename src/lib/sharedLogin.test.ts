import { describe, expect, it } from "vitest";
import {
  getLoginEmailCandidates,
  isSharedLogin,
  normalizeLogin,
  toSupabaseEmail,
} from "./sharedLogin";

describe("shared login mapping", () => {
  it("normaliserar Gunnilse-login med versaler och extra mellanslag", () => {
    expect(normalizeLogin("  Gunnilse@gunnilse.se  ")).toBe("gunnilse@gunnilse.se");
    expect(isSharedLogin("Gunnilse@gunnilse.se")).toBe(true);
  });

  it("mappar gemensamma alias till nya Gunnilse-kontot", () => {
    expect(toSupabaseEmail("Gunnilse@gunnilse.se")).toBe("gunnilse@gunnilse.se");
    expect(toSupabaseEmail("gunnilse")).toBe("gunnilse@gunnilse.se");
    expect(toSupabaseEmail("gunnilse2026")).toBe("gunnilse@gunnilse.se");
  });

  it("behaller legacy-kontot som fallback tills live-databasen ar migrerad", () => {
    expect(getLoginEmailCandidates("Gunnilse@gunnilse.se")).toEqual([
      "gunnilse@gunnilse.se",
      "gunnilse2026@gunnilse.se",
    ]);
  });

  it("andra anvandarnamn fortsatter ga till lokal Gunnilse-adress", () => {
    expect(toSupabaseEmail("spelare")).toBe("spelare@gunnilse.local");
    expect(getLoginEmailCandidates("spelare")).toEqual(["spelare@gunnilse.local"]);
  });
});
