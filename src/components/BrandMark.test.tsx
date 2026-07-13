import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import BrandMark from "./BrandMark";

describe("BrandMark", () => {
  it("renderar som SVG", () => {
    const { container } = render(<BrandMark />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("är aria-hidden (dekorativ)", () => {
    const { container } = render(<BrandMark />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("använder currentColor som stroke (ärver från parent)", () => {
    const { container } = render(<BrandMark />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
  });

  it("har viewBox 0 0 32 32", () => {
    const { container } = render(<BrandMark />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 32 32");
  });

  it("består av 2 paths (bågar) + 1 line (förbindelse) = S-monogrammet", () => {
    const { container } = render(<BrandMark />);
    const paths = container.querySelectorAll("path");
    const lines = container.querySelectorAll("line");
    expect(paths.length).toBe(2);
    expect(lines.length).toBe(1);
  });

  it("strokeWidth default 5.5 men kan överridas", () => {
    const { container, rerender } = render(<BrandMark />);
    expect(container.querySelector("svg")?.getAttribute("stroke-width")).toBe("5.5");
    rerender(<BrandMark strokeWidth={3} />);
    expect(container.querySelector("svg")?.getAttribute("stroke-width")).toBe("3");
  });

  it("accepterar className för storlek/färg-styling", () => {
    const { container } = render(<BrandMark className="h-12 w-12 text-accent" />);
    expect(container.querySelector("svg")?.className.baseVal).toMatch(/h-12/);
    expect(container.querySelector("svg")?.className.baseVal).toMatch(/text-accent/);
  });
});
