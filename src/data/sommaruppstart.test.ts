import { describe, expect, it } from "vitest";
import {
  EGENPERIOD_BUDSKAP,
  EGENPERIOD_KRAV,
  KALENDER,
  PASS,
} from "./sommaruppstart";

describe("gradvis kollektiv återstart", () => {
  it("följer två belastningsdagar med en verklig återhämtningsdag", () => {
    const helg = KALENDER.filter((steg) => ["lager-fre", "lager-lor", "lager-son"].includes(steg.id));

    expect(helg.map((steg) => steg.load)).toEqual(["Medel", "Medel", "Låg"]);
    expect(helg[2].detail.toLowerCase()).toContain("återhämtning");
    expect(helg[2].detail.toLowerCase()).toContain("ingen kollektiv belastning");
  });

  it("anger individuella minutgränser för återintroduktionen", () => {
    const uppstart = PASS.find((pass) => pass.id === "pass-2807");
    const text = JSON.stringify(uppstart).toLowerCase();

    expect(uppstart?.totaltid).toBe("60–75 min");
    expect(text).toMatch(/individuell minutgräns/);
    expect(text).toMatch(/45–60|60–75/);
  });

  it("definierar en begränsad höghastighetsdos med kvalitetsstopp", () => {
    const nyckelpass = PASS.find((pass) => pass.id === "pass-0508");
    const text = JSON.stringify(nyckelpass).toLowerCase();

    expect(text).toMatch(/höghastighetsdos/);
    expect(text).toMatch(/\d+ × \d+ m/);
    expect(text).toMatch(/fart.*sjunker|teknik.*försämras/);
  });

  it("taperar till låg belastning senast 48 timmar före match", () => {
    expect(KALENDER.find((steg) => steg.id === "on")?.load).toBe("Hög");
    expect(KALENDER.find((steg) => steg.id === "to")?.load).toBe("Låg");
    expect(KALENDER.find((steg) => steg.id === "fr")?.load).toBe("Låg");
  });

  it("använder samma tre nivåer som den individuella modellen utan det gamla veckokravet", () => {
    const egenperiod = JSON.stringify({ EGENPERIOD_KRAV, EGENPERIOD_BUDSKAP }).toLowerCase();

    expect(egenperiod).toContain("full plan");
    expect(egenperiod).toContain("underhåll");
    expect(egenperiod).toContain("minsta effektiva dos");
    expect(egenperiod).not.toMatch(/2 pass per vecka/);
  });

  it("undviker tre medel- eller högdagar inom fyra dygn", () => {
    const belastning = KALENDER.filter((steg) => steg.load === "Medel" || steg.load === "Hög");
    expect(belastning.map((steg) => steg.id)).toEqual(["uppstart", "lager-fre", "lager-lor", "on"]);
  });
});
