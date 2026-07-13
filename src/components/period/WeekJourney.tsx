import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PERIOD_1 } from "@/data/period1";

const WeekJourney = ({ to = "/period/1?tab=passen" }: { to?: string }) => (
  <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
    {PERIOD_1.weeks.map((week) => (
      <li key={week.weekNumber}>
        <Link
          to={`${to}#vecka-${week.weekNumber}`}
          className="group flex h-full flex-col rounded-lg border border-border bg-card/40 p-3 transition hover:border-accent/45"
        >
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
            Vecka {week.weekNumber}
          </span>
          <span className="mt-1 text-sm font-black leading-tight text-foreground">{week.theme}</span>
          <span className="mt-1 text-[11px] text-muted-foreground">{week.dateRange}</span>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-accent opacity-0 transition group-hover:opacity-100">
            Visa pass <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </li>
    ))}
  </ol>
);

export default WeekJourney;
