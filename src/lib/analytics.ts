/**
 * Analytics-hook. Tunn fasad så att vi kan slå på Plausible/PostHog senare utan
 * att röra resten av appen.
 *
 * Aktiverings-strategi:
 *   - VITE_PLAUSIBLE_DOMAIN sätter Plausible (auto-tracked pageviews via script i
 *     index.html — denna fasad används främst för custom events).
 *   - Saknas båda → no-op.
 *
 * Designprinciper:
 *   - Aldrig kasta från trackEvent. Analytics får INTE krascha UI.
 *   - Aldrig logga PII utan opt-in.
 */

type PlausibleFn = (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

const plausibleDomain = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined) ?? "";

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  try {
    if (plausibleDomain && typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible(name, props ? { props } : undefined);
    }
  } catch {
    // analytics får inte krascha UI
  }
}

export function trackPageview(path: string) {
  trackEvent("pageview", { path });
}

/** Init är till för att låta `main.tsx` injicera script. Idag no-op (script ligger i index.html om man vill). */
export function initAnalytics() {
  // Reserverad för senare init (cookie consent etc).
}
