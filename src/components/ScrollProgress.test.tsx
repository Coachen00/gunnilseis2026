import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrollProgress from "./ScrollProgress";

describe("ScrollProgress", () => {
  it("renders a fixed bar at the top of the page", () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.className).toMatch(/fixed/);
    expect(wrapper.className).toMatch(/top-0/);
    expect(wrapper.className).toMatch(/inset-x-0/);
  });

  it("is aria-hidden + pointer-events-none (decorative only)", () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.className).toMatch(/pointer-events-none/);
  });

  it("inner fill uses accent gradient", () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    const fill = wrapper.firstElementChild as HTMLElement;
    expect(fill).not.toBeNull();
    expect(fill.className).toMatch(/from-accent/);
    expect(fill.className).toMatch(/to-accent/);
  });

  it("starts at 0% width when scrollTop is 0", () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    const fill = wrapper.firstElementChild as HTMLElement;
    expect(fill.style.width).toMatch(/^0(?:%|px)?$|^0%$/);
  });

  it("renders above main content (z-60)", () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/z-\[60\]/);
  });
});
