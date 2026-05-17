import { logger } from "./logger";

/**
 * Registrera service worker — enbart i produktion och om browsern stödjer det.
 *
 * Vi väntar med register() till "load" så att SW inte konkurrerar med första
 * JS-bundlen om bandbredd. Det är en medveten vinst på första visit.
 *
 * Service workern (/sw.js) bygger på enkel network-first för navigation och
 * cache-first för statiska assets — se public/sw.js för detaljer.
 */
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return; // ingen SW i dev — undvik konstiga cache-bekymmer

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        logger.info("service worker registered", { scope: "sw", swScope: reg.scope });
      })
      .catch((err) => {
        logger.warn(err, { scope: "sw", phase: "register" });
      });
  });
}
