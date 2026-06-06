/**
 * ScanningScene — premium top-down "perception radar" för spelmodellen.se hero.
 *
 * Fågelperspektiv på en mörk taktisk plan (broadcast/analytics-estetik à la
 * SkillCorner / Sky tactical cam). Spelaren är en förfinad tracking-markör med
 * en SYNKON (field-of-view) som sveper omgivningen FÖRE mottagning — perception
 * blir synlig. Scanning → beslut (passningslinje löser upp sig) → aktion (boll
 * spelas genom den öppnade linjen). Loopar sömlöst.
 *
 * Grundat i scanning-forskning (Jordet m.fl., "visual exploratory behaviour"):
 *  - scan-kadensen STIGER ju närmare bollen är (~0.95 → 1.44 sweeps/s sista
 *    sekunden) → svep-gapen krymper 0.7 → 0.55 → 0.4 s.
 *  - korta, frekventa blickar; perception sker före touchen och GÖR aktionen bättre.
 *
 * Teknik: SVG + framer-motion useAnimate. Inga nya deps. prefers-reduced-motion →
 * statisk "beslutad" bild. Mobil: alltid svaga etiketter. Hover (desktop): etiketter.
 * Startar above-the-fold robust och pausar när fliken är dold (perf).
 */

import { useEffect, useState } from "react";
import { motion, useAnimate, type AnimationSequence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useIsMobile } from "@/hooks/use-mobile";

/* === Designtokens — mörk taktisk plan, grön möjlighet + amber hot === */
const C = {
  pitchTop: "#0a1813",
  pitchBot: "#060f0a",
  line: "rgba(150,214,180,0.13)",
  lineSoft: "rgba(150,214,180,0.07)",
  green: "#3ddc97", // medspelare / fri yta / vald linje
  amber: "#f6a945", // press / motståndare / synkon
  ball: "#f3fbf5",
  ink: "#06100b",
  text: "#cfeede",
} as const;

const SNAP: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STD: [number, number, number, number] = [0.4, 0, 0.2, 1];

/* Spelarens position (viewBox 0 0 1000 640). Anfallsriktning = höger. */
const PX = 372;
const PY = 332;
const FOV_R = 290; // synkonens räckvidd

type Tone = "amber" | "green";
type Node = { id: string; x: number; y: number; tone: Tone; r: number };
const NODES: Node[] = [
  { id: "press", x: 520, y: 372, tone: "amber", r: 11 }, // press stänger framifrån-ner
  { id: "cover", x: 556, y: 246, tone: "amber", r: 10 }, // täcker central linje
  { id: "mate", x: 748, y: 206, tone: "green", r: 13 }, // fri medspelare (vald)
  { id: "covmate", x: 726, y: 470, tone: "green", r: 9 }, // täckt medspelare (förkastad)
  { id: "feeder", x: 176, y: 452, tone: "green", r: 9 }, // matar in bollen
];
const N = (id: string) => NODES.find((n) => n.id === id)!;

/* Passningslinjer från spelaren. */
const LANE_CHOSEN = `M ${PX} ${PY} Q 560 250 ${N("mate").x} ${N("mate").y}`;
const LANE_REJECTED = `M ${PX} ${PY} Q 600 430 ${N("covmate").x} ${N("covmate").y}`;

/* Bollens väg: matare → spelaren (mottagning) → fri yta (touch) → fri medspelare (pass). */
const BALL_PATH = `M ${N("feeder").x} ${N("feeder").y} C 250 410 320 364 ${PX} ${PY} C 408 312 440 312 470 300 C 596 252 672 230 ${N("mate").x} ${N("mate").y}`;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pivot = (x: number, y: number) => ({
  transformBox: "view-box" as const,
  transformOrigin: `${x}px ${y}px`,
});

/* Synkon (FOV-sektor) pekande höger vid 0°, halvvinkel ~32°, roteras kring spelaren. */
const coneSector = () => {
  const half = (32 * Math.PI) / 180;
  const p1 = [PX + FOV_R * Math.cos(-half), PY + FOV_R * Math.sin(-half)];
  const p2 = [PX + FOV_R * Math.cos(half), PY + FOV_R * Math.sin(half)];
  return `M ${PX} ${PY} L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A ${FOV_R} ${FOV_R} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z`;
};

export default function ScanningScene({ reduced }: { reduced: boolean }) {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const isMobile = useIsMobile();

  // Starta vid scroll-in, men fall tillbaka till mount+1s ifall hero ligger
  // above-the-fold och IntersectionObserver aldrig fyrar (robusthet).
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (inView) {
      setArmed(true);
      return;
    }
    const t = setTimeout(() => setArmed(true), 1000);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (reduced || !armed) return;
    let cancelled = false;

    const seq: AnimationSequence = [
      /* nollställ till prep-läge (gör loopen sömlös + återhämtar från avbrott) */
      [".fov", { rotate: 0, opacity: 0.14 }, { at: 0, duration: 0 }],
      [".marker-face", { rotate: 0 }, { at: 0, duration: 0 }],
      [".lane-chosen", { strokeDashoffset: 1, opacity: 0.1 }, { at: 0, duration: 0 }],
      [".lane-rejected", { opacity: 0.18 }, { at: 0, duration: 0 }],
      [".zone-space", { opacity: 0.14, scale: 0.94 }, { at: 0, duration: 0 }],
      [".ball-mover", { opacity: 0, offsetDistance: "0%" }, { at: 0, duration: 0 }],
      [".core-press", { scale: 1, opacity: 0.5 }, { at: 0, duration: 0 }],
      [".core-cover", { scale: 1, opacity: 0.5 }, { at: 0, duration: 0 }],
      [".core-mate", { scale: 1, opacity: 0.5 }, { at: 0, duration: 0 }],
      [".ping", { opacity: 0, scale: 0.2 }, { at: 0, duration: 0 }],
      [".cue-1", { opacity: 0.26 }, { at: 0, duration: 0 }],
      [".cue-2", { opacity: 0.26 }, { at: 0, duration: 0 }],
      [".cue-3", { opacity: 0.26 }, { at: 0, duration: 0 }],

      /* SCAN 1 → press (ner-höger) */
      [".fov", { rotate: [0, 20], opacity: [0.14, 0.5, 0.2] }, { at: 1.1, duration: 0.5, ease: SNAP }],
      [".ping", { opacity: [0.5, 0], scale: [0.2, 1] }, { at: 1.12, duration: 0.95, ease: EXPO }],
      [".core-press", { scale: [1, 1.45, 1.08], opacity: [0.5, 1, 0.85] }, { at: 1.18, duration: 0.55 }],
      [".cue-1", { opacity: [0.26, 1] }, { at: 1.1, duration: 0.3 }],

      /* SCAN 2 → fri medspelare + yta (upp-höger), gap 0.7s */
      [".fov", { rotate: [20, -26], opacity: [0.14, 0.5, 0.2] }, { at: 1.8, duration: 0.5, ease: SNAP }],
      [".ping", { opacity: [0.5, 0], scale: [0.2, 1] }, { at: 1.82, duration: 0.95, ease: EXPO }],
      [".core-mate", { scale: [1, 1.5, 1.12], opacity: [0.5, 1, 0.92] }, { at: 1.88, duration: 0.55 }],
      [".zone-space", { opacity: [0.14, 0.42] }, { at: 1.92, duration: 0.5 }],

      /* SCAN 3 → över axeln, bakåt (upp-vänster), gap 0.55s (accelererar) */
      [".fov", { rotate: [-26, -142], opacity: [0.14, 0.42, 0.16] }, { at: 2.35, duration: 0.45, ease: SNAP }],
      [".ping", { opacity: [0.45, 0], scale: [0.2, 1] }, { at: 2.37, duration: 0.85, ease: EXPO }],
      [".core-cover", { scale: [1, 1.35, 1], opacity: [0.5, 0.95, 0.6] }, { at: 2.42, duration: 0.5 }],

      /* SCAN 4 → snabb front, gap 0.4s (snabbast) */
      [".fov", { rotate: [-142, -18] }, { at: 2.75, duration: 0.42, ease: SNAP }],

      /* BESLUT: vald linje tänds, förkastad dämpas, yta glöder */
      [".lane-chosen", { strokeDashoffset: [1, 0], opacity: [0.1, 1] }, { at: 3.1, duration: 0.62, ease: EXPO }],
      [".lane-rejected", { opacity: [0.18, 0.05] }, { at: 3.1, duration: 0.5 }],
      [".zone-space", { opacity: [0.42, 0.85], scale: [0.94, 1] }, { at: 3.2, duration: 0.55 }],
      [".fov", { opacity: [0.2, 0.32] }, { at: 3.2, duration: 0.4 }],
      [".core-mate", { scale: [1.12, 1.22], opacity: [0.92, 1] }, { at: 3.25, duration: 0.4 }],
      [".cue-2", { opacity: [0.26, 1] }, { at: 3.1, duration: 0.3 }],

      /* AKTION: boll in → första touch (markören vänds mot ytan) → pass genom linjen */
      [
        ".ball-mover",
        { opacity: [0, 1, 1, 1, 1], offsetDistance: ["0%", "34%", "34%", "48%", "100%"] },
        { at: 3.65, duration: 1.6, times: [0, 0.26, 0.33, 0.47, 1], ease: "easeInOut" },
      ],
      [".marker-face", { rotate: [0, -22] }, { at: 4.05, duration: 0.6, ease: SNAP }],
      [".fov", { opacity: [0.32, 0.12] }, { at: 4.05, duration: 0.5 }],
      [".cue-3", { opacity: [0.26, 1] }, { at: 4.0, duration: 0.3 }],
      [".core-mate", { scale: [1.22, 1.6, 1.15], opacity: [1, 1, 0.95] }, { at: 4.95, duration: 0.5 }],

      /* ÅTERSTÄLLNING till vila → loop */
      [".ball-mover", { opacity: [1, 0] }, { at: 5.25, duration: 0.4 }],
      [".lane-chosen", { opacity: [1, 0.1] }, { at: 5.4, duration: 0.5 }],
      [".lane-rejected", { opacity: [0.05, 0.18] }, { at: 5.4, duration: 0.5 }],
      [".zone-space", { opacity: [0.85, 0.14] }, { at: 5.4, duration: 0.5 }],
      [".marker-face", { rotate: [-22, 0] }, { at: 5.4, duration: 0.6, ease: STD }],
      [".fov", { rotate: [-18, 0], opacity: [0.12, 0.14] }, { at: 5.4, duration: 0.6, ease: STD }],
      [".core-press", { opacity: [0.85, 0.5], scale: 1 }, { at: 5.4, duration: 0.5 }],
      [".core-cover", { opacity: [0.6, 0.5], scale: 1 }, { at: 5.4, duration: 0.5 }],
      [".core-mate", { opacity: [0.95, 0.5], scale: 1 }, { at: 5.4, duration: 0.5 }],
      [".cue-1", { opacity: [1, 0.26] }, { at: 5.55, duration: 0.4 }],
      [".cue-2", { opacity: [1, 0.26] }, { at: 5.55, duration: 0.4 }],
      [".cue-3", { opacity: [1, 0.26] }, { at: 5.55, duration: 0.4 }],
      [".ball-mover", { offsetDistance: "0%" }, { at: 5.9, duration: 0 }],
    ];

    const run = async () => {
      await wait(450);
      while (!cancelled) {
        if (typeof document !== "undefined" && document.visibilityState === "hidden") {
          await wait(400);
          continue;
        }
        try {
          await animate(seq);
        } catch {
          break;
        }
        if (cancelled) break;
        await wait(750);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [reduced, armed, animate]);

  const labelClass = reduced
    ? "opacity-80"
    : isMobile
      ? "opacity-60"
      : "opacity-0 transition-opacity duration-300 group-hover:opacity-100";

  return (
    <div ref={inViewRef} className="group relative aspect-[1000/640] w-full">
      <svg
        ref={scope}
        viewBox="0 0 1000 640"
        className="h-full w-full"
        role="img"
        aria-label="Taktiskt fågelperspektiv: en spelare scannar planen med en synkon — press, fri medspelare och yta — och spelar bollen genom en öppnad passningslinje"
      >
        <defs>
          <linearGradient id="sc-pitch" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={C.pitchTop} />
            <stop offset="100%" stopColor={C.pitchBot} />
          </linearGradient>
          <radialGradient id="sc-marker" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#5af0b0" />
            <stop offset="100%" stopColor="#0c3a28" />
          </radialGradient>
          <radialGradient id="sc-greenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-amberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-zone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.3" />
            <stop offset="70%" stopColor={C.green} stopOpacity="0.09" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </radialGradient>
          {/* Synkon: ljus vid spelaren, tonar ut (userSpace → centrerad på pivot, rotationsinvariant) */}
          <radialGradient id="sc-cone" cx={PX} cy={PY} r={FOV_R} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.5" />
            <stop offset="55%" stopColor={C.amber} stopOpacity="0.16" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-vignette" cx="42%" cy="48%" r="70%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <filter id="sc-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sc-blur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <marker id="sc-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 L 3 5 z" fill={C.green} />
          </marker>
        </defs>

        {/* === Plan (top-down, anfallsriktning höger) === */}
        <rect x="0" y="0" width="1000" height="640" rx="16" fill="url(#sc-pitch)" />

        <g fill="none" stroke={C.line} strokeWidth="1.6">
          {/* ytterram */}
          <rect x="34" y="26" width="932" height="588" rx="6" />
          {/* mittlinje (vänster) + mittcirkel-båge */}
          <line x1="120" y1="26" x2="120" y2="614" stroke={C.lineSoft} />
          <path d="M 120 232 A 92 92 0 0 1 120 408" stroke={C.lineSoft} />
          {/* straffområde (höger, anfallsmål) */}
          <rect x="788" y="150" width="178" height="340" />
          <rect x="892" y="232" width="74" height="176" />
          <path d="M 788 268 A 92 92 0 0 0 788 372" />
        </g>
        {/* korridorer (horisontella band toward goal) */}
        <g stroke={C.lineSoft} strokeWidth="1.2" strokeDasharray="3 11">
          {[164, 250, 414, 500].map((y) => (
            <line key={y} x1="34" y1={y} x2="966" y2={y} />
          ))}
        </g>

        {/* perception-radar-ringar kring spelaren (svag, statisk) */}
        {[120, 200, 280].map((r) => (
          <circle key={r} cx={PX} cy={PY} r={r} fill="none" stroke="rgba(61,220,151,0.10)" strokeWidth="1.1" />
        ))}

        {/* fri yta (dit första touchen tar bollen) */}
        <g className="zone-space" style={{ ...pivot(606, 268), opacity: reduced ? 0.85 : 0.14 }}>
          <ellipse cx="606" cy="268" rx="118" ry="86" fill="url(#sc-zone)" />
          <ellipse cx="606" cy="268" rx="118" ry="86" fill="none" stroke={C.green} strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="5 8" />
        </g>

        {/* presstryck-pil mot spelaren */}
        <path
          d={`M ${N("press").x - 4} ${N("press").y - 2} Q 470 350 ${PX + 22} ${PY + 12}`}
          fill="none"
          stroke={C.amber}
          strokeOpacity="0.4"
          strokeWidth="1.6"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />

        {/* passningslinjer */}
        <path
          className="lane-rejected"
          d={LANE_REJECTED}
          fill="none"
          stroke={C.amber}
          strokeWidth="2"
          strokeDasharray="4 9"
          strokeLinecap="round"
          style={{ opacity: reduced ? 0.05 : 0.18 }}
        />
        <path
          className="lane-chosen"
          d={LANE_CHOSEN}
          fill="none"
          stroke={C.green}
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#sc-arrow)"
          filter="url(#sc-soft)"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: reduced ? 0 : 1, opacity: reduced ? 1 : 0.1 }}
        />

        {/* informationsnoder (motståndare/medspelare) */}
        {NODES.map((n) => {
          const isGreen = n.tone === "green";
          const color = isGreen ? C.green : C.amber;
          const glow = isGreen ? "url(#sc-greenGlow)" : "url(#sc-amberGlow)";
          const coreClass = n.id === "press" ? "core-press" : n.id === "cover" ? "core-cover" : n.id === "mate" ? "core-mate" : "";
          const baseOpacity = reduced ? (n.id === "mate" ? 1 : 0.62) : n.id === "covmate" || n.id === "feeder" ? 0.42 : 0.5;
          return (
            <g key={n.id}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r + 11}
                fill="none"
                stroke={color}
                strokeOpacity="0.28"
                strokeWidth="1.3"
                style={pivot(n.x, n.y)}
                {...(reduced
                  ? {}
                  : {
                      animate: { scale: [1, 1.45, 1], opacity: [0.32, 0, 0.32] },
                      transition: { duration: 3.4, repeat: Infinity, ease: "easeOut", delay: n.x / 380 },
                    })}
              />
              <circle cx={n.x} cy={n.y} r={n.r + 7} fill={glow} opacity="0.7" />
              <circle
                className={coreClass}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={color}
                stroke={C.ink}
                strokeOpacity="0.4"
                strokeWidth="1.5"
                style={{ ...pivot(n.x, n.y), opacity: baseOpacity }}
              />
              {/* liten kärnpunkt för "tracking dot"-känsla */}
              <circle cx={n.x} cy={n.y} r={n.r * 0.34} fill={C.ink} opacity="0.45" />
            </g>
          );
        })}

        {/* === Synkon (FOV) — roteras vid scanning === */}
        <g
          className="fov"
          style={{ ...pivot(PX, PY), transform: reduced ? "rotate(-18deg)" : undefined, opacity: reduced ? 0.32 : 0.14 }}
        >
          <path d={coneSector()} fill="url(#sc-cone)" />
          {/* tunna FOV-kanter */}
          <g stroke={C.amber} strokeOpacity="0.32" strokeWidth="1.2" strokeLinecap="round">
            <line x1={PX} y1={PY} x2={(PX + FOV_R * Math.cos((-32 * Math.PI) / 180)).toFixed(1)} y2={(PY + FOV_R * Math.sin((-32 * Math.PI) / 180)).toFixed(1)} />
            <line x1={PX} y1={PY} x2={(PX + FOV_R * Math.cos((32 * Math.PI) / 180)).toFixed(1)} y2={(PY + FOV_R * Math.sin((32 * Math.PI) / 180)).toFixed(1)} />
          </g>
        </g>

        {/* perception-ping (expanderar vid varje scan) */}
        <circle className="ping" cx={PX} cy={PY} r="150" fill="none" stroke={C.green} strokeWidth="1.6" style={{ ...pivot(PX, PY), opacity: 0 }} />

        {/* === Spelar-markör === */}
        <g>
          {/* mjuk glöd under markören */}
          <circle cx={PX} cy={PY} r="30" fill="url(#sc-greenGlow)" opacity="0.5" filter="url(#sc-blur)" />
          {/* kroppsriktnings-chevron (roterar vid första touch) */}
          <g className="marker-face" style={{ ...pivot(PX, PY), transform: reduced ? "rotate(-22deg)" : undefined }}>
            <path d={`M ${PX + 17} ${PY} l 13 -7 l -3 7 l 3 7 z`} fill={C.green} opacity="0.9" />
          </g>
          {/* disc */}
          <circle cx={PX} cy={PY} r="16" fill="url(#sc-marker)" stroke={C.green} strokeWidth="2" />
          <circle cx={PX} cy={PY} r="16" fill="none" stroke={C.ball} strokeOpacity="0.25" strokeWidth="1" />
          <circle cx={PX} cy={PY} r="4" fill={C.ball} opacity="0.9" />
        </g>

        {/* boll */}
        <g className="ball-mover" style={{ offsetPath: `path("${BALL_PATH}")`, offsetDistance: reduced ? "48%" : "0%", opacity: reduced ? 1 : 0 } as React.CSSProperties}>
          <circle r="22" fill="url(#sc-greenGlow)" filter="url(#sc-blur)" opacity="0.55" />
          <circle r="6.5" fill={C.ball} stroke={C.green} strokeWidth="1.4" />
        </g>

        {/* === Etiketter (hover desktop / alltid svag mobil+reduced) === */}
        <g fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize="12.5" fontWeight="700" letterSpacing="1.2">
          {[
            { x: N("press").x, y: N("press").y + 30, t: "PRESS", c: C.amber },
            { x: N("mate").x, y: N("mate").y - 24, t: "MEDSPELARE", c: C.green },
            { x: 606, y: 196, t: "YTA", c: C.green },
            { x: 470, y: 286, t: "NÄSTA AKTION", c: C.text },
          ].map((l) => (
            <text key={l.t} className={labelClass} x={l.x} y={l.y} textAnchor="middle" fill={l.c}>
              {l.t}
            </text>
          ))}
        </g>

        {/* === Cue-ord: SE → FÖRSTÅ → AGERA (tänds i takt med faserna) === */}
        <g fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize="13" fontWeight="700" letterSpacing="2.4" fill={C.text}>
          <text className="cue-1" x="40" y="606" style={{ opacity: reduced ? 1 : 0.26 }}>SE</text>
          <text x="74" y="606" opacity="0.28">→</text>
          <text className="cue-2" x="96" y="606" style={{ opacity: reduced ? 1 : 0.26 }}>FÖRSTÅ</text>
          <text x="176" y="606" opacity="0.28">→</text>
          <text className="cue-3" x="198" y="606" style={{ opacity: reduced ? 1 : 0.26 }}>AGERA</text>
        </g>

        {/* vinjett för djup */}
        <rect x="0" y="0" width="1000" height="640" rx="16" fill="url(#sc-vignette)" pointerEvents="none" />
      </svg>

      {/* Bildtext — knyter animationen till budskapet */}
      <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-amber-200/55">
        Spelet börjar innan bollen kommer
      </p>
    </div>
  );
}
