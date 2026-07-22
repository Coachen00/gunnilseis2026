import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Coach from "./Coach";

const renderPage = () => render(<MemoryRouter><Coach /></MemoryRouter>);

describe("Coach", () => {
  afterEach(cleanup);

  it("samlar coacharbetet i tre beslut i arbetsordning", () => {
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: /En riktning\. Ett nästa steg\./ })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Sätt riktningen",
      "Planera veckan",
      "Gör matchen tydlig",
    ]);
    expect(screen.queryByRole("heading", { level: 2, name: "Språk" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "Spel" })).not.toBeInTheDocument();
  });

  it("gör samtliga coachverktyg sökbara under rätt arbetssteg", () => {
    renderPage();

    const expectations = [
      ["Sätt riktningen: verktyg", ["/spelide", "/under-process", "/under-process/5-upphojt-i-fem"]],
    ["Planera veckan: verktyg", ["/spelmodell-labb", "/coach/traningsplanering-host-2026", "/traningsplan", "/taktiktavla"]],
    ["Gör matchen tydlig: verktyg", ["/motstandaranalys", "/matchblad"]],
    ] as const;

    for (const [label, paths] of expectations) {
      const tools = screen.getByRole("region", { name: label });
      expect(within(tools).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(paths);
    }
  });
});
