import { PERIOD_1_TIMELINE } from "@/data/period1";

const PeriodTimeline = () => (
  <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
    {PERIOD_1_TIMELINE.map((step) => (
      <li
        key={step.week}
        className="rounded-lg border border-border bg-card/40 p-3 transition hover:border-accent/40"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Vecka {step.week}
        </p>
        <p className="mt-1 text-sm font-black leading-tight text-foreground">{step.label}</p>
      </li>
    ))}
  </ol>
);

export default PeriodTimeline;
