import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MatchKommande from "./MatchKommande";
import { renderWithProviders } from "@/test/test-utils";
import { SEASON_BREAK } from "@/data/matchplan";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

/**
 * Veckans match under sommaruppehållet (SEASON_BREAK.active).
 * Sidan ska visa uppehålls-kortet och nästa match, men INTE matchdags-
 * detaljer (tre-saker-idag) förrän kallelsen inför höstpremiären sätts.
 */
describe("MatchKommande — säsongsuppehåll", () => {
  afterEach(cleanup);

  it("uppehållet är aktivt (annars är detta test inte relevant)", () => {
    expect(SEASON_BREAK.active).toBe(true);
  });

  it("visar uppehålls-kort med sista resultat och höstpremiär", () => {
    renderWithProviders(<MatchKommande />, { routerProps: { initialEntries: ["/match/kommande"] } });
    expect(screen.getByText("Sommaruppehåll")).toBeInTheDocument();
    expect(screen.getByText(/Stenkullen GoIK 6–0/)).toBeInTheDocument();
    expect(screen.getByText(SEASON_BREAK.nextMatchLabel)).toBeInTheDocument();
    expect(screen.getByText(SEASON_BREAK.trainingResumes)).toBeInTheDocument();
  });

  it("visar Partille som nästa match, inte matchdags-fokus", () => {
    renderWithProviders(<MatchKommande />, { routerProps: { initialEntries: ["/match/kommande"] } });
    expect(screen.getByText("Nästa match")).toBeInTheDocument();
    // "Tre saker idag" hör till matchdag och ska vara dolt under uppehållet.
    expect(screen.queryByText(/Tre saker — inget annat/)).toBeNull();
    // Ingen trupp kallad → "Kallelse kommer".
    expect(screen.getByText("Kallelse kommer")).toBeInTheDocument();
  });
});
