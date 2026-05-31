import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MATCH_META, MATCH_KICKOFF_ISO, PAST_OPPONENT_NAMES } from "@/data/matchplan";

/** Härlett från `MATCH_META.kickoff` — INGEN parallell konstant att hålla
 *  synkad. Tom sträng om kickoff inte kan parsas → shouldUseStaticUpcoming
 *  blir false (NaN-jämförelse) och hooken faller tillbaka till supabase-data. */
const STATIC_UPCOMING_DATE = MATCH_KICKOFF_ISO;

export type MatchRow = {
  id: string;
  opponent: string;
  match_date: string | null;
  home_away: "home" | "away" | null;
  status: "upcoming" | "played";
  our_score: number | null;
  their_score: number | null;
  competition: string | null;
  venue: string | null;
  manual_override: boolean;
};

export function useMatch(status: "upcoming" | "played") {
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("status", status)
      .neq("opponent", "Spelmodell media")
      .order("match_date", { ascending: status === "upcoming", nullsFirst: false })
      .limit(1)
      .maybeSingle();
    const row = (data as MatchRow | null) ?? null;
    const now = Date.now();
    const staticUpcomingTime = new Date(STATIC_UPCOMING_DATE).getTime();
    const rowDateTime = row?.match_date ? new Date(row.match_date).getTime() : null;
    const rowIsStaticUpcoming =
      row?.opponent.toLowerCase() === MATCH_META.opponent.toLowerCase();
    const shouldUseStaticUpcoming =
      status === "upcoming" &&
      (!row ||
        (rowDateTime !== null && rowDateTime < now) ||
        (staticUpcomingTime >= now && !rowIsStaticUpcoming) ||
        PAST_OPPONENT_NAMES.has(row.opponent.toLowerCase()));

    if (shouldUseStaticUpcoming) {
      setMatch({
        ...(row ?? {
          id: "static-upcoming",
          status: "upcoming" as const,
          our_score: null,
          their_score: null,
          manual_override: true,
        }),
        opponent: MATCH_META.opponent,
        match_date: STATIC_UPCOMING_DATE,
        home_away: MATCH_META.home ? "home" : "away",
        competition: MATCH_META.competition,
        venue: MATCH_META.venue,
      });
    } else {
      setMatch(row);
    }
    setLoading(false);
  }, [status]);

  useEffect(() => {
    reload();
  }, [reload]);

  const update = useCallback(
    async (patch: Partial<MatchRow>) => {
      if (!match) return;
      const { data } = await supabase
        .from("matches")
        .update({ ...patch, manual_override: true })
        .eq("id", match.id)
        .select()
        .single();
      if (data) setMatch(data as MatchRow);
    },
    [match]
  );

  return { match, loading, reload, update };
}
