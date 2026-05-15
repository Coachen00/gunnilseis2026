import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MATCH_META } from "@/data/matchplan";

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
    const shouldUseStaticUpcoming =
      status === "upcoming" &&
      (!row ||
        (row.match_date ? new Date(row.match_date).getTime() < Date.now() : false) ||
        ["lerum", "kareby"].some((name) => row.opponent.toLowerCase().includes(name)));

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
        match_date: "2026-05-16T13:00:00+02:00",
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
