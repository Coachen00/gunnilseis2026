import { cn } from "@/lib/utils";

type Side = "us" | "opp" | "ball";

export interface PitchPlayer {
  id: string;
  side: Side;
  x: number;
  y: number;
  label?: string;
}

export type ArrowKind = "pass" | "run" | "press" | "cover" | "shoot";

export interface PitchArrow {
  from: { x: number; y: number };
  to: { x: number; y: number };
  kind: ArrowKind;
  label?: string;
  curve?: number;
}

export interface PitchAnnotation {
  x: number;
  y: number;
  text: string;
  align?: "start" | "middle" | "end";
}

interface TacticalPitchProps {
  title: string;
  caption?: string;
  players?: PitchPlayer[];
  arrows?: PitchArrow[];
  annotations?: PitchAnnotation[];
  corridors?: boolean;
  thirds?: boolean;
  highlightedCorridor?: "left" | "center" | "right" | null;
  highlightedZone?: { x: number; y: number; w: number; h: number; tone?: "accent" | "primary" | "destructive" | "success" } | null;
  className?: string;
}

const ARROW_STYLES: Record<
  ArrowKind,
  { stroke: string; strokeDash?: string; head: string; widthMul?: number }
> = {
  pass: { stroke: "hsl(var(--accent))", head: "url(#arrow-accent)", widthMul: 1.2 },
  run: { stroke: "hsl(var(--swedish-blue))", strokeDash: "2.5 1.5", head: "url(#arrow-blue)" },
  press: { stroke: "hsl(var(--destructive))", head: "url(#arrow-red)", widthMul: 1.3 },
  cover: { stroke: "hsl(var(--swedish-blue))", strokeDash: "1 1.5", head: "url(#arrow-blue)" },
  shoot: { stroke: "hsl(var(--accent))", head: "url(#arrow-accent)", widthMul: 1.6 },
};

const TacticalPitch = ({
  title,
  caption,
  players = [],
  arrows = [],
  annotations = [],
  corridors = false,
  thirds = false,
  highlightedCorridor = null,
  highlightedZone = null,
  className,
}: TacticalPitchProps) => {
  return (
    <figure className={cn("space-y-3", className)}>
      <div className="relative w-full overflow-hidden rounded-sm border border-border bg-[hsl(var(--pitch-dark))]">
        <svg
          viewBox="0 0 160 100"
          role="img"
          aria-label={title}
          className="block w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="pitch-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(145 55% 28%)" />
              <stop offset="100%" stopColor="hsl(145 60% 22%)" />
            </linearGradient>
            <pattern id="pitch-stripes" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="100" fill="hsl(145 55% 30%)" opacity="0.5" />
              <rect x="10" y="0" width="10" height="100" fill="hsl(145 60% 26%)" opacity="0.5" />
            </pattern>
            {(["accent", "blue", "red"] as const).map((tone) => {
              const color =
                tone === "accent"
                  ? "hsl(var(--accent))"
                  : tone === "blue"
                  ? "hsl(var(--swedish-blue))"
                  : "hsl(var(--destructive))";
              return (
                <marker
                  key={tone}
                  id={`arrow-${tone}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
              );
            })}
          </defs>

          <rect x="0" y="0" width="160" height="100" fill="url(#pitch-bg)" />
          <rect x="0" y="0" width="160" height="100" fill="url(#pitch-stripes)" />

          {corridors && (
            <g opacity="0.95">
              <rect
                x="0"
                y="0"
                width="53.3"
                height="100"
                fill="hsl(var(--accent))"
                opacity={highlightedCorridor === "left" ? 0.18 : 0.04}
              />
              <rect
                x="53.3"
                y="0"
                width="53.4"
                height="100"
                fill="hsl(var(--accent))"
                opacity={highlightedCorridor === "center" ? 0.22 : 0.06}
              />
              <rect
                x="106.7"
                y="0"
                width="53.3"
                height="100"
                fill="hsl(var(--accent))"
                opacity={highlightedCorridor === "right" ? 0.18 : 0.04}
              />
              <line x1="53.3" y1="0" x2="53.3" y2="100" stroke="hsl(var(--pitch-lines))" strokeWidth="0.25" strokeDasharray="1 1.2" opacity="0.6" />
              <line x1="106.7" y1="0" x2="106.7" y2="100" stroke="hsl(var(--pitch-lines))" strokeWidth="0.25" strokeDasharray="1 1.2" opacity="0.6" />
              <text x="26.6" y="6.5" textAnchor="middle" fontSize="3.2" fill="hsl(var(--pitch-lines))" opacity="0.85" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">VÄNSTER</text>
              <text x="80" y="6.5" textAnchor="middle" fontSize="3.2" fill="hsl(var(--pitch-lines))" opacity="0.85" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">MITTEN</text>
              <text x="133.3" y="6.5" textAnchor="middle" fontSize="3.2" fill="hsl(var(--pitch-lines))" opacity="0.85" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">HÖGER</text>
            </g>
          )}

          {thirds && (
            <g opacity="0.4">
              <line x1="53.3" y1="0" x2="53.3" y2="100" stroke="hsl(var(--pitch-lines))" strokeWidth="0.3" strokeDasharray="1.5 2" />
              <line x1="106.7" y1="0" x2="106.7" y2="100" stroke="hsl(var(--pitch-lines))" strokeWidth="0.3" strokeDasharray="1.5 2" />
            </g>
          )}

          {highlightedZone && (
            <rect
              x={highlightedZone.x}
              y={highlightedZone.y}
              width={highlightedZone.w}
              height={highlightedZone.h}
              fill={
                highlightedZone.tone === "destructive"
                  ? "hsl(var(--destructive))"
                  : highlightedZone.tone === "primary"
                  ? "hsl(var(--swedish-blue))"
                  : highlightedZone.tone === "success"
                  ? "hsl(var(--zone-attack))"
                  : "hsl(var(--accent))"
              }
              opacity="0.18"
              rx="1"
            />
          )}

          <g stroke="hsl(var(--pitch-lines))" strokeWidth="0.4" fill="none" opacity="0.85">
            <rect x="1.5" y="1.5" width="157" height="97" />
            <line x1="80" y1="1.5" x2="80" y2="98.5" />
            <circle cx="80" cy="50" r="9.15" />
            <circle cx="80" cy="50" r="0.6" fill="hsl(var(--pitch-lines))" />
            <rect x="1.5" y="22" width="16.5" height="56" />
            <rect x="1.5" y="36.8" width="5.5" height="26.4" />
            <circle cx="11" cy="50" r="0.6" fill="hsl(var(--pitch-lines))" />
            <path d="M 18 41.5 A 9.15 9.15 0 0 1 18 58.5" />
            <rect x="142" y="22" width="16.5" height="56" />
            <rect x="153" y="36.8" width="5.5" height="26.4" />
            <circle cx="149" cy="50" r="0.6" fill="hsl(var(--pitch-lines))" />
            <path d="M 142 58.5 A 9.15 9.15 0 0 1 142 41.5" />
          </g>

          {arrows.map((arrow, idx) => {
            const { stroke, strokeDash, head, widthMul = 1 } = ARROW_STYLES[arrow.kind];
            const dx = arrow.to.x - arrow.from.x;
            const dy = arrow.to.y - arrow.from.y;
            const mid = { x: (arrow.from.x + arrow.to.x) / 2, y: (arrow.from.y + arrow.to.y) / 2 };
            const curve = arrow.curve ?? 0;
            const nx = -dy;
            const ny = dx;
            const norm = Math.sqrt(nx * nx + ny * ny) || 1;
            const ctrl = { x: mid.x + (nx / norm) * curve, y: mid.y + (ny / norm) * curve };
            const path = curve === 0
              ? `M ${arrow.from.x} ${arrow.from.y} L ${arrow.to.x} ${arrow.to.y}`
              : `M ${arrow.from.x} ${arrow.from.y} Q ${ctrl.x} ${ctrl.y} ${arrow.to.x} ${arrow.to.y}`;
            return (
              <g key={idx}>
                <path
                  d={path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={0.9 * widthMul}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  markerEnd={head}
                  opacity="0.95"
                />
                {arrow.label && (
                  <text
                    x={ctrl.x}
                    y={ctrl.y - 1.2}
                    fontSize="2.6"
                    fill="hsl(var(--background))"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="0.05em"
                    textAnchor="middle"
                    style={{ paintOrder: "stroke", stroke: "hsl(var(--pitch-dark))", strokeWidth: 0.8 }}
                  >
                    {arrow.label}
                  </text>
                )}
              </g>
            );
          })}

          {players.map((p) => {
            if (p.side === "ball") {
              return (
                <g key={p.id}>
                  <circle cx={p.x} cy={p.y} r="1.9" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="0.4" />
                  <circle cx={p.x} cy={p.y} r="0.6" fill="hsl(var(--foreground))" />
                </g>
              );
            }
            const fill = p.side === "us" ? "hsl(var(--accent))" : "hsl(var(--destructive))";
            const textFill = p.side === "us" ? "hsl(var(--accent-foreground))" : "hsl(var(--destructive-foreground))";
            return (
              <g key={p.id}>
                <circle cx={p.x} cy={p.y} r="3.2" fill={fill} stroke="hsl(var(--foreground) / 0.55)" strokeWidth="0.3" />
                <text
                  x={p.x}
                  y={p.y + 1.05}
                  fontSize="3.2"
                  fontWeight="800"
                  fill={textFill}
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                >
                  {p.id}
                </text>
                {p.label && (
                  <text
                    x={p.x}
                    y={p.y + 7.6}
                    fontSize="2.5"
                    fill="hsl(var(--background))"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="0.08em"
                    style={{ paintOrder: "stroke", stroke: "hsl(var(--pitch-dark))", strokeWidth: 0.9 }}
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}

          {annotations.map((a, idx) => (
            <text
              key={idx}
              x={a.x}
              y={a.y}
              fontSize="2.8"
              fill="hsl(var(--background))"
              textAnchor={a.align ?? "middle"}
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.1em"
              fontWeight="700"
              style={{ paintOrder: "stroke", stroke: "hsl(var(--pitch-dark))", strokeWidth: 0.9 }}
            >
              {a.text}
            </text>
          ))}

          <g opacity="0.6">
            <text x="11" y="98" fontSize="2.2" fill="hsl(var(--pitch-lines))" fontFamily="ui-monospace, monospace" textAnchor="middle" letterSpacing="0.16em">VÅRT MÅL</text>
            <text x="149" y="98" fontSize="2.2" fill="hsl(var(--pitch-lines))" fontFamily="ui-monospace, monospace" textAnchor="middle" letterSpacing="0.16em">DERAS MÅL</text>
          </g>
        </svg>

        <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1.5 rounded-sm bg-background/85 px-1.5 py-1 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/80">VI</span>
          <span className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/80">MOTST.</span>
        </div>
      </div>

      <figcaption className="space-y-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Taktisk illustration</p>
        <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
        {caption && <p className="text-xs leading-relaxed text-muted-foreground">{caption}</p>}
      </figcaption>
    </figure>
  );
};

export default TacticalPitch;
