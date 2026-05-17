import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { SQUAD, STAFF, type Player, type StaffMember, type Position } from "@/data/squad";
import { useRealtimeChannel } from "./useRealtimeChannel";

type PlayerRow = {
  id: string;
  name: string;
  position: Position;
  jersey_number: number | null;
  birth_year: number | null;
  is_staff: boolean;
  staff_role: string | null;
  sort_order: number | null;
};

const SQUAD_KEY = ["players", "squad"] as const;

interface SquadData {
  players: Player[];
  staff: StaffMember[];
  usingFallback: boolean;
}

/**
 * useSquad — trupp + ledarstab med Supabase + realtime fallback.
 * API: `{ players, staff, loading, usingFallback }`.
 */
export function useSquad() {
  const query = useQuery<SquadData>({
    queryKey: SQUAD_KEY,
    queryFn: async () => {
      // @ts-expect-error - players-tabellen finns inte i auto-genererade typer
      const { data, error } = await supabase.from("players").select("*").order("sort_order");
      if (error) {
        logger.warn(error, { scope: "squad" });
        return { players: SQUAD, staff: STAFF, usingFallback: true };
      }
      const rows = (data ?? []) as unknown as PlayerRow[];
      if (rows.length === 0) {
        return { players: SQUAD, staff: STAFF, usingFallback: true };
      }
      return {
        players: rows
          .filter((r) => !r.is_staff)
          .map((r) => ({
            name: r.name,
            position: r.position,
            jerseyNumber: r.jersey_number ?? undefined,
            birthYear: r.birth_year ?? undefined,
          })),
        staff: rows
          .filter((r) => r.is_staff && r.staff_role)
          .map((r) => ({ name: r.name, role: r.staff_role! })),
        usingFallback: false,
      };
    },
  });

  useRealtimeChannel({
    table: "players",
    invalidate: [SQUAD_KEY],
  });

  return {
    players: query.data?.players ?? SQUAD,
    staff: query.data?.staff ?? STAFF,
    loading: query.isLoading,
    usingFallback: query.data?.usingFallback ?? true,
    error: query.error,
  };
}
