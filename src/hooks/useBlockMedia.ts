import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useRealtimeChannel } from "./useRealtimeChannel";

// principle_media saknas i de genererade Database-typerna → otypad klient.
const db = supabase as unknown as SupabaseClient;

/**
 * useBlockMedia — hämtar alla principle_media-rader för ett block i en query.
 *
 * Varför hooken finns:
 * - Tidigare design hämtade en row per princip-komponent (N requests för N principer).
 * - Spelare scrollar på mobil — vi vill bara skicka ETT request per block.
 * - Realtime: en kanal per block räcker; alla principer återspeglas direkt.
 *
 * Returnerar `Map<principle_id, MediaRow>` så konsumenter kan slå upp via id.
 */

export type MediaType = "video" | "image" | "text";
export type SourceKind = "url" | "upload" | "text";

export interface MediaRow {
  block_id: string;
  principle_id: string;
  media_type: MediaType;
  source_kind: SourceKind;
  url: string | null;
  storage_path: string | null;
  text_title: string | null;
  text_body: string | null;
  caption: string | null;
}

const BUCKET = "match-media";

export function useBlockMedia(blockId: string) {
  const query = useQuery<MediaRow[]>({
    queryKey: ["principle_media", "block", blockId],
    queryFn: async () => {
      const { data, error } = await db
        .from("principle_media")
        .select("block_id, principle_id, media_type, source_kind, url, storage_path, text_title, text_body, caption")
        .eq("block_id", blockId);
      if (error) {
        logger.warn(error, { scope: "principle_media", blockId });
        return [];
      }
      return (data ?? []) as unknown as MediaRow[];
    },
    staleTime: 60_000,
  });

  useRealtimeChannel({
    table: "principle_media",
    filter: `block_id=eq.${blockId}`,
    invalidate: [["principle_media", "block", blockId]],
  });

  const byPrinciple = useMemo(() => {
    const map = new Map<string, MediaRow>();
    for (const row of query.data ?? []) {
      map.set(row.principle_id, row);
    }
    return map;
  }, [query.data]);

  return {
    rows: query.data ?? [],
    byPrinciple,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * useSignedUrl — för uppladdade media. Hämtar en 60-min signed URL.
 * Returnerar undefined tills vi har en URL eller väsentlig data saknas.
 */
export function useSignedUrl(storagePath: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!storagePath) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 60 * 60)
      .then(({ data }) => {
        if (!cancelled) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [storagePath]);

  return url;
}

export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
