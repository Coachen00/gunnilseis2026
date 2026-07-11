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

import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* === Designtokens — mörk taktisk plan, grön möjlighet + amber hot === */
const C = {
  pitchTop: "#000052",
  pitchBot: "#00002e",
  line: "rgba(255,255,255,0.16)",
  lineSoft: "rgba(255,255,255,0.08)",
  green: "#0c44ac", // medspelare / fri yta / vald linje
  amber: "#ed0101", // press / motståndare / synkon
  ball: "#ffffff",
  ink: "#000052",
  text: "#ffffff",
} as const;

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
  const isMobile = useIsMobile();
  const animation = {
    duration: 6.4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };
  const scanTimes = [0, 0.16, 0.28, 0.39, 0.48, 0.62, 1];
  const scanTimes6 = [0, 0.2, 0.36, 0.52, 0.72, 1];
  const labelClass = reduced ? "opacity-80" : isMobile ? "opacity-65" : "opacity-80";

  return (
    <div className="group relative aspect-[1000/640] w-full">
      <svg
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
            <stop offset="0%" stopColor="#5d8fe8" />
            <stop offset="100%" stopColor="#000052" />
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
        <motion.g
          className="zone-space"
          style={pivot(606, 268)}
          initial={{ opacity: reduced ? 0.85 : 0.14, scale: reduced ? 1 : 0.94 }}
          animate={reduced ? undefined : { opacity: [0.14, 0.14, 0.42, 0.85, 0.85, 0.14], scale: [0.94, 0.94, 0.98, 1, 1, 0.94] }}
          transition={reduced ? undefined : { ...animation, times: scanTimes6 }}
        >
          <ellipse cx="606" cy="268" rx="118" ry="86" fill="url(#sc-zone)" />
          <ellipse cx="606" cy="268" rx="118" ry="86" fill="none" stroke={C.green} strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="5 8" />
        </motion.g>

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
        <motion.path
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
          initial={{ strokeDashoffset: reduced ? 0 : 1, opacity: reduced ? 1 : 0.1 }}
          animate={reduced ? undefined : { strokeDashoffset: [1, 1, 1, 0, 0, 1], opacity: [0.1, 0.1, 0.1, 1, 1, 0.1] }}
          transition={reduced ? undefined : { ...animation, times: scanTimes6 }}
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
              <motion.circle
                className={coreClass}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={color}
                stroke={C.ink}
                strokeOpacity="0.4"
                strokeWidth="1.5"
                style={pivot(n.x, n.y)}
                initial={{ opacity: baseOpacity, scale: 1 }}
                animate={reduced ? undefined : { scale: [1, 1, 1.3, 1, 1, 1] }}
                transition={reduced ? undefined : { ...animation, times: scanTimes6, delay: n.id === "press" ? 0.15 : n.id === "mate" ? 2.8 : 0.8 }}
              />
              {/* liten kärnpunkt för "tracking dot"-känsla */}
              <circle cx={n.x} cy={n.y} r={n.r * 0.34} fill={C.ink} opacity="0.45" />
            </g>
          );
        })}

        {/* === Synkon (FOV) — roteras vid scanning === */}
        <motion.g
          className="fov"
          style={pivot(PX, PY)}
          initial={{ rotate: reduced ? -18 : 0, opacity: reduced ? 0.32 : 0.14 }}
          animate={reduced ? undefined : { rotate: [0, 20, -26, -142, -18, -18, 0], opacity: [0.14, 0.5, 0.2, 0.42, 0.16, 0.32, 0.14] }}
          transition={reduced ? undefined : { ...animation, times: scanTimes }}
        >
          <path d={coneSector()} fill="url(#sc-cone)" />
          {/* tunna FOV-kanter */}
          <g stroke={C.amber} strokeOpacity="0.32" strokeWidth="1.2" strokeLinecap="round">
            <line x1={PX} y1={PY} x2={(PX + FOV_R * Math.cos((-32 * Math.PI) / 180)).toFixed(1)} y2={(PY + FOV_R * Math.sin((-32 * Math.PI) / 180)).toFixed(1)} />
            <line x1={PX} y1={PY} x2={(PX + FOV_R * Math.cos((32 * Math.PI) / 180)).toFixed(1)} y2={(PY + FOV_R * Math.sin((32 * Math.PI) / 180)).toFixed(1)} />
          </g>
        </motion.g>

        {/* perception-ping (expanderar vid varje scan) */}
        <motion.circle
          className="ping"
          cx={PX}
          cy={PY}
          r="150"
          fill="none"
          stroke={C.green}
          strokeWidth="1.6"
          style={pivot(PX, PY)}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={reduced ? undefined : { opacity: [0, 0.65, 0, 0, 0.6, 0, 0], scale: [0.2, 1, 0.2, 0.2, 1, 0.2, 0.2] }}
          transition={reduced ? undefined : { ...animation, times: scanTimes }}
        />

        {/* === Spelar-markör === */}
        <g>
          {/* mjuk glöd under markören */}
          <circle cx={PX} cy={PY} r="30" fill="url(#sc-greenGlow)" opacity="0.5" filter="url(#sc-blur)" />
          {/* kroppsriktnings-chevron (roterar vid första touch) */}
          <motion.g
            className="marker-face"
            style={pivot(PX, PY)}
            initial={{ rotate: reduced ? -22 : 0 }}
            animate={reduced ? undefined : { rotate: [0, 0, 0, 0, -22, -22, 0] }}
            transition={reduced ? undefined : { ...animation, times: scanTimes }}
          >
            <path d={`M ${PX + 17} ${PY} l 13 -7 l -3 7 l 3 7 z`} fill={C.green} opacity="0.9" />
          </motion.g>
          {/* disc */}
          <circle cx={PX} cy={PY} r="16" fill="url(#sc-marker)" stroke={C.green} strokeWidth="2" />
          <circle cx={PX} cy={PY} r="16" fill="none" stroke={C.ball} strokeOpacity="0.25" strokeWidth="1" />
          <circle cx={PX} cy={PY} r="4" fill={C.ball} opacity="0.9" />
        </g>

        {/* boll */}
        <motion.circle
          className="ball-mover"
          r="22"
          fill="url(#sc-greenGlow)"
          filter="url(#sc-blur)"
          opacity="0.55"
          initial={{ cx: N("feeder").x, cy: N("feeder").y, opacity: reduced ? 0.55 : 0 }}
          animate={reduced ? undefined : { cx: [N("feeder").x, N("feeder").x, PX, 470, N("mate").x, N("feeder").x], cy: [N("feeder").y, N("feeder").y, PY, 300, N("mate").y, N("feeder").y], opacity: [0, 0, 1, 1, 1, 0] }}
          transition={reduced ? undefined : { duration: 6.4, repeat: Infinity, times: [0, 0.43, 0.56, 0.64, 0.88, 1], ease: "easeInOut" }}
        />
        <motion.circle
          className="ball-mover-core"
          r="6.5"
          fill={C.ball}
          stroke={C.green}
          strokeWidth="1.4"
          initial={{ cx: N("feeder").x, cy: N("feeder").y, opacity: reduced ? 1 : 0 }}
          animate={reduced ? undefined : { cx: [N("feeder").x, N("feeder").x, PX, 470, N("mate").x, N("feeder").x], cy: [N("feeder").y, N("feeder").y, PY, 300, N("mate").y, N("feeder").y], opacity: [0, 0, 1, 1, 1, 0] }}
          transition={reduced ? undefined : { duration: 6.4, repeat: Infinity, times: [0, 0.43, 0.56, 0.64, 0.88, 1], ease: "easeInOut" }}
        />

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
          <motion.text
            className="cue-1"
            x="40"
            y="606"
            initial={{ opacity: reduced ? 1 : 0.26 }}
            animate={reduced ? undefined : { opacity: [0.26, 1, 0.26, 0.26, 0.26, 0.26, 0.26] }}
            transition={reduced ? undefined : { ...animation, times: scanTimes }}
          >
            SE
          </motion.text>
          <text x="74" y="606" opacity="0.28">→</text>
          <motion.text
            className="cue-2"
            x="96"
            y="606"
            initial={{ opacity: reduced ? 1 : 0.26 }}
            animate={reduced ? undefined : { opacity: [0.26, 0.26, 0.26, 1, 1, 0.26, 0.26] }}
            transition={reduced ? undefined : { ...animation, times: scanTimes }}
          >
            FÖRSTÅ
          </motion.text>
          <text x="176" y="606" opacity="0.28">→</text>
          <motion.text
            className="cue-3"
            x="198"
            y="606"
            initial={{ opacity: reduced ? 1 : 0.26 }}
            animate={reduced ? undefined : { opacity: [0.26, 0.26, 0.26, 0.26, 0.26, 1, 0.26] }}
            transition={reduced ? undefined : { ...animation, times: scanTimes }}
          >
            AGERA
          </motion.text>
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
