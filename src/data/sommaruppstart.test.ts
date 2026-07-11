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
    const blockMinutes = uppstart?.upplagg?.map((block) => {
      const match = block.tid?.match(/^(\d+) min$/);
      expect(match, `${block.namn} ska ha ett exekverbart minutvärde`).not.toBeNull();
      return Number(match?.[1]);
    }) ?? [];

    expect(uppstart?.totaltid).toBe("60–75 min");
    expect(blockMinutes.reduce((summa, minuter) => summa + minuter, 0)).toBeGreaterThanOrEqual(60);
    expect(blockMinutes.reduce((summa, minuter) => summa + minuter, 0)).toBeLessThanOrEqual(75);
    expect(text).toMatch(/individuell minutgräns/);
    expect(text).toContain("startklar: avsluta senast efter 75 min");
    expect(text).toContain("tillgänglig 45–60: avsluta senast efter 60 min");
    expect(text).toMatch(/avsluta direkt.*fart.*teknik/);
  });

  it("kommunicerar 3/8 konsekvent som låg belastning i kalender och pass", () => {
    const kalendersteg = KALENDER.find((steg) => steg.id === "ma");
    const kollektivtPass = PASS.find((pass) => pass.id === "pass-0308");

    expect(kalendersteg?.load).toBe("Låg");
    expect(kollektivtPass?.tag).toBe("Låg — kontrollerat");
    expect(JSON.stringify(kollektivtPass).toLowerCase()).not.toMatch(/medel — kontrollerat/);
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
