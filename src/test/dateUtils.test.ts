import { describe, expect, it } from "vitest";
import { SHORT_DAY, SHORT_MONTH, formatMatchDate, shortWeekday } from "@/lib/dateUtils";

describe("dateUtils", () => {
  describe("SHORT_DAY", () => {
    it("har 7 svenska veckodagar i Date.getDay()-ordning (söndag = 0)", () => {
      expect(SHORT_DAY).toHaveLength(7);
      expect(SHORT_DAY).toEqual(["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]);
    });
  });

  describe("SHORT_MONTH", () => {
    it("har 12 svenska månadsförkortningar i Date.getMonth()-ordning", () => {
      expect(SHORT_MONTH).toHaveLength(12);
      expect(SHORT_MONTH[0]).toBe("jan");
      expect(SHORT_MONTH[4]).toBe("maj");
      expect(SHORT_MONTH[11]).toBe("dec");
    });
  });

  describe("formatMatchDate", () => {
    it("formaterar fredag 8 maj 2026 19:00", () => {
      // 2026-05-08T19:00 lokal tid
      const iso = new Date(2026, 4, 8, 19, 0).toISOString();
      expect(formatMatchDate(iso)).toBe("Fre 8 maj · 19:00");
    });

    it("padding minut + timme till 2 siffror", () => {
      const iso = new Date(2026, 0, 5, 9, 5).toISOString();
      // 2026-01-05 = måndag
      expect(formatMatchDate(iso)).toBe("Mån 5 jan · 09:05");
    });

    it("midnatt rendereras som 00:00", () => {
      const iso = new Date(2026, 5, 14, 0, 0).toISOString();
      // 2026-06-14 = söndag
      expect(formatMatchDate(iso)).toBe("Sön 14 jun · 00:00");
    });
  });

  describe("shortWeekday", () => {
    it("returnerar 'Fre' för 2026-05-08", () => {
      expect(shortWeekday(new Date(2026, 4, 8).toISOString())).toBe("Fre");
    });

    it("returnerar 'Sön' för 2026-01-04", () => {
      expect(shortWeekday(new Date(2026, 0, 4).toISOString())).toBe("Sön");
    });
  });
});
