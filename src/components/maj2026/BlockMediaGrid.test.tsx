import { cleanup, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BlockMediaGrid from "./BlockMediaGrid";
import { renderWithProviders } from "@/test/test-utils";
import type { PrincipleDef } from "@/data/majSpelmodell";

vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

const PRINCIPLES: PrincipleDef[] = [
  { id: "hogt", label: "Högt försvar", oneLiner: "Pressa högt — vinn boll på motståndarens planhalva." },
  { id: "medel", label: "Medelhögt försvar", oneLiner: "Stäng mitten, tvinga ut spelet." },
];

describe("BlockMediaGrid", () => {
  afterEach(cleanup);

  it("renderar en kakla per princip", async () => {
    renderWithProviders(
      <BlockMediaGrid blockId="forsvarsspel" principles={PRINCIPLES} accent="red" />
    );
    await waitFor(() => {
      expect(screen.getByText("Högt försvar")).toBeInTheDocument();
      expect(screen.getByText("Medelhögt försvar")).toBeInTheDocument();
    });
  });

  it("visar 'Ingen film upplagd ännu' för principer utan media", async () => {
    renderWithProviders(
      <BlockMediaGrid blockId="forsvarsspel" principles={PRINCIPLES} accent="red" />
    );
    await waitFor(() => {
      const empties = screen.getAllByText(/ingen film upplagd ännu/i);
      expect(empties.length).toBe(PRINCIPLES.length);
    });
  });
});
