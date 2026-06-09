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
import { MATCH_META, SAMLING_TIME } from "@/data/matchplan";
import ScanningScene from "@/components/home/ScanningScene";

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

              {/* Huvudtitel: serif-känsla via tracking + skala, utan att byta typsnitt.
                  Match-info läcker ALDRIG till oinloggade — generisk rubrik istället. */}
              <motion.h1
                initial={reduced ? undefined : { opacity: 0, y: 28 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="text-[2.6rem] font-black leading-[0.96] tracking-tight text-[#fef3e2] sm:text-6xl md:text-7xl lg:text-[5.2rem]"
              >
                {authed ? (
                  <>
                    Nästa match
                    <br />
                    <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                      mot {MATCH_META.opponent.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <>
                    Så spelar vi
                    <br />
                    <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                      fotboll 2026
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Underrubrik — match-detaljer endast för inloggade */}
              <motion.p
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="mt-7 max-w-xl text-base leading-relaxed text-amber-100/85 md:text-lg"
              >
                {authed
                  ? `${MATCH_META.kickoff} · ${MATCH_META.venue}. Samling ${SAMLING_TIME} på Hjällbovallen. Kallelse och matchplan ligger under Veckans match.`
                  : "Gunnilse IS Division 4A Herrar — vår spelmodell, vår taktik och våra matcher. Logga in för att se veckans matchplan, kallad trupp och hela säsongens material."}
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
              <ScanningScene reduced={reduced} />
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
