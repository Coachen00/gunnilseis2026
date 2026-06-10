import { describe, expect, it } from "vitest";
import { easeInOutCubic, kf, phase, pulseIn } from "./timeline";

describe("zones timeline-matematik", () => {
  it("easeInOutCubic är klampad och symmetrisk", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 5);
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25); // långsam start
    expect(easeInOutCubic(0.75)).toBeGreaterThan(0.75); // mjuk sättning
  });

  it("phase klampar utanför intervallet och stiger monotont inom", () => {
    expect(phase(2, 3, 9)).toBe(0);
    expect(phase(10, 3, 9)).toBe(1);
    const a = phase(4, 3, 9);
    const b = phase(6, 3, 9);
    const c = phase(8, 3, 9);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
    expect(c).toBeLessThan(1);
  });

  it("kf interpolerar mellan keyframes och klampar i ändarna", () => {
    const frames = [
      { at: 9, v: 42 },
      { at: 10.4, v: 30 },
      { at: 12.9, v: 42 },
    ];
    expect(kf(5, frames)).toBe(42); // före första
    expect(kf(20, frames)).toBe(42); // efter sista
    expect(kf(10.4, frames)).toBe(30); // exakt keyframe
    const mid = kf(9.7, frames);
    expect(mid).toBeLessThan(42);
    expect(mid).toBeGreaterThan(30);
  });

  it("pulseIn är 0 i ändarna och toppar i mitten", () => {
    expect(pulseIn(13.2, 13.2, 14.6)).toBeCloseTo(0, 5);
    expect(pulseIn(14.6, 13.2, 14.6)).toBeCloseTo(0, 5);
    expect(pulseIn(13.9, 13.2, 14.6)).toBeGreaterThan(0.95);
  });

  it("spelytornas geometri följer lagdelslinjerna (dynamiska, inte fasta)", () => {
    // Samma keyframes som DynamicGameSpaceLayer använder för mittfältslinjen:
    const MID = [
      { at: 9, v: 58 },
      { at: 10.4, v: 44 },
      { at: 11.8, v: 63 },
      { at: 12.9, v: 58 },
    ];
    const BACK = [
      { at: 9, v: 76 },
      { at: 10.4, v: 58 },
      { at: 11.8, v: 79 },
      { at: 12.9, v: 76 },
    ];
    // Spelyta 2 = avståndet mellan mittfälts- och backlinjen. När laget är
    // kompakt (t=10.4) ska ytan vara mindre än i utgångsläget (t=9).
    const heightAt = (t: number) => kf(t, BACK) - kf(t, MID);
    expect(heightAt(10.4)).toBeLessThan(heightAt(9));
    expect(heightAt(11.8)).toBeLessThan(heightAt(9) + 1); // aldrig statisk tredjedel
    expect(heightAt(9)).toBeCloseTo(18, 5);
    expect(heightAt(10.4)).toBeCloseTo(14, 5);
  });
});
