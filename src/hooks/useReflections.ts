import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useRealtimeChannel } from "./useRealtimeChannel";

/**
 * Reflektioner som JSON-blob via content_blocks-tabellen.
 *
 * Varför content_blocks och inte egen tabell?
 *   - Tabellen finns, har RLS, och stödjer godkända-användare via existerande
 *     useContent.saveContent-flow.
 *   - Vi får realtime gratis (vi använder useRealtimeChannel).
 *   - Inga nya migrationer behövs för denna feature.
 *
 * Struktur:
 *   key = "match-reflections"
 *   data = { entries: Reflection[] }
 *
 * Vid behov flyttar vi senare till en dedikerad tabell utan att API ändras.
 */

export interface Reflection {
  id: string;
  /** Vilken match (slug eller external_id). Tom sträng → globalt block. */
  matchId: string;
  /** Märke/badge: "Mönster", "Trend", "Nästa steg" etc. */
  badge: string;
  /** Rubrik. */
  title: string;
  /** Bullet-points eller fritext. */
  body: string;
  author?: string;
  /** ISO-timestamp. */
  createdAt: string;
}

export const REFLECTIONS_KEY = ["content", "match-reflections"] as const;

interface ReflectionsData {
  entries: Reflection[];
}

const EMPTY: ReflectionsData = { entries: [] };

/**
 * Läser, skriver och prenumererar på reflektioner.
 *
 * Returnerar:
 *   - data
 *   - addReflection(input) — optimistic
 *   - removeReflection(id) — optimistic
 *   - status, error, isPending
 *
 * Vid fel rullas optimistic state tillbaka och toast triggas i view-lagret.
 */
export function useReflections(matchId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<ReflectionsData>({
    queryKey: REFLECTIONS_KEY,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("content_blocks")
        .select("data")
        .eq("key", "match-reflections")
        .maybeSingle();
      if (error) {
        logger.warn(error, { scope: "reflections", phase: "load" });
        return EMPTY;
      }
      const blob = (data as { data?: unknown } | null)?.data;
      if (!blob || typeof blob !== "object") return EMPTY;
      const entries = (blob as ReflectionsData).entries;
      return { entries: Array.isArray(entries) ? entries : [] };
    },
    staleTime: 15_000,
  });

  // Realtime — varje uppdatering av match-reflections invaliderar query.
  useRealtimeChannel({
    table: "content_blocks",
    filter: "key=eq.match-reflections",
    invalidate: [REFLECTIONS_KEY],
  });

  const save = async (next: ReflectionsData) => {
    const { error } = await (supabase as any)
      .from("content_blocks")
      .upsert({ key: "match-reflections", data: next }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  };

  const addReflection = useMutation({
    mutationFn: async (input: Omit<Reflection, "id" | "createdAt">) => {
      const newEntry: Reflection = {
        ...input,
        id: cryptoRandomId(),
        createdAt: new Date().toISOString(),
      };
      const current = queryClient.getQueryData<ReflectionsData>(REFLECTIONS_KEY) ?? EMPTY;
      const next: ReflectionsData = { entries: [newEntry, ...current.entries] };
      await save(next);
      return newEntry;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: REFLECTIONS_KEY });
      const previous = queryClient.getQueryData<ReflectionsData>(REFLECTIONS_KEY) ?? EMPTY;
      const optimistic: Reflection = {
        ...input,
        id: `optimistic-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<ReflectionsData>(REFLECTIONS_KEY, {
        entries: [optimistic, ...previous.entries],
      });
      return { previous };
    },
    onError: (err, _input, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(REFLECTIONS_KEY, ctx.previous);
      logger.error(err, { scope: "reflections", phase: "add" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REFLECTIONS_KEY });
    },
  });

  const removeReflection = useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<ReflectionsData>(REFLECTIONS_KEY) ?? EMPTY;
      const next: ReflectionsData = { entries: current.entries.filter((e) => e.id !== id) };
      await save(next);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: REFLECTIONS_KEY });
      const previous = queryClient.getQueryData<ReflectionsData>(REFLECTIONS_KEY) ?? EMPTY;
      queryClient.setQueryData<ReflectionsData>(REFLECTIONS_KEY, {
        entries: previous.entries.filter((e) => e.id !== id),
      });
      return { previous };
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(REFLECTIONS_KEY, ctx.previous);
      logger.error(err, { scope: "reflections", phase: "remove" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REFLECTIONS_KEY });
    },
  });

  const entries = matchId
    ? (query.data?.entries ?? []).filter((e) => !e.matchId || e.matchId === matchId)
    : (query.data?.entries ?? []);

  return {
    entries,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    addReflection,
    removeReflection,
  };
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
