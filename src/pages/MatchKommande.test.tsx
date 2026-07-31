import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MatchKommande from "./MatchKommande";
import { renderWithProviders } from "@/test/test-utils";
import { CALLED_SQUAD, MATCH_META, SAMLING_TIME, SEASON_BREAK } from "@/data/matchplan";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

/**
 * Veckans match i matchdagsläge (SEASON_BREAK.active === false).
 *
 * Testet låser kontraktet mellan datan i matchplan.ts och vad spelaren
 * faktiskt ser: rätt motståndare, rätt samlingstid, kallad trupp utskriven
 * och matchdags-blocken synliga. Uppehålls-kortet får INTE visas.
 *
 * Assertions läser ur MATCH_META/CALLED_SQUAD/SAMLING_TIME, så testet
 * överlever ett matchbyte — bara SEASON_BREAK-flaggan styr vilket läge
 * sidan ska vara i.
 */
describe("MatchKommande — matchdagsläge", () => {
  afterEach(cleanup);

  it("uppehållet är avstängt (annars är detta test inte relevant)", () => {
    expect(SEASON_BREAK.active).toBe(false);
  });

  it("visar veckans match med motståndare, samling och matchdags-fokus", () => {
    renderWithProviders(<MatchKommande />, { routerProps: { initialEntries: ["/match/kommande"] } });
    expect(screen.getByText("Veckans match")).toBeInTheDocument();
    expect(screen.getAllByText(MATCH_META.opponent).length).toBeGreaterThan(0);
    // Samlingstiden ska komma från MATCH_SCHEDULE[0], inte "Inför premiären"
    expect(screen.getAllByText(SAMLING_TIME).length).toBeGreaterThan(0);
    expect(screen.getByText(/Tre saker — inget annat/)).toBeInTheDocument();
    // Uppehålls-kortet ska vara borta
    expect(screen.queryByText("Sommaruppehåll")).toBeNull();
  });

  it("skriver ut den kallade truppen", () => {
    renderWithProviders(<MatchKommande />, { routerProps: { initialEntries: ["/match/kommande"] } });
    const total = CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length;
    expect(total).toBeGreaterThan(0);
    expect(screen.queryByText("Kallelse kommer")).toBeNull();
    // Utan spikad startelva visas en numrerad lista i stället för formationsplan
    if (CALLED_SQUAD.starting.length !== 11) {
      expect(screen.getByText("Kallade spelare")).toBeInTheDocument();
      expect(screen.getByText(`${total} spelare kallade`)).toBeInTheDocument();
    }
    for (const name of [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench]) {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    }
  });
});
