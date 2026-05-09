import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Sanity-test för index.html — fångar regressioner där
 * meta-taggar eller LD+JSON tappas eller blir trasiga vid edit.
 */

const html = readFileSync(join(process.cwd(), "index.html"), "utf-8");

describe("index.html — head meta", () => {
  it("title speglar Spelmodellen-brand", () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title).toMatch(/Spelmodellen/i);
  });

  it("har canonical-länk till spelmodellen.se", () => {
    expect(html).toMatch(/<link\s+rel="canonical"\s+href="https:\/\/spelmodellen\.se\/"/);
  });

  it("preconnectar till Google Fonts (latency-vinst för Inter)", () => {
    expect(html).toMatch(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com"/);
    expect(html).toMatch(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin/);
  });

  it("har OG-image i absolut URL och peke på spelmodellen.se", () => {
    expect(html).toMatch(/property="og:image"\s+content="https:\/\/spelmodellen\.se\/og-image\.png"/);
  });

  it("twitter card är summary_large_image", () => {
    expect(html).toMatch(/name="twitter:card"\s+content="summary_large_image"/);
  });

  it("html lang är svenska", () => {
    expect(html).toMatch(/<html\s+lang="sv">/);
  });
});

describe("index.html — LD+JSON structured data", () => {
  const ldMatch = html.match(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );

  it("LD+JSON-block finns och är välformad JSON", () => {
    expect(ldMatch).not.toBeNull();
    expect(() => JSON.parse(ldMatch![1])).not.toThrow();
  });

  it("schema är WebSite med inLanguage sv-SE", () => {
    const data = JSON.parse(ldMatch![1]);
    expect(data["@type"]).toBe("WebSite");
    expect(data.inLanguage).toBe("sv-SE");
  });

  it("name är Spelmodellen, url är root", () => {
    const data = JSON.parse(ldMatch![1]);
    expect(data.name).toBe("Spelmodellen");
    expect(data.url).toBe("https://spelmodellen.se/");
  });

  it("publisher är SportsOrganization Gunnilse IS, foundingDate 1950", () => {
    const data = JSON.parse(ldMatch![1]);
    expect(data.publisher["@type"]).toBe("SportsOrganization");
    expect(data.publisher.name).toBe("Gunnilse IS");
    expect(data.publisher.foundingDate).toBe("1950");
    expect(data.publisher.sport).toBe("Football");
  });

  it("location är Angered/Göteborg/SE", () => {
    const data = JSON.parse(ldMatch![1]);
    expect(data.publisher.location.name).toBe("Angered");
    expect(data.publisher.location.address.addressLocality).toBe("Göteborg");
    expect(data.publisher.location.address.addressCountry).toBe("SE");
  });
});
