import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./components/AuthGuard", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./components/Layout", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./components/ErrorBoundary", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./pages/SommarUppstart", () => ({ default: () => <h1>Sommaruppstart 2026</h1> }));
vi.mock("./hooks/useAuthSession", () => ({ useAuthSession: () => ({ isAuthed: false, loading: false }) }));

import App from "./App";

describe("App routes", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("visar sommaruppstarten på den publika ingången", async () => {
    window.history.replaceState({}, "", "/sommaruppstart");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Sommaruppstart 2026" })).toBeInTheDocument();
  });

  it("visar bara välkomsttext och inloggning på publik startsida", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Välkommen till Gunnilse herr 2026" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logga in" })).toHaveAttribute("href", "/login");
    expect(screen.queryByText("Spelmodell")).not.toBeInTheDocument();
  });
});
