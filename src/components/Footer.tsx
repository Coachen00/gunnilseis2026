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
    <footer className="border-t border-border/70 py-12 mt-section bg-card/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="font-bold text-sm tracking-tight text-foreground">
            Gunnilse IS <span className="text-accent ml-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold align-middle">2026</span>
          </p>
          {isLoggedIn && (
            <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.22em] font-medium">
              Så spelar vi · Träning · Match
            </p>
          )}
        </div>
        {isLoggedIn && (
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <Link to="/spelmodell" className="hover:text-foreground transition-colors duration-200">Spelmodell</Link>
            <Link to="/laget" className="hover:text-foreground transition-colors duration-200">Laget</Link>
            <Link to="/verktyg" className="hover:text-foreground transition-colors duration-200">Verktyg</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-foreground transition-colors duration-200"
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
