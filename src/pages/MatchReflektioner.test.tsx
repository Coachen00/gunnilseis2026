import { cleanup, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MatchReflektioner from "./MatchReflektioner";
import { renderWithProviders } from "@/test/test-utils";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

describe("MatchReflektioner page", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("renderar PageHero med titel", () => {
    renderWithProviders(<MatchReflektioner />, { routerProps: { initialEntries: ["/match/reflektioner"] } });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/samlade tankar/i);
  });

  it("visar live-indikator", () => {
    renderWithProviders(<MatchReflektioner />, { routerProps: { initialEntries: ["/match/reflektioner"] } });
    expect(screen.getByText(/uppdateras automatiskt/i)).toBeInTheDocument();
  });

  it("visar empty state när reflektioner saknas", async () => {
    renderWithProviders(<MatchReflektioner />, { routerProps: { initialEntries: ["/match/reflektioner"] } });
    await waitFor(() => {
      expect(screen.getByText(/inga reflektioner ännu/i)).toBeInTheDocument();
    });
  });
});
