import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LogIn, Shield, UserPlus } from "lucide-react";

const Hem = () => {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* Light paper veil over video — keeps brand mood, lifts contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/96 to-background" />

      <div className="container relative flex min-h-[88vh] flex-col justify-center py-section-lg">
        <div className="max-w-3xl">
          <motion.div
            {...fadeUp(0)}
            className="mb-9 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent"
          >
            <Shield className="h-5 w-5" strokeWidth={1.5} />
            Gunnilse IS · Angereds lag
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[5.25rem] leading-[1.02] text-foreground"
          >
            Gunnilse IS är inte bara
            <br className="hidden md:block" />
            <span className="italic text-foreground/90"> en fotbollsförening.</span>
          </motion.h1>

          <motion.div
            {...fadeUp(0.18)}
            className="mt-10 space-y-5 max-w-prose text-lg md:text-xl leading-relaxed text-foreground/80"
          >
            <p>
              Områdets lag sedan 1950. 1997 stod klubben trea i Allsvenska-kvalet — kraften finns redan här.
            </p>
            <p className="text-foreground/70">
              Angered är en stad i staden. Hjällbo, Hammarkullen, Gårdsten, Lövgärdet, Rannebergen, Gunnilse.
            </p>
          </motion.div>

          <motion.p
            {...fadeUp(0.28)}
            className="mt-8 max-w-prose font-serif text-2xl md:text-3xl leading-snug text-foreground"
          >
            Vi väcker en förening som <span className="italic text-accent/90">redan är stor</span>.
          </motion.p>

          <motion.p
            {...fadeUp(0.34)}
            className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent"
          >
            Angered har kraft.
          </motion.p>

          <motion.div
            {...fadeUp(0.42)}
            className="mt-12 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_4px_14px_-4px_hsl(215_35%_18%_/_0.25)]"
            >
              <LogIn className="h-4 w-4" />
              Logga in
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login?mode=signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card/60 px-6 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent/50 hover:bg-card"
            >
              <UserPlus className="h-4 w-4" />
              Begär tillgång
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hem;
