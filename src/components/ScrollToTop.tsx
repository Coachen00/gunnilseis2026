import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Flytande "tillbaka till toppen"-knapp som visas efter användaren har
 * scrollat ner > 60% av första viewporten. Låg-visuell impact när dold,
 * elegant när synlig. Endast som komplement till natural scroll, inte
 * primary navigation.
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Tillbaka till toppen"
      className={`fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-accent backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-card hover:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTop;
