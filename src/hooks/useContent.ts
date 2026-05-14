import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * useContent — hämta en redigerbar JSON-blob från content_blocks-tabellen
 * med fallback till hårdkodad data om raden saknas eller Supabase är otillgänglig.
 *
 * Sajten fungerar därför oförändrat även om migrationen inte är applicerad.
 *
 * Exempel:
 *   const { data: identity } = useContent("identity", IDENTITY);
 *
 * OBS om `fallback`: den läses via ref så att inline-arrays (t.ex. `useContent("x", [])`)
 * inte trigger:ar inf-loop. `reload`-identiteten är stabil på `key` ensam.
 */
export function useContent<T>(key: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"fallback" | "remote">("fallback");
  const [error, setError] = useState<Error | null>(null);

  // Stable ref för fallback — annars triggar inline-allokering (e.g. `useContent("x", [])`)
  // ny reload-callback varje render → useEffect kör om → inf loop.
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // @ts-expect-error content_blocks finns inte i de auto-genererade typerna än
      const { data: row, error: err } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", key)
        .maybeSingle();

      if (err) {
        // Tabellen saknas (migration inte körd) eller annat fel — håll fallback.
        setError(new Error(err.message));
        setData(fallbackRef.current);
        setSource("fallback");
      } else if (row?.data) {
        setData(row.data as T);
        setSource("remote");
      } else {
        setData(fallbackRef.current);
        setSource("fallback");
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setData(fallbackRef.current);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, source, error, reload };
}

/**
 * Spara en content_blocks-rad. Endast godkända användare (RLS) tillåts.
 * Kastar om Supabase nekar.
 */
export async function saveContent<T>(key: string, data: T) {
  // @ts-expect-error content_blocks finns inte i de auto-genererade typerna än
  const { error } = await supabase
    .from("content_blocks")
    .upsert({ key, data }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}
