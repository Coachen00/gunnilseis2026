import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

const Bomb = () => {
  throw new Error("explosion");
};

describe("ErrorBoundary", () => {
  afterEach(cleanup);

  it("renderar children när inget exploderar", () => {
    render(
      <ErrorBoundary>
        <p>ok</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("visar fallback-UI när child kastar", () => {
    // Tysta React-error-loggen för testet — vi vet att vi kastar med flit.
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <ErrorBoundary routeName="Test">
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/något gick sönder här/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it("kan återställa via 'Försök igen'-knappen", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    let shouldExplode = true;
    const MaybeBomb = () => {
      if (shouldExplode) throw new Error("nope");
      return <p>recovered</p>;
    };
    render(
      <ErrorBoundary>
        <MaybeBomb />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    shouldExplode = false;
    fireEvent.click(screen.getByRole("button", { name: /försök igen/i }));
    expect(screen.getByText("recovered")).toBeInTheDocument();
    spy.mockRestore();
  });
});
