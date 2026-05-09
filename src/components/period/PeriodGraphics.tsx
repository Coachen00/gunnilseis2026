import { cn } from "@/lib/utils";
import KorridorerDiagram from "@/components/KorridorerDiagram";
import type { GraphicType } from "@/data/period1";

const ARROWHEAD = (id: string, color: string) => (
  <defs>
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  </defs>
);

const PitchFrame = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 200 130" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
    <rect width="200" height="130" rx="6" fill="hsl(var(--pitch-dark))" />
    <rect x="6" y="6" width="188" height="118" rx="4" fill="hsl(var(--pitch))" opacity="0.85" />
    <line x1="6" y1="65" x2="194" y2="65" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.5" />
    <circle cx="100" cy="65" r="10" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.5" />
    <rect x="60" y="6" width="80" height="14" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.5" />
    <rect x="60" y="110" width="80" height="14" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.5" />
    {[40, 80, 120, 160].map((x) => (
      <line
        key={x}
        x1={x}
        y1="6"
        x2={x}
        y2="124"
        stroke="hsl(var(--foreground))"
        strokeWidth="0.3"
        strokeDasharray="3,2"
        opacity="0.18"
      />
    ))}
    {children}
  </svg>
);

const Player = ({ x, y, label, kind = "us" }: { x: number; y: number; label: string; kind?: "us" | "them" | "ball" }) => {
  const fill =
    kind === "us"
      ? "hsl(var(--accent))"
      : kind === "them"
      ? "hsl(var(--destructive))"
      : "hsl(var(--foreground))";
  const text = kind === "us" ? "hsl(var(--accent-foreground))" : "hsl(var(--background))";
  return (
    <g>
      <circle cx={x} cy={y} r="4.5" fill={fill} stroke="hsl(var(--background))" strokeWidth="0.6" />
      <text x={x} y={y + 1.6} textAnchor="middle" fontSize="4.5" fontWeight="900" fill={text}>
        {label}
      </text>
    </g>
  );
};

const PassArrow = ({ x1, y1, x2, y2, color = "hsl(var(--accent))", marker = "pass" }: { x1: number; y1: number; x2: number; y2: number; color?: string; marker?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2" markerEnd={`url(#${marker})`} />
);

const RunArrow = ({ x1, y1, x2, y2, color = "hsl(var(--primary))", marker = "run" }: { x1: number; y1: number; x2: number; y2: number; color?: string; marker?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeDasharray="3,2" markerEnd={`url(#${marker})`} />
);

/** MV → YB → MF → OM → YF, fem korridorer, en hel anfallssekvens. */
export const DiagonalPatternGraphic = ({ className, label }: { className?: string; label?: string }) => (
  <figure className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
    <PitchFrame>
      {ARROWHEAD("pass", "hsl(var(--accent))")}
      {ARROWHEAD("run", "hsl(var(--primary))")}
      <Player x={20} y={65} label="MV" />
      <Player x={50} y={28} label="YB" />
      <Player x={92} y={50} label="MF" />
      <Player x={130} y={88} label="OM" />
      <Player x={175} y={108} label="YF" />
      <PassArrow x1={24} y1={64} x2={47} y2={29} />
      <PassArrow x1={53} y1={29} x2={89} y2={49} />
      <PassArrow x1={94} y1={52} x2={127} y2={87} />
      <PassArrow x1={132} y1={89} x2={172} y2={107} />
    </PitchFrame>
    <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label ?? "MV → YB → MF → OM → YF"}
    </figcaption>
  </figure>
);

/** Attrahera → Fixera → Frigöra → Exploatera. */
export const AttractFixReleaseGraphic = ({ className, label }: { className?: string; label?: string }) => (
  <figure className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
    <PitchFrame>
      {ARROWHEAD("pass", "hsl(var(--accent))")}
      {ARROWHEAD("run", "hsl(var(--primary))")}
      <Player x={28} y={70} label="MV" />
      <Player x={48} y={38} label="YB" />
      <Player x={90} y={60} label="6" />
      <Player x={140} y={36} label="8" />
      <Player x={62} y={48} kind="them" label="P" />
      <Player x={70} y={62} kind="them" label="P" />
      <Player x={108} y={52} kind="them" label="P" />
      <PassArrow x1={32} y1={68} x2={45} y2={39} />
      <RunArrow x1={62} y1={48} x2={50} y2={36} />
      <PassArrow x1={51} y1={39} x2={87} y2={59} />
      <PassArrow x1={92} y1={58} x2={138} y2={37} />
    </PitchFrame>
    <figcaption className="mt-2 grid grid-cols-4 gap-1 text-[10px] font-bold uppercase text-muted-foreground">
      <span className="text-accent">Attrahera</span>
      <span>Fixera</span>
      <span>Frigöra</span>
      <span>Exploatera</span>
    </figcaption>
    {label && <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>}
  </figure>
);

/** A → B → C där C kommer rättvänd. */
export const ThirdManGraphic = ({ className, label }: { className?: string; label?: string }) => (
  <figure className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
    <PitchFrame>
      {ARROWHEAD("pass", "hsl(var(--accent))")}
      {ARROWHEAD("run", "hsl(var(--primary))")}
      <Player x={45} y={50} label="A" />
      <Player x={95} y={58} label="B" />
      <Player x={148} y={42} label="C" />
      <Player x={108} y={46} kind="them" label="P" />
      <PassArrow x1={49} y1={51} x2={92} y2={57} />
      <PassArrow x1={97} y1={56} x2={145} y2={44} />
      <RunArrow x1={130} y1={70} x2={148} y2={43} />
    </PitchFrame>
    <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label ?? "A → B (1 tillslag) → C rättvänd"}
    </figcaption>
  </figure>
);

/** Sista tredjedelen: ytter brett, OM halvyta, YB/8 understöd, cutback in i box. */
export const FinalThirdGraphic = ({ className, label }: { className?: string; label?: string }) => (
  <figure className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
    <PitchFrame>
      {ARROWHEAD("pass", "hsl(var(--accent))")}
      {ARROWHEAD("run", "hsl(var(--primary))")}
      <Player x={175} y={30} label="YF" />
      <Player x={140} y={50} label="OM" />
      <Player x={150} y={80} label="8" />
      <Player x={110} y={20} label="9" />
      <Player x={50} y={40} label="YF2" />
      <PassArrow x1={172} y1={32} x2={143} y2={51} />
      <PassArrow x1={140} y1={54} x2={114} y2={22} />
      <RunArrow x1={50} y1={42} x2={100} y2={20} />
      <RunArrow x1={150} y1={78} x2={120} y2={28} />
      <rect x="60" y="6" width="80" height="14" fill="hsl(var(--accent))" opacity="0.12" />
    </PitchFrame>
    <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label ?? "Assistyta + boxfyllnad"}
    </figcaption>
  </figure>
);

/** Restförsvar: 6:a under bollen, två/tre bakom, bortre MB skyddar djup. */
export const RestDefenseGraphic = ({ className, label }: { className?: string; label?: string }) => (
  <figure className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
    <PitchFrame>
      {ARROWHEAD("pass", "hsl(var(--accent))")}
      {ARROWHEAD("run", "hsl(var(--primary))")}
      <rect x="6" y="55" width="188" height="22" fill="hsl(var(--primary))" opacity="0.18" />
      <Player x={150} y={30} label="9" />
      <Player x={170} y={48} label="YF" />
      <Player x={130} y={45} label="OM" />
      <Player x={100} y={68} label="6" />
      <Player x={60} y={75} label="MB" />
      <Player x={50} y={50} label="MB" />
      <PassArrow x1={102} y1={67} x2={128} y2={46} />
      <text x={100} y={92} textAnchor="middle" fontSize="5" fontWeight="700" fill="hsl(var(--primary))">
        Säker zon
      </text>
    </PitchFrame>
    <figcaption className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label ?? "6:a under bollen + bortre MB skyddar djup"}
    </figcaption>
  </figure>
);

/** Render the right graphic for a session/week's `graphic` field. */
export const PeriodGraphic = ({ kind, label, className }: { kind: GraphicType; label?: string; className?: string }) => {
  switch (kind) {
    case "diagonal-pattern":
      return <DiagonalPatternGraphic className={className} label={label} />;
    case "attract-fix-release":
      return <AttractFixReleaseGraphic className={className} label={label} />;
    case "third-man":
      return <ThirdManGraphic className={className} label={label} />;
    case "final-third":
      return <FinalThirdGraphic className={className} label={label} />;
    case "rest-defense":
      return <RestDefenseGraphic className={className} label={label} />;
    case "corridor-map":
      return (
        <div className={cn("rounded-lg border border-border bg-card/40 p-3", className)}>
          <KorridorerDiagram />
        </div>
      );
    case "pitch":
    default:
      return <DiagonalPatternGraphic className={className} label={label} />;
  }
};
