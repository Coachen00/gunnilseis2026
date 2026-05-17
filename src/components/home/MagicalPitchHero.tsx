/**
 * MagicalPitchHero — varm, äventyrlig, retro-tonad intro till spelmodellen.se.
 *
 * Designprinciper:
 *  - "Svensk retro-äventyrsbok": varma toner (amber/oxblood/forest), inga skinande gradients.
 *  - Auto-play på mount: planens linjer tecknas in, en bollglöd glider över planen,
 *    sex principmarkörer dyker upp i sekvens — som figurer i en saga som vaknar till liv.
 *  - Mjuk parallax via scroll (utan att vara tung).
 *  - prefers-reduced-motion: alla animationer stängs av, slutläget visas direkt.
 *  - Inga skyddade figurer eller franchises kopieras — bara känslan av lekfull dramatik.
 *
 * Använder framer-motion (redan i bundle), inga nya deps.
 */

import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CalendarClock, Film, LogIn, PlayCircle, ShieldCheck, UserPlus } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";

type Principle = {
  id: string;
  label: string;
  short: string;
  /** Position i SVG-koordinatsystem (viewBox 0 0 1000 640). */
  x: number;
  y: number;
  tone: "ember" | "blue" | "gold" | "moss" | "rust" | "ink";
};

/** Sex spelfaser placerade runt planen — som markörer på en gammal sjökortskarta. */
const PRINCIPLES: Principle[] = [
  { id: "forsvar",   label: "Försvar",       short: "Stäng mitten, vinn duellen.",          x: 200, y: 195, tone: "rust" },
  { id: "omst-anf",  label: "Omställning",   short: "Bollvinst — första tanken framåt.",    x: 420, y: 120, tone: "gold" },
  { id: "anfall",    label: "Anfall",        short: "Skapa lägen i assistytan.",            x: 700, y: 180, tone: "blue" },
  { id: "atererov",  label: "Återerövring",  short: "Tappar vi — jakten startar.",          x: 820, y: 405, tone: "ember" },
  { id: "identitet", label: "Identitet",     short: "Värdighet, intensitet, nästa aktion.", x: 510, y: 480, tone: "moss" },
  { id: "fasta",     label: "Fasta",         short: "Stillastående boll = poäng.",          x: 180, y: 420, tone: "ink" },
];

const TONES = {
  ember: { dot: "#c2410c", ring: "rgba(194,65,12,0.45)", text: "#fde6d3", chip: "#451a03" },
  blue:  { dot: "#1d4ed8", ring: "rgba(29,78,216,0.45)", text: "#d9e6ff", chip: "#1e1b4b" },
  gold:  { dot: "#d97706", ring: "rgba(217,119,6,0.45)", text: "#fff2cf", chip: "#451a03" },
  moss:  { dot: "#15803d", ring: "rgba(21,128,61,0.45)", text: "#d8f3dc", chip: "#14532d" },
  rust:  { dot: "#9a3412", ring: "rgba(154,52,18,0.45)", text: "#fee4d4", chip: "#3b1207" },
  ink:   { dot: "#1f2937", ring: "rgba(31,41,55,0.5)",   text: "#e5e7eb", chip: "#0f172a" },
} as const;

/**
 * Path som bollens glöd följer från egen halva genom mittfältet upp i anfall.
 * Använt av <motion.path> som motion path för ljus-puncten.
 */
const BALL_PATH =
  "M 180 555 C 260 510 340 480 410 430 S 540 380 600 320 S 720 240 820 200";

/**
 * Hjälpare: längd av en path är ungefär bara känd av SVG-motorn — vi använder
 * pathLength=1 hack och låter motion animera 0 → 1. Längden är godtycklig.
 */

export default function MagicalPitchHero() {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { isAuthed, loading: authLoading } = useAuthSession();
  // Visa inloggad-CTA-set bara när vi vet säkert. Annars showar vi
  // gäst-CTAs (säkrare default — ingen läcker session-info).
  const authed = !authLoading && isAuthed;

  // Mjuk parallax — endast när användaren scrollar förbi intro.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 });
  const titleY = useTransform(smooth, [0, 1], [0, -80]);
  const pitchY = useTransform(smooth, [0, 1], [0, 60]);
  const pitchScale = useTransform(smooth, [0, 1], [1, 1.08]);
  const overlayOpacity = useTransform(smooth, [0, 0.6, 1], [0, 0.35, 0.7]);

  return (
    <section
      ref={containerRef}
      aria-label="Spelmodellen — magisk fotbollsvärld"
      className="relative isolate overflow-hidden bg-[#1a1108] text-[#fef3e2]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 18%, rgba(217,119,6,0.18), transparent 55%), radial-gradient(circle at 78% 82%, rgba(21,128,61,0.16), transparent 55%), linear-gradient(180deg, #1a1108 0%, #0f0a05 100%)",
      }}
    >
      {/* Grain / paper texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.13]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence baseFrequency=%221.2%22 seed=%223%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')",
        }}
      />

      {/* Vertical scroll volume — sätt höjd så parallax har plats att verka */}
      <div className="relative min-h-[110svh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center">
          <div className="container relative grid gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_1.2fr] lg:gap-16 lg:py-28">

            {/* === Vänster: text + CTAs === */}
            <motion.div style={reduced ? undefined : { y: titleY }} className="relative z-10 max-w-2xl">
              {/* Eyebrow — som en ornamental rubrik i en gammal äventyrsbok */}
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6 inline-flex items-center gap-3 border border-amber-400/40 bg-amber-400/5 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-300"
              >
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.3} />
                Gunnilse IS · Spelmodellen 2026
              </motion.div>

              {/* Huvudtitel: serif-känsla via tracking + skala, utan att byta typsnitt */}
              <motion.h1
                initial={reduced ? undefined : { opacity: 0, y: 28 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="text-[2.6rem] font-black leading-[0.96] tracking-tight text-[#fef3e2] sm:text-6xl md:text-7xl lg:text-[5.2rem]"
              >
                En magisk
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  fotbollsvärld
                </span>
                <br />
                tar form.
              </motion.h1>

              {/* Underrubrik */}
              <motion.p
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="mt-7 max-w-xl text-base leading-relaxed text-amber-100/85 md:text-lg"
              >
                Planen vaknar, linjerna tecknas och bollen glider fram. Sex
                spelfaser, ett lag och en idé — så spelar vi fotboll i Gunnilse IS.
              </motion.p>

              {/* CTAs — auth-aware: logged-in får action-länkar, ej-inloggad får login/signup */}
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.95 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <Link
                  to="/maj-2026"
                  className="group inline-flex h-12 items-center justify-center gap-2 bg-amber-400 px-7 text-sm font-black uppercase tracking-[0.12em] text-[#1a1108] transition hover:bg-amber-300"
                >
                  <PlayCircle className="h-4 w-4" strokeWidth={2.3} />
                  Så spelar vi
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </Link>

                {authed ? (
                  <>
                    <Link
                      to="/match/kommande"
                      className="inline-flex h-12 items-center justify-center gap-2 border border-amber-300/30 bg-amber-300/5 px-6 text-sm font-bold uppercase tracking-[0.12em] text-amber-100 backdrop-blur-sm transition hover:border-amber-300/70 hover:text-amber-300"
                    >
                      <CalendarClock className="h-4 w-4" strokeWidth={2.3} />
                      Veckans match
                    </Link>
                    <Link
                      to="/maj-2026#filmbibliotek"
                      className="inline-flex h-12 items-center justify-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-200/80 transition hover:text-amber-200"
                    >
                      <Film className="h-3.5 w-3.5" strokeWidth={2.3} />
                      Filmbibliotek
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex h-12 items-center justify-center gap-2 border border-amber-300/30 bg-amber-300/5 px-7 text-sm font-bold uppercase tracking-[0.12em] text-amber-100 backdrop-blur-sm transition hover:border-amber-300/70 hover:text-amber-300"
                    >
                      <LogIn className="h-4 w-4" strokeWidth={2.3} />
                      Logga in
                    </Link>
                    <Link
                      to="/login?mode=signup"
                      className="inline-flex h-12 items-center justify-center gap-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-200/70 transition hover:text-amber-200"
                    >
                      <UserPlus className="h-3.5 w-3.5" strokeWidth={2.3} />
                      Begär tillgång
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Liten footer-rad med spelfaserna som textchips */}
              <motion.ul
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="mt-10 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/65"
              >
                {PRINCIPLES.map((p) => (
                  <li key={p.id} className="inline-flex items-center gap-1.5 border border-amber-200/15 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONES[p.tone].dot }} />
                    {p.label}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* === Höger: animerad plan med markörer === */}
            <motion.div
              style={reduced ? undefined : { y: pitchY, scale: pitchScale }}
              className="relative isolate"
            >
              <PitchSceneAuto reduced={reduced} />
            </motion.div>

            {/* Mjuk vinjettering nedåt (övergång till nästa sektion) */}
            <motion.div
              aria-hidden="true"
              style={reduced ? undefined : { opacity: overlayOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1a1108] to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * PitchSceneAuto — SVG-baserad scen med auto-play timing.
 *
 * Animationer (alla med prefers-reduced-motion-respekt):
 *  - Plan-rektangel: stroke-dasharray draws in (0 → 1 over 1.4s)
 *  - Mittlinje + cirkel: draws in (1.4s → 2.0s)
 *  - Straffområden: draws in (1.8s → 2.4s)
 *  - Korridor-streck (gula): draws in stagger (2.0s → 3.2s)
 *  - Bollens path: pathLength 0 → 1 (3.0s → 5.0s)
 *  - Bollglöd följer pathen (motion offset)
 *  - Principmarkörer: pop-in stagger (3.5s → 5.5s)
 */
function PitchSceneAuto({ reduced }: { reduced: boolean }) {
  const animateProps = (delay: number, duration = 0.6) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration, delay, ease: "easeOut" as const },
        };

  return (
    <div className="relative aspect-[1000/640] w-full">
      <svg
        viewBox="0 0 1000 640"
        className="h-full w-full"
        role="img"
        aria-label="Levande fotbollsplan med spelfaser som markörer"
      >
        <defs>
          {/* Plan-gradient — varm forest, inte kall grön */}
          <linearGradient id="magicPitch" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1f3a26" />
            <stop offset="60%" stopColor="#15281a" />
            <stop offset="100%" stopColor="#0c1810" />
          </linearGradient>
          {/* Bollens glöd */}
          <radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7e0" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          {/* Mjuk skugga för markörer */}
          <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
          </filter>
          {/* Slug ljus-svans bakom bollen */}
          <filter id="ballBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          {/* Glow runt pilar (spelvändning) */}
          <filter id="arrowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Pilspetsar för spelvändning-pilarna */}
          <marker id="arrowHeadGold" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 12 6 L 0 12 L 3 6 z" fill="#fbbf24" />
          </marker>
          <marker id="arrowHeadCream" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 12 6 L 0 12 L 3 6 z" fill="#fde68a" />
          </marker>
          <marker id="arrowHeadAmber" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 12 6 L 0 12 L 3 6 z" fill="#fcd34d" />
          </marker>
        </defs>

        {/* Plan-bakgrund + subtila ränder för djup */}
        <rect x="0" y="0" width="1000" height="640" fill="url(#magicPitch)" rx="14" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={i * 167}
            y="0"
            width="83"
            height="640"
            fill="rgba(255,255,255,0.025)"
          />
        ))}

        {/* Plan-linjer (tecknas in) */}
        <g fill="none" stroke="rgba(255,243,226,0.62)" strokeWidth="2.5" strokeLinecap="round">
          {/* Ytterram */}
          <motion.rect
            x="30" y="30" width="940" height="580" rx="4" pathLength="1"
            {...animateProps(0.2, 1.4)}
          />
          {/* Mittlinje */}
          <motion.line x1="500" y1="30" x2="500" y2="610" pathLength="1" {...animateProps(1.4, 0.7)} />
          {/* Mittcirkel */}
          <motion.circle cx="500" cy="320" r="85" pathLength="1" {...animateProps(1.5, 0.7)} />
          <motion.circle
            cx="500" cy="320" r="3" fill="rgba(255,243,226,0.85)" stroke="none"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.3, delay: 2.1 }}
          />
          {/* Straffområden */}
          <motion.rect x="30" y="160" width="160" height="320" rx="2" pathLength="1" {...animateProps(1.8, 0.6)} />
          <motion.rect x="30" y="230" width="60" height="180" rx="2" pathLength="1" {...animateProps(2.0, 0.5)} />
          <motion.rect x="810" y="160" width="160" height="320" rx="2" pathLength="1" {...animateProps(1.8, 0.6)} />
          <motion.rect x="910" y="230" width="60" height="180" rx="2" pathLength="1" {...animateProps(2.0, 0.5)} />
        </g>

        {/* === KORRIDORER — 5 horisontella band, fade in i sekvens === */}
        {/* Ordning: Ytter (top) → Inner (top) → Central → Inner (bot) → Ytter (bot)
            Bandsen får sub-fyllning + en streckad delarlinje längs nedre kanten,
            plus en label-pill i vänstra hörnet av varje band. */}
        {[
          { y0: 30,  y1: 150, label: "Ytterkorridor",    central: false },
          { y0: 150, y1: 260, label: "Innerkorridor",    central: false },
          { y0: 260, y1: 380, label: "Central korridor", central: true  },
          { y0: 380, y1: 490, label: "Innerkorridor",    central: false },
          { y0: 490, y1: 610, label: "Ytterkorridor",    central: false },
        ].map((band, i) => {
          const baseDelay = 2.3 + i * 0.16;
          const labelY = band.y0 + 22;
          const isLast = i === 4;
          return (
            <g key={`corr-${i}`}>
              {/* Subtle fill — central korridor är något varmare */}
              <motion.rect
                x="30" y={band.y0} width="940" height={band.y1 - band.y0}
                fill={band.central ? "rgba(251,191,36,0.07)" : "rgba(251,191,36,0.03)"}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.5, delay: baseDelay, ease: "easeOut" }}
              />
              {/* Delar-linje längs nedre kanten (om inte sista) */}
              {!isLast && (
                <motion.line
                  x1="30" y1={band.y1} x2="970" y2={band.y1}
                  stroke={band.central ? "rgba(251,191,36,0.65)" : "rgba(251,191,36,0.42)"}
                  strokeWidth={band.central ? "2" : "1.5"}
                  strokeDasharray="8 10" strokeLinecap="round"
                  pathLength="1"
                  initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
                  animate={reduced ? undefined : { pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: baseDelay + 0.1, ease: "easeOut" }}
                />
              )}
              {/* Label-pill — slide in från vänster */}
              <motion.g
                initial={reduced ? undefined : { opacity: 0, x: -14 }}
                animate={reduced ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: baseDelay + 0.25, ease: "easeOut" }}
              >
                <rect
                  x="44" y={labelY - 10} width={band.central ? 134 : 112} height="18" rx="9"
                  fill="#0a0e1a" stroke={band.central ? "rgba(251,191,36,0.7)" : "rgba(251,191,36,0.45)"}
                  strokeWidth="1"
                />
                <text
                  x={band.central ? 111 : 100}
                  y={labelY + 3}
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize={band.central ? "10.5" : "9.5"}
                  fontWeight="900"
                  letterSpacing="1.6"
                  fill={band.central ? "#fbbf24" : "#fde68a"}
                  style={{ textTransform: "uppercase" }}
                >
                  {band.label.toUpperCase()}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* === SPELVÄNDNING — pilar som ritas in efter bollen ===
            Tre pilar visualiserar klassisk spelvändning:
              1) Höger ytter spelar bollen bakåt till djup mittfält
              2) Mittfältet vänder spelet diagonalt över till motsatt sida
              3) Genomspel framåt till anfallsytan vid bortre stolpen
            Pilarna ritas med stroke-dasharray (path-length animation).
            Loopar med 4s paus så känslan håller sig levande utan att
            distrahera när man scrollar. */}
        {!reduced && [
          {
            d: "M 800 200 Q 660 290 410 410",
            delay: 4.6,
            color: "#fbbf24",
            width: 4.5,
            marker: "arrowHeadGold",
          },
          {
            d: "M 410 410 Q 560 320 720 290",
            delay: 5.2,
            color: "#fde68a",
            width: 4,
            marker: "arrowHeadCream",
          },
          {
            d: "M 720 290 Q 820 250 880 220",
            delay: 5.8,
            color: "#fcd34d",
            width: 3.5,
            marker: "arrowHeadAmber",
          },
        ].map((arrow, i) => (
          <motion.path
            key={`spv-${i}`}
            d={arrow.d}
            fill="none"
            stroke={arrow.color}
            strokeWidth={arrow.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#arrowGlow)"
            markerEnd={`url(#${arrow.marker})`}
            pathLength="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4.5,
              delay: arrow.delay,
              times: [0, 0.18, 0.78, 1],
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Reduced motion: visa spelvändning som statisk slut-state */}
        {reduced && (
          <g fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.6">
            <path d="M 800 200 Q 660 290 410 410" markerEnd="url(#arrowHeadGold)" />
            <path d="M 410 410 Q 560 320 720 290" markerEnd="url(#arrowHeadCream)" stroke="#fde68a" />
            <path d="M 720 290 Q 820 250 880 220" markerEnd="url(#arrowHeadAmber)" stroke="#fcd34d" />
          </g>
        )}

        {/* Bollens path (osynlig — bara för att markera vägen) */}
        <motion.path
          d={BALL_PATH}
          fill="none"
          stroke="rgba(251,191,36,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 10"
          pathLength="1"
          {...animateProps(3.0, 1.6)}
        />

        {/* Bollens glöd — följer pathen via offset-path */}
        {!reduced && (
          <g style={{ offsetPath: `path("${BALL_PATH}")`, offsetRotate: "0deg" }}>
            <motion.g
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: 1 }}
              transition={{
                offsetDistance: { duration: 2.4, delay: 3.0, ease: "easeInOut" },
                opacity: { duration: 0.4, delay: 3.0 },
              }}
              style={{ offsetPath: `path("${BALL_PATH}")` }}
            >
              {/* Stora glöden */}
              <circle r="32" fill="url(#ballGlow)" filter="url(#ballBlur)" opacity="0.85" />
              {/* Själva bollen */}
              <circle r="6.5" fill="#fff7e0" stroke="#fbbf24" strokeWidth="1.5" />
            </motion.g>
          </g>
        )}

        {/* Reduced motion: visa bollen i slutposition (vid sista punkten på pathen) */}
        {reduced && (
          <g transform="translate(820 200)">
            <circle r="32" fill="url(#ballGlow)" filter="url(#ballBlur)" opacity="0.85" />
            <circle r="6.5" fill="#fff7e0" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        )}

        {/* Principmarkörer — pop in efter planen är klar */}
        {PRINCIPLES.map((p, i) => {
          const tone = TONES[p.tone];
          const startDelay = 3.5 + i * 0.18;
          return (
            <motion.g
              key={p.id}
              transform={`translate(${p.x} ${p.y})`}
              initial={reduced ? undefined : { opacity: 0, scale: 0.5 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: startDelay, ease: [0.34, 1.56, 0.64, 1] }}
              filter="url(#markerShadow)"
            >
              {/* Halo-ring (puls) */}
              {!reduced && (
                <motion.circle
                  r="22"
                  fill="none"
                  stroke={tone.ring}
                  strokeWidth="2"
                  animate={{ r: [22, 32, 22], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: startDelay + 1, ease: "easeOut" }}
                />
              )}
              {/* Markörens innercirkel */}
              <circle r="20" fill={tone.chip} stroke={tone.dot} strokeWidth="2.5" />
              <circle r="6" fill={tone.dot} />
              {/* Tagg under */}
              <g transform="translate(0 38)">
                <rect x="-46" y="-13" width="92" height="22" rx="3" fill={tone.chip} stroke={tone.dot} strokeWidth="1" opacity="0.95" />
                <text
                  y="2"
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize="11"
                  fontWeight="900"
                  letterSpacing="1.5"
                  fill={tone.text}
                  style={{ textTransform: "uppercase" }}
                >
                  {p.label.toUpperCase()}
                </text>
              </g>
            </motion.g>
          );
        })}

        {/* Subtle vignette — kanterna mörkare för djupkänsla */}
        <rect
          x="0" y="0" width="1000" height="640"
          fill="url(#magicPitch)"
          opacity="0"
          pointerEvents="none"
        />
      </svg>

      {/* Caption — som en handskriven karttext under sjökortet */}
      <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-amber-200/55">
        Sex faser · ett lag · en idé
      </p>
    </div>
  );
}
