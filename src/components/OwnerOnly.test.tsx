import { cleanup, render, screen } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import OwnerOnly from "./OwnerOnly";
import { isOwnerEmail } from "@/lib/owner";
import { useSession } from "@/hooks/useSession";

vi.mock("@/hooks/useSession", () => ({
  useSession: vi.fn(),
}));

const mockedUseSession = vi.mocked(useSession);

const makeSession = (email: string | null): Session =>
  ({
    user: { email },
  } as unknown as Session);

const setSession = (session: Session | null, isLoading = false) => {
  mockedUseSession.mockReturnValue({
    data: session,
    isLoading,
  } as ReturnType<typeof useSession>);
};

describe("isOwnerEmail", () => {
  it("godkänner endast den exakta normaliserade owner-adressen", () => {
    expect(isOwnerEmail("leojsjoqvist@gmail.com")).toBe(true);
    expect(isOwnerEmail(" LeoJSjoqvist@GMAIL.COM ")).toBe(true);
  });

  it.each([null, undefined, "leojsjoqvist", "leojsjoqvist+test@gmail.com", "annan@example.com"])(
    "nekar %s",
    (value) => {
      expect(isOwnerEmail(value)).toBe(false);
    }
  );
});

describe("OwnerOnly", () => {
  afterEach(() => {
    window.localStorage.clear();
    cleanup();
    vi.resetAllMocks();
  });

  it("visar laddning utan privat innehåll medan sessionen hämtas", () => {
    setSession(null, true);

    render(
      <OwnerOnly>
        <div>hemligt innehåll</div>
      </OwnerOnly>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Verifierar åtkomst…");
    expect(screen.queryByText("hemligt innehåll")).toBeNull();
  });

  it("visar children för exakt owner-session", () => {
    setSession(makeSession(" LeoJSjoqvist@GMAIL.COM "));

    render(
      <OwnerOnly>
        <div>hemligt innehåll</div>
      </OwnerOnly>
    );

    expect(screen.getByText("hemligt innehåll")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /begränsat innehåll/i })).toBeNull();
  });

  it("visar neutral denied-vy för alla andra, inklusive delad åtkomst utan owner-session", () => {
    window.localStorage.setItem(
      "gunnilse_shared_access_v1",
      JSON.stringify({ active: true, email: "gunnilse@gunnilse.se", createdAt: new Date().toISOString() })
    );
    setSession(null);

    render(
      <OwnerOnly>
        <div>hemligt innehåll</div>
      </OwnerOnly>
    );

    expect(screen.getByRole("heading", { name: /begränsat innehåll/i })).toBeInTheDocument();
    expect(screen.getByText(/inloggad med ägarkontot/i)).toBeInTheDocument();
    expect(screen.queryByText("hemligt innehåll")).toBeNull();
  });
});
