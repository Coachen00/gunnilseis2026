import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      .order("match_date", { ascending: status === "upcoming", nullsFirst: false })
      .limit(1)
      .maybeSingle();
    setMatch((data as MatchRow | null) ?? null);
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