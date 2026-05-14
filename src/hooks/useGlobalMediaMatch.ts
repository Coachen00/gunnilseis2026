import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GLOBAL_MEDIA_EXTERNAL_ID = "spelmodell-global-media";

type GlobalMediaResult = { matchId?: string; error: string | null };

// Module-level cache: deduplicates fetches across all MediaSlot instances.
// Tidigare körde varje MediaSlot sin egen hook → 12 parallella matches-queries
// + race på unique-constraint vid första load. Nu: 1 query, alla läser samma promise.
let cachedResult: GlobalMediaResult | null = null;
let inflight: Promise<GlobalMediaResult> | null = null;

async function ensureGlobalMatch(): Promise<GlobalMediaResult> {
  const { data: existing, error: selectError } = await supabase
    .from("matches")
    .select("id")
    .eq("external_id", GLOBAL_MEDIA_EXTERNAL_ID)
    .maybeSingle();

  if (existing?.id) return { matchId: existing.id, error: null };
  if (selectError) return { matchId: undefined, error: selectError.message };

  const { data: created, error: insertError } = await supabase
    .from("matches")
    .insert({
      opponent: "Spelmodell media",
      status: "played",
      source: "manual",
      manual_override: true,
      external_id: GLOBAL_MEDIA_EXTERNAL_ID,
      competition: "Globalt mediaarkiv",
    })
    .select("id")
    .single();

  if (created?.id) return { matchId: created.id, error: null };

  if (insertError?.code === "23505") {
    const { data: retried } = await supabase
      .from("matches")
      .select("id")
      .eq("external_id", GLOBAL_MEDIA_EXTERNAL_ID)
      .maybeSingle();
    if (retried?.id) return { matchId: retried.id, error: null };
  }

  return { matchId: undefined, error: insertError?.message ?? "Kunde inte skapa global mediayta." };
}

export function useGlobalMediaMatch() {
  const [matchId, setMatchId] = useState<string | undefined>(cachedResult?.matchId);
  const [loading, setLoading] = useState(!cachedResult);
  const [error, setError] = useState<string | null>(cachedResult?.error ?? null);

  useEffect(() => {
    if (cachedResult) return;

    let mounted = true;
    if (!inflight) inflight = ensureGlobalMatch().then((r) => (cachedResult = r));

    inflight.then((result) => {
      if (!mounted) return;
      setMatchId(result.matchId);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { matchId, loading, error };
}
