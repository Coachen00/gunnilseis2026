import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TopNav from "./TopNav";
import { routerFuture } from "@/test/test-utils";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

vi.mock("@/lib/sharedAccess", () => ({
  getSharedAccessUser: () => ({ displayName: "Testspelare" }),
  subscribeSharedAccess: () => () => undefined,
}));

describe("TopNav spelmodell-länkar", () => {
  afterEach(cleanup);

  it("pekar synlig spelmodell-navigation mot /spelmodell", () => {
    render(
      <MemoryRouter initialEntries={["/"]} future={routerFuture}>
        <TopNav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole("button", { name: /spelmodell/i })[0]);

    const link = screen.getByRole("link", { name: /så spelar vi/i });
    expect(link).toHaveAttribute("href", "/spelmodell");
    expect(link).not.toHaveAttribute("href", "/maj-2026");
  });

  it("grupperar Coach efter riktning, vecka och match", () => {
    render(
      <MemoryRouter initialEntries={["/"]} future={routerFuture}>
        <TopNav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole("button", { name: /coach/i })[0]);

    expect(screen.getByRole("link", { name: "Riktning & språk" })).toHaveAttribute("href", "/coach#riktning");
    expect(screen.getByRole("link", { name: "Planera veckan" })).toHaveAttribute("href", "/coach#veckan");
    expect(screen.getByRole("link", { name: "Gör matchen tydlig" })).toHaveAttribute("href", "/coach#matchen");
    expect(screen.getByRole("link", { name: /veckans arbetsyta/i })).toHaveAttribute("href", "/spelmodell-labb");
    expect(screen.getByRole("link", { name: /motståndaranalys/i })).toHaveAttribute("href", "/motstandaranalys");
  });
});
