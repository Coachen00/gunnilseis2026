import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./components/AuthGuard", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./components/Layout", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./components/ErrorBoundary", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("./pages/SommarUppstart", () => ({ default: () => <h1>Sommaruppstart 2026</h1> }));

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
});
