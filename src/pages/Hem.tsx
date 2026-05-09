import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Dumbbell,
  Flag,
  Lock,
  Sparkles,
  Wrench,
} from "lucide-react";
import FallingWords from "@/components/FallingWords";
import TacticalPitchGrid from "@/components/TacticalPitchGrid";
import PhaseFlow from "@/components/PhaseFlow";
import { IDENTITY, type IdentityItem } from "@/data/identity";
import { useContent } from "@/hooks/useContent";
import { useInView } from "@/hooks/useInView";

const revealClass = (inView: boolean, base = "transition-all duration-700") =>
  `${base} ${
    inView
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6 motion-reduce:translate-y-0 motion-reduce:opacity-100"
  }`;

/**
 * Hero-video. Lägg ny fil i public/ och peka om denna konstant.
 * Filen ska vara H.264 mp4, ~6–10s loop, ~1080p, < 4 MB om möjligt.
 * Saknas filen renderas bara den taktiska bakgrunden – inget kraschar.
 */
export const HERO_VIDEO_URL = "/hero-spelmodellen.mp4";
export const HERO_POSTER_URL = "/hero-poster.jpg";

const heroCards = [
  {
    label: "Principer",
    eyebrow: "01",
    text: "Från språk till handling.",
    to: "/spelide",
    icon: Compass,
  },
  {
    label: "Träning",
    eyebrow: "02",
    text: "Från övning till beteende.",
    to: "/verktyg",
    icon: Dumbbell,
  },
  {
    label: "Match",
    eyebrow: "03",
    text: "Från beslut till effekt.",
    to: "/match/matcher",
    icon: Flag,
  },
] as const;

const quickLinks = [
  { to: "/spelide", label: "Spelidé", text: "Principerna i rätt ordning.", icon: Sparkles },
  { to: "/match/matcher", label: "Matcher", text: "Resultat, motståndare och fokus.", icon: ClipboardList },
  { to: "/verktyg", label: "Verktyg", text: "Plan, analys och tavla.", icon: Wrench },
];

const Hem = () => {
  const { data: identity } = useContent<IdentityItem[]>("identity", IDENTITY);
  const identitySection = useInView<HTMLElement>();
  const phaseSection = useInView<HTMLElement>();
  const librarySection = useInView<HTMLElement>();

  return (
    <>
      {/* === HERO ====================================================== */}
      <section className="relative isolate min-h-[88vh] overflow-hidden md:min-h-[92vh]">
        {/* Background video — full-bleed, decorative */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER_URL}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-60 motion-reduce:hidden"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Static fallback gradient — visible always; carries hero when video missing */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(ellipse_at_75%_85%,hsl(var(--accent)/0.12),transparent_50%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(217_28%_8%)_100%)]"
        />

        {/* Tactical pitch grid */}
        <TacticalPitchGrid />

        {/* Falling tactical vocabulary */}
        <FallingWords />

        {/* Vignette + readability layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/45 to-background"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-background/30 md:via-background/40 md:to-transparent"
        />

        {/* Subtle film grain over the hero — adds organic texture under the H1 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grain opacity-[0.35] mix-blend-overlay"
        />

        {/* Cinematic corner vignettes — pulls focus toward content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,transparent_55%,hsl(var(--background)/0.55)_100%),radial-gradient(ellipse_at_top_right,transparent_55%,hsl(var(--background)/0.55)_100%),radial-gradient(ellipse_at_bottom_left,transparent_55%,hsl(var(--background)/0.55)_100%),radial-gradient(ellipse_at_bottom_right,transparent_55%,hsl(var(--background)/0.55)_100%)]"
        />

        {/* Content */}
        <div className="container relative z-10 flex min-h-[88vh] flex-col justify-between py-16 md:min-h-[92vh] md:py-20">
          <div className="max-w-4xl">
            <div
              className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent animate-hero-reveal md:text-xs"
              style={{ ["--reveal-delay" as string]: "0s" }}
            >
              <span className="relative inline-flex h-2 w-2 items-center justify-center" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent/60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="h-px w-6 bg-accent/70" aria-hidden="true" />
              Tränarplattform · Spelmodell · 2026
            </div>

            <h1
              className="mt-7 font-black uppercase leading-[0.92] tracking-tight text-foreground animate-hero-reveal animate-shine"
              style={{
                fontSize: "clamp(2.5rem, 10.5vw, 9rem)",
                ["--reveal-delay" as string]: "0.15s",
              }}
            >
              Spelmodellen
            </h1>

            <div className="mt-7 flex max-w-2xl items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-2 hidden h-12 w-[3px] flex-shrink-0 bg-accent animate-accent-grow md:block"
                style={{ ["--reveal-delay" as string]: "0.55s" }}
              />
              <p
                className="text-xl font-semibold leading-snug text-foreground animate-hero-reveal md:text-2xl"
                style={{ ["--reveal-delay" as string]: "0.4s" }}
              >
                Från idé till beteende.
                <span className="mt-1 block text-accent">
                  Från princip till prestation.
                </span>
              </p>
            </div>

            <p
              className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground animate-hero-reveal md:text-lg"
              style={{ ["--reveal-delay" as string]: "0.7s" }}
            >
              En digital spelmodell för tränare, spelare och ledare som vill göra
              fotbollens principer begripliga, träningsbara och synliga i match.
            </p>

            <div
              className="mt-10 flex flex-col gap-3 animate-hero-reveal sm:flex-row"
              style={{ ["--reveal-delay" as string]: "0.85s" }}
            >
              <Link
                to="/spelide"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md bg-accent px-6 text-sm font-black uppercase tracking-wider text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Utforska spelmodellen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
                />
              </Link>
              <Link
                to="/anfall"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border/80 bg-background/40 px-6 text-sm font-bold uppercase tracking-wider text-foreground backdrop-blur-sm transition hover:border-accent/60 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Se principerna
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          {/* Hero footer — 3 stat cards */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-border/70 bg-border/70 sm:grid-cols-3 md:mt-20">
            {heroCards.map(({ label, eyebrow, text, to, icon: Icon }, idx) => (
              <Link
                key={label}
                to={to}
                className="group relative flex items-start gap-4 overflow-hidden bg-background/75 p-5 backdrop-blur-md transition animate-hero-reveal hover:bg-card/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:p-6"
                style={{ ["--reveal-delay" as string]: `${1.05 + idx * 0.1}s` }}
              >
                {/* Animated top-edge accent line — grows on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:hidden"
                />
                <span className="font-mono text-[10px] font-black tracking-[0.2em] text-muted-foreground">
                  {eyebrow}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-accent">
                    <Icon
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-[8deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
                      strokeWidth={2}
                    />
                    {label}
                  </div>
                  <p className="mt-2 text-sm leading-snug text-foreground/90">{text}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === IDENTITY — fem beteenden ================================== */}
      <section
        ref={identitySection.ref}
        className={`container py-20 md:py-28 ${revealClass(identitySection.inView)}`}
      >
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <header>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
                Identitet
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
              Fem beteenden vi alltid återvänder till.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Kort nog att komma ihåg under match. Tydligt nog att följa upp efteråt.
            </p>
          </header>

          <ol className="divide-y divide-border border-y border-border">
            {identity.map((item, index) => (
              <li key={item.slug} className="group/item relative">
                {/* Vänster accent-bar som glider in från left på hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-500 group-hover/item:scale-y-100 motion-reduce:hidden"
                />
                <Link
                  to={`/identitet/${item.slug}`}
                  className="group grid gap-4 py-5 transition hover:bg-card/35 focus-visible:bg-card/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-inset md:grid-cols-[64px_220px_1fr_28px]"
                >
                  <span className="font-mono text-xs font-black text-muted-foreground transition-colors group-hover:text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-black leading-snug tracking-normal text-foreground">
                    {item.title}
                  </span>
                  <span className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {item.short}
                  </span>
                  <ArrowRight className="hidden h-4 w-4 self-center text-accent transition group-hover:translate-x-1 md:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* === PHASE FLOW — fyra skeden ================================== */}
      <section
        ref={phaseSection.ref}
        className={`border-y border-border bg-card/30 py-20 md:py-28 ${revealClass(phaseSection.inView)}`}
      >
        <div className="container grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <header>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
                Fyra skeden
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
              Samma struktur i varje match.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Vi byter beteende när bollinnehavet byter ägare.
            </p>
          </header>
          <PhaseFlow />
        </div>
      </section>

      {/* === QUICK LINKS — bibliotek =================================== */}
      <section
        ref={librarySection.ref}
        className={`container py-20 md:py-24 ${revealClass(librarySection.inView)}`}
      >
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
              Bibliotek
            </p>
          </div>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Tre vägar in i modellen.
          </h2>
        </header>
        <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {quickLinks.map(({ to, label, text, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-start gap-4 bg-background p-6 transition hover:bg-card focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-inset md:flex-col md:gap-3"
            >
              <Icon className="h-5 w-5 flex-shrink-0 text-accent" strokeWidth={1.75} />
              <div className="flex-1">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent opacity-80 transition group-hover:gap-2.5 group-hover:opacity-100">
                  Öppna <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === GATED CTA ================================================= */}
      <section className="relative border-t border-border bg-card/40 py-16 md:py-24">
        {/* Subtle accent halo i botten — bekräftar 'gateway' utan att vara skrik */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
        <div className="container grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
              <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-accent">
                <Lock className="h-3.5 w-3.5" />
                För laget
              </p>
            </div>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight md:text-4xl">
              Detaljer, matchplan och tränarverktyg finns bakom inloggning.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/spelmodell-labb"
              className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-accent px-5 text-sm font-black uppercase tracking-wider text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Öppna labbet <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
              />
            </Link>
            <Link
              to="/login?mode=signup"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-5 text-sm font-bold uppercase tracking-wider text-foreground transition hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Begär tillgång
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hem;
