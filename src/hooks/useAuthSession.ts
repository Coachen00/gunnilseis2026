import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSharedAccessUser } from "@/lib/sharedAccess";

/**
 * Returnerar `{ session, hasSharedAccess, isAuthed, loading }` baserat
 * på Supabase + shared-access-fallback.
 *
 * `isAuthed = true` när användaren har antingen en riktig session eller
 * en aktiv shared-access-token. `loading = true` tills första checken
 * är klar — använd det för att undvika att flasha fel CTAs på första
 * render.
 *
 * Lyssnar på `onAuthStateChange` så hooken uppdateras automatiskt vid
 * login/logout.
 */
export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasSharedAccess, setHasSharedAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Sync shared-access state — det är synkront men kan ändras mellan navigeringar
    setHasSharedAccess(Boolean(getSharedAccessUser()));

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    hasSharedAccess,
    isAuthed: Boolean(session) || hasSharedAccess,
    loading,
  };
}
