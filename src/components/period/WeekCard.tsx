import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Week } from "@/data/period1";

const WeekCard = ({ week, anchorBase = "/period/1#vecka" }: { week: Week; anchorBase?: string }) => {
  const days = week.sessions.map((s) => `${s.day} ${s.date}`);
  return (
    <Link
      to={`${anchorBase}-${week.weekNumber}`}
      className="group flex h-full flex-col rounded-lg border border-border bg-card/40 p-4 transition hover:border-accent/45"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
          Vecka {week.weekNumber}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {week.dateRange}
        </span>
      </div>
      <h3 className="text-xl leading-snug text-foreground">{week.theme}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{week.learningGoal}</p>

      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {days.map((d) => (
          <li key={d} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            {d}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <p className="rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1.5 text-[11px] font-semibold leading-snug text-accent">
          KPI · {week.kpi}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent opacity-80 transition group-hover:gap-2.5 group-hover:opacity-100">
          Öppna detalj <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default WeekCard;
