import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MatchRow } from "./useMatch";

export function useMatches(status: "upcoming" | "played") {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("status", status)
      .order("match_date", { ascending: status === "upcoming", nullsFirst: false });
    setMatches(((data as MatchRow[] | null) ?? []));
    setLoading(false);
  }, [status]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (opponent: string): Promise<MatchRow | null> => {
      const { data } = await supabase
        .from("matches")
        .insert({ opponent, status })
        .select()
        .single();
      if (data) await reload();
      return (data as MatchRow | null) ?? null;
    },
    [status, reload]
  );

  return { matches, loading, reload, create };
}
