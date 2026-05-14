import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { useSeasonMatches } from "@/hooks/useSeasonMatches";
import { groupByMonth, MONTH_LABELS, nextMatch, type SeasonMatch } from "@/data/season";
import { ExternalLink, Loader2, MapPin, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHORT_DAY } from "@/lib/dateUtils";

const Matcher = () => {
  const { matches, loading, usingFallback } = useSeasonMatches();
  const now = new Date();
  const upcoming = nextMatch(matches, now);
  const played = matches.filter((m) => new Date(m.date) < now);
  const remaining = matches.filter((m) => new Date(m.date) >= now);
  const months = Array.from(groupByMonth(matches).entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <>
      <PageHero
        eyebrow="Säsong"
        title="Årets matcher"
        description={`${played.length} spelade · ${remaining.length} kvar · auto-uppdateras från svenskalag.se`}
      />

      <div className="container pb-section">
        {loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Hämtar matcher…
          </div>
        )}

        {usingFallback && !loading && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            Fallback-data · väntar på första syncen
          </div>
        )}

        <div className="space-y-12">
          {months.map(([key, monthMatches]) => {
            const [year, monthIdx] = key.split("-").map(Number);
            const label = `${MONTH_LABELS[monthIdx - 1]} ${year}`;
            return (
              <SectionReveal key={key} as="section">
                <h2 className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                    {String(monthIdx).padStart(2, "0")}
                  </span>
                  <span className="text-xl font-black tracking-tight text-foreground">{label}</span>
                </h2>
                <ul className="space-y-2">
                  {monthMatches.map((m) => (
                    <MatchRow
                      key={m.id}
                      match={m}
                      isUpcoming={upcoming?.id === m.id}
                      isPast={new Date(m.date) < now}
                    />
                  ))}
                </ul>
              </SectionReveal>
            );
          })}
        </div>

        <a
          href="https://www.svenskalag.se/gunnilseis-herr/matcher"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground transition hover:text-accent"
        >
          Källa · svenskalag.se
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </>
  );
};

const MatchRow = ({
  match,
  isUpcoming,
  isPast,
}: {
  match: SeasonMatch;
  isUpcoming: boolean;
  isPast: boolean;
}) => {
  const result = resultOf(match);
  const rowClassName = cn(
    "group grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-md border bg-card px-4 py-3 transition",
    match.sourceUrl && "cursor-pointer",
    isUpcoming
      ? "border-accent/60 shadow-[0_0_0_1px_hsl(var(--accent)/0.3)] hover:border-accent"
      : "border-border/70 hover:border-accent/40",
    isPast && !isUpcoming && "opacity-70 hover:opacity-100"
  );

  return (
    <li>
      {match.sourceUrl ? (
        <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" className={rowClassName}>
          <MatchRowContent match={match} isUpcoming={isUpcoming} isPast={isPast} result={result} />
        </a>
      ) : (
        <div className={rowClassName}>
          <MatchRowContent match={match} isUpcoming={isUpcoming} isPast={isPast} result={result} />
        </div>
      )}
    </li>
  );
};

const MatchRowContent = ({
  match,
  isUpcoming,
  isPast,
  result,
}: {
  match: SeasonMatch;
  isUpcoming: boolean;
  isPast: boolean;
  result: { outcome: "W" | "D" | "L"; us: number; them: number } | null;
}) => {
  const date = new Date(match.date);
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = SHORT_DAY[date.getDay()];
  const time = date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Date stamp */}
      <div className="flex flex-col items-center justify-center border-r border-border/60 pr-4">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {weekday}
        </span>
        <span className="text-2xl font-black leading-none tracking-tight text-foreground">{day}</span>
        <span className="mt-0.5 font-mono text-[9px] font-bold tracking-wider text-muted-foreground">
          {time}
        </span>
      </div>

      {/* Opponent + meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "grid h-5 w-5 flex-shrink-0 place-items-center rounded-sm border font-mono text-[9px] font-black uppercase",
              match.homeAway === "home"
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-background/60 text-muted-foreground"
            )}
            title={match.homeAway === "home" ? "Hemmamatch" : "Bortamatch"}
          >
            {match.homeAway === "home" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
          </span>
          <p className="truncate text-base font-semibold tracking-tight text-foreground">
            {match.homeAway === "home" ? "Gunnilse — " : ""}
            {match.opponent}
            {match.homeAway === "away" ? " — Gunnilse" : ""}
            {match.sourceUrl && <ExternalLink className="ml-1.5 inline h-3 w-3 text-muted-foreground transition group-hover:text-accent" />}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-mono font-bold uppercase tracking-[0.16em]">{match.competition}</span>
          {match.venue && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.venue}
            </span>
          )}
        </div>
      </div>

      {/* Result / status */}
      <div className="flex flex-col items-end gap-0.5">
        {isUpcoming && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-accent">
            Veckans
          </span>
        )}
        {result ? (
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2 py-1",
              result.outcome === "W" && "border-zone-attack/40 bg-zone-attack/10 text-zone-attack",
              result.outcome === "D" && "border-border bg-muted/30 text-muted-foreground",
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
        ) : !isUpcoming ? (
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {isPast ? "Spelad" : "Kommande"}
          </span>
        ) : null}
      </div>
    </>
  );
};

function resultOf(match: SeasonMatch): { outcome: "W" | "D" | "L"; us: number; them: number } | null {
  if (typeof match.ourScore !== "number" || typeof match.theirScore !== "number") return null;
  if (match.ourScore > match.theirScore) return { outcome: "W", us: match.ourScore, them: match.theirScore };
  if (match.ourScore < match.theirScore) return { outcome: "L", us: match.ourScore, them: match.theirScore };
  return { outcome: "D", us: match.ourScore, them: match.theirScore };
}

export default Matcher;
