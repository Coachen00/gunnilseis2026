import { useEffect, useState } from "react";

/**
 * Architectural light background:
 * - Base: clean white
 * - Subtle grid lines (64px) — very low opacity
 * - Two static accent washes top/bottom — barely visible saturation
 * - Thin parallax accent strip on left edge
 * - No particles, no mesh, no grain. Architectural, not editorial.
 *
 * Pointer-events-none. Sits behind content. Respects prefers-reduced-motion.
 */
const AnimatedBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Clean white base */}
      <div className="absolute inset-0 bg-background" />

      {/* Architectural grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-60" />

      {/* Vertical accent rail — left edge, parallax */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[2px] bg-accent/80"
        style={{
          transform: `translate3d(0, ${scrollY * -0.12}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Very subtle top accent wash */}
      <div
        className="absolute top-0 inset-x-0 h-64"
        style={{
          background:
            "linear-gradient(180deg, hsl(42 90% 48% / 0.04) 0%, transparent 100%)",
        }}
      />

      {/* Soft bottom navy wash */}
      <div
        className="absolute bottom-0 inset-x-0 h-72"
        style={{
          background:
            "linear-gradient(0deg, hsl(215 70% 16% / 0.04) 0%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
