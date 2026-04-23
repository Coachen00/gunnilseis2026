import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { to: "/", label: "Hem" },
  { to: "/spelide", label: "Spelidé" },
  { to: "/forsvar", label: "Försvar" },
  { to: "/anfall", label: "Anfall" },
  { to: "/fasta", label: "Fasta situationer" },
  { to: "/roller", label: "Roller & Trupp" },
  { to: "/verktyg", label: "Verktyg" },
];

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === "leojsjoqvist@gmail.com") setIsAdmin(true);
    });
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-background/50 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="Gunnilse IS — Hem"
        >
          <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center text-accent font-mono font-black text-sm">
            G
          </div>
          <span className="font-extrabold tracking-tight text-foreground hidden sm:inline">
            Gunnilse IS
            <span className="text-accent ml-1">2026</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200",
                  "text-muted-foreground hover:text-foreground",
                  isActive && "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={cn(
                      "absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-accent transition-all duration-300",
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          <div className="hidden md:block">
            <LogoutButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out border-t border-border/60",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="container py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-card text-accent border-l-2 border-accent"
                    : "text-muted-foreground hover:bg-card hover:text-foreground border-l-2 border-transparent"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Admin
            </Link>
          )}
          <div className="pt-2">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
