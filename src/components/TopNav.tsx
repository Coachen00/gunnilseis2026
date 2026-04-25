import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Lock, ChevronDown, LogIn, UserPlus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import NavDropdown, { NavGroup } from "@/components/NavDropdown";

type SimpleItem = { kind: "link"; to: string; label: string };
type DropdownItem = { kind: "dropdown"; label: string; groups: NavGroup[]; activePathPrefixes: string[]; variant?: "wide" | "narrow" };
type NavItem = SimpleItem | DropdownItem;

const skedenGroups: NavGroup[] = [
  {
    label: "Anfall",
    to: "/anfall",
    children: [
      { label: "Speluppbyggnad", to: "/anfall#speluppbyggnad" },
      { label: "Skapa", to: "/anfall#skapa" },
      { label: "Avsluta", to: "/anfall#avsluta" },
    ],
  },
  {
    label: "Omställning → försvar",
    to: "/omstallning-forsvar",
    children: [
      { label: "Direkt (motpress)", to: "/omstallning-forsvar#direkt" },
      { label: "Tillbaka till kontroll", to: "/omstallning-forsvar#kontroll" },
    ],
  },
  {
    label: "Försvar",
    to: "/forsvar",
    children: [
      { label: "Högt försvar", to: "/forsvar#hogt" },
      { label: "Medelhögt försvar", to: "/forsvar#medel" },
      { label: "Lågt försvar", to: "/forsvar#lagt" },
    ],
  },
  {
    label: "Omställning → anfall",
    to: "/omstallning-anfall",
    children: [
      { label: "Kontring", to: "/omstallning-anfall#kontring" },
      { label: "Starta speluppbyggnad", to: "/omstallning-anfall#uppbyggnad" },
    ],
  },
  {
    label: "Fasta — Försvar",
    to: "/fasta/forsvar",
    children: [
      { label: "Hörnor", to: "/fasta/forsvar#hornor" },
      { label: "Inläggsfrisparkar", to: "/fasta/forsvar#frisparkar" },
      { label: "Inkast", to: "/fasta/forsvar#inkast" },
      { label: "Avspark", to: "/fasta/forsvar#avspark" },
    ],
  },
  {
    label: "Fasta — Anfall",
    to: "/fasta/anfall",
    children: [
      { label: "Hörnor", to: "/fasta/anfall#hornor" },
      { label: "Inläggsfrisparkar", to: "/fasta/anfall#frisparkar" },
      { label: "Inkast", to: "/fasta/anfall#inkast" },
      { label: "Avspark", to: "/fasta/anfall#avspark" },
    ],
  },
];

const matchGroups: NavGroup[] = [
  {
    label: "Match",
    children: [
      { label: "Förra matchen", to: "/match/forra", hint: "Resultat & lärdomar" },
      { label: "Veckans match", to: "/match/kommande", hint: "Motståndare & plan" },
      { label: "Samlade tankar", to: "/match/reflektioner", hint: "Sista periodens trender" },
    ],
  },
];

const navItems: NavItem[] = [
  { kind: "link", to: "/", label: "Hem" },
  { kind: "link", to: "/spelide", label: "Spelidé" },
  {
    kind: "dropdown",
    label: "Skeden",
    groups: skedenGroups,
    variant: "wide",
    activePathPrefixes: ["/anfall", "/forsvar", "/omstallning-forsvar", "/omstallning-anfall", "/fasta"],
  },
  {
    kind: "dropdown",
    label: "Match",
    groups: matchGroups,
    variant: "narrow",
    activePathPrefixes: ["/match"],
  },
  { kind: "link", to: "/roller", label: "Roller & Trupp" },
  { kind: "link", to: "/verktyg", label: "Verktyg" },
];

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
    let mounted = true;

    const checkAdmin = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) setIsAdmin(Boolean(data));
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      setUser(user);
      checkAdmin(user);
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

  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Inloggad";

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
          {navItems.map((item) => {
            if (item.kind === "dropdown") {
              return (
                <NavDropdown
                  key={item.label}
                  label={item.label}
                  groups={item.groups}
                  variant={item.variant}
                  activePathPrefixes={item.activePathPrefixes}
                />
              );
            }
            return (
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
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {user && isAdmin && (
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="max-w-36 truncate text-xs font-semibold text-muted-foreground">
                {displayName}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogIn className="w-4 h-4" /> Logga in
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Registrera
              </Link>
            </div>
          )}
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
          {navItems.map((item) => {
            if (item.kind === "dropdown") {
              const isOpen = mobileOpenGroup === item.label;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setMobileOpenGroup(isOpen ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-card transition-colors border-l-2 border-transparent"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="pl-3 pb-2 space-y-3">
                      {item.groups.map((group) => (
                        <div key={group.label}>
                          {group.to ? (
                            <Link
                              to={group.to}
                              className="block px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent"
                            >
                              {group.label}
                            </Link>
                          ) : (
                            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent">
                              {group.label}
                            </div>
                          )}
                          <ul>
                            {group.children.map((child) => (
                              <li key={child.to}>
                                <Link
                                  to={child.to}
                                  className="block px-3 py-1.5 rounded text-sm text-muted-foreground hover:bg-card hover:text-foreground"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
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
            );
          })}
          {user && isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Admin
            </Link>
          )}
          {user ? (
            <div className="pt-2 border-t border-border/60 mt-2">
              <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground">
                {displayName}
              </div>
              <LogoutButton className="w-full justify-start" />
            </div>
          ) : (
            <div className="pt-2 border-t border-border/60 mt-2 grid gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogIn className="w-4 h-4" /> Logga in
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Registrera
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
