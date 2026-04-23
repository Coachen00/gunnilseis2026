import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavChild {
  label: string;
  to: string;
  hint?: string;
}

export interface NavGroup {
  label: string;
  to?: string;
  children: NavChild[];
}

interface NavDropdownProps {
  label: string;
  groups: NavGroup[];
  /** Width hint: "wide" for multi-column, "narrow" for single column */
  variant?: "wide" | "narrow";
  /** Paths considered "active" for highlighting the trigger */
  activePathPrefixes?: string[];
}

const NavDropdown = ({ label, groups, variant = "wide", activePathPrefixes = [] }: NavDropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const location = useLocation();

  const isActive = activePathPrefixes.some((p) => location.pathname === p || location.pathname.startsWith(p + "/") || location.pathname.startsWith(p + "#"));

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const colsClass = variant === "wide"
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    : "grid-cols-1";
  const widthClass = variant === "wide" ? "w-[min(96vw,1100px)]" : "w-72";

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "relative inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200",
          "text-muted-foreground hover:text-foreground",
          (isActive || open) && "text-foreground"
        )}
      >
        {label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
        <span
          className={cn(
            "absolute left-3 right-6 -bottom-0.5 h-[2px] rounded-full bg-accent transition-all duration-300",
            isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50",
            widthClass,
            "rounded-lg border border-border bg-card/95 backdrop-blur-xl shadow-2xl",
            "animate-in fade-in-0 zoom-in-95"
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className={cn("grid gap-x-6 gap-y-5 p-5", colsClass)}>
            {groups.map((group) => (
              <div key={group.label} className="min-w-0">
                {group.to ? (
                  <Link
                    to={group.to}
                    className="block mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent hover:underline underline-offset-4"
                  >
                    {group.label}
                  </Link>
                ) : (
                  <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent">
                    {group.label}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {group.children.map((child) => (
                    <li key={child.to}>
                      <Link
                        to={child.to}
                        className="group/item block px-2 py-1.5 -mx-2 rounded text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <span className="font-medium">{child.label}</span>
                        {child.hint && (
                          <span className="block text-[11px] text-muted-foreground/70 mt-0.5">{child.hint}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;