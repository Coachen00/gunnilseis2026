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
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: (i * 41) % 100,
    top: (i * 73) % 100,
    size: 4 + ((i * 7) % 10),
    delay: (i * 0.7) % 8,
    duration: 14 + ((i * 3) % 10),
  }));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-[0.18] animate-mesh-shift bg-mesh-gradient" />

      {/* Parallax blobs */}
      <div
        className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.55) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        }}
      />
      <div
        className="absolute top-[40%] -right-40 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.45) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * -0.12}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-0 left-[30%] w-[34rem] h-[34rem] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--secondary) / 0.5) 0%, transparent 70%)",
          transform: `translate3d(0, ${scrollY * 0.08}px, 0)`,
        }}
      />

      {/* Floating gold particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-accent/40 animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              boxShadow: "0 0 12px hsl(var(--accent) / 0.4)",
            }}
          />
        ))}
      </div>

      {/* Soft top/bottom fade so content stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/40" />
    </div>
  );
};

export default AnimatedBackground;
