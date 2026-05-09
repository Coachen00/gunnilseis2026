import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <footer className="border-t border-border py-10 mt-20 bg-card/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Gunnilse IS <span className="text-accent">2026</span>
          </p>
          {user && (
            <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-[0.2em]">
              Spelidé · Träning · Match
            </p>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
            <Link to="/spelide" className="hover:text-accent transition-colors">Spelidé</Link>
            <Link to="/verktyg" className="hover:text-accent transition-colors">Verktyg</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-accent transition-colors"
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
