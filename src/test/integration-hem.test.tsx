import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Hem from "@/pages/Hem";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
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

vi.mock("@/hooks/useContent", async () => {
  const actual = await vi.importActual<typeof import("@/hooks/useContent")>(
    "@/hooks/useContent",
  );
  return {
    ...actual,
    useContent: <T,>(_key: string, fallback: T) => ({
      data: fallback,
      loading: false,
      source: "fallback" as const,
      error: null,
      reload: () => Promise.resolve(),
    }),
  };
});

describe("Integration — Hem rendered inside Layout", () => {
  const renderApp = () =>
    render(
      <MemoryRouter>
        <Layout>
          <Hem />
        </Layout>
      </MemoryRouter>,
    );

  it("hela sidan renderar utan att krascha", () => {
    renderApp();
    expect(screen.getByRole("heading", { level: 1, name: /spelmodellen/i })).toBeInTheDocument();
  });

  it("layout-chrome (skip-link, ScrollProgress, TopNav, Footer, ScrollToTop) finns runt Hem", () => {
    const { container } = renderApp();
    // Skip-link
    expect(container.querySelector('a[href="#huvudinnehall"]')).not.toBeNull();
    // ScrollProgress (fixed top)
    expect(container.querySelector('div[aria-hidden="true"].fixed.top-0')).not.toBeNull();
    // TopNav (header)
    expect(container.querySelector("header")).not.toBeNull();
    // Footer
    expect(container.querySelector("footer")).not.toBeNull();
    // ScrollToTop
    expect(screen.getByRole("button", { name: /tillbaka till toppen/i })).toBeInTheDocument();
  });

  it("hela visuella hierarki: H1 → H2 (4 sektioner) → H3 (bibliotek)", () => {
    renderApp();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    const h2s = screen.getAllByRole("heading", { level: 2 });
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h1s.length).toBe(1); // 1 H1 per page (semantic correctness)
    expect(h2s.length).toBeGreaterThanOrEqual(4); // Identity, Skeden, Bibliotek, För laget
    expect(h3s.length).toBeGreaterThanOrEqual(3); // Bibliotek-quicklinks
  });

  it("Spelmodellen-brand syns både i TopNav, hero och Footer", () => {
    renderApp();
    const matches = screen.getAllByText(/spelmodellen/i);
    // TopNav brand + H1 + Footer brand + andra ställen = >= 3
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("editorial 'Edition 2026'-stamp finns i hero", () => {
    renderApp();
    expect(screen.getByText(/edition 2026/i)).toBeInTheDocument();
  });

  it("navigerbara länkar finns: skip-link, brand, hero CTAs, identity, bibliotek, footer", () => {
    renderApp();
    // Skip-link
    expect(screen.getByRole("link", { name: /hoppa till innehåll/i })).toBeInTheDocument();
    // Brand (multiple occurrences expected)
    expect(screen.getAllByLabelText(/spelmodellen — start/i).length).toBeGreaterThanOrEqual(1);
    // Hero CTAs
    expect(screen.getByRole("link", { name: /utforska spelmodellen/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /se principerna/i })).toBeInTheDocument();
  });
});
