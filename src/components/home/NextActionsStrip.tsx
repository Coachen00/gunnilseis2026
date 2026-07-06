/**
 * NextActionsStrip — visas direkt under hero på förstasidan.
 *
 * Mål: tydlig väg vidare. Inga vägval, inga gömda länkar.
 *
 * Auth-läge:
 *   - Inloggad → tre kort: veckans match, spelmodellen, filmbibliotek
 *   - Ej inloggad → renderar INGENTING (match-info får aldrig läcka)
 *
 * Datakälla: MATCH_META (för veckans match-rubrik). Övrigt statiskt.
 */

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock, Dumbbell, Film, PlayCircle } from "lucide-react";
import { MATCH_META } from "@/data/matchplan";
import { useAuthSession } from "@/hooks/useAuthSession";

type Action = {
  to: string;
  hash?: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  Icon: typeof CalendarClock;
  accent: "amber" | "blue" | "green" | "violet";
};

const ACCENT = {
  amber:  { bar: "bg-amber-500",  iconBg: "bg-amber-500/15",  iconText: "text-amber-700",  ring: "hover:border-amber-500/70 hover:bg-amber-50/40" },
  blue:   { bar: "bg-sky-500",    iconBg: "bg-sky-500/15",    iconText: "text-sky-700",    ring: "hover:border-sky-500/70 hover:bg-sky-50/40" },
  green:  { bar: "bg-emerald-500", iconBg: "bg-emerald-500/15", iconText: "text-emerald-700", ring: "hover:border-emerald-500/70 hover:bg-emerald-50/40" },
  violet: { bar: "bg-violet-500", iconBg: "bg-violet-500/15", iconText: "text-violet-700", ring: "hover:border-violet-500/70 hover:bg-violet-50/40" },
} as const;

export default function NextActionsStrip() {
  const reduced = Boolean(useReducedMotion());
  const { isAuthed, loading: authLoading } = useAuthSession();

  // Ej inloggad (eller loading) → dölj stripen helt. Match-info, motståndare
  // och länkar till skyddade sidor får aldrig synas för oinloggade.
  if (authLoading || !isAuthed) return null;

  const actions: Action[] = [
    {
      to: "/semestern-2026",
      eyebrow: "Semester 2026",
      title: "Personliga träningsscheman",
      description: "Välj nivå: hög ambition, hålla dig fräsch eller minsta möjliga. Löpning och gym fram till 26/7.",
      meta: "Laget · spelare · position",
      Icon: Dumbbell,
      accent: "green",
    },
    {
      to: "/match/kommande",
      eyebrow: "Veckans match",
      title: MATCH_META.opponent,
      description: MATCH_META.home ? "Hemma — " + MATCH_META.venue : "Borta — " + MATCH_META.venue,
      meta: MATCH_META.kickoff,
      Icon: CalendarClock,
      accent: "amber",
    },
    {
      to: "/maj-2026",
      eyebrow: "Spelmodellen 2026",
      title: "Så spelar vi fotboll",
      description: "Sex spelfaser, ett lag och en idé. Försvar, omställning, anfall, identitet, fasta.",
      meta: "Sommaren 2026 · alla principer",
      Icon: PlayCircle,
      accent: "blue",
    },
    {
      to: "/maj-2026",
      hash: "#filmbibliotek",
      eyebrow: "Filmbibliotek",
      title: "Hitta rätt film direkt",
      description: "Allt klippmaterial sorterat efter spelfas — 8 kategorier, kristallklart.",
      meta: "Veckans match · försvar · anfall · fasta",
      Icon: Film,
      accent: "violet",
    },
  ];

  return (
    <section
      aria-label="Snabbväg vidare"
      className="border-t border-border bg-gradient-to-b from-background via-background to-muted/20 py-12 md:py-16"
    >
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.26em] text-amber-700">
              Nästa steg
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-foreground md:text-2xl">
              Fyra vägar in
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((a, i) => {
            const tone = ACCENT[a.accent];
            const href = a.hash ? `${a.to}${a.hash}` : a.to;
            return (
              <motion.div
                key={a.eyebrow}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <Link
                  to={href}
                  className={`group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors ${tone.ring}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${tone.iconBg} ${tone.iconText}`}>
                      <a.Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`h-[2px] w-6 ${tone.bar}`} aria-hidden="true" />
                        <p className={`font-mono text-[9px] font-black uppercase tracking-[0.22em] ${tone.iconText}`}>
                          {a.eyebrow}
                        </p>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-foreground">
                        {a.title}
                      </h3>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {a.meta}
                    </p>
                    <ArrowRight
                      className={`h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:${tone.iconText}`}
                      strokeWidth={2.3}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
