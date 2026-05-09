import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  );

describe("NotFound", () => {
  it("renders a 404 heading in the spelmodellen brand voice", () => {
    renderAt("/some-missing-route");
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/spelmodellen · 404/i)).toBeInTheDocument();
  });

  it("renders a Swedish, friendly message — no English placeholder copy", () => {
    renderAt("/missing");
    expect(screen.getByText(/sidan du letade efter finns inte här/i)).toBeInTheDocument();
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/return to home/i)).not.toBeInTheDocument();
  });

  it("displays the unknown pathname so the visitor knows where they ended up", () => {
    renderAt("/lapp-kallet-finns-ej");
    expect(screen.getByText("/lapp-kallet-finns-ej")).toBeInTheDocument();
  });

  it("offers a single back-to-start link to /", () => {
    renderAt("/x");
    const back = screen.getByRole("link", { name: /tillbaka till startsidan/i });
    expect(back).toHaveAttribute("href", "/");
  });

  it("does not log to the console (production-safe)", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    renderAt("/silent");
    expect(errSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
    logSpy.mockRestore();
  });
});
