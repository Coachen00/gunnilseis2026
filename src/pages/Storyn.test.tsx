import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Storyn from "./Storyn";

const useSessionMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useSession", () => ({ useSession: useSessionMock }));

afterEach(() => {
  cleanup();
  useSessionMock.mockReset();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <Storyn />
    </MemoryRouter>
  );
}

describe("Storyn private page", () => {
  it("visar hela berättelsen för exakt ägarkonto", () => {
    useSessionMock.mockReturnValue({ data: { user: { email: "leojsjoqvist@gmail.com" } }, isLoading: false });
    renderPage();

    expect(screen.getByRole("heading", { name: "Storyn" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Var förberedd" })).toBeInTheDocument();
    expect(screen.getByText("Det jag vill göra")).toBeInTheDocument();
    expect(screen.getByText(/Standards → ledarskap → träningskultur/)).toBeInTheDocument();
  });

  it("visar inte privat material för annan användare", () => {
    useSessionMock.mockReturnValue({ data: { user: { email: "annan@gmail.com" } }, isLoading: false });
    renderPage();

    expect(screen.queryByRole("heading", { name: "Storyn" })).not.toBeInTheDocument();
    expect(screen.queryByText("Det jag vill göra")).not.toBeInTheDocument();
    expect(screen.getByText("Begränsat innehåll")).toBeInTheDocument();
  });

  it("visar inte privat material för delad åtkomst utan Supabase-session", () => {
    useSessionMock.mockReturnValue({ data: null, isLoading: false });
    renderPage();

    expect(screen.queryByText("Var förberedd")).not.toBeInTheDocument();
    expect(screen.getByText("Begränsat innehåll")).toBeInTheDocument();
  });
});
