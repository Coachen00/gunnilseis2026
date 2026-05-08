import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEASON_MATCHES, type SeasonMatch } from "@/data/season";

export function useSeasonMatches() {
  const [matches, setMatches] = useState<SeasonMatch[]>(SEASON_MATCHES);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, opponent, match_date, home_away, competition, venue, our_score, their_score, external_id, manual_override")
        .not("match_date", "is", null)
        .order("match_date", { ascending: true });

      if (!mounted) return;
      if (error || !data || data.length === 0) {
        setLoading(false);
        return;
      }

      setMatches(
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
      setUsingFallback(false);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { matches, loading, usingFallback };
}

function toSvenskalagUrl(externalId: string | null): string | undefined {
  if (!externalId) return undefined;
  if (externalId.startsWith("http")) return externalId;
  if (externalId.startsWith("/")) return `https://www.svenskalag.se${externalId}`;
  return undefined;
}
