/**
 * PaintedScenes — fem digitalt målade 2D-miljöer för taktiktavlan.
 *
 * Varje scen returneras som inline SVG (16:9). Inga binärer behövs:
 *  - Skarpa på alla skärmar (SVG = vektor + raster-effekter via filter)
 *  - Snabba (~5–8 KB var i bundle)
 *  - Inga spelare, pilar, text eller färdiga taktiska objekt — bara
 *    miljön där taktiken läggs ovanpå
 *  - `pointer-events: none` sätts av wrappern, inte här
 *
 * Designprinciper:
 *  - Mjuk målad känsla via SVG-filter (turbulence + displacement +
 *    soft-light blending). Aldrig suddiga eller röriga.
 *  - Ljus nog att spelare/labels alltid är läsbara på toppen.
 *  - Brand: amber, swedish-blue, forest-green-toner.
 *  - Inga gradients som blänker eller är skrikiga.
 */

import type { CSSProperties } from "react";

type SceneRendererProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Gemensamma SVG-defs som flera scener återanvänder.
 * Importerat en gång per scen (lokala IDs så de inte krockar).
 */
const Defs = ({ id }: { id: string }) => (
  <defs>
    {/* Organisk turbulens — basen för "målat" känsla */}
    <filter id={`${id}-paint`} x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="3" />
      <feColorMatrix
        values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0.18 0"
      />
      <feComposite in2="SourceGraphic" operator="in" />
      <feBlend in="SourceGraphic" mode="soft-light" />
    </filter>
    {/* Subtle grain — paper/canvas-känsla */}
    <filter id={`${id}-grain`} x="0%" y="0%" width="100%" height="100%">
      <feTurbulence baseFrequency="1.8" numOctaves="1" seed="7" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" />
    </filter>
  </defs>
);

/* =================================================================
   SCEN 1 — TRAINING_PITCH_PAINTED (alternativ till webp:en)
   Mjuka stripes, varm sommarsol. SVG-versionen är fallback/utbyt.
   ================================================================= */
export const TrainingPitchPaintedScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="tp" />
    {/* Bas-tone: varm gräsgrön */}
    <rect width="1600" height="900" fill="#4d8a3a" />
    {/* Vertikala stripes — målade som om de var klippta */}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect
        key={i}
        x={i * 178}
        y="0"
        width="89"
        height="900"
        fill={i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}
      />
    ))}
    {/* Soft ljus i mitten ovanifrån */}
    <radialGradient id="tp-light" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stopColor="rgba(255,243,200,0.22)" />
      <stop offset="100%" stopColor="rgba(255,243,200,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#tp-light)" />
    {/* Målat brus */}
    <rect width="1600" height="900" filter={`url(#tp-paint)`} fill="#3f7530" opacity="0.45" />
    <rect width="1600" height="900" filter={`url(#tp-grain)`} opacity="0.5" />
  </svg>
);

/* =================================================================
   SCEN 2 — WHITEBOARD
   Cream-vit yta med svag rutmönster, märkbar men ej dominant.
   ================================================================= */
export const WhiteboardScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="wb" />
    {/* Cream-vit bas */}
    <rect width="1600" height="900" fill="#f5efe1" />
    {/* Subtilt rutnät */}
    <g stroke="rgba(120,108,82,0.10)" strokeWidth="1">
      {Array.from({ length: 32 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="900" />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="1600" y2={i * 50} />
      ))}
    </g>
    {/* Mjuk soft-light i hörnen */}
    <radialGradient id="wb-glow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
      <stop offset="100%" stopColor="rgba(220,200,160,0.18)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#wb-glow)" />
    {/* Papper-textur */}
    <rect width="1600" height="900" filter="url(#wb-grain)" opacity="0.55" />
    {/* Diskreta penn-skuggor i ytterkanten */}
    <rect x="0" y="0" width="1600" height="900" fill="none" stroke="rgba(80,60,30,0.10)" strokeWidth="6" />
  </svg>
);

/* =================================================================
   SCEN 3 — NIGHT_PITCH
   Kvällsbelyst konstgräs. Varma strålkastare i topp + botten.
   ================================================================= */
export const NightPitchScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="np" />
    {/* Djup mörkgrön bas — fortfarande ljus nog för läsbarhet */}
    <rect width="1600" height="900" fill="#2a5236" />
    {/* Vertikala stripes */}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect
        key={i}
        x={i * 178}
        y="0"
        width="89"
        height="900"
        fill={i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.10)"}
      />
    ))}
    {/* Topp-strålkastare — varmt amber-sken */}
    <radialGradient id="np-top" cx="20%" cy="-15%" r="55%">
      <stop offset="0%" stopColor="rgba(255,210,140,0.45)" />
      <stop offset="100%" stopColor="rgba(255,210,140,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#np-top)" />
    <radialGradient id="np-top2" cx="78%" cy="-15%" r="55%">
      <stop offset="0%" stopColor="rgba(255,210,140,0.42)" />
      <stop offset="100%" stopColor="rgba(255,210,140,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#np-top2)" />
    {/* Botten-strålkastare */}
    <radialGradient id="np-bot" cx="50%" cy="120%" r="55%">
      <stop offset="0%" stopColor="rgba(255,220,160,0.34)" />
      <stop offset="100%" stopColor="rgba(255,220,160,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#np-bot)" />
    {/* Brus */}
    <rect width="1600" height="900" filter="url(#np-paint)" fill="#1d3b27" opacity="0.5" />
    <rect width="1600" height="900" filter="url(#np-grain)" opacity="0.6" />
    {/* Diskret blå-skiftning som "skugga" — så det inte blir för varmt */}
    <rect width="1600" height="900" fill="rgba(20,40,70,0.10)" />
  </svg>
);

/* =================================================================
   SCEN 4 — MATCH_OVERVIEW
   Ren matchplan ovanifrån. Reklamskyltar längs långsidor.
   ================================================================= */
export const MatchOverviewScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="mo" />
    {/* Bas: starkare TV-grön */}
    <rect width="1600" height="900" fill="#3f8d3f" />
    {/* Stripes (smalare = mer broadcast-känsla) */}
    {Array.from({ length: 16 }).map((_, i) => (
      <rect
        key={i}
        x={i * 100}
        y="0"
        width="50"
        height="900"
        fill={i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}
      />
    ))}
    {/* Reklamskyltar — översta + understa band */}
    {/* Övre band */}
    <rect x="0" y="0" width="1600" height="38" fill="#1f3a5c" />
    {[
      { x: 0, w: 220, fill: "#c41a2b" },
      { x: 220, w: 180, fill: "#f5c242" },
      { x: 400, w: 240, fill: "#fff" },
      { x: 640, w: 200, fill: "#1f3a5c" },
      { x: 840, w: 220, fill: "#c41a2b" },
      { x: 1060, w: 200, fill: "#f5c242" },
      { x: 1260, w: 200, fill: "#fff" },
      { x: 1460, w: 140, fill: "#1f3a5c" },
    ].map((b, i) => (
      <rect key={`top-${i}`} x={b.x} y="0" width={b.w} height="38" fill={b.fill} opacity="0.78" />
    ))}
    {/* Undre band */}
    <rect x="0" y="862" width="1600" height="38" fill="#1f3a5c" />
    {[
      { x: 0, w: 180, fill: "#f5c242" },
      { x: 180, w: 220, fill: "#fff" },
      { x: 400, w: 200, fill: "#1f3a5c" },
      { x: 600, w: 220, fill: "#c41a2b" },
      { x: 820, w: 240, fill: "#fff" },
      { x: 1060, w: 200, fill: "#f5c242" },
      { x: 1260, w: 220, fill: "#c41a2b" },
      { x: 1480, w: 120, fill: "#1f3a5c" },
    ].map((b, i) => (
      <rect key={`bot-${i}`} x={b.x} y="862" width={b.w} height="38" fill={b.fill} opacity="0.78" />
    ))}
    {/* Soft TV-spotlight */}
    <radialGradient id="mo-light" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#mo-light)" />
    {/* Lätt målad textur */}
    <rect width="1600" height="900" filter="url(#mo-paint)" fill="#2f6f2f" opacity="0.35" />
  </svg>
);

/* =================================================================
   SCEN 5 — COACHBOARD
   Omklädningsrums-känsla. Mörk skifferyta med krit-textur.
   Ljus nog för spelare/labels ska synas.
   ================================================================= */
export const CoachboardScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="cb" />
    {/* Mörk teal-grön bas (klassisk svart-tavla men ej helsvart) */}
    <rect width="1600" height="900" fill="#1f3b3a" />
    {/* Krit-/smuts-textur */}
    <rect width="1600" height="900" filter="url(#cb-paint)" fill="#2b524f" opacity="0.55" />
    {/* Subtilt krit-rutnät */}
    <g stroke="rgba(220,235,230,0.05)" strokeWidth="1">
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="900" strokeDasharray="3 8" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} strokeDasharray="3 8" />
      ))}
    </g>
    {/* Ljusare ovanifrån — som en lampa över tavlan */}
    <radialGradient id="cb-lamp" cx="50%" cy="-5%" r="55%">
      <stop offset="0%" stopColor="rgba(255,236,170,0.18)" />
      <stop offset="100%" stopColor="rgba(255,236,170,0)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#cb-lamp)" />
    {/* Trä-ram (omklädningsrum) */}
    <rect x="0" y="0" width="1600" height="900" fill="none" stroke="#3d2a17" strokeWidth="20" />
    <rect x="10" y="10" width="1580" height="880" fill="none" stroke="rgba(200,150,90,0.15)" strokeWidth="2" />
    {/* Brus */}
    <rect width="1600" height="900" filter="url(#cb-grain)" opacity="0.7" />
  </svg>
);

/* =================================================================
   SCEN 6 — NEUTRAL_ANALYSIS
   Off-white analysyta. Maximal läsbarhet, ingen distraktion.
   ================================================================= */
export const NeutralAnalysisScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <Defs id="na" />
    {/* Mjuk beige */}
    <rect width="1600" height="900" fill="#ede5d3" />
    {/* Mycket subtilt millimeterrutnät */}
    <g stroke="rgba(80,60,30,0.06)" strokeWidth="0.6">
      {Array.from({ length: 64 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="900" />
      ))}
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 25} x2="1600" y2={i * 25} />
      ))}
    </g>
    <g stroke="rgba(80,60,30,0.10)" strokeWidth="1">
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 125} y1="0" x2={i * 125} y2="900" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 125} x2="1600" y2={i * 125} />
      ))}
    </g>
    {/* Mjuk vinjettering */}
    <radialGradient id="na-vig" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stopColor="rgba(255,255,255,0)" />
      <stop offset="100%" stopColor="rgba(160,140,100,0.18)" />
    </radialGradient>
    <rect width="1600" height="900" fill="url(#na-vig)" />
    {/* Brus */}
    <rect width="1600" height="900" filter="url(#na-grain)" opacity="0.45" />
  </svg>
);
