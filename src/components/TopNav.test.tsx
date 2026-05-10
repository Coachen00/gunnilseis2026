import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopNav from "./TopNav";

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

const renderNav = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TopNav />
    </MemoryRouter>,
  );

describe("TopNav — brand", () => {
  it("brand-länk pekar på / med aria-label 'Spelmodellen — Start'", () => {
    renderNav();
    const brand = screen.getByLabelText(/spelmodellen — start/i);
    expect(brand).toHaveAttribute("href", "/");
  });

  it("brand visar S-monogram + 'Spelmodellen' + 'Gunnilse IS · 2026' subtitle", () => {
    renderNav();
    const brand = screen.getByLabelText(/spelmodellen — start/i);
    expect(brand.textContent).toMatch(/^S/);
    expect(brand.textContent).toMatch(/Spelmodellen/);
    expect(brand.textContent).toMatch(/Gunnilse IS/);
    expect(brand.textContent).toMatch(/2026/);
  });
});

describe("TopNav — nav-items", () => {
  it("har 'Start'-länk (inte gamla 'Hem')", () => {
    renderNav();
    const startLinks = screen.getAllByRole("link", { name: /^start$/i });
    expect(startLinks.length).toBeGreaterThan(0);
    expect(startLinks[0]).toHaveAttribute("href", "/");
  });

  it("ingen 'Hem'-länk längre", () => {
    renderNav();
    expect(screen.queryAllByRole("link", { name: /^hem$/i })).toHaveLength(0);
  });

  it("renderar dropdowns (Skeden + Match) utan att krascha", () => {
    renderNav();
    expect(screen.getAllByRole("button", { name: /^skeden$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /^match$/i }).length).toBeGreaterThan(0);
  });

  it("renderar minst 'Start', 'Spelidé', 'Trupp', 'Roller', 'Verktyg'", () => {
    renderNav();
    for (const label of ["Start", "Spelidé", "Trupp", "Roller", "Verktyg"]) {
      const found = screen.getAllByRole("link", { name: new RegExp(`^${label}$`, "i") });
      expect(found.length).toBeGreaterThan(0);
    }
  });
});

describe("TopNav — auth-aware right cluster (logged out)", () => {
  it("visar 'Logga in' + 'Registrera' när ingen user", () => {
    renderNav();
    const loginLinks = screen.getAllByRole("link", { name: /logga in/i });
    const signupLinks = screen.getAllByRole("link", { name: /registrera/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(signupLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
    expect(signupLinks[0]).toHaveAttribute("href", "/login?mode=signup");
  });
});

describe("TopNav — mobile hamburger", () => {
  it("hamburger-knappen har aria-label", () => {
    renderNav();
    expect(screen.getByLabelText(/öppna meny/i)).toBeInTheDocument();
  });
});
