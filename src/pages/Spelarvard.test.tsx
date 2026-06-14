import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import Spelarvard from "./Spelarvard";
import { inferDocKind } from "@/hooks/useSpelarvardDocs";
import { SPELARVARD_SECTIONS, SPELARVARD_TITLE } from "@/data/spelarvard";

// Permissiv supabase-mock → ingen admin, inga dokument (allt tomt).
vi.mock("@/integrations/supabase/client", async () => {
  const m = await import("@/test/mocks/supabase");
  return m.createSupabaseMock();
});

const renderPage = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/spelarvard"]}>
        <Spelarvard />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Spelarvard — egen sida med dokumentgalleri", () => {
  afterEach(cleanup);

  it("visar sidrubriken 'Ta hand om dig själv'", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: SPELARVARD_TITLE })).toBeInTheDocument();
  });

  it("renderar alla 6 avsnitt som egna rubriker", () => {
    renderPage();
    SPELARVARD_SECTIONS.forEach((s) => {
      expect(screen.getByRole("heading", { level: 2, name: s.title })).toBeInTheDocument();
    });
  });

  it("visar tomt-tillstånd per avsnitt när inga dokument finns", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/inget material än/i)).toHaveLength(SPELARVARD_SECTIONS.length);
    });
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
