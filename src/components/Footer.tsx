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
    <footer className="border-t border-border/70 py-12 mt-section bg-card/40">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="font-serif text-base text-foreground">
            Gunnilse IS <span className="text-accent/90 font-sans text-xs uppercase tracking-[0.2em] font-semibold ml-1 align-middle">2026</span>
          </p>
          {user && (
            <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.22em] font-medium">
              Spelidé · Träning · Match
            </p>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <Link to="/spelide" className="hover:text-foreground transition-colors duration-200">Spelidé</Link>
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
