import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const overrideId = searchParams.get("match");
  const [match, setMatch] = useState<MatchRow | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    if (overrideId) {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("id", overrideId)
        .maybeSingle();
      setMatch((data as MatchRow | null) ?? null);
    } else {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("status", status)
        .order("match_date", { ascending: status === "upcoming", nullsFirst: false })
        .limit(1)
        .maybeSingle();
      setMatch((data as MatchRow | null) ?? null);
    }
    setLoading(false);
  }, [status, overrideId]);

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