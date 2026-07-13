import { useEffect, useState } from "react";

/**
 * Tunn scroll-progress-bar i toppkanten av sajten — fixerad position,
 * fyller från 0–100% när användaren scrollar genom sidan. Premium-detalj
 * (Vercel, Stripe, Linear-stil). Pure CSS-transform så perf är gratis.
 *
 * Respekterar prefers-reduced-motion: ingen transition, men visar fortfarande
 * statisk position för orientering.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrolled / max) * 100)) : 0;
      setProgress(pct);
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
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        className="h-full bg-gradient-to-r from-accent/80 via-accent to-accent/80 transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
