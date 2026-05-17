import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useRealtimeChannel } from "./useRealtimeChannel";

/**
 * useContent — JSON-blob editor via content_blocks-tabellen.
 *
 * Backas av TanStack Query → cache delas mellan ContentEditor och konsumenter,
 * och realtime invaliderar automatiskt vid update från admin.
 *
 * API bevaras (data/loading/source/error/reload) så ingen anropare bryts.
 */

interface UseContentResult<T> {
  data: T;
  loading: boolean;
  source: "fallback" | "remote";
  error: Error | null;
  reload: () => void;
}

export function useContent<T>(key: string, fallback: T): UseContentResult<T> {
  // Stable ref för fallback — inline-arrays/objekt får inte re-trigga fetch.
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const query = useQuery<{ value: T; source: "fallback" | "remote" }>({
    queryKey: ["content", key],
    queryFn: async () => {
      // @ts-expect-error content_blocks finns inte i de auto-genererade typerna
      const { data: row, error } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", key)
        .maybeSingle();

      if (error) {
        logger.warn(error, { scope: "content", key });
        return { value: fallbackRef.current, source: "fallback" };
      }
      if (row?.data) {
        return { value: row.data as T, source: "remote" };
      }
      return { value: fallbackRef.current, source: "fallback" };
    },
  });

  // Realtime — invaliderar enbart vid förändring av exakt denna key.
  useRealtimeChannel({
    table: "content_blocks",
    filter: `key=eq.${key}`,
    invalidate: [["content", key]],
  });

  const reload = useCallback(() => {
    query.refetch();
  }, [query]);

  // Behåll latest fallback i sync med query.data om servern fortsatt svarar tomt.
  useEffect(() => {
    if (query.data?.source === "fallback") {
      // ingen extra åtgärd — fallbackRef styr value
    }
  }, [query.data]);

  return {
    data: query.data?.value ?? fallbackRef.current,
    loading: query.isLoading,
    source: query.data?.source ?? "fallback",
    error: (query.error as Error | null) ?? null,
    reload,
  };
}

/**
 * Spara content_blocks-rad med optimistic update.
 *
 * Den fristående saveContent-funktionen bevaras för existerande anropare i
 * ContentEditor, men `useContentMutation` är att föredra i nytt komponentkod.
 */
export async function saveContent<T>(key: string, data: T) {
  // @ts-expect-error content_blocks finns inte i de auto-genererade typerna
  const { error } = await supabase
    .from("content_blocks")
    .upsert({ key, data }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

export function useContentMutation<T>(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: T) => {
      await saveContent(key, data);
      return data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["content", key] });
      const previous = queryClient.getQueryData(["content", key]);
      queryClient.setQueryData(["content", key], { value: data, source: "remote" });
      return { previous };
    },
    onError: (err, _data, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["content", key], ctx.previous);
      logger.error(err, { scope: "content-mutation", key });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["content", key] });
    },
  });
}
