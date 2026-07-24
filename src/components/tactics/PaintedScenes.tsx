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
   Tactical whiteboard med tydlig metallram, marker-pennor i hörnet
   och spår av tidigare ritningar för känslan av "använd tavla".
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
    {/* Subtila gamla marker-spår — för känslan av "använd tavla" */}
    <g stroke="rgba(40,55,90,0.08)" strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M 180 230 Q 260 200 340 240" />
      <path d="M 1180 670 Q 1280 700 1380 660" />
      <circle cx="800" cy="450" r="40" />
    </g>
    {/* Papper-textur */}
    <rect width="1600" height="900" filter="url(#wb-grain)" opacity="0.55" />
    {/* Metallram runt hela tavlan */}
    <rect x="0" y="0" width="1600" height="900" fill="none" stroke="rgba(110,95,75,0.55)" strokeWidth="14" />
    <rect x="10" y="10" width="1580" height="880" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
    {/* Marker-tray nere till höger — tre pennor */}
    <g transform="translate(1340 825)">
      <rect x="0" y="0" width="220" height="40" rx="6" fill="rgba(70,55,40,0.85)" stroke="rgba(40,30,20,0.65)" strokeWidth="1.5" />
      <rect x="14" y="-12" width="50" height="22" rx="3" fill="#dc2626" />
      <rect x="78" y="-12" width="50" height="22" rx="3" fill="#1f3a5c" />
      <rect x="142" y="-12" width="50" height="22" rx="3" fill="#15803d" />
    </g>
    {/* Liten "TAKTIK"-stämpel uppe till vänster */}
    <g transform="translate(40 45)">
      <rect x="0" y="0" width="120" height="26" rx="4" fill="rgba(40,30,15,0.78)" />
      <text x="60" y="18" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif"
            fontSize="12" fontWeight="900" letterSpacing="3" fill="#f5efe1">TAKTIK</text>
    </g>
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
    {/* Stadium-silhuett uppe i kanten — antyder läktarrad */}
    <g fill="rgba(0,0,0,0.5)">
      <path d="M 0 0 L 0 36 L 200 30 L 220 40 L 380 32 L 400 42 L 600 30 L 620 40 L 800 32 L 820 42 L 1000 30 L 1020 40 L 1200 32 L 1220 42 L 1400 30 L 1420 40 L 1600 32 L 1600 0 Z" />
    </g>
    {/* Strålkastare-stolpe-toppar (4 punkter) */}
    <g fill="rgba(255,235,180,0.85)">
      <circle cx="200" cy="38" r="3.5" />
      <circle cx="600" cy="40" r="3.5" />
      <circle cx="1000" cy="38" r="3.5" />
      <circle cx="1400" cy="40" r="3.5" />
    </g>
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
    {/* Sponsor-text på övre band (vit text på blå) */}
    <g fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fill="#fff" textAnchor="middle">
      <text x="640" y="26" fontSize="14" letterSpacing="2.5">GUNNILSE IS</text>
      <text x="1360" y="26" fontSize="14" letterSpacing="2.5">SPELMODELLEN</text>
      <text x="290" y="888" fontSize="14" letterSpacing="2.5" fill="#1f3a5c">MAJ 2026</text>
    </g>
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
    <rect x="0" y="0" width="1600" height="900" fill="none" stroke="#3d2a17" strokeWidth="22" />
    <rect x="14" y="14" width="1572" height="872" fill="none" stroke="rgba(200,150,90,0.18)" strokeWidth="2" />
    {/* Krit-spår — gamla ritningar för "använd tavla"-känsla */}
    <g stroke="rgba(240,232,210,0.18)" strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M 180 230 Q 280 200 360 250 L 400 240" />
      <path d="M 1260 700 L 1340 670 L 1420 680" strokeDasharray="14 18" />
      <circle cx="800" cy="500" r="36" />
    </g>
    {/* Krit-pennor i nedre vänstra hörnet */}
    <g transform="translate(50 825)">
      <rect x="0" y="0" width="190" height="34" rx="4" fill="rgba(60,40,20,0.7)" />
      <rect x="14" y="-8" width="42" height="14" rx="2" fill="#fffaf0" />
      <rect x="68" y="-8" width="42" height="14" rx="2" fill="#fde68a" />
      <rect x="122" y="-8" width="42" height="14" rx="2" fill="#fca5a5" />
    </g>
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
    {/* Center cross-hair — antyder analys-yta */}
    <g stroke="rgba(80,60,30,0.22)" strokeWidth="1.5">
      <line x1="800" y1="430" x2="800" y2="470" />
      <line x1="780" y1="450" x2="820" y2="450" />
    </g>
    {/* Diskret "ANALYS"-stämpel uppe till vänster */}
    <g transform="translate(40 40)">
      <rect x="0" y="0" width="118" height="24" rx="3" fill="rgba(80,60,30,0.10)" stroke="rgba(80,60,30,0.30)" strokeWidth="1" />
      <text x="59" y="17" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif"
            fontSize="11" fontWeight="900" letterSpacing="3" fill="rgba(80,60,30,0.7)">ANALYS</text>
    </g>
  </svg>
);

/* =================================================================
   SCEN 7 — CUSTOM_IMAGE
   Minimal mörk basyta för analysläget. Den faktiska uppladdade bilden
   renderas inte här — den ligger i statisk markup (#tactics-custom-image)
   som ett syskon till backdrop-roten, se tactic-board-markup.html och
   tactic-board-script.js (setBackgroundImage/clearBackgroundImage).
   Denna scen är bara en säker mörk fallback bakom den, så
   TacticsBitmapBackdrop aldrig renderar tomt/kraschar för scenen.
   ================================================================= */
export const CustomImageScene = ({ className, style }: SceneRendererProps) => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className={className}
    style={style}
    aria-hidden="true"
    role="presentation"
  >
    <rect width="1600" height="900" fill="#0d1417" />
  </svg>
);
