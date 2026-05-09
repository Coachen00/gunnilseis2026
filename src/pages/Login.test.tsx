import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
  },
}));

const renderLogin = (path = "/login") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Login />
    </MemoryRouter>,
  );

describe("Login — brand & form", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/login");
  });

  it("renders Spelmodellen-wordmark above the card with link to /", () => {
    renderLogin();
    const wordmark = screen.getByLabelText(/spelmodellen — start/i);
    expect(wordmark).toHaveAttribute("href", "/");
    expect(wordmark.textContent).toMatch(/Spelmodellen/);
    expect(wordmark.textContent).toMatch(/Gunnilse IS/);
  });

  it("eyebrow says 'KONTO · INLOGGNING' on default mode", () => {
    renderLogin();
    expect(screen.getByText(/konto · inloggning/i)).toBeInTheDocument();
  });

  it("CardTitle says 'Logga in' on default mode", () => {
    renderLogin();
    expect(
      screen.getByRole("heading", { name: /^logga in$/i }),
    ).toBeInTheDocument();
  });

  it("CardDescription mentions 'spelmodellen' (not 'spelidén')", () => {
    renderLogin();
    expect(
      screen.getByText(/komma åt spelmodellen/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/komma åt spelidén/i)).not.toBeInTheDocument();
  });

  it("renders username + password inputs with labels", () => {
    renderLogin();
    expect(screen.getByLabelText(/användarnamn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lösenord/i)).toBeInTheDocument();
  });

  it("'Tillbaka till startsidan'-länken pekar på /", () => {
    renderLogin();
    const back = screen.getByRole("link", { name: /tillbaka till startsidan/i });
    expect(back).toHaveAttribute("href", "/");
  });

  it("toggle button switches to 'Begär tillgång'-mode", () => {
    renderLogin();
    expect(screen.getByText(/ingen tillgång\? begär åtkomst/i)).toBeInTheDocument();
  });
});

describe("Login — signup mode (?mode=signup)", () => {
  it("eyebrow visar 'KONTO · FÖRFRÅGAN'", () => {
    renderLogin("/login?mode=signup");
    expect(screen.getByText(/konto · förfrågan/i)).toBeInTheDocument();
  });

  it("CardTitle visar 'Begär tillgång'", () => {
    renderLogin("/login?mode=signup");
    expect(
      screen.getByRole("heading", { name: /^begär tillgång$/i }),
    ).toBeInTheDocument();
  });
});
