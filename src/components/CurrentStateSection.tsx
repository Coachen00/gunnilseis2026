import { RotateCcw, Shield, Swords, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "gold" | "blue" | "green" | "red";

type MacroPhase = {
  num: string;
  label: string;
  oneLiner: string;
  Icon: LucideIcon;
  tone: Tone;
  principles: string[];
};

const TONE: Record<Tone, { text: string; bg: string; border: string }> = {
  gold: { text: "text-gunnilse-gold", bg: "bg-gunnilse-gold/10", border: "border-gunnilse-gold/25" },
  blue: { text: "text-swedish-blue", bg: "bg-swedish-blue/10", border: "border-swedish-blue/25" },
  green: { text: "text-zone-attack", bg: "bg-zone-attack/10", border: "border-zone-attack/25" },
  red: { text: "text-gunnilse-red", bg: "bg-gunnilse-red/10", border: "border-gunnilse-red/25" },
};

const PHASES: MacroPhase[] = [
  {
    num: "01",
    label: "Anfall",
    oneLiner: "Skydda kontring först — sen in, ut, framåt, fyll boxen.",
    Icon: Swords,
    tone: "gold",
    principles: ["Skydda", "In", "Ut", "Framåt", "Box"],
  },
  {
    num: "02",
    label: "Försvar",
    oneLiner: "Samla först, lås sedan bollsida.",
    Icon: Shield,
    tone: "blue",
    principles: ["Gyllene zon", "Styr press", "Tre korridorer", "Kompakt", "Insidan stängd"],
  },
  {
    num: "03",
    label: "Bollvinst",
    oneLiner: "Kontra när bilden är rätt, annars säkra.",
    Icon: Zap,
    tone: "green",
    principles: ["Kontra", "Diagonal ut", "Djupled"],
  },
  {
    num: "04",
    label: "Bolltapp",
    oneLiner: "Jaga nära, bromsa när vi är utdragna.",
    Icon: RotateCcw,
    tone: "red",
    principles: ["Direkt", "Indirekt", "Forwarden först"],
  },
];

const CurrentStateSection = () => (
  <section id="nulage" className="scroll-mt-24 pt-10">
    <div className="mb-10 max-w-3xl">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Nuläge</p>
      <h1 className="text-4xl font-black leading-tight tracking-normal text-foreground md:text-6xl">
        En enkel spelidé i fyra skeden.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        Samma ord i träning, matchgenomgång och analys.
      </p>
    </div>

    <div className="divide-y divide-border border-y border-border">
      {PHASES.map((phase) => (
        <PhaseRow key={phase.num} phase={phase} />
      ))}
    </div>
  </section>
);

const PhaseRow = ({ phase }: { phase: MacroPhase }) => {
  const tone = TONE[phase.tone];
  const Icon = phase.Icon;

  return (
    <article className="grid gap-4 py-6 md:grid-cols-[72px_220px_1fr] md:items-start">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-md border", tone.border, tone.bg, tone.text)}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-xs font-black text-muted-foreground md:hidden">{phase.num}</span>
      </div>
      <div>
        <p className="hidden font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground md:block">
          {phase.num}
        </p>
        <h2 className="mt-1 text-xl font-black leading-tight tracking-normal text-foreground">{phase.label}</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">{phase.oneLiner}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {phase.principles.map((principle) => (
          <span
            key={principle}
            className="rounded-md border border-border bg-card/55 px-2.5 py-1.5 text-xs font-bold text-foreground/85"
          >
            {principle}
          </span>
        ))}
      </div>
    </article>
  );
};

export default CurrentStateSection;
