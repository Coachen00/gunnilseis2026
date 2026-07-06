import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import Spelarvard from "./Spelarvard";
import { inferDocKind } from "@/hooks/useSpelarvardDocs";
import { SPELARVARD_AREAS, SPELARVARD_SECTIONS, SPELARVARD_TITLE } from "@/data/spelarvard";
import { routerFuture } from "@/test/test-utils";

// Permissiv supabase-mock → ingen admin, inga uppladdade dokument (allt tomt).
vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

vi.mock("@/hooks/useIsAdmin", () => ({
  useIsAdmin: () => ({ isAdmin: false, loading: false, user: null }),
}));

vi.mock("@/hooks/useSpelarvardDocs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/hooks/useSpelarvardDocs")>();
  return {
    ...actual,
    useSpelarvardDocs: () => ({
      addLink: vi.fn(),
      bySection: new Map(),
      deleteDoc: vi.fn(),
      isLoading: false,
      refresh: vi.fn(),
      rows: [],
      uploadDoc: vi.fn(),
    }),
    useSpelarvardSignedUrl: () => ({ data: null, isLoading: false }),
  };
});

const renderPage = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/spelarvard"]} future={routerFuture}>
        <Spelarvard />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const sectionTitle = (id: string) => SPELARVARD_SECTIONS.find((s) => s.id === id)!.title;

describe("Spelarvard — områden + dokumentgalleri", () => {
  afterEach(cleanup);

  it("visar sidrubriken 'Ta hand om dig själv'", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: SPELARVARD_TITLE })).toBeInTheDocument();
  });

  it("har en rullgardin med alla områden", () => {
    renderPage();
    const select = screen.getByLabelText(/välj område/i);
    expect(select).toBeInTheDocument();
    SPELARVARD_AREAS.forEach((a) => {
      expect(within(select).getByRole("option", { name: new RegExp(a.label, "i") })).toBeInTheDocument();
    });
  });

  it("visar första områdets avsnitt som standard — och döljer andra områdens", () => {
    renderPage();
    const first = SPELARVARD_AREAS[0];
    first.sectionIds.forEach((id) => {
      expect(screen.getByRole("heading", { level: 2, name: sectionTitle(id) })).toBeInTheDocument();
    });
    const hidden = SPELARVARD_SECTIONS.find((s) => !first.sectionIds.includes(s.id))!;
    expect(screen.queryByRole("heading", { level: 2, name: hidden.title })).toBeNull();
  });

  it("byter visat område när man väljer i rullgardinen", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/välj område/i), { target: { value: "gym" } });
    const gym = SPELARVARD_AREAS.find((a) => a.id === "gym")!;
    gym.sectionIds.forEach((id) => {
      expect(screen.getByRole("heading", { level: 2, name: sectionTitle(id) })).toBeInTheDocument();
    });
  });

  it("visar inbyggt material direkt (utan inloggning/uppladdning)", () => {
    renderPage();
    // Standardområdet (kost) har de inbyggda kost-presentationerna.
    expect(screen.getByText("Kost för motorn")).toBeInTheDocument();
    // Byt till gym → Gymmet-presentationen syns.
    fireEvent.change(screen.getByLabelText(/välj område/i), { target: { value: "gym" } });
    expect(screen.getByText("Gymmet")).toBeInTheDocument();
  });

  it("icke-admin ser inte uppladdningsknappen", () => {
    renderPage();
    expect(screen.queryByText(/lägg till material/i)).toBeNull();
  });
});

describe("inferDocKind", () => {
  it("mappar filändelser till rätt korttyp", () => {
    expect(inferDocKind("kostschema.pdf")).toBe("pdf");
    expect(inferDocKind("Matchplan.pptx")).toBe("slides");
    expect(inferDocKind("deck.ppt")).toBe("slides");
    expect(inferDocKind("taktiktavla.html")).toBe("html");
    expect(inferDocKind("bild.JPG")).toBe("image");
    expect(inferDocKind("https://youtu.be/abc")).toBe("link");
  });
});
