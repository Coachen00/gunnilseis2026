import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useRealtimeChannel } from "./useRealtimeChannel";

/**
 * useSpelarvardDocs — dokumentgalleri per avsnitt på "Ta hand om dig själv".
 *
 * - EN query hämtar alla rader och grupperar per section_id (spelare scrollar
 *   på mobil — vi vill inte göra N requests för N avsnitt).
 * - Realtime invaliderar vid admin-uppladdning; mutationerna invaliderar också
 *   manuellt så UI:t uppdateras även om realtime inte är aktiverat för tabellen.
 * - Uppladdning återanvänder den privata bucketen "match-media" (signed URLs).
 */

export type DocKind = "pdf" | "slides" | "html" | "link" | "image";
export type DocSourceKind = "url" | "upload";

export interface SpelarvardDoc {
  id: string;
  section_id: string;
  title: string;
  doc_kind: DocKind;
  source_kind: DocSourceKind;
  url: string | null;
  storage_path: string | null;
  caption: string | null;
  sort_order: number;
}

const TABLE = "spelarvard_docs";
const BUCKET = "match-media";
const QUERY_KEY = ["spelarvard_docs"] as const;

/** Gissa doc_kind från filändelse — ger admin rätt default utan extra klick. */
export function inferDocKind(fileName: string): DocKind {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx", "key", "odp"].includes(ext)) return "slides";
  if (["html", "htm"].includes(ext)) return "html";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg", "heic", "heif"].includes(ext)) return "image";
  return "link";
}

function sanitizeSegment(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export function useSpelarvardDocs() {
  const queryClient = useQueryClient();

  const query = useQuery<SpelarvardDoc[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // @ts-expect-error spelarvard_docs saknas i de auto-genererade typerna
      const { data, error } = await supabase
        .from(TABLE)
        .select("id, section_id, title, doc_kind, source_kind, url, storage_path, caption, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) {
        logger.warn(error, { scope: "spelarvard_docs" });
        return [];
      }
      return (data ?? []) as unknown as SpelarvardDoc[];
    },
    staleTime: 60_000,
  });

  useRealtimeChannel({ table: TABLE, invalidate: [QUERY_KEY as unknown as string[]] });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }, [queryClient]);

  const bySection = useMemo(() => {
    const map = new Map<string, SpelarvardDoc[]>();
    for (const row of query.data ?? []) {
      const arr = map.get(row.section_id) ?? [];
      arr.push(row);
      map.set(row.section_id, arr);
    }
    return map;
  }, [query.data]);

  /** Ladda upp en fil och skapa en rad. doc_kind gissas om den inte anges. */
  const uploadDoc = useCallback(
    async (sectionId: string, file: File, opts?: { title?: string; kind?: DocKind; caption?: string }) => {
      const kind = opts?.kind ?? inferDocKind(file.name);
      const ext = file.name.split(".").pop() || "bin";
      const ts = Date.now();
      const path = `spelarvard/${sanitizeSegment(sectionId)}/${ts}-${sanitizeSegment(
        file.name.replace(/\.[^.]+$/, "")
      )}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) throw new Error(uploadError.message);

      const nextOrder = (bySection.get(sectionId)?.length ?? 0);
      // @ts-expect-error spelarvard_docs saknas i de auto-genererade typerna
      const { error: insertError } = await supabase.from(TABLE).insert({
        section_id: sectionId,
        title: opts?.title?.trim() || file.name.replace(/\.[^.]+$/, ""),
        doc_kind: kind,
        source_kind: "upload",
        storage_path: path,
        caption: opts?.caption?.trim() || null,
        sort_order: nextOrder,
      });
      if (insertError) {
        // Rulla tillbaka uppladdningen om radskapandet faller (RLS m.m.).
        await supabase.storage.from(BUCKET).remove([path]);
        throw new Error(insertError.message);
      }
      refresh();
    },
    [bySection, refresh]
  );

  /** Lägg till ett dokument via extern länk. */
  const addLink = useCallback(
    async (sectionId: string, input: { title: string; url: string; kind?: DocKind; caption?: string }) => {
      const nextOrder = (bySection.get(sectionId)?.length ?? 0);
      // @ts-expect-error spelarvard_docs saknas i de auto-genererade typerna
      const { error } = await supabase.from(TABLE).insert({
        section_id: sectionId,
        title: input.title.trim(),
        doc_kind: input.kind ?? inferDocKind(input.url),
        source_kind: "url",
        url: input.url.trim(),
        caption: input.caption?.trim() || null,
        sort_order: nextOrder,
      });
      if (error) throw new Error(error.message);
      refresh();
    },
    [bySection, refresh]
  );

  /** Ta bort ett dokument (och dess lagringsfil om uppladdad). */
  const deleteDoc = useCallback(
    async (doc: SpelarvardDoc) => {
      if (doc.source_kind === "upload" && doc.storage_path) {
        await supabase.storage.from(BUCKET).remove([doc.storage_path]);
      }
      // @ts-expect-error spelarvard_docs saknas i de auto-genererade typerna
      const { error } = await supabase.from(TABLE).delete().eq("id", doc.id);
      if (error) throw new Error(error.message);
      refresh();
    },
    [refresh]
  );

  return {
    bySection,
    rows: query.data ?? [],
    isLoading: query.isLoading,
    refresh,
    uploadDoc,
    addLink,
    deleteDoc,
  };
}

/** useSignedUrl — 60-min signed URL för en uppladdad fil i match-media. */
export function useSpelarvardSignedUrl(storagePath: string | null | undefined) {
  return useQuery<string | null>({
    queryKey: ["spelarvard_signed", storagePath],
    enabled: Boolean(storagePath),
    staleTime: 50 * 60_000,
    queryFn: async () => {
      if (!storagePath) return null;
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60);
      return data?.signedUrl ?? null;
    },
  });
}
