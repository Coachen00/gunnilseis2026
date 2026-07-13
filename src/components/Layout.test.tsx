import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }),
        }),
      }),
    }),
  },
}));

const renderLayout = () =>
  render(
    <MemoryRouter>
      <Layout>
        <article>Innehåll i sidan</article>
      </Layout>
    </MemoryRouter>,
  );

describe("Layout", () => {
  it("renders a skip-to-content link as the first focusable element", () => {
    renderLayout();
    const skipLink = screen.getByRole("link", { name: /hoppa till innehåll/i });
    expect(skipLink).toHaveAttribute("href", "#huvudinnehall");
    expect(skipLink.className).toMatch(/sr-only/);
    expect(skipLink.className).toMatch(/focus:not-sr-only/);
  });

  it("main has matching id 'huvudinnehall' for the skip target", () => {
    const { container } = renderLayout();
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.id).toBe("huvudinnehall");
  });

  it("renders nav (TopNav) and footer", () => {
    const { container } = renderLayout();
    expect(container.querySelector("header")).not.toBeNull();
    expect(container.querySelector("footer")).not.toBeNull();
  });

  it("renders the page children inside main", () => {
    renderLayout();
    expect(screen.getByText("Innehåll i sidan")).toBeInTheDocument();
  });

  it("mountar ScrollProgress (fixed bar i toppkanten)", () => {
    const { container } = renderLayout();
    // ScrollProgress: fixed inset-x-0 top-0 z-[60] h-[2px]
    const bar = container.querySelector(
      'div[aria-hidden="true"].fixed.inset-x-0.top-0',
    );
    expect(bar).not.toBeNull();
    expect((bar as HTMLElement)?.className).toMatch(/z-\[60\]/);
  });

  it("mountar ScrollToTop-knapp (fixed bottom-right)", () => {
    renderLayout();
    const btn = screen.getByRole("button", { name: /tillbaka till toppen/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/fixed/);
    expect(btn.className).toMatch(/bottom-6/);
    expect(btn.className).toMatch(/right-6/);
  });

  it("strukturordning: skip-link först, ScrollProgress, sedan TopNav, main, Footer, ScrollToTop", () => {
    const { container } = renderLayout();
    const root = container.firstElementChild as HTMLElement;
    const children = Array.from(root.children);
    // Skip-link är första
    expect(children[0].tagName).toBe("A");
    expect(children[0].getAttribute("href")).toBe("#huvudinnehall");
    // Sista barn är ScrollToTop-knappen
    expect(children[children.length - 1].tagName).toBe("BUTTON");
  });
});
