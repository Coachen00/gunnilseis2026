import { useEffect, useState } from "react";

const WORDS = [
  "SPELIDÉ",
  "PRESS",
  "ÅTERERÖVRING",
  "SPELBREDD",
  "SPELDJUP",
  "DIAGONALT",
  "VERTIKALT",
  "HALVYTA",
  "BOX",
  "RESTFÖRSVAR",
  "ÖVERBELASTA",
  "FRIGÖRA",
  "ATTRAHERA",
  "FIXERA",
  "EXPLOATERA",
  "KOLLEKTIV",
  "PRINCIPER",
  "BESLUT",
  "TEMPO",
  "RIKTNING",
] as const;

type Drop = {
  word: string;
  left: number;
  delay: number;
  duration: number;
  size: "sm" | "md" | "lg";
  drift: number;
};

const seedDrops = (count: number): Drop[] => {
  const sizes: Drop["size"][] = ["sm", "md", "lg"];
  return Array.from({ length: count }, (_, i) => {
    const word = WORDS[i % WORDS.length];
    const left = (i * 13.7) % 96;
    const delay = (i * 1.9) % 22;
    const duration = 28 + ((i * 5) % 22);
    const size = sizes[i % sizes.length];
    const drift = ((i * 7) % 11) - 5;
    return { word, delay, duration, left, size, drift };
  });
};

const sizeClass = (s: Drop["size"]) => {
  switch (s) {
    case "lg":
      return "text-2xl md:text-4xl tracking-[0.32em] opacity-[0.10]";
    case "md":
      return "text-base md:text-2xl tracking-[0.32em] opacity-[0.08]";
    case "sm":
    default:
      return "text-xs md:text-sm tracking-[0.32em] opacity-[0.06]";
  }
};

const FallingWords = () => {
  const [reduce, setReduce] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(max-width: 767px)");

    const apply = () => {
      setReduce(motionMq.matches);
      setIsNarrow(widthMq.matches);
    };
    apply();

    motionMq.addEventListener?.("change", apply);
    widthMq.addEventListener?.("change", apply);

    return () => {
      motionMq.removeEventListener?.("change", apply);
      widthMq.removeEventListener?.("change", apply);
    };
  }, []);

  if (reduce) {
    return null;
  }

  const count = isNarrow ? 8 : 16;
  const drops = seedDrops(count);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {drops.map((d, i) => (
        <span
          key={`${d.word}-${i}`}
          className={`absolute top-0 -translate-y-full font-mono font-semibold uppercase text-foreground/80 will-change-transform animate-fall ${sizeClass(
            d.size,
          )}`}
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            ["--drift" as string]: `${d.drift}vw`,
          }}
        >
          {d.word}
        </span>
      ))}
    </div>
  );
};

export default FallingWords;
