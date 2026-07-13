import { useEffect, useState } from "react";

/**
 * Soft animated background:
 * - Layer 1: slowly shifting gradient mesh (Navy → Shield → Gold)
 * - Layer 2: ~25 floating gold particles
 * - Layer 3: 3 large blobs with subtle scroll parallax
 * All pointer-events-none, very low opacity. Lives behind content.
 */
const AnimatedBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Hoppa över scroll-parallaxen helt vid reducerad rörelse — sparar
    // requestAnimationFrame-cykler för användare som föredrar stillhet.
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

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

  // Pre-generate stable particle props
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: (i * 41) % 100,
    top: (i * 73) % 100,
    size: 2 + ((i * 5) % 4),
    delay: (i * 0.7) % 8,
    duration: 18 + ((i * 3) % 12),
  }));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-[0.06] animate-mesh-shift bg-mesh-gradient" />

      {/* Parallax blobs */}
      <div
        className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-[0.18]"
        style={{
          background:
            "radial-gradient(circle, hsl(217 40% 14%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        }}
      />
      <div
        className="absolute top-[40%] -right-40 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-[0.14]"
        style={{
          background:
            "radial-gradient(circle, hsl(215 35% 10%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * -0.12}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-0 left-[30%] w-[34rem] h-[34rem] rounded-full blur-3xl opacity-[0.16]"
        style={{
          background:
            "radial-gradient(circle, hsl(217 30% 12%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.08}px, 0)`,
        }}
      />

      {/* Floating gold particles — barely there */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-accent/20 animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              boxShadow: "0 0 8px hsl(var(--accent) / 0.25)",
            }}
          />
        ))}
      </div>

      {/* Filmic grain overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="midnight-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#midnight-noise)" />
      </svg>

      {/* Soft top/bottom fade so content stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
    </div>
  );
};

export default AnimatedBackground;
