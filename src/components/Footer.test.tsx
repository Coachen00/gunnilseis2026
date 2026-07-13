import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe("Footer", () => {
  it("uses the Spelmodellen brand wordmark", () => {
    renderFooter();
    expect(screen.getByText(/^Spelmodellen$/i)).toBeInTheDocument();
  });

  it("shows the brand-defining one-liner", () => {
    renderFooter();
    expect(
      screen.getByText(/En gemensam karta för hur laget tränar, spelar och utvecklas\./i),
    ).toBeInTheDocument();
  });

  it("renders all four quick links pointing to canonical routes", () => {
    renderFooter();
    const expected: Array<[RegExp, string]> = [
      [/^Spelidé$/i, "/spelide"],
      [/^Principer$/i, "/anfall"],
      [/^Träningspass$/i, "/verktyg"],
      [/^Matcher$/i, "/match/matcher"],
    ];
    for (const [label, href] of expected) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("includes the year in the copyright", () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${year}.*Spelmodellen`, "i")),
    ).toBeInTheDocument();
  });

  it("has a top-link button (button, not link, since it scrolls)", () => {
    renderFooter();
    const top = screen.getByRole("button", { name: /toppen/i });
    expect(top).toBeInTheDocument();
    expect(top.tagName).toBe("BUTTON");
  });

  it("has a labelled snabblänkar nav region", () => {
    const { container } = renderFooter();
    const nav = container.querySelector('nav[aria-label="Snabblänkar"]');
    expect(nav).not.toBeNull();
  });

  it("does not contain old Gunnilse-only branding ('Gunnilse IS 2026' or 'Spelidé · Träning · Match' as primary brand)", () => {
    renderFooter();
    // Old Footer had '<Gunnilse IS> <accent>2026</accent>' as primary brand.
    // New Footer keeps Gunnilse only as part of copyright reference.
    const wordmark = screen.getByText(/^Spelmodellen$/i);
    expect(wordmark.closest("a")).toHaveAttribute("href", "/");
  });

  it("brand wordmark hover-glow + accent-color shift på text", () => {
    renderFooter();
    const wordmark = screen.getByText(/^Spelmodellen$/i);
    const link = wordmark.closest("a")!;
    // S-monogram-wrapper är den första div-children av länken
    const monogram = link.firstElementChild as HTMLElement;
    expect(monogram.className).toMatch(/group-hover:border-accent\/60/);
    expect(monogram.className).toMatch(/group-hover:shadow/);
    expect(wordmark.className).toMatch(/group-hover:text-accent/);
  });

  it("snabblänkar har animerad scale-x underline-effekt", () => {
    renderFooter();
    const links = ["Spelidé", "Principer", "Träningspass", "Matcher"];
    for (const label of links) {
      const link = screen.getByRole("link", { name: new RegExp(`^${label}$`, "i") });
      // Underline-spannen är sista barnet i länken
      const underline = link.querySelector("span[aria-hidden]");
      expect(underline).not.toBeNull();
      expect((underline as HTMLElement).className).toMatch(/scale-x-0/);
      expect((underline as HTMLElement).className).toMatch(/group-hover\/q:scale-x-100/);
    }
  });
});
