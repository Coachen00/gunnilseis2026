import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSharedAccessUser, subscribeSharedAccess } from "@/lib/sharedAccess";

const Footer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [hasSharedAccess, setHasSharedAccess] = useState(() => Boolean(getSharedAccessUser()));
  const isLoggedIn = Boolean(user || hasSharedAccess);

  useEffect(() => {
    let mounted = true;
    const refreshSharedAccess = () => {
      if (mounted) setHasSharedAccess(Boolean(getSharedAccessUser()));
    };
    const unsubscribeSharedAccess = subscribeSharedAccess(refreshSharedAccess);
    refreshSharedAccess();

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
      unsubscribeSharedAccess();
    };
  }, []);

  return (
    <footer className="border-t border-border/70 py-section-sm mt-section bg-card/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <p className="font-bold text-sm tracking-tight text-foreground">
            Gunnilse IS <span className="text-accent-ink ml-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold align-middle">2026</span>
          </p>
          {isLoggedIn && (
            <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.22em] font-medium">
              Så spelar vi · Träning · Match
            </p>
          )}
        </div>
        {isLoggedIn && (
          <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
            <Link to="/maj-2026" className="inline-flex items-center py-2 -my-2 hover:text-foreground transition-colors duration-200">Så spelar vi</Link>
            <Link to="/verktyg" className="inline-flex items-center py-2 -my-2 hover:text-foreground transition-colors duration-200">Verktyg</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center py-2 -my-2 hover:text-foreground transition-colors duration-200"
            >
              ↑ Toppen
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
