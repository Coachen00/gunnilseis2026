/**
 * Web Vitals-rapportering.
 *
 * Designval: vi gör INTE en dynamisk import av paketet `web-vitals` här.
 * Vite analyserar dynamiska imports vid build-tid och misslyckas om paketet
 * inte finns. Istället exponerar vi en `wireWebVitals(handlers)`-fasad som
 * main.tsx (eller den som vill mäta) kallar med riktiga onCLS/onLCP/onINP
 * från `web-vitals` när paketet är installerat.
 *
 * Default: `reportWebVitals` är no-op, säker att kalla i alla miljöer.
 */

import { logger } from "./logger";
import { trackEvent } from "./analytics";

export type WebVitalMetric = {
  name: string;
  value: number;
  id: string;
  rating?: "good" | "needs-improvement" | "poor";
};

export type WebVitalHandlers = {
  onCLS?: (cb: (m: WebVitalMetric) => void) => void;
  onLCP?: (cb: (m: WebVitalMetric) => void) => void;
  onINP?: (cb: (m: WebVitalMetric) => void) => void;
  onFCP?: (cb: (m: WebVitalMetric) => void) => void;
  onTTFB?: (cb: (m: WebVitalMetric) => void) => void;
};

function reportMetric(metric: WebVitalMetric) {
  logger.info("web-vital", { scope: "web-vitals", ...metric });
  trackEvent("web-vital", {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating ?? "unknown",
  });
}

/**
 * Bind web-vitals handlers till vår rapport-pipeline. Anropas av main.tsx
 * om paketet installeras:
 *
 *   import * as wv from "web-vitals";
 *   wireWebVitals(wv);
 */
export function wireWebVitals(handlers: WebVitalHandlers) {
  handlers.onCLS?.(reportMetric);
  handlers.onLCP?.(reportMetric);
  handlers.onINP?.(reportMetric);
  handlers.onFCP?.(reportMetric);
  handlers.onTTFB?.(reportMetric);
}

/** Default no-op så main.tsx kan kalla utan att veta något. */
export function reportWebVitals() {
  // no-op — invokera wireWebVitals manuellt när paketet finns.
}
