import SectionReveal from "@/components/SectionReveal";
import KedjaHero from "@/components/kedja/KedjaHero";
import { useSeasonMatches } from "@/hooks/useSeasonMatches";
import { MONTH_LABELS, nextMatch, type SeasonMatch } from "@/data/season";
import { CALENDAR_TRAININGS, type CalendarTraining } from "@/data/teamCalendar";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Dumbbell,
  ExternalLink,
  Loader2,
  MapPin,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SHORT_DAY } from "@/lib/dateUtils";

type CalendarActivity =
  | { id: string; date: string; kind: "training"; training: CalendarTraining }
  | { id: string; date: string; kind: "match"; match: SeasonMatch };

const Matcher = () => {
  const { matches, loading, usingFallback } = useSeasonMatches();
  const now = new Date();
  const upcoming = nextMatch(matches, now);
  const playedMatches = matches.filter((m) => new Date(m.date) < now);
  const activities = buildCalendarActivities(matches);
  const remainingActivities = activities.filter((activity) => new Date(activity.date) >= now);
  const nextActivity = remainingActivities[0] ?? null;
  const months = Array.from(groupActivitiesByMonth(activities).entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Säsong"
        title="Kalender"
        lead={`${matches.length} matcher · ${CALENDAR_TRAININGS.length} träningar · allt i datumordning`}
      />

      <div className="container pb-section">
        {loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-kedja-border bg-white px-3 py-1.5 text-xs text-kedja-deep/70">
            <Loader2 className="h-3 w-3 animate-spin" /> Hämtar kalender…
          </div>
        )}

        {usingFallback && !loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-kedja-green/30 bg-kedja-green/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kedja-green">
            Fallback-data · väntar på första syncen
          </div>
        )}

        <div className="mb-8 grid gap-3 md:grid-cols-3">
          <SummaryTile label="Spelade matcher" value={playedMatches.length} tone="red" />
          <SummaryTile label="Kommande aktiviteter" value={remainingActivities.length} tone="green" />
          <SummaryTile label="Nästa aktivitet" value={nextActivity ? formatShortDate(nextActivity.date) : "—"} tone="amber" />
        </div>

        <div className="space-y-12">
          {months.map(([key, monthActivities]) => {
            const [year, monthIdx] = key.split("-").map(Number);
            const label = `${MONTH_LABELS[monthIdx - 1]} ${year}`;
            return (
              <SectionReveal key={key} as="section">
                <h2 className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-kedja-green">
                    {String(monthIdx).padStart(2, "0")}
                  </span>
                  <span className="text-xl font-black tracking-tight text-kedja-ink">{label}</span>
                </h2>
                <ul className="space-y-2">
                  {monthActivities.map((activity) => (
                    <CalendarActivityRow
                      key={activity.id}
                      activity={activity}
                      isNext={nextActivity?.id === activity.id}
                      isUpcomingMatch={activity.kind === "match" && upcoming?.id === activity.match.id}
                      isPast={new Date(activity.date) < now}
                    />
                  ))}
                </ul>
              </SectionReveal>
            );
          })}
        </div>

        <a
          href="https://www.svenskalag.se/gunnilseis-herr/kalender"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kedja-deep/70 transition hover:text-kedja-green"
        >
          Källa · svenskalag.se kalender
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

function buildCalendarActivities(matches: SeasonMatch[]): CalendarActivity[] {
  return [
    ...CALENDAR_TRAININGS.map((training) => ({
      id: training.id,
      date: training.date,
      kind: "training" as const,
      training,
    })),
    ...matches.map((match) => ({
      id: `match-${match.id}`,
      date: match.date,
      kind: "match" as const,
      match,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function groupActivitiesByMonth(activities: CalendarActivity[]): Map<string, CalendarActivity[]> {
  const groups = new Map<string, CalendarActivity[]>();
  for (const activity of activities) {
    const date = new Date(activity.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(activity);
  }
  return groups;
}

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "numeric" }).format(date);
}

const SummaryTile = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "red" | "green" | "amber";
}) => {
  const toneClass =
    tone === "red"
      ? "border-primary/30 bg-primary/5 text-primary"
      : tone === "green"
        ? "border-kedja-green/30 bg-kedja-green/5 text-kedja-green"
        : "border-amber-500/30 bg-amber-500/10 text-amber-700";

  return (
    <div className={cn("rounded-md border p-4", toneClass)}>
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] opacity-75">{label}</p>
      <p className="mt-1 text-3xl font-black tabular-nums tracking-tight">{value}</p>
    </div>
  );
};

const CalendarActivityRow = ({
  activity,
  isNext,
  isUpcomingMatch,
  isPast,
}: {
  activity: CalendarActivity;
  isNext: boolean;
  isUpcomingMatch: boolean;
  isPast: boolean;
}) => {
  if (activity.kind === "training") {
    return <TrainingRow training={activity.training} isNext={isNext} isPast={isPast} />;
  }

  return (
    <MatchRow
      match={activity.match}
      isNext={isNext}
      isUpcoming={isUpcomingMatch}
      isPast={isPast}
    />
  );
};

const TrainingRow = ({
  training,
  isNext,
  isPast,
}: {
  training: CalendarTraining;
  isNext: boolean;
  isPast: boolean;
}) => {
  const rowClassName = cn(
    "group grid grid-cols-[64px_1fr] items-center gap-4 rounded-md border bg-white px-4 py-3 transition sm:grid-cols-[64px_1fr_auto]",
    isNext
      ? "border-kedja-green/60 shadow-[0_0_0_1px_rgba(7,102,83,0.3)]"
      : "border-kedja-border/70 hover:border-kedja-green/40",
    isPast && !isNext && "opacity-70 hover:opacity-100"
  );

  return (
    <li>
      <div className={rowClassName}>
        <DateStamp iso={training.date} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-sm border border-kedja-green/40 bg-kedja-green/10 text-kedja-green">
              <Dumbbell className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <p className="truncate text-base font-semibold tracking-tight text-kedja-ink">{training.title}</p>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-kedja-deep/70">
            <span className="font-mono font-bold uppercase tracking-[0.16em]">{training.focus}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {training.venue}
            </span>
          </div>
        </div>
        <StatusBadge isNext={isNext} label={isPast ? "Genomförd" : "Träning"} />
      </div>
    </li>
  );
};

const MatchRow = ({
  match,
  isNext,
  isUpcoming,
  isPast,
}: {
  match: SeasonMatch;
  isNext: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}) => {
  const result = resultOf(match);
  const rowClassName = cn(
    "group grid grid-cols-[64px_1fr] items-center gap-4 rounded-md border bg-white px-4 py-3 transition sm:grid-cols-[64px_1fr_auto]",
    match.sourceUrl && "cursor-pointer",
    isNext || isUpcoming
      ? "border-primary/60 shadow-[0_0_0_1px_hsl(var(--primary)/0.25)] hover:border-primary"
      : "border-kedja-border/70 hover:border-primary/40",
    isPast && !isNext && !isUpcoming && "opacity-70 hover:opacity-100"
  );

  return (
    <li>
      {match.sourceUrl ? (
        <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" className={rowClassName}>
          <MatchRowContent match={match} isNext={isNext} isUpcoming={isUpcoming} isPast={isPast} result={result} />
        </a>
      ) : (
        <div className={rowClassName}>
          <MatchRowContent match={match} isNext={isNext} isUpcoming={isUpcoming} isPast={isPast} result={result} />
        </div>
      )}
    </li>
  );
};

const MatchRowContent = ({
  match,
  isNext,
  isUpcoming,
  isPast,
  result,
}: {
  match: SeasonMatch;
  isNext: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  result: { outcome: "W" | "D" | "L"; us: number; them: number } | null;
}) => {
  return (
    <>
      <DateStamp iso={match.date} />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "grid h-5 w-5 flex-shrink-0 place-items-center rounded-sm border font-mono text-[9px] font-black uppercase",
              match.homeAway === "home"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-kedja-border bg-kedja-paper text-kedja-deep/70"
            )}
            title={match.homeAway === "home" ? "Hemmamatch" : "Bortamatch"}
          >
            {match.homeAway === "home" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
          </span>
          <p className="truncate text-base font-semibold tracking-tight text-kedja-ink">
            {match.homeAway === "home" ? "Gunnilse — " : ""}
            {match.opponent}
            {match.homeAway === "away" ? " — Gunnilse" : ""}
            {match.sourceUrl && (
              <ExternalLink className="ml-1.5 hidden h-3 w-3 text-kedja-deep/70 transition group-hover:text-primary sm:inline" />
            )}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-kedja-deep/70">
          <span className="inline-flex items-center gap-1 font-mono font-bold uppercase tracking-[0.16em]">
            <Trophy className="h-3 w-3" />
            {match.competition}
          </span>
          {match.venue && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.venue}
            </span>
          )}
        </div>
      </div>

      {result ? (
        <ResultBadge result={result} />
      ) : (
        <StatusBadge isNext={isNext || isUpcoming} label={isNext ? "Nästa" : isPast ? "Spelad" : "Match"} />
      )}
    </>
  );
};

const DateStamp = ({ iso }: { iso: string }) => {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = SHORT_DAY[date.getDay()];
  const time = date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col items-center justify-center border-r border-kedja-border/60 pr-4">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-kedja-deep/70">
        {weekday}
      </span>
      <span className="text-2xl font-black leading-none tracking-tight text-kedja-ink">{day}</span>
      <span className="mt-0.5 font-mono text-[9px] font-bold tracking-wider text-kedja-deep/70">
        {time}
      </span>
    </div>
  );
};

const StatusBadge = ({ isNext, label }: { isNext: boolean; label: string }) => (
  <div className="col-span-2 flex justify-end sm:col-span-1">
    <span
      className={cn(
        "rounded-sm border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wider",
        isNext
          ? "border-kedja-green/40 bg-kedja-green/10 text-kedja-green"
          : "border-kedja-border bg-kedja-paper text-kedja-deep/70"
      )}
    >
      {label}
    </span>
  </div>
);

const ResultBadge = ({ result }: { result: { outcome: "W" | "D" | "L"; us: number; them: number } }) => (
  <div className="col-span-2 flex justify-end sm:col-span-1">
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-sm border px-2 py-1",
        result.outcome === "W" && "border-zone-attack/40 bg-zone-attack/10 text-zone-attack",
        result.outcome === "D" && "border-kedja-border bg-kedja-paper text-kedja-deep/70",
        result.outcome === "L" && "border-destructive/40 bg-destructive/10 text-destructive"
      )}
    >
      <span className="font-mono text-[10px] font-black uppercase tracking-wider">
        {result.outcome === "W" ? "Vinst" : result.outcome === "D" ? "Oavgjort" : "Förlust"}
      </span>
      <span className="font-mono text-sm font-black">
        {result.us}–{result.them}
      </span>
    </div>
  </div>
);

export function resultOf(match: SeasonMatch): { outcome: "W" | "D" | "L"; us: number; them: number } | null {
  if (typeof match.ourScore !== "number" || typeof match.theirScore !== "number") return null;
  if (match.ourScore > match.theirScore) return { outcome: "W", us: match.ourScore, them: match.theirScore };
  if (match.ourScore < match.theirScore) return { outcome: "L", us: match.ourScore, them: match.theirScore };
  return { outcome: "D", us: match.ourScore, them: match.theirScore };
}

export default Matcher;
