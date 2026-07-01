import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, LockKeyhole, MapPin, Shield, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useSeasonMatches } from "@/hooks/useSeasonMatches";
import { cn } from "@/lib/utils";

type TrainingEvent = {
  id: string;
  date: string;
  day: string;
  time: string;
  title: string;
  venue: string;
  tone: "green" | "amber" | "red";
};

const TRAINING_EVENTS: TrainingEvent[] = [
  {
    id: "start",
    date: "27/7",
    day: "Mån",
    time: "18:30",
    title: "Första träningen",
    venue: "Hjällbovallen gräs",
    tone: "green",
  },
  {
    id: "matchtempo",
    date: "29/7",
    day: "Ons",
    time: "18:30",
    title: "Matchtempo",
    venue: "Hjällbovallen",
    tone: "amber",
  },
  {
    id: "matchforberedande",
    date: "30/7",
    day: "Tor",
    time: "18:30",
    title: "Matchförberedande",
    venue: "Hjällbovallen",
    tone: "red",
  },
];

const TONE = {
  green: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
  amber: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  red: "border-red-300/40 bg-red-300/10 text-red-100",
} as const;

function formatMatchDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { day: "", date: "", time: "" };
  return {
    day: new Intl.DateTimeFormat("sv-SE", { weekday: "short" }).format(date).replace(".", ""),
    date: new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "numeric" }).format(date),
    time: new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit" }).format(date),
  };
}

function AuthedCalendarContent() {
  const { matches, loading: matchesLoading } = useSeasonMatches();
  const now = new Date();
  const upcomingMatches = matches
    .filter((match) => new Date(match.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <>
      <div className="grid gap-2.5">
        {TRAINING_EVENTS.map((event) => (
          <div
            key={event.id}
            className="grid grid-cols-[58px_1fr] gap-3 border border-amber-200/12 bg-amber-100/[0.035] p-3"
          >
            <div className={cn("flex flex-col items-center justify-center border px-2 py-2", TONE[event.tone])}>
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em]">{event.day}</span>
              <span className="text-lg font-black leading-none tabular-nums">{event.date}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-sm font-black tracking-tight text-amber-50">{event.title}</h3>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold tracking-[0.12em] text-amber-200/75">
                  <Clock3 className="h-3 w-3" strokeWidth={2.3} aria-hidden="true" />
                  {event.time}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-amber-100/65">
                <MapPin className="h-3 w-3 shrink-0" strokeWidth={2.3} aria-hidden="true" />
                {event.venue}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-amber-200/15" aria-hidden="true" />
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-amber-300/80">
          Matcher
        </span>
        <span className="h-px flex-1 bg-amber-200/15" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        {matchesLoading && (
          <div className="border border-amber-200/12 bg-amber-100/[0.035] p-3 text-xs text-amber-100/70">
            Hämtar uppdaterad kalender…
          </div>
        )}
        {!matchesLoading &&
          upcomingMatches.map((match, index) => {
            const date = formatMatchDate(match.date);
            const isNext = index === 0;
            return (
              <a
                key={match.id}
                href={match.sourceUrl ?? "https://www.svenskalag.se/gunnilseis-herr/matcher"}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group grid grid-cols-[58px_1fr_auto] items-center gap-3 border p-3 transition",
                  isNext
                    ? "border-red-300/45 bg-red-400/12"
                    : "border-amber-200/12 bg-amber-100/[0.035] hover:border-amber-300/35"
                )}
              >
                <div className="text-center">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-amber-200/70">
                    {date.day}
                  </p>
                  <p className="text-lg font-black leading-none tabular-nums text-amber-50">{date.date}</p>
                  <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.14em] text-amber-200/65">
                    {date.time}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black tracking-tight text-amber-50">
                    {match.homeAway === "home" ? "Gunnilse - " : ""}
                    {match.opponent}
                    {match.homeAway === "away" ? " - Gunnilse" : ""}
                  </p>
                  <p className="mt-1 truncate text-xs text-amber-100/62">{match.venue}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center border px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.15em]",
                    isNext
                      ? "border-red-200/45 bg-red-200/10 text-red-100"
                      : "border-amber-200/20 text-amber-200/70"
                  )}
                >
                  {isNext ? "Nästa" : match.homeAway === "home" ? "H" : "B"}
                </span>
              </a>
            );
          })}
      </div>

      <Link
        to="/match/matcher"
        className="group mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 text-sm font-black uppercase tracking-[0.14em] text-amber-100 transition hover:border-amber-300/70 hover:bg-amber-300/15"
      >
        Öppna hela kalendern
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
      </Link>
    </>
  );
}

export default function HomeCalendarBoard() {
  const reduced = Boolean(useReducedMotion());
  const { isAuthed, loading: authLoading } = useAuthSession();
  const authed = !authLoading && isAuthed;

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18, rotate: 0.5 },
        animate: { opacity: 1, y: 0, rotate: 0 },
        transition: { duration: 0.75, delay: 0.85, ease: "easeOut" as const },
      };

  return (
    <motion.aside
      {...reveal}
      aria-label="Kalender för återstart och kommande matcher"
      className="relative mt-6 w-full max-w-xl justify-self-end border border-amber-200/20 bg-[#110b05]/76 p-4 text-amber-50 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(254,243,226,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(254,243,226,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-amber-200/15 pb-4">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
              Kalender
            </p>
            <h2 className="mt-2 text-2xl font-black leading-none tracking-tight text-amber-50 sm:text-3xl">
              Tillbaka på gräs
            </h2>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center border border-amber-300/35 bg-amber-300/10">
            <span className="text-center font-mono text-[10px] font-black uppercase leading-tight tracking-[0.16em] text-amber-200">
              v.31
            </span>
          </div>
        </div>

        {authed ? (
          <AuthedCalendarContent />
        ) : (
          <div className="grid gap-3">
            <div className="border border-amber-200/12 bg-amber-100/[0.035] p-4">
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                <LockKeyhole className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                Inloggad vy
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-amber-100/76">
                Kalender, samlingar och matchvecka visas här när du är inloggad i spelmodellen.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2" aria-hidden="true">
              {["Träning", "Match", "Plan"].map((label, index) => (
                <div key={label} className="border border-amber-200/12 bg-amber-100/[0.035] p-3 text-center">
                  <span className="mx-auto mb-2 grid h-8 w-8 place-items-center border border-amber-300/25 bg-amber-300/10 text-amber-200">
                    {index === 0 ? <Zap className="h-4 w-4" /> : index === 1 ? <Shield className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                  </span>
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-amber-100/52">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-amber-300/35 bg-amber-300/10 px-4 text-sm font-black uppercase tracking-[0.14em] text-amber-100 transition hover:border-amber-300/70"
            >
              Logga in
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
