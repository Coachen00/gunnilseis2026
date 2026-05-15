import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * useSession — TanStack Query-wrap kring Supabase auth.
 *
 * - Initial fetch via supabase.auth.getSession().
 * - Lyssnar på onAuthStateChange och invaliderar/uppdaterar cache.
 * - Returnerar `session`-objektet eller null.
 *
 * Andra hooks (useProfile, AuthGuard) bygger på denna så vi får
 * en sanningskälla för auth.
 */
export const SESSION_KEY = ["auth", "session"] as const;

export function useSession() {
  const queryClient = useQueryClient();

  const query = useQuery<Session | null>({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(SESSION_KEY, session);
      // Profile har lärt sig från sessionen — invalidera så approval-check
      // alltid återhämtas vid sign-in/sign-out.
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return query;
}
