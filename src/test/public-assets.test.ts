import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Sanity-test för publika tillgångar — fångar regressioner där
 * en bild eller ikon raderas av misstag och bryter hero/OG/PWA.
 */

const publicDir = join(process.cwd(), "public");

describe("public/ — assets som hero, og och brand pekar på", () => {
  it("CNAME pekar på spelmodellen.se", () => {
    const cname = readFileSync(join(publicDir, "CNAME"), "utf-8").trim();
    expect(cname).toBe("spelmodellen.se");
  });

  it("hero-poster.jpg finns och är icke-tom", () => {
    const path = join(publicDir, "hero-poster.jpg");
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });

  it("og-image.png finns och är icke-tom", () => {
    const path = join(publicDir, "og-image.png");
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });

  it("og-image.jpg finns (fallback för plattformar som föredrar JPG)", () => {
    const path = join(publicDir, "og-image.jpg");
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });

  it("favicon.ico finns", () => {
    const path = join(publicDir, "favicon.ico");
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(0);
  });

  it("robots.txt tillåter Googlebot på roten", () => {
    const robots = readFileSync(join(publicDir, "robots.txt"), "utf-8");
    expect(robots).toMatch(/User-agent:\s*Googlebot/i);
    expect(robots).toMatch(/Allow:\s*\//);
  });

  it("favicon.svg finns och är SVG-formaterad", () => {
    const path = join(publicDir, "favicon.svg");
    expect(existsSync(path)).toBe(true);
    const svg = readFileSync(path, "utf-8");
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/viewBox/);
    expect(svg).toMatch(/<\/svg>/);
  });

  it("manifest.webmanifest är välformad PWA-manifest", () => {
    const path = join(publicDir, "manifest.webmanifest");
    expect(existsSync(path)).toBe(true);
    const manifest = JSON.parse(readFileSync(path, "utf-8"));
    expect(manifest.name).toMatch(/Spelmodellen/);
    expect(manifest.short_name).toBe("Spelmodellen");
    expect(manifest.lang).toBe("sv-SE");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0b121a");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });
});
