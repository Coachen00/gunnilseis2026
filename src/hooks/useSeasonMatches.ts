import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { SEASON_MATCHES, type SeasonMatch } from "@/data/season";
import { MATCH_META } from "@/data/matchplan";
import { useRealtimeChannel } from "./useRealtimeChannel";

/**
 * useSeasonMatches — säsongens matcher från Supabase med realtime-uppdatering.
 *
 * - TanStack Query för cache och dedup mellan rutter.
 * - Realtime: pratar med `matches`-tabellen och invaliderar query vid changes.
 * - Fallback: hårdkodad SEASON_MATCHES om backend är otillgänglig.
 * - ensureWeeklyMatch() städar bort stale upcoming-matcher som annars
 *   skuggar veckans riktiga match (logik från huvud-branchen).
 *
 * API bevaras: `{ matches, loading, usingFallback }`.
 */
const SEASON_KEY = ["matches", "season"] as const;
const STATIC_WEEKLY_MATCH = SEASON_MATCHES.find((match) => match.opponent === MATCH_META.opponent);
const STALE_UPCOMING_NAMES = ["kareby", "lerum", "björkö", "bjorko"];

export function useSeasonMatches() {
  const query = useQuery({
    queryKey: SEASON_KEY,
    queryFn: async (): Promise<{ data: SeasonMatch[]; usingFallback: boolean }> => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          "id, opponent, match_date, home_away, competition, venue, our_score, their_score, external_id, manual_override"
        )
        .not("match_date", "is", null)
        .order("match_date", { ascending: true });

      if (error) {
        logger.warn(error, { scope: "matches", phase: "season" });
        return { data: SEASON_MATCHES, usingFallback: true };
      }
      if (!data || data.length === 0) {
        return { data: SEASON_MATCHES, usingFallback: true };
      }
      const rows = ensureWeeklyMatch(
        data
          .filter((row) => row.match_date && row.opponent)
          .filter((row) => !(row.manual_override && !row.external_id))
          .map((row) => ({
            id: row.id,
            date: row.match_date as string,
            opponent: row.opponent as string,
            homeAway: (row.home_away as "home" | "away" | null) ?? "home",
            competition: row.competition ?? "Match",
            venue: row.venue ?? "",
            ourScore: row.our_score ?? undefined,
            theirScore: row.their_score ?? undefined,
            sourceUrl: toSvenskalagUrl(row.external_id),
          }))
      );
      return { data: rows, usingFallback: false };
    },
  });

  useRealtimeChannel({
    table: "matches",
    invalidate: [SEASON_KEY],
  });

  return {
    matches: query.data?.data ?? SEASON_MATCHES,
    loading: query.isLoading,
    usingFallback: query.data?.usingFallback ?? true,
    error: query.error,
    refetch: query.refetch,
  };
}

export function ensureWeeklyMatch(matches: SeasonMatch[], now = new Date()): SeasonMatch[] {
  if (!STATIC_WEEKLY_MATCH) return matches;
  const staticWeeklyTime = new Date(STATIC_WEEKLY_MATCH.date).getTime();
  const nowTime = now.getTime();

  const withoutStaleUpcoming = matches.filter((match) => {
    const matchTime = new Date(match.date).getTime();
    const isFuture = matchTime >= nowTime;
    const isStaticWeeklyMatch =
      match.id === STATIC_WEEKLY_MATCH.id ||
      match.opponent.toLowerCase() === STATIC_WEEKLY_MATCH.opponent.toLowerCase();
    const isStaleOpponent = STALE_UPCOMING_NAMES.some((name) =>
      match.opponent.toLowerCase().includes(name)
    );
    const blocksStaticWeeklyMatch =
      !isStaticWeeklyMatch && staticWeeklyTime >= nowTime && matchTime <= staticWeeklyTime;
    return !(isFuture && (isStaleOpponent || blocksStaticWeeklyMatch));
  });

  const hasWeeklyMatch = withoutStaleUpcoming.some((match) =>
    match.id === STATIC_WEEKLY_MATCH.id ||
    match.opponent.toLowerCase() === STATIC_WEEKLY_MATCH.opponent.toLowerCase()
  );

  return (hasWeeklyMatch ? withoutStaleUpcoming : [...withoutStaleUpcoming, STATIC_WEEKLY_MATCH])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function toSvenskalagUrl(externalId: string | null): string | undefined {
  if (!externalId) return undefined;
  if (externalId.startsWith("http")) return externalId;
  if (externalId.startsWith("/")) return `https://www.svenskalag.se${externalId}`;
  return undefined;
}
