import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import TacticalPitchGrid from "./TacticalPitchGrid";

describe("TacticalPitchGrid", () => {
  it("renders an SVG that is aria-hidden", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses pointer-events-none + absolute positioning so it never blocks input", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toMatch(/pointer-events-none/);
    expect(svg?.getAttribute("class")).toMatch(/absolute/);
  });

  it("declares slice preserveAspectRatio so the pitch covers the hero", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("preserveAspectRatio")).toBe("xMidYMid slice");
  });

  it("renders the canonical pitch elements (touchline, halfway, centre, boxes, channels, thirds)", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    if (!svg) throw new Error("missing svg");

    // Outer touchline + halfway + centre circle
    const rects = svg.querySelectorAll("rect");
    expect(rects.length).toBeGreaterThanOrEqual(5);
    const lines = svg.querySelectorAll("line");
    // halfway line + 4 channel lines + 2 third lines = 7
    expect(lines.length).toBeGreaterThanOrEqual(7);
    const circles = svg.querySelectorAll("circle");
    // centre circle + centre dot + 2 penalty spots = 4
    expect(circles.length).toBe(4);
    // 2 penalty arcs
    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

  it("uses the pitch-lines design token via text-utility (no hardcoded colors)", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toMatch(/text-pitch-lines/);
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
  });

  it("animates with the pulse keyframe", () => {
    const { container } = render(<TacticalPitchGrid />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toMatch(/animate-pitch-pulse/);
  });
});
