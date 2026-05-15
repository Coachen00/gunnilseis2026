import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export interface Profile {
  approved: boolean;
}

/**
 * useProfile — hämtar approval-status för aktuell user.
 * Returnerar `null` om ingen session finns. Använder TanStack Query så cache
 * delas mellan AuthGuard, TopNav (admin-check), etc.
 */
export function useProfile() {
  const { data: session } = useSession();

  return useQuery<Profile | null>({
    queryKey: ["auth", "profile", session?.user.id ?? "anon"],
    enabled: Boolean(session?.user.id),
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", session.user.id)
        .single();
      if (error) {
        // Saknad rad → ej godkänd, snarare än kasta.
        if ((error as { code?: string }).code === "PGRST116") return { approved: false };
        throw error;
      }
      return data as Profile;
    },
    staleTime: 60_000,
  });
}
