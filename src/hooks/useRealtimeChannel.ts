import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface UseRealtimeChannelOptions {
  /** Tabellnamn i public-schemat. */
  table: string;
  /** Event-typ; default `*` för alla. */
  event?: PostgresEvent;
  /** Filter på Postgres-format, t.ex. `match_id=eq.abc` (frivilligt). */
  filter?: string;
  /** Query-keys att invalidera när något händer. */
  invalidate?: QueryKey[];
  /** Egen callback (körs FÖRE invalidate). */
  onChange?: (payload: { eventType: PostgresEvent; new: unknown; old: unknown }) => void;
  /** Slå av prenumerationen utan att avregistrera komponenten. */
  enabled?: boolean;
}

/**
 * Generisk hook för Supabase Realtime. Användning:
 *
 *   useRealtimeChannel({
 *     table: "matches",
 *     invalidate: [["matches", "season"]],
 *   });
 *
 * - Skapar EN kanal per komponent-instans.
 * - Avregistrerar i cleanup (även vid HMR).
 * - Loggar fel via central logger så vi ser tappade subscriptions.
 *
 * OBS: Kräver att tabellen är publicerad i Supabase Realtime
 * (`alter publication supabase_realtime add table <name>`).
 * Hooken är resilient: om realtime inte är aktiverat fallar vi
 * tyst tillbaka på reguljär refetch.
 */
export function useRealtimeChannel({
  table,
  event = "*",
  filter,
  invalidate = [],
  onChange,
  enabled = true,
}: UseRealtimeChannelOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channelName = `${table}:${event}:${filter ?? "all"}:${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event, schema: "public", table, filter }, (payload) => {
        try {
          onChange?.(payload as never);
        } catch (err) {
          logger.error(err, { scope: "realtime", table, event });
        }
        for (const key of invalidate) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          logger.warn("realtime channel error", { scope: "realtime", table, status });
        }
      });

    return () => {
      supabase.removeChannel(channel).catch((err) => {
        logger.warn(err, { scope: "realtime", table, phase: "cleanup" });
      });
    };
    // queryClient.invalidateQueries är stabil; invalidate är en array — vi
    // håller den enkel genom att stringify:a för dependency-stabilitet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, event, filter, enabled, JSON.stringify(invalidate)]);
}
