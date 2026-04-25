import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  MATCH_SECTION_SAVED_EVENT,
  type MatchSectionSavedDetail,
} from "@/components/match/EditableText";

/**
 * Returnerar senaste updated_at för match_sections kopplade till en match.
 * Initialvärde hämtas från Supabase. Lyssnar på match-section:saved event
 * från EditableText så att relativ tid kan uppdateras live när coachen
 * skriver i ett fält.
 */
export function useLastSaved(matchId: string | undefined) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!matchId) {
      setLastSaved(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("match_sections")
        .select("updated_at")
        .eq("match_id", matchId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      setLastSaved(data?.updated_at ? new Date(data.updated_at) : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;
    function onSaved(e: Event) {
      const detail = (e as CustomEvent<MatchSectionSavedDetail>).detail;
      if (detail?.matchId !== matchId) return;
      setLastSaved(new Date(detail.at));
    }
    window.addEventListener(MATCH_SECTION_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(MATCH_SECTION_SAVED_EVENT, onSaved);
  }, [matchId]);

  return lastSaved;
}
