import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Start from "./Start";
import { PERIOD_1_REFERENCES } from "@/data/period1";

const renderStart = () =>
  render(
    <MemoryRouter>
      <Start />
    </MemoryRouter>
  );

describe("Start (logged-in landing)", () => {
  afterEach(cleanup);

  it("renderar hero med Lagets karta + diagonal-grafik", () => {
    renderStart();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/lagets karta/i);
  });

  it("visar de 5 huvudprinciperna", () => {
    renderStart();
    for (const title of ["Bygg upp", "Bryt press", "Byt korridor", "Attackera", "Säkra"]) {
      expect(screen.getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
    }
  });

  it("visar Period 1-rubrik och länk till alla 18 pass", () => {
    renderStart();
    expect(screen.getByText(/öppna alla 18 pass/i)).toBeInTheDocument();
  });

  it("visar nyckeltal-strip med 5 metrics", () => {
    renderStart();
    for (const value of ["6", "18", "5", "4", "6 sek"]) {
      // value kan dyka upp på flera ställen
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    }
  });

  it("visar effektlogik och 3 inspirationsreferenser", () => {
    renderStart();
    for (const label of ["Resurser", "Aktiviteter", "Mål", "Effekt"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    for (const ref of PERIOD_1_REFERENCES) {
      expect(screen.getByRole("heading", { level: 3, name: new RegExp(ref.team) })).toBeInTheDocument();
    }
  });

  it("visar fördjupningssektion med deep-dive länkar", () => {
    renderStart();
    expect(
      screen.getByRole("heading", { level: 2, name: /allt detaljerat innehåll/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Principbibliotek")).toBeInTheDocument();
    expect(screen.getByText("Alla 18 träningspass")).toBeInTheDocument();
  });
});
