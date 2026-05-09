import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Sanity-test för CSS-keyframes som hero-koreografin är beroende av.
 * Fångar regressioner där någon "städar" index.css och tar bort en keyframe
 * som fortfarande används av en .animate-*-klass.
 */

const css = readFileSync(join(process.cwd(), "src/index.css"), "utf-8");

const expectedKeyframes = [
  "fadeIn",
  "slideUp",
  "pulseSoft",
  "floatParticle",
  "meshShift",
  "fadeInUp",
  "bounceSlow",
  "fallDown",
  "pitchPulse",
  "heroReveal",
  "heroRevealGrand",
  "accentGrow",
  "shineSweep",
];

const expectedUtilities = [
  "animate-fade-in",
  "animate-slide-up",
  "animate-pulse-soft",
  "animate-float",
  "animate-mesh-shift",
  "animate-fade-in-up",
  "animate-bounce-slow",
  "animate-fall",
  "animate-pitch-pulse",
  "animate-hero-reveal",
  "animate-hero-reveal-grand",
  "animate-accent-grow",
  "animate-shine",
  "bg-grain",
  "bg-mesh-gradient",
];

describe("index.css — keyframes & utilities", () => {
  it.each(expectedKeyframes)("@keyframes %s finns", (name) => {
    expect(css).toMatch(new RegExp(`@keyframes\\s+${name}\\s*\\{`));
  });

  it.each(expectedUtilities)("utility .%s definieras", (name) => {
    const escaped = name.replace(/-/g, "\\-");
    expect(css).toMatch(new RegExp(`\\.${escaped}\\s*\\{`));
  });

  it("prefers-reduced-motion-block stänger ALL nya animationer", () => {
    const reducedBlock = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\}\s*\}/);
    expect(reducedBlock).not.toBeNull();
    const block = reducedBlock![1];
    expect(block).toMatch(/animate-fall/);
    expect(block).toMatch(/animate-pitch-pulse/);
    expect(block).toMatch(/animate-hero-reveal/);
    expect(block).toMatch(/animate-hero-reveal-grand/);
    expect(block).toMatch(/animate-accent-grow/);
  });

  it("design-tokens definieras i :root", () => {
    expect(css).toMatch(/:root\s*\{[\s\S]*?--background:/);
    expect(css).toMatch(/--accent:\s*47\s*78%\s*56%/);
    expect(css).toMatch(/--primary:\s*212\s*50%\s*48%/);
    expect(css).toMatch(/--pitch-lines:\s*142\s*25%\s*45%/);
  });
});
