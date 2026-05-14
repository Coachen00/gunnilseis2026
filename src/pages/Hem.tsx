import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn, Shield, UserPlus } from "lucide-react";

const Hem = () => {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* Tight veil — keep the video as texture but the page reads as architectural */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/93 to-background" />
      <div className="absolute inset-0 bg-architectural-grid opacity-[0.35]" aria-hidden="true" />
      {/* Accent stripe top — sport */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" aria-hidden="true" />

      <div className="container relative flex min-h-[92vh] flex-col justify-center py-section-lg">
        <div className="max-w-4xl">
          <motion.div
            {...fadeUp(0)}
            className="mb-8 flex items-center gap-3 text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-accent"
          >
            <span className="inline-block h-[2px] w-10 bg-accent" aria-hidden="true" />
            <Shield className="h-4 w-4" strokeWidth={2} />
            Gunnilse IS · Angereds lag · 2026
          </motion.div>

          <motion.h1
            {...fadeUp(0.06)}
            className="text-[3rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] leading-[0.98] text-foreground"
          >
            Inte bara en
            <br />
            fotbollsförening.
          </motion.h1>

          <motion.div
            {...fadeUp(0.14)}
            className="mt-10 grid gap-3 max-w-2xl text-base md:text-lg leading-relaxed text-foreground/75"
          >
            <p>
              Områdets lag sedan 1950. 1997 stod vi trea i Allsvenska-kvalet.
            </p>
            <p className="text-foreground/65">
              Angered — Hjällbo, Hammarkullen, Gårdsten, Lövgärdet, Rannebergen, Gunnilse.
              En stad i staden, redo att samlas runt en förening igen.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.22)}
            className="mt-10 flex items-stretch gap-[2px] max-w-2xl"
          >
            <div className="flex-1 bg-primary px-5 py-4 text-primary-foreground">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-accent mb-1">
                Uppdrag
              </div>
              <div className="text-lg md:text-xl font-bold tracking-tight leading-snug">
                Väcka en förening som redan är stor.
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center bg-accent px-6 text-primary">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.22em]">Kraft</span>
              <span className="text-2xl font-black tabular leading-none mt-1">∴</span>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-sm font-bold tracking-tight text-primary-foreground transition-all duration-200 hover:bg-primary/92 hover:shadow-[0_8px_24px_-10px_hsl(215_70%_12%/0.35)]"
            >
              <LogIn className="h-4 w-4" strokeWidth={2.25} />
              Logga in
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.25} />
            </Link>
            <Link
              to="/login?mode=signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border bg-card px-7 text-sm font-bold tracking-tight text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
            >
              <UserPlus className="h-4 w-4" strokeWidth={2.25} />
              Begär tillgång
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hem;
