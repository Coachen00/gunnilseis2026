/**
 * ScanningScene — premiumvisualisering av perception → beslut → aktion.
 *
 * Ersätter den tidigare "spelvändnings"-scenen i hero. Visar en elitspelares
 * scanning FÖRE mottagning: huvudet vrids i accelererande kadens, varje scan
 * tänder informationsnoder (press / medspelare / yta), besluten kopplas till en
 * passningslinje, och första touchen tar bollen bort från press in i fri yta —
 * följt av passningen genom den öppnade linjen. Loopar sömlöst.
 *
 * Beteendet är grundat i forskning på "visual exploratory behaviour" (Jordet m.fl.):
 *  - scanning-frekvensen STIGER ju närmare bollen är (~0.95/s → ~1.44/s sista sekunden),
 *    därför accelererar scan-kadensen i timelinen (gap 0.7s → 0.55s → 0.4s).
 *  - blickarna är korta och frekventa, inte långa stirr.
 *  - perceptionen sker före touchen och GÖR den efterföljande aktionen bättre.
 *
 * Teknik: SVG + framer-motion useAnimate (en imperativ, synkad berättelse-timeline).
 * Inga nya beroenden. prefers-reduced-motion → statisk "beslutad" slutbild som
 * kommunicerar hela idén utan rörelse. Animationen startar först när scenen
 * scrollas in och pausar när fliken är dold (perf).
 */

import { useEffect, useState } from "react";
import { motion, useAnimate, type AnimationSequence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useIsMobile } from "@/hooks/use-mobile";

/* === Designtokens — mörk taktisk plan, en grön + en amber accent === */
const C = {
  pitchTop: "#0b1712",
  pitchBot: "#081009",
  grid: "rgba(176,224,196,0.06)",
  radar: "rgba(120,200,160,0.16)",
  green: "#34d39a", // medspelare / fri yta / lyckad linje ("möjlighet")
  greenSoft: "rgba(52,211,154,0.16)",
  amber: "#f5b042", // press / motståndare / scan-kon ("hot / uppmärksamhet")
  amberSoft: "rgba(245,176,66,0.16)",
  limbDark: "#06120d", // siluett sitter i den mörka scenen
  limbLit: "#173b2c",
  rim: "rgba(110,231,183,0.85)", // emerald rim-light på ledande kant
  joint: "rgba(110,231,183,0.5)", // tracking-data-leder
  cream: "#eaf6ee",
} as const;

/* Easing-kurvor som läser som "dyrt": snabb ut, mjuk sättning. */
const SNAP: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STD: [number, number, number, number] = [0.4, 0, 0.2, 1];

/* Spelarens "skelett" i SVG-koordinater (viewBox 0 0 1000 640).
   Trekvartsvänd, spelbar position, kroppen lätt öppen mot vänster (dit hen ska spela). */
const SK = {
  neck: [555, 196] as const,
  hip: [560, 330] as const,
  chest: [557, 230] as const,
  shoulderF: [523, 219], // främre axel: lägre + längre fram (öppen kropp)
  shoulderB: [583, 205], // bakre axel: indragen + höjd (djup)
  hipF: [536, 330],
  hipB: [580, 326],
  elbowF: [503, 264],
  handF: [511, 308],
  elbowB: [606, 247],
  handB: [629, 281],
  kneeBack: [597, 396],
  footBack: [617, 460],
  kneeFront: [531, 398],
  footFront: [508, 464],
  headC: [549, 156] as const, // huvudet något framåt-vänster = trekvartsvänt
  headR: 22,
};

/* Informationsnoder runt spelaren. tone styr färg, dim = förkastat alternativ. */
type NodeTone = "amber" | "green";
const NODES: { id: string; x: number; y: number; tone: NodeTone; r: number }[] = [
  { id: "press", x: 768, y: 332, tone: "amber", r: 9 }, // press bakifrån-höger
  { id: "central", x: 522, y: 122, tone: "amber", r: 8 }, // stängd central linje
  { id: "mate", x: 228, y: 250, tone: "green", r: 9 }, // fri medspelare (vald)
  { id: "covered", x: 852, y: 226, tone: "green", r: 7 }, // täckt medspelare (förkastad)
];

/* Bollens väg: djupt bakifrån → spelarens fötter (mottagning) → fri yta (touch) → fri medspelare (pass). */
const BALL_PATH =
  "M 664 602 C 616 548 578 498 560 462 C 548 434 512 420 470 408 C 392 384 300 318 228 252";

/* Passningslinjer från spelaren (bröstpunkt). */
const PLAYER_HUB = [560, 300] as const;
const LANE_CHOSEN = `M ${PLAYER_HUB[0]} ${PLAYER_HUB[1]} Q 430 300 ${NODES[2].x} ${NODES[2].y}`;
const LANE_REJECTED = `M ${PLAYER_HUB[0]} ${PLAYER_HUB[1]} Q 700 270 ${NODES[3].x} ${NODES[3].y}`;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* origin-helper: rotera/skala kring exakt SVG-punkt (transform-box: view-box krävs). */
const pivot = (x: number, y: number) => ({
  transformBox: "view-box" as const,
  transformOrigin: `${x}px ${y}px`,
});

export default function ScanningScene({ reduced }: { reduced: boolean }) {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const isMobile = useIsMobile();

  // Starta vid scroll-in, men fall tillbaka till mount + 1s ifall hero ligger
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
      /* --- nollställ till prep-läge (gör loopen sömlös + återhämtar från avbrott) --- */
      [".head", { rotate: 0 }, { at: 0, duration: 0 }],
      [".player-turn", { rotate: 0, x: 0 }, { at: 0, duration: 0 }],
      [".cone", { opacity: 0 }, { at: 0, duration: 0 }],
      [".scan-radar", { opacity: 0, scale: 0.55 }, { at: 0, duration: 0 }],
      [".lane-chosen", { strokeDashoffset: 1, opacity: 0.12 }, { at: 0, duration: 0 }],
      [".lane-rejected", { opacity: 0.22 }, { at: 0, duration: 0 }],
      [".zone-space", { opacity: 0.16, scale: 0.96 }, { at: 0, duration: 0 }],
      [".ball-mover", { opacity: 0, offsetDistance: "0%" }, { at: 0, duration: 0 }],
      [".core-press", { scale: 1, opacity: 0.55 }, { at: 0, duration: 0 }],
      [".core-mate", { scale: 1, opacity: 0.5 }, { at: 0, duration: 0 }],
      [".core-central", { scale: 1, opacity: 0.5 }, { at: 0, duration: 0 }],
      [".cue-1", { opacity: 0.28 }, { at: 0, duration: 0 }],
      [".cue-2", { opacity: 0.28 }, { at: 0, duration: 0 }],
      [".cue-3", { opacity: 0.28 }, { at: 0, duration: 0 }],

      /* --- SCAN 1 → höger (press) --- */
      [".head", { rotate: [0, 18] }, { at: 1.1, duration: 0.32, ease: SNAP }],
      [".cone", { opacity: [0, 0.5, 0] }, { at: 1.1, duration: 0.72, ease: STD }],
      [".scan-radar", { opacity: [0, 0.55, 0], scale: [0.55, 1.25, 1.45] }, { at: 1.12, duration: 0.95, ease: EXPO }],
      [".core-press", { scale: [1, 1.4, 1.08], opacity: [0.55, 1, 0.85] }, { at: 1.2, duration: 0.55 }],
      [".cue-1", { opacity: [0.28, 1] }, { at: 1.1, duration: 0.3 }],

      /* --- SCAN 2 → vänster (fri medspelare + yta), gap 0.7s --- */
      [".head", { rotate: [18, -22] }, { at: 1.8, duration: 0.34, ease: SNAP }],
      [".cone", { opacity: [0, 0.5, 0] }, { at: 1.8, duration: 0.72, ease: STD }],
      [".scan-radar", { opacity: [0, 0.5, 0], scale: [0.55, 1.25, 1.45] }, { at: 1.82, duration: 0.95, ease: EXPO }],
      [".core-mate", { scale: [1, 1.45, 1.12], opacity: [0.5, 1, 0.9] }, { at: 1.9, duration: 0.55 }],
      [".zone-space", { opacity: [0.16, 0.42] }, { at: 1.95, duration: 0.5 }],

      /* --- SCAN 3 → över axeln (press/central), gap 0.55s (accelererar) --- */
      [".head", { rotate: [-22, 28] }, { at: 2.35, duration: 0.3, ease: SNAP }],
      [".cone", { opacity: [0, 0.42, 0] }, { at: 2.35, duration: 0.6, ease: STD }],
      [".core-press", { scale: [1.08, 1.3, 1], opacity: [0.85, 1, 0.72] }, { at: 2.4, duration: 0.5 }],
      [".core-central", { scale: [1, 1.28, 1], opacity: [0.5, 0.95, 0.6] }, { at: 2.45, duration: 0.5 }],

      /* --- SCAN 4 → snabb front, gap 0.4s (snabbast) --- */
      [".head", { rotate: [28, -4, 0] }, { at: 2.75, duration: 0.34, ease: SNAP }],

      /* --- BESLUT: vald linje tänds, förkastad dämpas, fri yta glöder --- */
      [".lane-chosen", { strokeDashoffset: [1, 0], opacity: [0.12, 1] }, { at: 3.05, duration: 0.62, ease: EXPO }],
      [".lane-rejected", { opacity: [0.22, 0.05] }, { at: 3.05, duration: 0.5 }],
      [".zone-space", { opacity: [0.42, 0.85], scale: [0.96, 1] }, { at: 3.15, duration: 0.55 }],
      [".core-mate", { scale: [1.12, 1.22], opacity: [0.9, 1] }, { at: 3.2, duration: 0.4 }],
      [".cue-2", { opacity: [0.28, 1] }, { at: 3.05, duration: 0.3 }],

      /* --- AKTION: boll in → första touch bort från press → pass genom linjen --- */
      [
        ".ball-mover",
        { opacity: [0, 1, 1, 1, 1], offsetDistance: ["0%", "36%", "36%", "54%", "100%"] },
        { at: 3.6, duration: 1.55, times: [0, 0.26, 0.33, 0.49, 1], ease: "easeInOut" },
      ],
      [".player-turn", { rotate: [0, -6, -4], x: [0, -7, -5] }, { at: 4.05, duration: 0.62, ease: SNAP }],
      [".cue-3", { opacity: [0.28, 1] }, { at: 4.0, duration: 0.3 }],
      [".core-mate", { scale: [1.22, 1.6, 1.15], opacity: [1, 1, 0.95] }, { at: 4.92, duration: 0.5 }],

      /* --- ÅTERSTÄLLNING till vila (mjukt, sedan loop) --- */
      [".ball-mover", { opacity: [1, 0] }, { at: 5.2, duration: 0.4 }],
      [".lane-chosen", { opacity: [1, 0.12] }, { at: 5.35, duration: 0.5 }],
      [".lane-rejected", { opacity: [0.05, 0.22] }, { at: 5.35, duration: 0.5 }],
      [".zone-space", { opacity: [0.85, 0.16] }, { at: 5.35, duration: 0.5 }],
      [".player-turn", { rotate: [-4, 0], x: [-5, 0] }, { at: 5.35, duration: 0.6, ease: STD }],
      [".core-press", { opacity: [0.72, 0.55], scale: 1 }, { at: 5.35, duration: 0.5 }],
      [".core-mate", { opacity: [0.95, 0.5], scale: 1 }, { at: 5.35, duration: 0.5 }],
      [".core-central", { opacity: [0.6, 0.5] }, { at: 5.35, duration: 0.5 }],
      [".cue-1", { opacity: [1, 0.28] }, { at: 5.5, duration: 0.4 }],
      [".cue-2", { opacity: [1, 0.28] }, { at: 5.5, duration: 0.4 }],
      [".cue-3", { opacity: [1, 0.28] }, { at: 5.5, duration: 0.4 }],
      [".ball-mover", { offsetDistance: "0%" }, { at: 5.85, duration: 0 }],
    ];

    const run = async () => {
      // liten startfördröjning så scenen "andas" in innan första scanen
      await wait(450);
      while (!cancelled) {
        if (typeof document !== "undefined" && document.visibilityState === "hidden") {
          await wait(400);
          continue;
        }
        try {
          await animate(seq);
        } catch {
          break; // scope unmountad / avbruten
        }
        if (cancelled) break;
        await wait(750); // medveten vila innan loopen tar om
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [reduced, armed, animate]);

  // Etiketternas synlighet: hover på desktop, alltid svagt synliga på mobil/reduced.
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
        aria-label="En spelare scannar planen — press, fri medspelare och yta — och spelar bollen genom en öppnad passningslinje"
      >
        <defs>
          <linearGradient id="sc-pitch" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={C.pitchTop} />
            <stop offset="100%" stopColor={C.pitchBot} />
          </linearGradient>
          <linearGradient id="sc-limb" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={C.limbLit} />
            <stop offset="100%" stopColor={C.limbDark} />
          </linearGradient>
          <radialGradient id="sc-greenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-amberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sc-zone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.28" />
            <stop offset="70%" stopColor={C.green} stopOpacity="0.08" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0" />
          </radialGradient>
          {/* x1=1 → ljus vid huvudet (höger), tonar ut mot blickfältet (vänster) */}
          <linearGradient id="sc-cone" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.5" />
            <stop offset="65%" stopColor={C.amber} stopOpacity="0.12" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sc-head" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor={C.limbLit} />
            <stop offset="100%" stopColor={C.limbDark} />
          </radialGradient>
          <filter id="sc-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sc-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <marker id="sc-arrow" markerWidth="11" markerHeight="11" refX="8" refY="5.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 11 5.5 L 0 11 L 3 5.5 z" fill={C.green} />
          </marker>
        </defs>

        {/* === Plan === */}
        <rect x="0" y="0" width="1000" height="640" rx="16" fill="url(#sc-pitch)" />
        {/* Korridorlinjer (subtil spelmodell-logik) */}
        {[200, 400, 600, 800].map((x) => (
          <line key={x} x1={x} y1="24" x2={x} y2="616" stroke={C.grid} strokeWidth="1.5" />
        ))}
        <line x1="24" y1="320" x2="976" y2="320" stroke={C.grid} strokeWidth="1.5" />

        {/* Radarringar kring spelaren — "perceptionsfält" */}
        {[150, 230].map((r) => (
          <circle key={r} cx={PLAYER_HUB[0]} cy={PLAYER_HUB[1] + 30} r={r} fill="none" stroke={C.radar} strokeWidth="1.2" strokeDasharray="2 8" />
        ))}

        {/* Fri yta (dit första touchen går) */}
        <g className="zone-space" style={{ ...pivot(430, 400), opacity: reduced ? 0.85 : 0.16 }}>
          <ellipse cx="430" cy="400" rx="120" ry="78" fill="url(#sc-zone)" />
          <ellipse cx="430" cy="400" rx="120" ry="78" fill="none" stroke={C.green} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="5 7" />
        </g>

        {/* Passningslinjer */}
        <path
          className="lane-rejected"
          d={LANE_REJECTED}
          fill="none"
          stroke={C.amber}
          strokeWidth="2"
          strokeDasharray="4 9"
          strokeLinecap="round"
          style={{ opacity: reduced ? 0.05 : 0.22 }}
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
          style={{ strokeDashoffset: reduced ? 0 : 1, opacity: reduced ? 1 : 0.12 }}
        />

        {/* Presspil (riktning på trycket mot spelaren) */}
        <path
          d={`M ${NODES[0].x - 6} ${NODES[0].y - 4} Q 680 320 ${PLAYER_HUB[0] + 26} ${PLAYER_HUB[1] + 6}`}
          fill="none"
          stroke={C.amber}
          strokeOpacity="0.4"
          strokeWidth="1.6"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />

        {/* Informationsnoder */}
        {NODES.map((n) => {
          const isGreen = n.tone === "green";
          const glow = isGreen ? "url(#sc-greenGlow)" : "url(#sc-amberGlow)";
          const color = isGreen ? C.green : C.amber;
          const coreClass = n.id === "press" ? "core-press" : n.id === "mate" ? "core-mate" : n.id === "central" ? "core-central" : "";
          const baseOpacity = reduced ? (n.id === "mate" ? 1 : 0.6) : n.id === "covered" ? 0.45 : 0.5;
          return (
            <g key={n.id}>
              {/* ambient halo-puls */}
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r + 10}
                fill="none"
                stroke={color}
                strokeOpacity="0.3"
                strokeWidth="1.4"
                style={pivot(n.x, n.y)}
                {...(reduced
                  ? {}
                  : {
                      animate: { scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] },
                      transition: { duration: 3.2, repeat: Infinity, ease: "easeOut", delay: n.x / 400 },
                    })}
              />
              <circle cx={n.x} cy={n.y} r={n.r + 6} fill={glow} opacity="0.7" />
              <circle
                className={coreClass}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={color}
                stroke={C.cream}
                strokeOpacity="0.25"
                strokeWidth="1"
                style={{ ...pivot(n.x, n.y), opacity: baseOpacity }}
              />
            </g>
          );
        })}

        {/* === Spelare === */}
        <g className="player-turn" style={{ ...pivot(SK.hip[0], SK.hip[1]), transform: reduced ? "rotate(-4deg) translateX(-5px)" : undefined }}>
          {/* markkontakt-skugga */}
          <ellipse cx="566" cy="468" rx="74" ry="15" fill="#000" opacity="0.32" filter="url(#sc-blur)" />

          {/* ben (kapslar) */}
          <g fill="none" stroke="url(#sc-limb)" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M ${SK.hipB[0]} ${SK.hipB[1]} L ${SK.kneeBack[0]} ${SK.kneeBack[1]} L ${SK.footBack[0]} ${SK.footBack[1]}`} strokeWidth="20" />
            <path d={`M ${SK.hipF[0]} ${SK.hipF[1]} L ${SK.kneeFront[0]} ${SK.kneeFront[1]} L ${SK.footFront[0]} ${SK.footFront[1]}`} strokeWidth="19" />
          </g>

          {/* överkropp + armar (svag andnings-sway) */}
          <motion.g
            className="torso"
            style={pivot(SK.chest[0], SK.chest[1])}
            {...(reduced ? {} : { animate: { y: [0, -2.2, 0] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } })}
          >
            {/* torso */}
            <path
              d={`M ${SK.shoulderF[0]} ${SK.shoulderF[1]} Q 560 200 ${SK.shoulderB[0]} ${SK.shoulderB[1]} L ${SK.hipB[0]} ${SK.hipB[1]} Q 560 340 ${SK.hipF[0]} ${SK.hipF[1]} Z`}
              fill="url(#sc-limb)"
              stroke={C.rim}
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
            {/* armar — främre tjockare (närmare), bakre tunnare (djup) */}
            <g fill="none" stroke="url(#sc-limb)" strokeLinecap="round" strokeLinejoin="round">
              <path d={`M ${SK.shoulderB[0]} ${SK.shoulderB[1]} L ${SK.elbowB[0]} ${SK.elbowB[1]} L ${SK.handB[0]} ${SK.handB[1]}`} strokeWidth="9.5" />
              <path d={`M ${SK.shoulderF[0]} ${SK.shoulderF[1]} L ${SK.elbowF[0]} ${SK.elbowF[1]} L ${SK.handF[0]} ${SK.handF[1]}`} strokeWidth="12" />
            </g>
            {/* rim-light längs ledande kant */}
            <path d={`M ${SK.shoulderF[0]} ${SK.shoulderF[1]} Q 532 270 ${SK.hipF[0]} ${SK.hipF[1]}`} fill="none" stroke={C.rim} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          </motion.g>

          {/* tracking-leder — ger "spårad atlet"/sport-tech-känsla */}
          <g fill={C.joint}>
            {[SK.shoulderF, SK.shoulderB, SK.elbowF, SK.elbowB, SK.hipF, SK.hipB, SK.kneeFront, SK.kneeBack].map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={i < 2 ? 3 : 2.4} />
            ))}
          </g>

          {/* huvud (roterar vid scanning, pivot = nacke) */}
          <g
            className="head"
            style={{ ...pivot(SK.neck[0], SK.neck[1]), transform: reduced ? "rotate(-12deg)" : undefined }}
          >
            {/* scan-kon — sitter i huvudgruppen → sveper med blicken */}
            <path className="cone" d={`M ${SK.headC[0]} ${SK.headC[1]} L 470 ${SK.headC[1] - 52} L 470 ${SK.headC[1] + 50} Z`} fill="url(#sc-cone)" style={{ opacity: reduced ? 0.16 : 0 }} />
            {/* nacke */}
            <path d={`M ${SK.neck[0] - 7} ${SK.neck[1]} L ${SK.headC[0] - 5} ${SK.headC[1] + 13} L ${SK.headC[0] + 7} ${SK.headC[1] + 13} L ${SK.neck[0] + 9} ${SK.neck[1]} Z`} fill="url(#sc-limb)" />
            <circle cx={SK.headC[0]} cy={SK.headC[1]} r={SK.headR} fill="url(#sc-head)" stroke={C.rim} strokeOpacity="0.5" strokeWidth="1.3" />
            {/* rim-light på ledande (vänster) kant */}
            <path d={`M ${SK.headC[0] - 3} ${SK.headC[1] - SK.headR + 3} A ${SK.headR} ${SK.headR} 0 0 0 ${SK.headC[0] - SK.headR + 4} ${SK.headC[1] + 9}`} fill="none" stroke={C.rim} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            {/* visir/blickriktning framåt-vänster */}
            <path d={`M ${SK.headC[0] - 15} ${SK.headC[1] - 3} Q ${SK.headC[0] - 20} ${SK.headC[1] + 3} ${SK.headC[0] - 14} ${SK.headC[1] + 9}`} fill="none" stroke={C.green} strokeOpacity="0.85" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>

        {/* markprojicerad scan-radar (expanderar vid varje scan) */}
        <circle className="scan-radar" cx={PLAYER_HUB[0]} cy={PLAYER_HUB[1] + 36} r="120" fill="none" stroke={C.green} strokeWidth="1.6" style={{ ...pivot(PLAYER_HUB[0], PLAYER_HUB[1] + 36), opacity: 0 }} />

        {/* boll */}
        <g className="ball-mover" style={{ offsetPath: `path("${BALL_PATH}")`, offsetDistance: reduced ? "54%" : "0%", opacity: reduced ? 1 : 0 } as React.CSSProperties}>
          <circle r="26" fill="url(#sc-greenGlow)" filter="url(#sc-blur)" opacity="0.6" />
          <circle r="7" fill={C.cream} stroke={C.green} strokeWidth="1.5" />
        </g>

        {/* === Etiketter (hover desktop / alltid svag mobil+reduced) === */}
        {[
          { x: NODES[0].x, y: NODES[0].y - 20, t: "Press", c: C.amber, anchor: "middle" as const },
          { x: NODES[2].x, y: NODES[2].y - 20, t: "Medspelare", c: C.green, anchor: "middle" as const },
          { x: 430, y: 332, t: "Yta", c: C.green, anchor: "middle" as const },
          { x: 360, y: 286, t: "Nästa aktion", c: C.cream, anchor: "middle" as const },
        ].map((l) => (
          <text
            key={l.t}
            className={labelClass}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="13"
            fontWeight="800"
            letterSpacing="0.8"
            fill={l.c}
          >
            {l.t}
          </text>
        ))}

        {/* === Cue-ord: Se → Förstå → Agera (tänds i takt med faserna) === */}
        <g fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize="13" fontWeight="700" letterSpacing="2" fill={C.cream}>
          <text className="cue-1" x="40" y="606" style={{ opacity: reduced ? 1 : 0.28 }}>SE</text>
          <text x="78" y="606" opacity="0.3">→</text>
          <text className="cue-2" x="100" y="606" style={{ opacity: reduced ? 1 : 0.28 }}>FÖRSTÅ</text>
          <text x="178" y="606" opacity="0.3">→</text>
          <text className="cue-3" x="200" y="606" style={{ opacity: reduced ? 1 : 0.28 }}>AGERA</text>
        </g>
      </svg>

      {/* Bildtext — knyter animationen till budskapet */}
      <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-amber-200/55">
        Spelet börjar innan bollen kommer
      </p>
    </div>
  );
}
