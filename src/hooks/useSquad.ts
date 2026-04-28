import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SQUAD, STAFF, type Player, type StaffMember, type Position } from "@/data/squad";

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

export function useSquad() {
  const [players, setPlayers] = useState<Player[]>(SQUAD);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // @ts-expect-error - players-tabellen finns inte i auto-genererade Supabase-typer än
      const { data, error } = await supabase.from("players").select("*").order("sort_order");
      if (!mounted) return;
      if (error || !data || (data as unknown as PlayerRow[]).length === 0) {
        setLoading(false);
        return;
      }
      const rows = data as unknown as PlayerRow[];
      setPlayers(
        rows
          .filter((r) => !r.is_staff)
          .map((r) => ({
            name: r.name,
            position: r.position,
            jerseyNumber: r.jersey_number ?? undefined,
            birthYear: r.birth_year ?? undefined,
          }))
      );
      setStaff(
        rows
          .filter((r) => r.is_staff && r.staff_role)
          .map((r) => ({ name: r.name, role: r.staff_role! }))
      );
      setUsingFallback(false);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { players, staff, loading, usingFallback };
}
