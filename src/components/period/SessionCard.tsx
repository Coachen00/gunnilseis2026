import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Flag,
  Gauge,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { PeriodGraphic } from "@/components/period/PeriodGraphics";
import type { Session } from "@/data/period1";

const Block = ({
  label,
  text,
  tint = "default",
}: {
  label: string;
  text: string;
  tint?: "default" | "accent";
}) => (
  <div className="rounded-md border border-border bg-background/40 p-3">
    <p
      className={`mb-1 text-[10px] font-black uppercase tracking-[0.2em] ${
        tint === "accent" ? "text-accent-ink" : "text-muted-foreground"
      }`}
    >
      {label}
    </p>
    <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
  </div>
);

const Bullets = ({
  label,
  Icon,
  items,
  tint = "muted",
}: {
  label: string;
  Icon: LucideIcon;
  items: string[];
  tint?: "muted" | "accent" | "destructive" | "primary";
}) => {
  const colors = {
    muted: "text-muted-foreground",
    accent: "text-accent-ink",
    destructive: "text-destructive",
    primary: "text-primary",
  } as const;
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <p className={`mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${colors[tint]}`}>
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
};

const SessionCard = ({ session }: { session: Session }) => (
  <article className="rounded-xl border border-border bg-card/35 p-5">
    <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
      <h3 className="text-xl text-foreground">{session.title}</h3>
      <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-ink">
        <Compass className="h-3.5 w-3.5" />
        {session.principle}
      </span>
    </header>

    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{session.purpose}</p>

    <div className="grid gap-3 lg:grid-cols-[1fr_minmax(0,260px)]">
      <div className="space-y-2.5">
        <Block label="Aktivering" text={session.activation} tint="accent" />
        <Block label="Övning 1" text={session.exercise1} />
        <Block label="Övning 2" text={session.exercise2} />
        <Block label="Spel" text={session.game} tint="accent" />
      </div>
      <PeriodGraphic kind={session.graphic} />
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Bullets label="Coaching cues" Icon={Lightbulb} items={session.coachingCues} tint="accent" />
      <Bullets
        label="Positiv förstärkning"
        Icon={CheckCircle2}
        items={session.positiveReinforcement}
        tint="primary"
      />
      <Bullets label="Vanliga fel" Icon={AlertTriangle} items={session.commonErrors} tint="destructive" />
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <div className="rounded-md border border-border bg-background/40 p-3">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> Progression
        </p>
        <p className="text-xs text-muted-foreground">{session.progression}</p>
      </div>
      <div className="rounded-md border border-border bg-background/40 p-3">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Flag className="h-3 w-3" /> Match
        </p>
        <p className="text-xs text-muted-foreground">{session.matchConnection}</p>
      </div>
      <div className="rounded-md border border-accent/30 bg-accent/10 p-3">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent-ink">
          <Gauge className="h-3 w-3" /> KPI
        </p>
        <p className="text-xs font-semibold text-accent-ink">{session.kpi}</p>
      </div>
    </div>
  </article>
);

export default SessionCard;
