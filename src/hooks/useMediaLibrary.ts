import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  MediaCategory,
  MediaLibraryDraft,
  MediaLibraryItem,
} from "@/data/mediaLibrary";

/** Bucket som återanvänds (definierad i tidigare migration). */
const BUCKET = "match-media";
const PREFIX = "library";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface UseMediaLibraryOptions {
  /** Filtrera på kategori. Lämna utelämnat för att hämta alla. */
  category?: MediaCategory;
  /** Bara objekt synliga för spelare. */
  visibleOnly?: boolean;
}

interface UseMediaLibraryReturn {
  items: MediaLibraryItem[];
  status: LoadStatus;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hämtar media_library-rader (filtrerat). RLS sköter åtkomst —
 * approved users får allt, övriga ser bara visible_to_players=true.
 */
export function useMediaLibrary(opts: UseMediaLibraryOptions = {}): UseMediaLibraryReturn {
  const { category, visibleOnly } = opts;
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setStatus("loading");
    setError(null);

    let q = supabase
      // @ts-expect-error tabellen finns inte i auto-generated types ännu
      .from("media_library")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (category) q = q.eq("category", category);
    if (visibleOnly) q = q.eq("visible_to_players", true);

    const { data, error: qErr } = await q;

    if (qErr) {
      setError(describeSupabaseError(qErr, "Kunde inte hämta mediabiblioteket."));
      setStatus("error");
      return;
    }

    setItems((data ?? []) as MediaLibraryItem[]);
    setStatus("ready");
  }, [category, visibleOnly]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return { items, status, error, refresh: fetchItems };
}

export interface UploadProgress {
  /** 0..1 — för loading-feedback. Supabase rapporterar inte chunk-level än,
   *  så denna är diskret: 0 → 0.5 (uppstart) → 1 (klart). */
  fraction: number;
  /** Statustext för UI. */
  label: string;
}

/** Generera ett stabilt path-prefix för en ny rad. */
function buildStoragePath(category: MediaCategory, filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "bin";
  const safeBase = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  const ts = Date.now();
  return `${PREFIX}/${category}/${ts}-${safeBase || "fil"}.${ext}`;
}

export async function uploadMediaFile(
  category: MediaCategory,
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<{ storagePath: string } | { error: string }> {
  const path = buildStoragePath(category, file.name);
  onProgress?.({ fraction: 0.1, label: `Laddar upp ${file.name}…` });

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type || undefined,
  });

  if (error) {
    return { error: describeSupabaseError(error, "Uppladdningen misslyckades.") };
  }

  onProgress?.({ fraction: 1, label: "Klart" });
  return { storagePath: path };
}

export async function createMediaLibraryItem(
  draft: MediaLibraryDraft,
): Promise<{ item: MediaLibraryItem } | { error: string }> {
  const { data, error } = await supabase
    // @ts-expect-error tabellen finns inte i auto-generated types ännu
    .from("media_library")
    .insert(draft)
    .select("*")
    .single();

  if (error) {
    return { error: describeSupabaseError(error, "Kunde inte spara mediaposten.") };
  }
  return { item: data as MediaLibraryItem };
}

export async function updateMediaLibraryItem(
  id: string,
  patch: Partial<MediaLibraryDraft>,
): Promise<{ item: MediaLibraryItem } | { error: string }> {
  const { data, error } = await supabase
    // @ts-expect-error tabellen finns inte i auto-generated types ännu
    .from("media_library")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return { error: describeSupabaseError(error, "Kunde inte uppdatera mediaposten.") };
  }
  return { item: data as MediaLibraryItem };
}

export async function deleteMediaLibraryItem(
  item: Pick<MediaLibraryItem, "id" | "storage_path">,
): Promise<{ ok: true } | { error: string }> {
  // Storage först — om det misslyckas vill vi inte ha en dangling rad.
  if (item.storage_path) {
    const { error: rmError } = await supabase.storage.from(BUCKET).remove([item.storage_path]);
    if (rmError && !/not.*found/i.test(rmError.message ?? "")) {
      return { error: describeSupabaseError(rmError, "Kunde inte ta bort filen.") };
    }
  }

  const { error } = await supabase
    // @ts-expect-error tabellen finns inte i auto-generated types ännu
    .from("media_library")
    .delete()
    .eq("id", item.id);

  if (error) {
    return { error: describeSupabaseError(error, "Kunde inte ta bort mediaposten.") };
  }
  return { ok: true };
}

/** Hämta signed URL för uppladdat objekt (giltig 1 h). */
export async function getSignedMediaUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60);
  if (error) {
    console.warn("[media-library] signed url failed", storagePath, error);
    return null;
  }
  return data?.signedUrl ?? null;
}

/**
 * Översätter Supabase-fel till begriplig svenska. Återanvänder samma
 * mönster som `PrincipleMediaSlot.describeError` så att texten ser
 * konsekvent ut i hela appen.
 */
export function describeSupabaseError(
  err: { message?: string; code?: string; statusCode?: string | number; status?: number } | null | undefined,
  fallback: string,
): string {
  if (!err) return fallback;
  const msg = (err.message ?? "").toLowerCase();
  const code = String(err.code ?? "");

  if (code === "42P01" || (msg.includes("relation") && msg.includes("does not exist"))) {
    return "Tabellen media_library finns inte. Migrationen `supabase/migrations/20260515093328_media_library.sql` måste köras mot live-Supabase.";
  }
  if (code === "23514" || msg.includes("violates check constraint")) {
    return "Datat klarar inte schemats regler — kontrollera att källa (länk/uppladdning) är ifylld korrekt.";
  }
  if (code === "42501" || msg.includes("row-level security") || msg.includes("permission denied")) {
    return "Du har inte rätt att skriva här. Be admin godkänna ditt konto (is_approved_user).";
  }
  if (msg.includes("jwt") || msg.includes("invalid token") || err.status === 401) {
    return "Du är inte inloggad — logga in på nytt och försök igen.";
  }
  if (msg.includes("bucket") && msg.includes("not found")) {
    return "Storage-bucketen 'match-media' saknas i Supabase. Skapa den först.";
  }
  if (msg.includes("payload too large") || err.statusCode === 413) {
    return "Filen är för stor. Komprimera eller höj bucket-limiten i Supabase.";
  }
  return err.message ?? fallback;
}
