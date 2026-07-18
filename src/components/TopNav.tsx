import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Lock, ChevronDown, LogIn, UserPlus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import NavDropdown, { NavGroup } from "@/components/NavDropdown";
import { getSharedAccessUser, subscribeSharedAccess, type SharedAccessUser } from "@/lib/sharedAccess";
import { isOwnerEmail } from "@/lib/owner";

type SimpleItem = { kind: "link"; to: string; label: string; featured?: boolean };
type DropdownItem = { kind: "dropdown"; label: string; groups: NavGroup[]; activePathPrefixes: string[]; variant?: "wide" | "narrow" };
type NavItem = SimpleItem | DropdownItem;

/* Match — inför, under och efter. Veckans match först (nästa handling). */
const matchGroups: NavGroup[] = [
  {
    label: "Match",
    children: [
      { label: "Veckans match", to: "/match/kommande", hint: "Motståndare & plan" },
      { label: "Förra matchen", to: "/match/forra", hint: "Resultat & lärdomar" },
      { label: "Reflektioner", to: "/match/reflektioner", hint: "Sista periodens trender" },
      { label: "Årets matcher", to: "/match/matcher", hint: "Hela säsongen" },
    ],
  },
];

/* Spelmodell — speglar hubben /spelmodell: översikt, skeden, spelaren. */
const spelmodellGroups: NavGroup[] = [
  {
    label: "Översikt",
    to: "/spelmodell",
    children: [
      { label: "Så spelar vi", to: "/spelmodell", hint: "Hela modellen i översikt" },
      { label: "Planens ytor", to: "/spelmodell/planens-ytor", hint: "Korridorer & spelytor" },
    ],
  },
  {
    label: "Skeden",
    children: [
      { label: "Anfall", to: "/anfall" },
      { label: "Spelvändningar", to: "/anfall/spelvandningar", hint: "Central → yttre yta" },
      { label: "Försvar", to: "/forsvar" },
      { label: "Omställning anfall", to: "/omstallning-anfall" },
      { label: "Omställning försvar", to: "/omstallning-forsvar" },
      { label: "Fasta situationer", to: "/fasta" },
    ],
  },
  {
    label: "Spelaren",
    children: [
      { label: "Identitet", to: "/identitet", hint: "Fem beteenden i varje match" },
      { label: "Roller", to: "/roller", hint: "Din uppgift i varje skede" },
    ],
  },
];

/* Laget — Trupp, spelarvård, sommarfys och tävlingar samlat under en värld. */
const lagetGroups: NavGroup[] = [
  {
    label: "Laget",
    to: "/laget",
    children: [
      { label: "Trupp", to: "/truppen", hint: "Namn, nummer, position" },
      { label: "Spelarvård", to: "/spelarvard", hint: "Ta hand om dig själv" },
      { label: "Semestern 2026", to: "/semestern-2026", hint: "Gå inte upp i vikt" },
      { label: "Tävlingar", to: "/tavlingar", hint: "Serier & cuper 2026" },
    ],
  },
];

/* Coach — ledar-/ägarmaterial. Diskret men tydligt. */
const coachGroups: NavGroup[] = [
  {
    label: "Coach",
    to: "/coach",
    children: [
      { label: "Prisma 2026", to: "/under-process", hint: "Hela tankesystemet" },
      { label: "5⁵", to: "/under-process/5-upphojt-i-fem", hint: "Minnesskelettet" },
      { label: "Spelidé", to: "/spelide", hint: "Vi kommer förberedda" },
      { label: "Spelmodell-labb", to: "/spelmodell-labb", hint: "Bygg veckans matchbild" },
      { label: "Träningsplanering", to: "/coach/traningsplanering-host-2026", hint: "Fyra moment per pass" },
      { label: "Träningsplan", to: "/traningsplan", hint: "A4 för passet" },
      { label: "Matchblad", to: "/matchblad", hint: "Trupp och fokuspunkter" },
      { label: "Motståndaranalys", to: "/motstandaranalys", hint: "Styrkor, svagheter och plan" },
      { label: "Taktiktavla", to: "/taktiktavla", hint: "Flytta spelare och rita sekvenser" },
    ],
  },
];

const navItems: NavItem[] = [
  { kind: "link", to: "/semestern-2026", label: "Personliga träningsscheman", featured: true },
  { kind: "link", to: "/", label: "Hem" },
  {
    kind: "dropdown",
    label: "Match",
    groups: matchGroups,
    variant: "narrow",
    activePathPrefixes: ["/match"],
  },
  {
    kind: "dropdown",
    label: "Spelmodell",
    groups: spelmodellGroups,
    variant: "wide",
    activePathPrefixes: [
      "/spelmodell",
      "/maj-2026",
      "/anfall",
      "/forsvar",
      "/omstallning-anfall",
      "/omstallning-forsvar",
      "/fasta",
      "/identitet",
      "/roller",
      "/period",
    ],
  },
  {
    kind: "dropdown",
    label: "Laget",
    groups: lagetGroups,
    variant: "narrow",
    activePathPrefixes: ["/laget", "/truppen", "/spelarvard", "/semestern-2026", "/tavlingar"],
  },
  {
    kind: "dropdown",
    label: "Coach",
    groups: coachGroups,
    variant: "narrow",
    activePathPrefixes: ["/coach", "/under-process", "/spelide", "/spelmodell-labb", "/traningsplan", "/matchblad", "/motstandaranalys", "/taktiktavla"],
  },
];

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sharedUser, setSharedUser] = useState<SharedAccessUser | null>(() => getSharedAccessUser());
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isLoggedIn = Boolean(user || sharedUser);
  const isOwner = isOwnerEmail(user?.email);

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
          ? "bg-kedja-paper/95 backdrop-blur-xl border-b border-kedja-border shadow-[0_1px_0_0_rgba(12,52,44,0.08)]"
          : "bg-kedja-paper/80 backdrop-blur-md border-b border-kedja-border/60"
      )}
    >
      <div className="container flex items-center justify-between gap-4 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label="Gunnilse IS — Hem"
        >
          <div className="w-8 h-8 rounded-[6px] bg-kedja-ink text-kedja-lime flex items-center justify-center font-mono font-black text-sm leading-none">
            G
          </div>
          <span className="font-bold text-base tracking-tight text-kedja-ink hidden sm:inline">
            Gunnilse IS
            <span className="text-kedja-green ml-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold align-middle">2026</span>
          </span>
        </Link>

        {/* Desktop nav — endast inloggade ser strukturen */}
        <nav className={cn("hidden items-center gap-1", isLoggedIn ? "lg:flex" : "lg:hidden")}>
          {isOwner && (
            <NavLink
              to="/storyn"
              className={({ isActive }) => cn("rounded-md px-3 py-2 text-sm font-bold transition-colors", isActive ? "bg-amber-100 text-amber-800" : "text-kedja-ink hover:bg-amber-50")}
            >
              Storyn
            </NavLink>
          )}
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
                    item.featured
                      ? "bg-kedja-ink text-kedja-lime font-black shadow-sm hover:bg-kedja-deep"
                      : "text-kedja-deep hover:text-kedja-green",
                    isActive && (item.featured ? "bg-kedja-deep" : "text-kedja-ink")
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        "absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-kedja-lime transition-all duration-300",
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
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md text-kedja-deep hover:text-kedja-ink hover:bg-kedja-mint/50 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="max-w-36 truncate text-xs font-semibold text-kedja-deep">
                {displayName}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-kedja-deep hover:text-kedja-ink hover:bg-kedja-mint/50 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Logga in
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold bg-kedja-ink text-kedja-lime hover:bg-kedja-deep transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Registrera
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-kedja-ink hover:bg-kedja-mint/50 transition-colors"
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
          "lg:hidden overflow-hidden transition-all duration-300 ease-out border-t border-kedja-border bg-kedja-paper",
          isLoggedIn && open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="container py-3 flex flex-col gap-1">
          {isOwner && (
            <NavLink
              to="/storyn"
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn("block rounded-lg px-3 py-2.5 text-sm font-bold", isActive ? "bg-amber-100 text-amber-800" : "text-kedja-ink hover:bg-amber-50")}
            >
              Storyn · privat
            </NavLink>
          )}
          {navItems.map((item) => {
            if (item.kind === "dropdown") {
              const isOpen = mobileOpenGroup === item.label;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setMobileOpenGroup(isOpen ? null : item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-kedja-ink hover:bg-kedja-mint/40 transition-colors border-l-2 border-transparent"
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
                              className="block px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-kedja-green"
                            >
                              {group.label}
                            </Link>
                          ) : (
                            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-kedja-green">
                              {group.label}
                            </div>
                          )}
                          <ul>
                            {group.children.map((child) => (
                              <li key={child.to}>
                                <Link
                                  to={child.to}
                                  className="block px-3 py-1.5 rounded text-sm text-kedja-deep hover:bg-kedja-mint/40 hover:text-kedja-ink"
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
                    item.featured
                      ? "bg-kedja-ink text-kedja-lime font-black border-l-2 border-kedja-green"
                      : isActive
                        ? "bg-kedja-mint/40 text-kedja-ink border-l-2 border-kedja-lime"
                        : "text-kedja-deep hover:bg-kedja-mint/40 hover:text-kedja-ink border-l-2 border-transparent"
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
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-kedja-deep hover:bg-kedja-mint/40 hover:text-kedja-ink inline-flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Admin
            </Link>
          )}
          {isLoggedIn ? (
            <div className="pt-2 border-t border-kedja-border mt-2">
              <div className="px-3 pb-2 text-xs font-semibold text-kedja-deep">
                {displayName}
              </div>
              <LogoutButton className="w-full justify-start" />
            </div>
          ) : (
            <div className="pt-2 border-t border-kedja-border mt-2 grid gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-kedja-deep hover:text-kedja-ink hover:bg-kedja-mint/40 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Logga in
              </Link>
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-kedja-ink text-kedja-lime hover:bg-kedja-deep transition-colors"
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
