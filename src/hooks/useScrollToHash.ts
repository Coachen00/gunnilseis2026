import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolla till elementet som matchar `location.hash` när det ändras.
 *
 * Använder requestAnimationFrame för att vänta in DOM-rendering, och
 * decodeURIComponent för att hantera å/ä/ö i ankar-IDs.
 *
 * Exempel: på /identitet#duellspel scrollas <section id="duellspel"> i view.
 *
 * Lägg till `scroll-mt-24` (eller motsvarande) på targetelementet om du har
 * en sticky header.
 */
export function useScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
  }, [location.hash]);
}
