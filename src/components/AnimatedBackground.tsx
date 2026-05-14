import { useEffect, useState } from "react";

/**
 * Light editorial background:
 * - Layer 1: warm paper wash
 * - Layer 2: very subtle gradient mesh (gold/sage/navy hints, low opacity)
 * - Layer 3: 3 soft parallax blobs in muted Gunnilse tones
 * - Layer 4: barely-there gold particles
 * - Layer 5: thin grain for paper texture
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

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: (i * 41) % 100,
    top: (i * 73) % 100,
    size: 2 + ((i * 5) % 4),
    delay: (i * 0.7) % 8,
    duration: 22 + ((i * 3) % 12),
  }));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Paper base */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 opacity-[0.55] animate-mesh-shift bg-mesh-gradient" />

      {/* Parallax blobs — dampened paper tones */}
      <div
        className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-[0.32]"
        style={{
          background:
            "radial-gradient(circle, hsl(42 70% 88%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
        }}
      />
      <div
        className="absolute top-[40%] -right-40 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-[0.22]"
        style={{
          background:
            "radial-gradient(circle, hsl(215 40% 90%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * -0.1}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-0 left-[30%] w-[34rem] h-[34rem] rounded-full blur-3xl opacity-[0.18]"
        style={{
          background:
            "radial-gradient(circle, hsl(145 30% 88%) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.06}px, 0)`,
        }}
      />

      {/* Soft floating dust */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-accent/15 animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Paper grain */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-multiply"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>

      {/* Soft top fade for nav legibility */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent" />
    </div>
  );
};

export default AnimatedBackground;
