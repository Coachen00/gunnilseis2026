import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  it("renders an aria-labelled button", () => {
    render(<ScrollToTop />);
    const btn = screen.getByRole("button", { name: /tillbaka till toppen/i });
    expect(btn).toBeInTheDocument();
  });

  it("is fixed bottom-right with high z-index", () => {
    render(<ScrollToTop />);
    const btn = screen.getByRole("button", { name: /tillbaka till toppen/i });
    expect(btn.className).toMatch(/fixed/);
    expect(btn.className).toMatch(/bottom-6/);
    expect(btn.className).toMatch(/right-6/);
    expect(btn.className).toMatch(/z-50/);
  });

  it("starts hidden (opacity-0 + pointer-events-none) when scrollY is 0", () => {
    render(<ScrollToTop />);
    const btn = screen.getByRole("button", { name: /tillbaka till toppen/i });
    expect(btn.className).toMatch(/opacity-0/);
    expect(btn.className).toMatch(/pointer-events-none/);
  });

  it("uses focus-visible ring (a11y)", () => {
    render(<ScrollToTop />);
    const btn = screen.getByRole("button", { name: /tillbaka till toppen/i });
    expect(btn.className).toMatch(/focus-visible:ring-2/);
    expect(btn.className).toMatch(/focus-visible:ring-accent/);
  });

  it("includes ArrowUp icon (decorative svg)", () => {
    const { container } = render(<ScrollToTop />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
