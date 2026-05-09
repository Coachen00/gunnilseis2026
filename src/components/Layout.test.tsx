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
});
