import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GLOBAL_MEDIA_EXTERNAL_ID = "spelmodell-global-media";

export function useGlobalMediaMatch() {
  const [matchId, setMatchId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const ensureGlobalMatch = async () => {
      setLoading(true);
      setError(null);

      const { data: existing, error: selectError } = await supabase
        .from("matches")
        .select("id")
        .eq("external_id", GLOBAL_MEDIA_EXTERNAL_ID)
        .maybeSingle();

      if (!mounted) return;

      if (existing?.id) {
        setMatchId(existing.id);
        setLoading(false);
        return;
      }

      if (selectError) {
        setError(selectError.message);
        setLoading(false);
        return;
      }

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

      if (!mounted) return;

      if (created?.id) {
        setMatchId(created.id);
        setLoading(false);
        return;
      }

      if (insertError?.code === "23505") {
        const { data: retried } = await supabase
          .from("matches")
          .select("id")
          .eq("external_id", GLOBAL_MEDIA_EXTERNAL_ID)
          .maybeSingle();
        if (mounted && retried?.id) {
          setMatchId(retried.id);
          setLoading(false);
          return;
        }
      }

      setError(insertError?.message ?? "Kunde inte skapa global mediayta.");
      setLoading(false);
    };

    ensureGlobalMatch();

    return () => {
      mounted = false;
    };
  }, []);

  return { matchId, loading, error };
}
