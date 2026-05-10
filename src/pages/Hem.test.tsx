import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hem, { HERO_VIDEO_URL, HERO_POSTER_URL } from "./Hem";

// Replace the network-touching content hook with a synchronous fallback.
vi.mock("@/hooks/useContent", () => ({
  useContent: <T,>(_key: string, fallback: T) => ({
    data: fallback,
    loading: false,
    source: "fallback" as const,
    error: null,
    reload: () => Promise.resolve(),
  }),
}));

const renderHem = () =>
  render(
    <MemoryRouter>
      <Hem />
    </MemoryRouter>,
  );

describe("Hem — hero", () => {
  it("renders H1 'Spelmodellen'", () => {
    renderHem();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/spelmodellen/i);
  });

  it("renders the brand subheadline (idé→beteende, princip→prestation)", () => {
    renderHem();
    expect(screen.getByText(/Från idé till beteende/i)).toBeInTheDocument();
    expect(screen.getByText(/Från princip till prestation/i)).toBeInTheDocument();
  });

  it("renders the descriptive body copy", () => {
    renderHem();
    expect(
      screen.getByText(
        /digital spelmodell för tränare, spelare och ledare/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders both primary CTAs with the correct copy", () => {
    renderHem();
    const primary = screen.getByRole("link", { name: /utforska spelmodellen/i });
    const secondary = screen.getByRole("link", { name: /se principerna/i });
    expect(primary).toBeInTheDocument();
    expect(primary).toHaveAttribute("href", "/spelide");
    expect(secondary).toBeInTheDocument();
    expect(secondary).toHaveAttribute("href", "/anfall");
  });

  it("renders all three hero cards (Principer, Träning, Match)", () => {
    renderHem();
    // "Principer" appears in hero card AND in library section — both expected.
    expect(screen.getAllByText(/^principer$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/^träning$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/^match$/i).length).toBeGreaterThanOrEqual(1);
  });

  it("hero card 'Principer' links to /spelide", () => {
    renderHem();
    const principerCards = screen
      .getAllByRole("link")
      .filter((a) => /principer/i.test(a.textContent ?? ""));
    const heroPrinciper = principerCards.find(
      (a) => a.getAttribute("href") === "/spelide",
    );
    expect(heroPrinciper).toBeDefined();
  });

  it("hero card 'Match' links to /match/matcher", () => {
    renderHem();
    const links = screen.getAllByRole("link");
    const matchCard = links.find(
      (a) =>
        a.getAttribute("href") === "/match/matcher" &&
        /match/i.test(a.textContent ?? ""),
    );
    expect(matchCard).toBeDefined();
  });

  it("renders a hero video element using HERO_VIDEO_URL and HERO_POSTER_URL", () => {
    const { container } = renderHem();
    const video = container.querySelector("video") as HTMLVideoElement | null;
    expect(video).not.toBeNull();
    if (!video) return;
    // React maps these to DOM properties, not attributes — assert on the props.
    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.getAttribute("poster")).toBe(HERO_POSTER_URL);
    const source = video.querySelector("source");
    expect(source?.getAttribute("src")).toBe(HERO_VIDEO_URL);
    expect(source?.getAttribute("type")).toBe("video/mp4");
  });

  it("exports HERO_VIDEO_URL with .mp4 extension at /hero-spelmodellen.mp4", () => {
    expect(HERO_VIDEO_URL).toMatch(/\.mp4$/);
    expect(HERO_VIDEO_URL).toBe("/hero-spelmodellen.mp4");
  });

  it("eyebrow announces the platform tag", () => {
    renderHem();
    expect(
      screen.getByText(/tränarplattform.*spelmodell.*2026/i),
    ).toBeInTheDocument();
  });

  it("renders deep links into spelidén, identity, and gated lab", () => {
    renderHem();
    const labLink = screen.getByRole("link", { name: /öppna labbet/i });
    expect(labLink).toHaveAttribute("href", "/spelmodell-labb");
    const signupLink = screen.getByRole("link", { name: /begär tillgång/i });
    expect(signupLink).toHaveAttribute("href", "/login?mode=signup");
  });
});

describe("Hem — sections below hero", () => {
  it("identity section header is present", () => {
    renderHem();
    const heading = screen.getByRole("heading", {
      name: /fem beteenden vi alltid återvänder till/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("phase flow section header is present", () => {
    renderHem();
    const heading = screen.getByRole("heading", {
      name: /samma struktur i varje match/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("library quicklinks section is present and links to spelidé", () => {
    renderHem();
    const lib = screen.getByRole("heading", { name: /tre vägar in i modellen/i });
    expect(lib).toBeInTheDocument();
    // The Spelidé quicklink in the library section
    const links = screen.getAllByRole("link", { name: /spelidé/i });
    expect(links.length).toBeGreaterThan(0);
  });
});

describe("Hem — premium polish", () => {
  it("renders editorial 'Edition 2026 · Premiär maj' stamp on desktop", () => {
    renderHem();
    expect(screen.getByText(/edition 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/premiär maj/i)).toBeInTheDocument();
  });

  it("identity-list items have hover accent-bar (group-hover/item:scale-y-100)", () => {
    const { container } = renderHem();
    const items = container.querySelectorAll("li.group\\/item");
    expect(items.length).toBe(5);
    items.forEach((li) => {
      const bar = li.querySelector("span[aria-hidden]") as HTMLElement;
      expect(bar).not.toBeNull();
      expect(bar.className).toMatch(/scale-y-0/);
      expect(bar.className).toMatch(/group-hover\/item:scale-y-100/);
    });
  });

  it("hero H1 uses animate-hero-reveal-grand + animate-shine", () => {
    renderHem();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toMatch(/animate-hero-reveal-grand/);
    expect(h1.className).toMatch(/animate-shine/);
  });

  it("hero eyebrow has live-signal pulsing dot (motion-safe:animate-ping)", () => {
    const { container } = renderHem();
    const ping = container.querySelector(".motion-safe\\:animate-ping");
    expect(ping).not.toBeNull();
  });

  it("hero has film-grain overlay + corner vignettes", () => {
    const { container } = renderHem();
    expect(container.querySelector(".bg-grain")).not.toBeNull();
    // corner vignettes är ett aria-hidden div med radial-gradient
    const vignettes = container.querySelectorAll('[aria-hidden="true"].pointer-events-none');
    expect(vignettes.length).toBeGreaterThan(2);
  });

  it("primary CTA 'Utforska spelmodellen' har shimmer-sweep span", () => {
    const { container } = renderHem();
    const primary = screen
      .getAllByRole("link")
      .find((a) => /utforska spelmodellen/i.test(a.textContent ?? ""));
    expect(primary).toBeDefined();
    // shimmer span är en absolut positionerad gradient
    const shimmer = primary?.querySelector(
      'span[aria-hidden].absolute.inset-0',
    );
    expect(shimmer).not.toBeNull();
    expect((shimmer as HTMLElement)?.className).toMatch(/-translate-x-full/);
    expect((shimmer as HTMLElement)?.className).toMatch(/group-hover:translate-x-full/);
    void container; // unused but kept for consistency
  });

  it("gated section 'För laget' har accent-halo längs topkanten", () => {
    const { container } = renderHem();
    const sections = container.querySelectorAll("section");
    const gated = Array.from(sections).find((s) =>
      /För laget/i.test(s.textContent ?? ""),
    );
    expect(gated).toBeDefined();
    // Halo är en <div aria-hidden> med absolute top-0 + via-accent gradient.
    const halos = Array.from(
      gated?.querySelectorAll('[aria-hidden="true"]') ?? [],
    ) as HTMLElement[];
    const halo = halos.find((el) => /via-accent/.test(el.className));
    expect(halo).toBeDefined();
    expect(halo?.className).toMatch(/bg-gradient-to-r/);
    expect(halo?.className).toMatch(/absolute/);
    expect(halo?.className).toMatch(/top-0/);
  });

  it("alla section-eyebrows har konsekvent accent-stripe (h-px + bg-accent)", () => {
    const { container } = renderHem();
    // Hero har h-px w-6 (efter live-dot tillkom), övriga sektioner h-px w-8.
    const strokes = container.querySelectorAll(
      'span[aria-hidden].h-px',
    );
    // Hero + Identity + Fyra skeden + Bibliotek + Gated = 5 sektioner
    expect(strokes.length).toBeGreaterThanOrEqual(5);
  });

  it("hero-CTAs ('Utforska spelmodellen', 'Se principerna') båda har focus-visible-rings", () => {
    renderHem();
    const utforska = screen.getByRole("link", { name: /utforska spelmodellen/i });
    const principerna = screen.getByRole("link", { name: /se principerna/i });
    expect(utforska.className).toMatch(/focus-visible:ring-2/);
    expect(principerna.className).toMatch(/focus-visible:ring-2/);
  });
});
