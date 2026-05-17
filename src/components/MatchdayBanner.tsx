/**
 * MatchdayBanner — visas globalt i Layout om dagens datum matchar
 * matchdagen från MATCH_META.kickoff.
 *
 * Tre tillstånd, alla data-driven utan klockslag-databas:
 *   - "Före match"     — visar countdown till avspark
 *   - "Pågående"       — visar "Matchen pågår just nu"
 *   - "Efter match"    — länkar till reflektioner
 *
 * Användaren kan stänga bannern (state sparas i localStorage tills
 * datumet ändras). Respekterar prefers-reduced-motion — ingen
 * pulsering eller scale-animering om användaren slagit av motion.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MATCH_META } from "@/data/matchplan";

const DISMISS_KEY = "matchday-banner:dismissed-for";

/**
 * Parsar MATCH_META.kickoff (t.ex. "Lör 16 maj · 13:00") till en Date.
 * Använder enkelt regex för svenska månadsförkortningar — räcker
 * eftersom matchplan.ts uppdateras inför varje match med samma format.
 */
function parseKickoff(kickoff: string, year = new Date().getFullYear()): Date | null {
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
  };
  // ".. 16 maj · 13:00" → ["16", "maj", "13", "00"]
  const m = kickoff.match(/(\d{1,2})\s+([a-zåäö]+)\s*[·\-,]?\s*(\d{1,2}):(\d{2})/i);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = months[m[2].toLowerCase()];
  if (month === undefined) return null;
  const hour = parseInt(m[3], 10);
  const minute = parseInt(m[4], 10);
  return new Date(year, month, day, hour, minute);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatCountdown(diffMs: number): string {
  const totalMinutes = Math.floor(diffMs / 60000);
  if (totalMinutes < 0) return "";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours >= 1) return `${hours}t ${String(minutes).padStart(2, "0")}m`;
  return `${minutes} min`;
}

export default function MatchdayBanner() {
  const reduced = Boolean(useReducedMotion());
  const kickoff = useMemo(() => parseKickoff(MATCH_META.kickoff), []);
  const [now, setNow] = useState<Date>(() => new Date());
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined" || !kickoff) return false;
    return localStorage.getItem(DISMISS_KEY) === kickoff.toISOString().slice(0, 10);
  });

  useEffect(() => {
    if (!kickoff) return;
    // Uppdatera var 30:e sekund — räcker för minutprecision i countdown.
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, [kickoff]);

  if (!kickoff) return null;
  if (!sameDay(now, kickoff)) return null;
  if (dismissed) return null;

  const diff = kickoff.getTime() - now.getTime();
  // Antaganden: match är ~95 min lång (90 + reservtid)
  const matchEndMs = 95 * 60_000;
  const past = diff < -matchEndMs;
  const inProgress = diff <= 0 && !past;
  const pre = diff > 0;

  let state: "pre" | "live" | "post";
  let title: string;
  let detail: string;
  let cta: { to: string; label: string };
  if (pre) {
    state = "pre";
    title = "Matchdag";
    detail = `Avspark om ${formatCountdown(diff)} — IFK Björkö ${MATCH_META.home ? "hemma" : "borta"}`;
    cta = { to: "/match/kommande", label: "Veckans match" };
  } else if (inProgress) {
    state = "live";
    title = "Matchen pågår";
    detail = `${MATCH_META.opponent} · ${MATCH_META.venue}`;
    cta = { to: "/match/kommande", label: "Matchplan" };
  } else {
    state = "post";
    title = "Tack för matchen";
    detail = "Dags att reflektera och bygga vidare.";
    cta = { to: "/match/reflektioner", label: "Reflektioner" };
  }

  const dot =
    state === "pre"  ? "bg-amber-500" :
    state === "live" ? "bg-rose-500"  :
                       "bg-emerald-500";
  const ringTint =
    state === "pre"  ? "from-amber-50  via-amber-100/40 to-background" :
    state === "live" ? "from-rose-50   via-rose-100/40  to-background" :
                       "from-emerald-50 via-emerald-100/40 to-background";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative border-b border-amber-500/30 bg-gradient-to-r ${ringTint}`}
    >
      <div className="container flex items-center gap-3 py-2.5 md:py-3">
        <motion.span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`}
          aria-hidden="true"
          animate={reduced || state === "post" ? undefined : { scale: [1, 1.35, 1] }}
          transition={reduced || state === "post" ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {state === "live" && !reduced && (
            <motion.span
              className="absolute inset-0 rounded-full bg-rose-500/60"
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
        </motion.span>

        <Calendar className="hidden h-4 w-4 text-amber-700 sm:block" strokeWidth={2.4} aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-foreground">
            <span className="mr-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              {title}
            </span>
            <span className="font-bold text-foreground/85">{detail}</span>
          </p>
        </div>

        <Link
          to={cta.to}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-amber-500 bg-amber-500 px-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400"
        >
          {cta.label}
          <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
        </Link>

        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem(DISMISS_KEY, kickoff.toISOString().slice(0, 10));
            } catch {
              /* localStorage kan vara blockerad i privat mode — bannern är ändå
                 dold för sessionen tack vare state-uppdateringen. */
            }
          }}
          aria-label="Stäng matchdag-bannern"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.3} />
        </button>
      </div>
    </div>
  );
}
