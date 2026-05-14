import { useRef } from "react";
import { Link } from "react-router-dom";
import type { MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, LogIn, Shield, UserPlus } from "lucide-react";

type BeatTone = "gold" | "blue" | "red" | "green";

type StoryBeat = {
  number: string;
  title: string;
  detail: string;
  start: number;
  end: number;
  side: "left" | "right";
  tone: BeatTone;
};

const beats: StoryBeat[] = [
  {
    number: "01",
    title: "2:a bollsspel",
    detail: "Vi läser duellen innan den händer och är först på nästa boll.",
    start: 0.18,
    end: 0.36,
    side: "right",
    tone: "gold",
  },
  {
    number: "02",
    title: "Duellspel",
    detail: "Närkampen sätter riktningen: nära, aggressivt och redo för nästa aktion.",
    start: 0.36,
    end: 0.54,
    side: "left",
    tone: "red",
  },
  {
    number: "03",
    title: "Djupled",
    detail: "Hotet bakom backlinjen öppnar ytorna framför den.",
    start: 0.54,
    end: 0.72,
    side: "right",
    tone: "blue",
  },
  {
    number: "04",
    title: "Kroppsspråk",
    detail: "Vi bär laget i nästa sekund: beslut, energi och ansvar.",
    start: 0.72,
    end: 0.92,
    side: "left",
    tone: "green",
  },
];

const toneClass: Record<BeatTone, string> = {
  gold: "border-accent/70 bg-accent/12 text-accent",
  blue: "border-swedish-blue/50 bg-swedish-blue/12 text-sky-200",
  red: "border-zone-defense/50 bg-zone-defense/12 text-red-100",
  green: "border-pitch-lines/50 bg-pitch/20 text-emerald-100",
};

const pitchPlayers = [
  { x: 500, y: 1220, label: "1" },
  { x: 240, y: 1040, label: "2" },
  { x: 420, y: 1040, label: "3" },
  { x: 580, y: 1040, label: "4" },
  { x: 760, y: 1040, label: "5" },
  { x: 500, y: 840, label: "6", focus: true },
  { x: 300, y: 690, label: "8" },
  { x: 700, y: 690, label: "10" },
  { x: 220, y: 440, label: "11" },
  { x: 500, y: 360, label: "9" },
  { x: 780, y: 440, label: "7" },
];

const opponents = [
  { x: 500, y: 180 },
  { x: 290, y: 350 },
  { x: 710, y: 350 },
  { x: 390, y: 560 },
  { x: 610, y: 560 },
  { x: 500, y: 710 },
];

const useBeatOpacity = (progress: MotionValue<number>, start: number, end: number) =>
  useTransform(progress, [start - 0.06, start, end, end + 0.05], [0, 1, 1, 0]);

function TacticalCallout({ beat, progress, reduced }: { beat: StoryBeat; progress: MotionValue<number>; reduced: boolean }) {
  const opacity = useBeatOpacity(progress, beat.start, beat.end);
  const y = useTransform(progress, [beat.start - 0.06, beat.start, beat.end], [26, 0, -8]);
  const scale = useTransform(progress, [beat.start - 0.06, beat.start], [0.96, 1]);

  return (
    <motion.aside
      style={reduced ? undefined : { opacity, y, scale }}
      className={[
        "pointer-events-none absolute z-20 w-[min(20rem,calc(100vw-2rem))] border px-4 py-3 shadow-[0_18px_70px_hsl(215_70%_8%/0.28)] backdrop-blur-xl",
        "bottom-[18vh] sm:bottom-[20vh]",
        beat.side === "left" ? "left-4 md:left-10 lg:left-16" : "right-4 md:right-10 lg:right-16",
        toneClass[beat.tone],
      ].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-bold">{beat.number}</span>
        <span className="h-px flex-1 bg-current/30" />
        <span className="font-mono text-[10px] font-bold uppercase">Spelprincip</span>
      </div>
      <h2 className="text-xl font-black leading-tight md:text-2xl">{beat.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/78">{beat.detail}</p>
    </motion.aside>
  );
}

function PitchScene({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const routeOpacity = useTransform(progress, [0.08, 0.28, 0.82], [0, 1, 0.92]);
  const routeLength = useTransform(progress, [0.14, 0.58], [0, 1]);
  const playerHalo = useTransform(progress, [0.1, 0.5, 0.86], [0.3, 1, 0.78]);
  const playerScale = useTransform(progress, [0.08, 0.78], [1, 2.35]);
  const detailOpacity = useTransform(progress, [0.62, 0.9], [0, 1]);

  return (
    <svg
      viewBox="0 0 1000 1500"
      className="h-full w-full"
      role="img"
      aria-label="Animerad fotbollsplan där taktiska detaljer växer fram"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pitchDepth" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#153f2b" />
          <stop offset="55%" stopColor="#0d3021" />
          <stop offset="100%" stopColor="#071b13" />
        </linearGradient>
        <linearGradient id="goldRoute" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5c242" />
          <stop offset="100%" stopColor="#fff1a8" />
        </linearGradient>
        <filter id="pitchGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hardShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#02080a" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect x="0" y="0" width="1000" height="1500" fill="url(#pitchDepth)" />
      {Array.from({ length: 10 }).map((_, index) => (
        <rect
          key={index}
          x="0"
          y={index * 150}
          width="1000"
          height="75"
          fill={index % 2 === 0 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.08)"}
        />
      ))}

      <g fill="none" stroke="rgba(236,255,240,0.72)" strokeWidth="5">
        <rect x="70" y="70" width="860" height="1360" />
        <line x1="70" x2="930" y1="750" y2="750" />
        <circle cx="500" cy="750" r="118" />
        <circle cx="500" cy="750" r="8" fill="rgba(236,255,240,0.9)" stroke="none" />
        <rect x="250" y="70" width="500" height="220" />
        <rect x="345" y="70" width="310" height="90" />
        <path d="M 385 290 A 150 150 0 0 0 615 290" />
        <rect x="250" y="1210" width="500" height="220" />
        <rect x="345" y="1340" width="310" height="90" />
        <path d="M 385 1210 A 150 150 0 0 1 615 1210" />
      </g>

      <motion.g style={reduced ? undefined : { opacity: detailOpacity }} fill="none" stroke="rgba(245,194,66,0.42)" strokeWidth="3">
        <path d="M 70 520 H 930" strokeDasharray="12 18" />
        <path d="M 70 980 H 930" strokeDasharray="12 18" />
        <path d="M 285 70 V 1430" strokeDasharray="10 20" />
        <path d="M 715 70 V 1430" strokeDasharray="10 20" />
      </motion.g>

      <motion.g
        style={reduced ? undefined : { opacity: routeOpacity, pathLength: routeLength }}
        fill="none"
        stroke="url(#goldRoute)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        filter="url(#pitchGlow)"
      >
        <motion.path d="M 500 840 C 560 730 610 640 710 560 C 790 480 800 420 780 350" />
        <motion.path d="M 500 840 C 435 800 372 730 300 690" strokeWidth="8" opacity="0.8" />
        <motion.path d="M 500 840 C 525 740 515 610 500 360" strokeWidth="8" opacity="0.75" />
      </motion.g>

      <g>
        {opponents.map((player, index) => (
          <g key={index} transform={`translate(${player.x} ${player.y})`} opacity="0.82">
            <ellipse cx="0" cy="18" rx="24" ry="8" fill="rgba(0,0,0,0.22)" />
            <circle r="24" fill="#22498f" stroke="#8ab7ff" strokeWidth="4" />
          </g>
        ))}
      </g>

      <g filter="url(#hardShadow)">
        {pitchPlayers.map((player) => {
          const content = (
            <>
              <ellipse cx="0" cy="20" rx="26" ry="9" fill="rgba(0,0,0,0.24)" />
              <circle r="25" fill={player.focus ? "#f5c242" : "#f2f5f4"} stroke={player.focus ? "#fff4b8" : "#dce8e4"} strokeWidth="5" />
              <text
                y="7"
                textAnchor="middle"
                fontSize="23"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="900"
                fill={player.focus ? "#071813" : "#0c2018"}
              >
                {player.label}
              </text>
            </>
          );

          if (!player.focus) {
            return <g key={player.label} transform={`translate(${player.x} ${player.y})`}>{content}</g>;
          }

          return (
            <motion.g
              key={player.label}
              transform={`translate(${player.x} ${player.y})`}
              style={reduced ? undefined : { scale: playerScale, opacity: playerHalo, transformOrigin: "center" }}
            >
              <motion.circle r="52" fill="rgba(245,194,66,0.14)" stroke="rgba(245,194,66,0.42)" strokeWidth="4" />
              {content}
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}

const CinematicPitchHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 72, damping: 22, mass: 0.32 });
  const pitchScaleRaw = useTransform(smoothProgress, [0, 0.45, 0.95], [0.72, 1.08, 1.72]);
  const pitchYRaw = useTransform(smoothProgress, [0, 0.45, 0.95], [80, -70, -230]);
  const pitchXRaw = useTransform(smoothProgress, [0, 0.95], [0, -22]);
  const pitchRotateRaw = useTransform(smoothProgress, [0, 0.85], [63, 27]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.14, 0.32], [1, 1, 0]);
  const playerViewOpacity = useTransform(smoothProgress, [0.66, 0.84], [0, 1]);
  const frameOpacity = useTransform(smoothProgress, [0.04, 0.2], [0.45, 1]);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-[#06120d] text-white">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#06120d]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: reduced ? 0.8 : frameOpacity,
            background:
              "linear-gradient(180deg, rgba(3,9,14,0.92) 0%, rgba(6,18,13,0.18) 42%, rgba(3,9,14,0.86) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center justify-center [perspective:1100px]">
          <motion.div
            className="h-[118vh] w-[min(1220px,152vw)] origin-[50%_68%]"
            style={
              reduced
                ? undefined
                : {
                    scale: pitchScaleRaw,
                    x: pitchXRaw,
                    y: pitchYRaw,
                    rotateX: pitchRotateRaw,
                  }
            }
          >
            <PitchScene progress={smoothProgress} reduced={reduced} />
          </motion.div>
        </div>

        <motion.div
          style={reduced ? undefined : { opacity: heroOpacity }}
          className="container pointer-events-none relative z-20 flex min-h-screen items-center pb-20 pt-20"
        >
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-3 border border-accent/45 bg-black/24 px-3 py-2 text-xs font-bold uppercase text-accent backdrop-blur-md">
              <span className="h-[2px] w-8 bg-accent" aria-hidden="true" />
              <Shield className="h-4 w-4" strokeWidth={2} />
              Gunnilse IS · Spelmodellen 2026
            </div>
            <h1 className="max-w-4xl text-[3rem] font-black leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[5.65rem]">
              Spelet börjar
              <br />
              i varje detalj.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/76 md:text-lg">
              En levande plan där identitet, roller och aktioner växer fram när vi går från helhet till spelare.
            </p>
            <div className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-7 text-sm font-black text-[#07120d] transition hover:bg-accent/90"
              >
                <LogIn className="h-4 w-4" strokeWidth={2.25} />
                Logga in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-white/26 bg-white/8 px-7 text-sm font-bold text-white backdrop-blur-md transition hover:border-accent hover:text-accent"
              >
                <UserPlus className="h-4 w-4" strokeWidth={2.25} />
                Begär tillgång
              </Link>
            </div>
          </div>
        </motion.div>

        {beats.map((beat) => (
          <TacticalCallout key={beat.number} beat={beat} progress={smoothProgress} reduced={reduced} />
        ))}

        <motion.div
          style={reduced ? undefined : { opacity: playerViewOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 px-4"
        >
          <div className="mx-auto max-w-5xl border-t border-white/18 pt-5">
            <div className="flex flex-col justify-between gap-4 text-white md:flex-row md:items-end">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-accent">Närbild · nummer 6</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight md:text-5xl">
                  Läs läget, ta ytan, vinn nästa aktion.
                </h2>
              </div>
              <Link
                to="/identitet"
                className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-accent/60 bg-accent px-5 text-sm font-black text-[#07120d] transition hover:bg-accent/90"
              >
                Se identiteten
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicPitchHero;
