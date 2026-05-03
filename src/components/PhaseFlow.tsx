import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, Shield, Swords, Zap } from "lucide-react";

const phases = [
  { icon: Swords, label: "Anfall", sub: "Skapa avslut", to: "/anfall#cues" },
  { icon: RotateCcw, label: "Tapp", sub: "Jaga eller samla", to: "/omstallning-forsvar#cues" },
  { icon: Shield, label: "Försvar", sub: "Stäng mitten", to: "/forsvar#cues" },
  { icon: Zap, label: "Vinst", sub: "Ut och fram", to: "/omstallning-anfall#cues" },
];

const PhaseFlow = () => (
  <ol className="divide-y divide-border border-y border-border">
    {phases.map((phase, index) => {
      const Icon = phase.icon;
      return (
        <li key={phase.label}>
          <Link
            to={phase.to}
            className="group grid items-center gap-4 py-5 transition hover:bg-background/35 md:grid-cols-[56px_1fr_1fr_28px]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background/40 text-accent">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Skede {index + 1}
              </span>
              <span className="mt-1 block text-lg font-black leading-tight tracking-normal text-foreground">
                {phase.label}
              </span>
            </span>
            <span className="text-sm font-semibold text-muted-foreground">{phase.sub}</span>
            <ArrowRight className="hidden h-4 w-4 text-accent transition group-hover:translate-x-1 md:block" />
          </Link>
        </li>
      );
    })}
  </ol>
);

export default PhaseFlow;
