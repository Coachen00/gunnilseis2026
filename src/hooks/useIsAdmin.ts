import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returnerar `{ user, isAdmin, loading }` baserat på Supabase-sessionen.
 *
 * - `loading=true` initialt tills första auth-checken är klar
 * - `user=null` om inte inloggad (då är `isAdmin=false`)
 * - `isAdmin=true` om en rad finns i `user_roles` med role='admin'
 *
 * Lyssnar på `onAuthStateChange` så hooken uppdateras automatiskt vid
 * login/logout.
 */
export function useIsAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        setIsAdmin(Boolean(data));
        setLoading(false);
      }
    };

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!mounted) return;
      setUser(currentUser);
      checkAdmin(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      checkAdmin(nextUser);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
