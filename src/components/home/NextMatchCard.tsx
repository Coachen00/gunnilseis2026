/**
 * NextMatchCard — kompakt matchkort överst på Hem.
 *
 * Spelarens första fråga ("när/var/vem spelar vi?") ska besvaras direkt,
 * utan inloggning och utan klick. Datakälla: samma statiska mönster som
 * MatchKommande.tsx (MATCH_META + MATCH_SCHEDULE) — ingen ny datalogik.
 *
 * Utloggad: samma matchinfo syns (inte känsligt), men CTA pekar till /login.
 */

import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MATCH_META, MATCH_SCHEDULE } from "@/data/matchplan";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function NextMatchCard() {
  const { isAuthed, loading } = useAuthSession();

  if (!MATCH_META?.opponent) return null;

  const gathering = MATCH_SCHEDULE[0];
  const kickoffTime = MATCH_META.kickoff.split("·").at(-1)?.trim() ?? MATCH_META.kickoff;

  if (loading) {
    return (
      <div className="container pt-8 md:pt-12">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container pt-8 md:pt-12">
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="bg-gradient-to-br from-amber-50 via-card to-card px-5 py-5 md:px-8 md:py-7">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
              Veckans match
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-4xl">
              {MATCH_META.opponent}
            </h2>
            <p className="mt-2 text-sm font-bold text-muted-foreground md:text-base">
              {MATCH_META.home ? "Hemma" : "Borta"} · {MATCH_META.competition}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-amber-700" />
                <span className="text-sm font-bold">{kickoffTime}</span>
              </div>
              {gathering && (
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-amber-700" />
                  <span className="text-sm font-bold">Samling {gathering.time}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4 text-amber-700" />
                <span className="text-sm font-bold">{MATCH_META.venue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center border-t border-border bg-card px-5 py-5 md:border-l md:border-t-0 md:px-6">
            <Link
              to={isAuthed ? "/match/kommande" : "/login"}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-amber-500/60 bg-amber-500 px-5 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400 md:w-auto"
            >
              Veckans matchplan
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
