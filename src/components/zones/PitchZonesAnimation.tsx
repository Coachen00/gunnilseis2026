/**
 * PitchZonesAnimation — premiumanimerad 30-sekunders visualisering av planens
 * taktiska indelning: korridorer (bredd) → spelytor (djup, dynamiska mellan
 * motståndarens lagdelar) → assistytan → gyllene zonen → samlad slutbild.
 *
 * Broadcast-/analysestetik: mörk gräsplan ovanifrån med lätt 3D-perspektiv,
 * tunna linjer, semitransparenta fält, subtil glow. Allt ritas i SVG och är
 * RENA FUNKTIONER AV TIDEN t — därför är scrubbing, paus och verifiering
 * deterministiska. Ingen framer-motion; egen rAF-klocka (timeline.ts).
 *
 * Lagerstruktur (spec): PitchLayer, CorridorLayer, DynamicGameSpaceLayer,
 * AssistZoneLayer, GoldenZoneLayer, FinalCompositeLayer + TimelineController,
 * TooltipSystem, LayerToggle.
 *
 * Tidsplan: 0–3 plan+titel · 3–9 korridorer · 9–17 dynamiska spelytor ·
 * 17–22 assistytan · 22–26 gyllene zonen · 26–30 samlad slutbild.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  kf,
  oscillate,
  phase,
  pulseIn,
  useTimeline,
  type Keyframe,
} from "./timeline";
import {
  ASSIST_ZONES,
  CORRIDORS,
  GZ_ZONE,
  LAYER_LABELS,
  OPPONENT_FORMATION,
  ZONE_COLORS as ZC,
  ZONE_LABELS as ZL,
  ZONE_TOOLTIPS,
  ZONES_DURATION,
  type LayerKey,
} from "./zonesConfig";

/* === Geometri: SVG-canvas 1600×900 (16:9), planen på högkant (anfall uppåt) ===
 * Plan 536×828 ≈ 68:105 m. Vänster panel (x 40–500) används för rubrik/captions. */
const PITCH = { x: 532, y: 30, w: 536, h: 828 } as const;
/** Procent-x (0 = vänster sidlinje) → SVG-x. */
const px = (x: number) => PITCH.x + (x / 100) * PITCH.w;
/** Procent-y (0 = egen kortlinje, 100 = offensiv kortlinje) → SVG-y. */
const py = (y: number) => PITCH.y + PITCH.h - (y / 100) * PITCH.h;

/* Planmarkeringar i procent (105×68 m): straffområde 16,5 m djupt / 40,32 m brett,
 * målområde 5,5/18,32 m, straffpunkt 11 m, mittcirkel r 9,15 m. */
const BOX = { depth: 15.71, width: 59.3 };
const GOAL_AREA = { depth: 5.24, width: 26.94 };
const SPOT_Y = 89.52;
const CIRCLE_R = (9.15 / 68) * PITCH.w;

type TipState = { id: keyof typeof ZONE_TOOLTIPS; x: number; y: number } | null;

interface LayerProps {
  t: number;
  on: boolean;
  withText: boolean;
  tip: (id: keyof typeof ZONE_TOOLTIPS) => {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerLeave: () => void;
  };
}

/* ============================== PitchLayer ============================== */
/** Gräs, ränder, vita linjer (stroke-reveal 0–2,5 s), mål och mittcirkel. */
function PitchLayer({ t }: { t: number }) {
  const draw = phase(t, 0.3, 2.4); // linjerna tecknas in
  const grass = phase(t, 0, 1.2);
  const stripes = Array.from({ length: 10 }, (_, i) => i);
  const lineProps = {
    fill: "none",
    stroke: ZC.lines,
    strokeWidth: 2,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
  } as const;
  const goalW = (7.32 / 68) * PITCH.w; // 7,32 m målbredd

  return (
    <g>
      {/* Gräs med klippränder */}
      <g opacity={grass}>
        <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} fill={ZC.grassB} rx={4} />
        {stripes.map((i) => (
          <rect
            key={i}
            x={PITCH.x}
            y={PITCH.y + (i * PITCH.h) / 10}
            width={PITCH.w}
            height={PITCH.h / 10}
            fill={i % 2 === 0 ? ZC.grassA : ZC.grassB}
          />
        ))}
        {/* Mjukt ovanljus + vinjett för djup */}
        <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} fill="url(#zonesPitchLight)" />
      </g>

      {/* Planlinjer */}
      <g>
        <rect x={PITCH.x} y={PITCH.y} width={PITCH.w} height={PITCH.h} rx={3} {...lineProps} />
        <line x1={PITCH.x} y1={py(50)} x2={PITCH.x + PITCH.w} y2={py(50)} {...lineProps} />
        <circle cx={px(50)} cy={py(50)} r={CIRCLE_R} {...lineProps} />
        <circle cx={px(50)} cy={py(50)} r={3} fill={ZC.lines} opacity={draw} stroke="none" />
        {/* Offensivt straffområde + målområde + straffpunkt + båge */}
        <rect x={px(50 - BOX.width / 2)} y={py(100)} width={(BOX.width / 100) * PITCH.w} height={(BOX.depth / 100) * PITCH.h} {...lineProps} />
        <rect x={px(50 - GOAL_AREA.width / 2)} y={py(100)} width={(GOAL_AREA.width / 100) * PITCH.w} height={(GOAL_AREA.depth / 100) * PITCH.h} {...lineProps} />
        <circle cx={px(50)} cy={py(SPOT_Y)} r={2.5} fill={ZC.lines} opacity={draw} stroke="none" />
        <path d={`M ${px(50) - 57.5} ${py(100 - BOX.depth)} A 72 72 0 0 0 ${px(50) + 57.5} ${py(100 - BOX.depth)}`} {...lineProps} />
        {/* Eget straffområde (speglat) */}
        <rect x={px(50 - BOX.width / 2)} y={py(BOX.depth)} width={(BOX.width / 100) * PITCH.w} height={(BOX.depth / 100) * PITCH.h} {...lineProps} />
        <rect x={px(50 - GOAL_AREA.width / 2)} y={py(GOAL_AREA.depth)} width={(GOAL_AREA.width / 100) * PITCH.w} height={(GOAL_AREA.depth / 100) * PITCH.h} {...lineProps} />
        <circle cx={px(50)} cy={py(100 - SPOT_Y)} r={2.5} fill={ZC.lines} opacity={draw} stroke="none" />
        <path d={`M ${px(50) - 57.5} ${py(BOX.depth)} A 72 72 0 0 1 ${px(50) + 57.5} ${py(BOX.depth)}`} {...lineProps} />
        {/* Mål (utanför kortlinjerna) */}
        <rect x={px(50) - goalW / 2} y={py(100) - 13} width={goalW} height={13} {...lineProps} strokeWidth={1.6} />
        <rect x={px(50) - goalW / 2} y={py(0)} width={goalW} height={13} {...lineProps} strokeWidth={1.6} />
      </g>
    </g>
  );
}

/* ============================ CorridorLayer ============================ */
/** Fem vertikala korridorer, in en i taget 3–8 s, label, sedan svag grundnivå. */
function CorridorLayer({ t, on, withText, tip }: LayerProps) {
  if (!on) return null;
  return (
    <g {...tip("korridorer")} className="cursor-pointer">
      {CORRIDORS.map((c, i) => {
        const enter = 3 + i; // 3,0 / 4,0 / 5,0 / 6,0 / 7,0
        // Lys upp vid entré → settla → tona till grundnivå efter 9 s →
        // nästan bort under assist/gyllene-faserna → tillbaka i slutbilden.
        const fill = kf(t, [
          { at: enter, v: 0 },
          { at: enter + 0.45, v: 0.42 },
          { at: enter + 1.0, v: 0.16 },
          { at: 8.4, v: 0.2 },
          { at: 9.8, v: 0.07 },
          { at: 17.5, v: 0.03 },
          { at: 26.6, v: 0.09 },
        ]);
        const edge = kf(t, [
          { at: enter, v: 0 },
          { at: enter + 0.4, v: 0.8 },
          { at: enter + 1.1, v: 0.3 },
          { at: 9.8, v: 0.12 },
          { at: 17.5, v: 0.05 },
          { at: 26.6, v: 0.16 },
        ]);
        const label = kf(t, [
          { at: enter + 0.25, v: 0 },
          { at: enter + 0.7, v: 1 },
          { at: 9.8, v: 0.35 },
          { at: 17.5, v: 0 },
          { at: 26.6, v: 0.4 },
        ]);
        return (
          <g key={c.id}>
            <rect x={px(c.x0)} y={py(100)} width={px(c.x1) - px(c.x0)} height={PITCH.h} fill={ZC.corridor} opacity={fill * 0.55} />
            <line x1={px(c.x1)} y1={py(0)} x2={px(c.x1)} y2={py(100)} stroke={ZC.corridorEdge} strokeWidth={1.2} opacity={i < 4 ? edge : 0} filter="url(#zonesGlowSm)" />
            {withText && (
              <text x={(px(c.x0) + px(c.x1)) / 2} y={py(31)} textAnchor="middle" fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={13} fontWeight={700} letterSpacing={2.2} fill={ZC.corridorEdge} opacity={label}>
                {c.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

/* ======================== DynamicGameSpaceLayer ======================== */
/**
 * Motståndarens tre lagdelar rör sig (högt → lågt → utgångsläge) och
 * spelytorna BERÄKNAS ur linjernas positioner varje frame — aldrig fasta
 * koordinater. Bollsekvens: förbi pressen (Spelyta 1) → rättvänd mottagning
 * (Spelyta 2) → djupledslöpning bakom backlinjen (Spelyta 3).
 */
const FW_KF: Keyframe[] = [{ at: 9, v: 42 }, { at: 10.4, v: 30 }, { at: 11.8, v: 50 }, { at: 12.9, v: 42 }];
const MID_KF: Keyframe[] = [{ at: 9, v: 58 }, { at: 10.4, v: 44 }, { at: 11.8, v: 63 }, { at: 12.9, v: 58 }];
const BACK_KF: Keyframe[] = [{ at: 9, v: 76 }, { at: 10.4, v: 58 }, { at: 11.8, v: 79 }, { at: 12.9, v: 76 }];

function DynamicGameSpaceLayer({ t, on, withText, tip }: LayerProps) {
  if (!on) return null;
  const fwY = kf(t, FW_KF);
  const midY = kf(t, MID_KF);
  const backY = kf(t, BACK_KF);

  const baseIn = phase(t, 9.1, 10);
  const fadeOut = 1 - phase(t, 17.2, 18.1) * 0.72; // tonas till bakgrund i assist-fasen
  const composite = phase(t, 26.5, 27.4) * 0.5; // lyfts tillbaka i slutbilden
  const master = Math.max(baseIn * fadeOut * 0.32, composite * 0.42);

  // Beat-highlights (pulser) när bollen låser upp respektive yta
  const hl1 = pulseIn(t, 13.2, 14.6);
  const hl2 = pulseIn(t, 14.6, 16.0);
  const hl3 = pulseIn(t, 15.9, 17.2);

  // Bollsekvens 13–17 (procentkoordinater)
  const ballX = kf(t, [{ at: 13.0, v: 50 }, { at: 13.9, v: 46 }, { at: 14.9, v: 44 }, { at: 15.9, v: 44 }, { at: 16.7, v: 56 }]);
  const ballY = kf(t, [{ at: 13.0, v: 26 }, { at: 13.9, v: 50 }, { at: 14.9, v: 66 }, { at: 15.9, v: 66 }, { at: 16.7, v: 88 }]);
  const ballOn = phase(t, 12.9, 13.2) * (1 - phase(t, 17.0, 17.6));

  const zones = [
    // Utgångsytan: framför motståndarens första presslinje
    { id: "utgang", label: ZL.utgang, y0: 18, y1: fwY, color: ZC.utgang, hl: 0 },
    // Spelyta 1: mellan forwards och mittfält ("förbi första pressen")
    { id: "s1", label: ZL.spelyta1, y0: fwY, y1: midY, color: ZC.spelyta1, hl: hl1 },
    // Spelyta 2: mellan mittfält och backlinje ("rättvänd mellan lagdelar")
    { id: "s2", label: ZL.spelyta2, y0: midY, y1: backY, color: ZC.spelyta2, hl: hl2 },
    // Spelyta 3: bakom backlinjen
    { id: "s3", label: ZL.spelyta3, y0: backY, y1: 97, color: ZC.spelyta3, hl: hl3 },
  ];

  const dotRows = [
    { xs: OPPONENT_FORMATION.forwards, y: fwY },
    { xs: OPPONENT_FORMATION.midfield, y: midY },
    { xs: OPPONENT_FORMATION.backline, y: backY },
  ];
  const dotsOn = phase(t, 9, 9.7) * (1 - phase(t, 17.2, 18.1) * 0.6);

  return (
    <g {...tip("spelytor")} className="cursor-pointer">
      {/* Dynamiska ytor mellan lagdelarna */}
      {zones.map((z) => {
        const yTop = py(Math.max(z.y0, z.y1));
        const h = Math.abs(py(z.y0) - py(z.y1));
        const o = master + z.hl * 0.34;
        const labelO = withText ? Math.max(z.hl, t >= 26.5 ? composite * 0.9 : 0) : 0;
        return (
          <g key={z.id}>
            <rect x={px(2)} y={yTop} width={px(98) - px(2)} height={h} fill={z.color} opacity={o * 0.5} />
            <rect x={px(2)} y={yTop} width={px(98) - px(2)} height={h} fill="none" stroke={z.color} strokeOpacity={o * 0.9} strokeWidth={1} strokeDasharray="6 8" />
            {labelO > 0.02 && (
              <text x={px(8)} y={yTop + h / 2 + 5} fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={13.5} fontWeight={700} letterSpacing={2} fill={z.color} opacity={labelO}>
                {z.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Motståndarens lagdelar (tunna rader med spelarprickar) */}
      {dotRows.map((row, ri) => (
        <g key={ri} opacity={dotsOn}>
          <line x1={px(4)} y1={py(row.y)} x2={px(96)} y2={py(row.y)} stroke={ZC.opponent} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="2 7" />
          {row.xs.map((x, i) => (
            <g key={i}>
              <circle cx={px(x)} cy={py(row.y)} r={7.5} fill="#2a0f12" stroke={ZC.opponent} strokeWidth={1.6} strokeOpacity={0.85} />
              <circle cx={px(x)} cy={py(row.y)} r={2.4} fill={ZC.opponent} opacity={0.8} />
            </g>
          ))}
        </g>
      ))}

      {/* Rättvänd mottagare (Spelyta 2) + djupledslöpare (Spelyta 3) */}
      <g opacity={phase(t, 14.5, 15.0) * (1 - phase(t, 17.0, 17.8))}>
        <circle cx={px(44)} cy={py(66)} r={8} fill="#06251a" stroke={ZC.own} strokeWidth={2} />
        <circle cx={px(44)} cy={py(66)} r={2.6} fill={ZC.own} />
      </g>
      <ArrowPath d={`M ${px(62)} ${py(70)} Q ${px(58)} ${py(78)} ${px(54)} ${py(86)}`} color={ZC.own} draw={phase(t, 15.9, 16.7)} width={2.4} />

      {/* Bollen */}
      <g opacity={ballOn}>
        <circle cx={px(ballX)} cy={py(ballY)} r={13} fill="url(#zonesBallGlow)" opacity={0.7} />
        <circle cx={px(ballX)} cy={py(ballY)} r={5} fill={ZC.ball} stroke={ZC.own} strokeWidth={1.2} />
      </g>
    </g>
  );
}

/* ============================ AssistZoneLayer ============================ */
/** Assistytorna i sista tredjedelen + tre sista-passningsvägar. */
function AssistZoneLayer({ t, on, withText, tip }: LayerProps) {
  if (!on) return null;
  const zoneIn = phase(t, 17.4, 18.4);
  const dim = 1 - phase(t, 25.6, 26.4) * 0.35;
  const o = zoneIn * dim;
  if (o <= 0.01) return null;

  const zones = [ASSIST_ZONES.left, ASSIST_ZONES.right];
  const cutbacks = [ASSIST_ZONES.cutbackLeft, ASSIST_ZONES.cutbackRight];

  // Tre typer av sista passning (spec): inspel, cutback, instick
  const arrows = [
    { id: "inspel", label: ZL.inspel, d: `M ${px(12)} ${py(86)} Q ${px(26)} ${py(89)} ${px(40)} ${py(90)}`, draw: phase(t, 18.4, 19.3), lx: 10, ly: 82 },
    { id: "cutback", label: ZL.cutback, d: `M ${px(86)} ${py(93)} Q ${px(76)} ${py(89)} ${px(64)} ${py(84)}`, draw: phase(t, 19.5, 20.4), lx: 84, ly: 79.5 },
    { id: "instick", label: ZL.instick, d: `M ${px(72)} ${py(74)} Q ${px(70)} ${py(82)} ${px(67)} ${py(90)}`, draw: phase(t, 20.6, 21.5), lx: 74, ly: 72 },
  ];

  return (
    <g {...tip("assistytan")} className="cursor-pointer">
      {zones.map((z, i) => (
        <g key={i}>
          <rect x={px(z.x0)} y={py(z.y1)} width={px(z.x1) - px(z.x0)} height={py(z.y0) - py(z.y1)} fill={ZC.assist} opacity={o * 0.26} rx={6} />
          <rect x={px(z.x0)} y={py(z.y1)} width={px(z.x1) - px(z.x0)} height={py(z.y0) - py(z.y1)} fill="none" stroke={ZC.assist} strokeOpacity={o * 0.85} strokeWidth={1.4} rx={6} filter="url(#zonesGlowSm)" />
        </g>
      ))}
      {cutbacks.map((z, i) => (
        <rect key={i} x={px(z.x0)} y={py(z.y1)} width={px(z.x1) - px(z.x0)} height={py(z.y0) - py(z.y1)} fill={ZC.assist} opacity={o * 0.12} rx={6} />
      ))}
      {withText && (
        <text x={px(15)} y={py(96.5)} textAnchor="middle" fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={12.5} fontWeight={700} letterSpacing={1.8} fill={ZC.assist} opacity={o}>
          {ZL.assistLeft}
        </text>
      )}
      {arrows.map((a) => (
        <g key={a.id}>
          <ArrowPath d={a.d} color={ZC.assist} draw={a.draw} width={2.6} />
          {withText && a.draw > 0.65 && (
            <text x={px(a.lx)} y={py(a.ly)} textAnchor="middle" fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={11.5} fontWeight={700} letterSpacing={1.2} fill={ZC.text} opacity={(a.draw - 0.65) * 2.6 * o}>
            {a.label}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/* ============================ GoldenZoneLayer ============================ */
/** Gyllene zonen: guldpuls centralt framför mål + attackerande löpningar + avslut. */
function GoldenZoneLayer({ t, on, withText, tip }: LayerProps) {
  if (!on) return null;
  const zin = phase(t, 22.0, 22.9);
  if (zin <= 0.01) return null;
  const pulse = 0.72 + 0.28 * oscillate(t, 1.7);
  const z = GZ_ZONE;

  // Tre attackerande löpningar (första ytan, bortre ytan, cutback-ytan)
  const runners = [
    { d: `M ${px(30)} ${py(80)} Q ${px(36)} ${py(86)} ${px(43)} ${py(91)}`, draw: phase(t, 22.9, 23.7) },
    { d: `M ${px(72)} ${py(80)} Q ${px(65)} ${py(87)} ${px(58)} ${py(93)}`, draw: phase(t, 23.1, 23.9) },
    { d: `M ${px(52)} ${py(74)} Q ${px(51)} ${py(80)} ${px(50)} ${py(85)}`, draw: phase(t, 23.3, 24.1) },
  ];
  // Boll: assistytan → gyllene zonen, därefter avslutsmarkering
  const bx = kf(t, [{ at: 23.6, v: 18 }, { at: 24.4, v: 47 }]);
  const by = kf(t, [{ at: 23.6, v: 87 }, { at: 24.4, v: 90 }]);
  const ballOn = phase(t, 23.5, 23.8) * (1 - phase(t, 25.2, 25.8));
  const flash = pulseIn(t, 24.5, 25.6);

  return (
    <g {...tip("gyllene")} className="cursor-pointer">
      <rect x={px(z.x0)} y={py(z.y1)} width={px(z.x1) - px(z.x0)} height={py(z.y0) - py(z.y1)} rx={14} fill={ZC.gz} opacity={zin * 0.3 * pulse} />
      <rect x={px(z.x0)} y={py(z.y1)} width={px(z.x1) - px(z.x0)} height={py(z.y0) - py(z.y1)} rx={14} fill="none" stroke={ZC.gz} strokeWidth={1.8} opacity={zin * 0.95 * pulse} filter="url(#zonesGlow)" />
      {withText && (
        <text x={px(50)} y={py(90.5) + 5} textAnchor="middle" fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={14} fontWeight={800} letterSpacing={2.6} fill={ZC.gz} opacity={zin * pulse}>
          {ZL.gz}
        </text>
      )}
      {runners.map((r, i) => (
        <ArrowPath key={i} d={r.d} color={ZC.own} draw={r.draw} width={2.2} />
      ))}
      <g opacity={ballOn}>
        <circle cx={px(bx)} cy={py(by)} r={13} fill="url(#zonesBallGlow)" opacity={0.7} />
        <circle cx={px(bx)} cy={py(by)} r={5} fill={ZC.ball} stroke={ZC.gz} strokeWidth={1.2} />
      </g>
      {/* Avslutsmarkering: expanderande ring + blixt mot mål */}
      <g opacity={flash}>
        <circle cx={px(47)} cy={py(90)} r={10 + flash * 26} fill="none" stroke={ZC.gz} strokeWidth={2} />
        <line x1={px(47)} y1={py(90)} x2={px(50)} y2={py(99.6)} stroke={ZC.gz} strokeWidth={2.6} strokeLinecap="round" filter="url(#zonesGlowSm)" />
      </g>
    </g>
  );
}

/* ========================== FinalCompositeLayer ========================== */
/** Samlad slutbild: kedjepil Spelyta 1 → 2 → 3 → assistytan → gyllene zonen. */
function FinalCompositeLayer({ t, on, withText }: { t: number; on: boolean; withText: boolean }) {
  if (!on) return null;
  const o = phase(t, 26.4, 27.2);
  if (o <= 0.01) return null;
  const segs = [
    { d: `M ${px(50)} ${py(50)} L ${px(47)} ${py(67)}`, draw: phase(t, 26.6, 27.2) },
    { d: `M ${px(47)} ${py(67)} L ${px(57)} ${py(84)}`, draw: phase(t, 27.1, 27.7) },
    { d: `M ${px(57)} ${py(84)} L ${px(78)} ${py(87)}`, draw: phase(t, 27.6, 28.2) },
    { d: `M ${px(78)} ${py(87)} L ${px(54)} ${py(91)}`, draw: phase(t, 28.1, 28.7) },
  ];
  return (
    <g opacity={o}>
      {segs.map((s, i) => (
        <ArrowPath key={i} d={s.d} color={ZC.text} draw={s.draw} width={2} dash="3 6" />
      ))}
      {withText && (
        <circle cx={px(50)} cy={py(50)} r={4} fill={ZC.text} opacity={0.7} />
      )}
    </g>
  );
}

/* === Pil-primitiv: stroke-reveal längs path med pilspets === */
function ArrowPath({ d, color, draw, width, dash }: { d: string; color: string; draw: number; width: number; dash?: string }) {
  if (draw <= 0.01) return null;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ?? 1} pathLength={dash ? undefined : 1} strokeDashoffset={dash ? undefined : 1 - draw} opacity={dash ? draw : 0.92} filter="url(#zonesGlowSm)" markerEnd={draw > 0.92 ? "url(#zonesArrow)" : undefined} />
    </g>
  );
}

/* ====================== Rubrik & fas-captions (SVG) ====================== */
function Captions({ t, withText }: { t: number; withText: boolean }) {
  if (!withText) return null;
  const titleO = phase(t, 0.7, 1.6) * (1 - phase(t, 3.0, 3.9));
  const captions = [
    { text: ZL.corridorMicro, start: 7.8, end: 9.6 },
    { text: ZL.gameSpaceCaption, start: 9.6, end: 17.2 },
    { text: ZL.assistCaption, start: 17.6, end: 21.9 },
    { text: ZL.gzCaption, start: 22.2, end: 26.0 },
  ];
  const finalO = phase(t, 26.8, 27.6);

  return (
    <g>
      {/* Titel (0–3,9 s) */}
      <g opacity={titleO}>
        <text x={800} y={120} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize={52} fontWeight={900} letterSpacing={-1} fill={ZC.text}>
          {ZL.title}
        </text>
        <rect x={742} y={140} width={116} height={3} fill={ZC.gz} rx={1.5} />
      </g>

      {/* Fas-captions i vänsterpanelen */}
      {captions.map((c) => {
        const o = phase(t, c.start, c.start + 0.6) * (1 - phase(t, c.end, c.end + 0.6));
        if (o <= 0.01) return null;
        return (
          <g key={c.text} opacity={o}>
            <rect x={64} y={430} width={3} height={40} fill={ZC.gz} rx={1.5} />
            <text x={84} y={448} fontFamily='"JetBrains Mono", ui-monospace, monospace' fontSize={17} fontWeight={700} letterSpacing={1.4} fill={ZC.text}>
              {c.text.split(": ")[0].toUpperCase()}
            </text>
            <text x={84} y={474} fontFamily="Inter, system-ui, sans-serif" fontSize={15.5} fill={ZC.textDim}>
              {c.text.split(": ")[1]}
            </text>
          </g>
        );
      })}

      {/* Slutbildens fyra rader */}
      <g opacity={finalO}>
        {ZL.finalLines.map((line, i) => (
          <text key={line} x={64} y={392 + i * 34} fontFamily="Inter, system-ui, sans-serif" fontSize={19} fontWeight={i === 3 ? 800 : 500} fill={i === 3 ? ZC.gz : ZC.text} opacity={phase(t, 27.0 + i * 0.45, 27.5 + i * 0.45)}>
            {line}
          </text>
        ))}
      </g>
    </g>
  );
}

/* ============================ Huvudkomponent ============================ */
export interface PitchZonesAnimationProps {
  /** Spela automatiskt vid mount (default true). */
  autoPlay?: boolean;
  /** Loopa sömlöst istället för att stanna (default false). */
  loop?: boolean;
  /** Pedagogisk version med text + tooltips (default) eller ren visuell. */
  withTextDefault?: boolean;
  /** Statisk slutbild istället för rörelse (prefers-reduced-motion). */
  reduced?: boolean;
  /** Anropas när 30-sekverssekvensen spelat klart (ej vid loop). */
  onComplete?: () => void;
  className?: string;
}

export default function PitchZonesAnimation({
  autoPlay = true,
  loop = false,
  withTextDefault = true,
  reduced = false,
  onComplete,
  className,
}: PitchZonesAnimationProps) {
  const tl = useTimeline(ZONES_DURATION, { autoPlay: autoPlay && !reduced, loop, onComplete });
  // Reduced motion → statisk samlad slutbild (hela budskapet utan rörelse)
  const t = reduced && tl.t === 0 && !tl.playing ? 28.6 : tl.t;

  const [withText, setWithText] = useState(withTextDefault);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    korridorer: true,
    spelytor: true,
    assistytan: true,
    gyllene: true,
  });
  const [tipState, setTipState] = useState<TipState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Headless-/dev-verifiering: window.dispatchEvent(new CustomEvent("zones:seek", { detail: 14 }))
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const h = (e: Event) => {
      tl.pause();
      tl.seek(Number((e as CustomEvent).detail) || 0);
    };
    window.addEventListener("zones:seek", h);
    return () => window.removeEventListener("zones:seek", h);
  }, [tl]);

  const tip = useCallback(
    (id: keyof typeof ZONE_TOOLTIPS) => ({
      onPointerEnter: (e: React.PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setTipState({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
      },
      onPointerLeave: () => setTipState(null),
    }),
    []
  );

  // Kamera: långsam inzoomning 0–3,2 s (spec) + lätt 3D-perspektiv via wrapper
  const zoom = useMemo(() => kf(t, [{ at: 0, v: 1.05 }, { at: 3.2, v: 1 }]), [t]);
  const allOn = Object.values(layers).every(Boolean);
  const layerProps = { t, withText, tip };

  const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

  return (
    <div ref={containerRef} className={cn("relative h-full w-full select-none", className)}>
      <div className="h-full w-full" style={{ perspective: "1500px" }}>
        <svg
          viewBox="0 0 1600 900"
          className="h-full w-full"
          role="img"
          aria-label="Animerad taktisk genomgång av planens indelning: fem korridorer för bredd, dynamiska spelytor mellan motståndarens lagdelar, assistytan för sista passningen och gyllene zonen för avslut"
          style={{ transform: "rotateX(3.5deg) scale(1.01)", transformOrigin: "50% 60%" }}
        >
          <defs>
            <radialGradient id="zonesPitchLight" cx="50%" cy="38%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.015" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
            </radialGradient>
            <radialGradient id="zonesBallGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ZC.ball} stopOpacity="0.9" />
              <stop offset="100%" stopColor={ZC.ball} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="zonesBg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={ZC.bgTop} />
              <stop offset="100%" stopColor={ZC.bgBot} />
            </linearGradient>
            <filter id="zonesGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="zonesGlowSm" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="zonesArrow" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 9 4.5 L 0 9 L 2.5 4.5 z" fill="context-stroke" />
            </marker>
          </defs>

          <rect x="0" y="0" width="1600" height="900" fill="url(#zonesBg)" />

          <g style={{ transform: `scale(${zoom})`, transformOrigin: "800px 480px" }}>
            <PitchLayer t={t} />
            <CorridorLayer on={layers.korridorer} {...layerProps} />
            <DynamicGameSpaceLayer on={layers.spelytor} {...layerProps} />
            <AssistZoneLayer on={layers.assistytan} {...layerProps} />
            <GoldenZoneLayer on={layers.gyllene} {...layerProps} />
            <FinalCompositeLayer t={t} on={allOn} withText={withText} />
          </g>

          <Captions t={t} withText={withText} />
        </svg>
      </div>

      {/* TooltipSystem */}
      {tipState && (
        <div
          className="pointer-events-none absolute z-20 max-w-[16rem] rounded-md border border-white/15 bg-black/85 px-3.5 py-2.5 backdrop-blur-sm"
          style={{ left: Math.min(tipState.x + 14, (containerRef.current?.clientWidth ?? 600) - 270), top: tipState.y + 14 }}
          role="tooltip"
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
            {ZONE_TOOLTIPS[tipState.id].title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/85">{ZONE_TOOLTIPS[tipState.id].body}</p>
        </div>
      )}

      {/* TimelineController + LayerToggle */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={tl.toggle}
            aria-label={tl.playing ? "Pausa" : "Spela"}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/90 transition hover:border-amber-300/70 hover:text-amber-300"
          >
            {tl.playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={tl.restart}
            aria-label="Börja om"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="ml-1 font-mono text-[11px] font-bold tabular-nums text-white/70">
            {fmt(t)} / {fmt(ZONES_DURATION)}
          </span>
        </div>

        <input
          id="zones-scrub"
          type="range"
          min={0}
          max={ZONES_DURATION}
          step={0.05}
          value={t}
          onChange={(e) => tl.seek(Number(e.target.value))}
          aria-label="Tidslinje"
          className="h-1.5 min-w-[8rem] flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-amber-400"
        />

        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(LAYER_LABELS) as LayerKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setLayers((p) => ({ ...p, [key]: !p[key] }))}
              aria-pressed={layers[key]}
              className={cn(
                "rounded-sm border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition",
                layers[key]
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                  : "border-white/15 text-white/40 hover:text-white/70"
              )}
            >
              {LAYER_LABELS[key]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLayers({ korridorer: true, spelytor: true, assistytan: true, gyllene: true })}
            className="rounded-sm border border-white/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 transition hover:text-white"
          >
            Alla
          </button>
          <button
            type="button"
            onClick={() => setWithText((v) => !v)}
            aria-pressed={withText}
            aria-label="Visa/dölj text"
            className={cn(
              "grid h-7 w-7 place-items-center rounded-sm border transition",
              withText ? "border-amber-300/50 bg-amber-300/10 text-amber-300" : "border-white/15 text-white/40 hover:text-white/70"
            )}
          >
            <Type className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
