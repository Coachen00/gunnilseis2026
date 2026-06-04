import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Lock, ChevronDown, LogIn, UserPlus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import NavDropdown, { NavGroup } from "@/components/NavDropdown";
import { getSharedAccessUser, subscribeSharedAccess, type SharedAccessUser } from "@/lib/sharedAccess";

type SimpleItem = { kind: "link"; to: string; label: string };
type DropdownItem = { kind: "dropdown"; label: string; groups: NavGroup[]; activePathPrefixes: string[]; variant?: "wide" | "narrow" };
type NavItem = SimpleItem | DropdownItem;

const skedenGroups: NavGroup[] = [
  {
    label: "Identitet",
    to: "/identitet",
    children: [
      { label: "2a bollsspel", to: "/identitet#andrabollsspel" },
      { label: "Duellspel", to: "/identitet#duellspel" },
      { label: "Djupledsspel", to: "/identitet#djupledsspel" },
      { label: "Värdigt kroppsspråk", to: "/identitet#vardigt-kroppssprak" },
    ],
  },
  {
    label: "Roller",
    to: "/roller",
    children: [
      { label: "Roller & positioner", to: "/roller#roller-positioner" },
      { label: "Målvakten", to: "/roller#malvakt" },
      { label: "Matchtrupp", to: "/roller#matchtrupp" },
      { label: "Kvalitetskontroll", to: "/roller#quality-control" },
    ],
  },
  {
    label: "Anfall",
    to: "/anfall",
    children: [
      { label: "1 · Skydda mot kontring", to: "/anfall#skydda-mot-kontring" },
      { label: "2 · Spela in bollen", to: "/anfall#spela-in" },
      { label: "3 · Spela ut bollen", to: "/anfall#spela-ut" },
      { label: "4 · Ta med den framåt", to: "/anfall#ta-med-framat" },
      { label: "5 · Fyll på i och runt box", to: "/anfall#fyll-pa-box" },
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
      { label: "Årets matcher", to: "/match/matcher", hint: "Hela säsongen" },
    ],
  },
];

/* Maj 2026 dropdown — de sex spelmodellblocken utan separat filmlänk. */
const majGroups: NavGroup[] = [
  {
    label: "Maj 2026 · Spelmodellen",
    to: "/maj-2026",
    children: [
      { label: "Försvarsspel", to: "/maj-2026#forsvarsspel" },
      { label: "Omställning till anfall", to: "/maj-2026#overgang-anfall" },
      { label: "Anfallsspel", to: "/maj-2026#anfallsspel" },
      { label: "Omställning till försvar", to: "/maj-2026#overgang-forsvar" },
      { label: "Identitet", to: "/maj-2026#identitet" },
      { label: "Fasta situationer", to: "/maj-2026#fasta-situationer" },
    ],
  },
];

const navItems: NavItem[] = [
  { kind: "link", to: "/", label: "Hem" },
  {
    kind: "dropdown",
    label: "Maj 2026",
    groups: majGroups,
    variant: "narrow",
    activePathPrefixes: ["/maj-2026"],
  },
  {
    kind: "dropdown",
    label: "Match",
    groups: matchGroups,
    variant: "narrow",
    activePathPrefixes: ["/match"],
  },
  {
    kind: "dropdown",
    label: "Spelet",
    groups: skedenGroups,
    variant: "wide",
    // Roller är i Spelet — vi tar bort top-level-dubbletten
    activePathPrefixes: ["/identitet", "/roller", "/anfall", "/forsvar", "/omstallning-forsvar", "/omstallning-anfall", "/fasta"],
  },
  { kind: "link", to: "/tavlingar", label: "Tävlingar" },
  { kind: "link", to: "/truppen", label: "Trupp" },
  { kind: "link", to: "/verktyg", label: "Verktyg" },
  { kind: "link", to: "/under-process", label: "Under process" },
];

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sharedUser, setSharedUser] = useState<SharedAccessUser | null>(() => getSharedAccessUser());
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isLoggedIn = Boolean(user || sharedUser);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let mounted = true;
    const refreshSharedAccess = () => {
      if (mounted) setSharedUser(getSharedAccessUser());
    };
    const unsubscribeSharedAccess = subscribeSharedAccess(refreshSharedAccess);
    refreshSharedAccess();

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
      unsubscribeSharedAccess();
    };
  }, []);

  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    sharedUser?.displayName ||
    "Inloggad";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/70 shadow-[0_1px_0_0_hsl(var(--border)/0.5)]"
          : "bg-background/60 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label="Gunnilse IS — Hem"
        >
          <div className="w-8 h-8 rounded-sm bg-primary text-primary-foreground border border-primary flex items-center justify-center font-mono font-bold text-sm leading-none">
            G
          </div>
          <span className="font-bold text-base tracking-tight text-foreground hidden sm:inline">
            Gunnilse IS
            <span className="text-accent-ink ml-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold align-middle">2026</span>
          </span>
        </Link>

        {/* Desktop nav — endast inloggade ser strukturen */}
        <nav className={cn("hidden items-center gap-1", isLoggedIn ? "lg:flex" : "lg:hidden")}>
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
          {isLoggedIn ? (
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
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label={open ? "Stäng meny" : "Öppna meny"}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu — endast inloggade har en meny att öppna */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out border-t border-border/60",
          isLoggedIn && open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 border-transparent"
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
                              className="block px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent-ink"
                            >
                              {group.label}
                            </Link>
                          ) : (
                            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent-ink">
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
                      ? "bg-card text-accent-ink border-l-2 border-accent"
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
          {isLoggedIn ? (
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
