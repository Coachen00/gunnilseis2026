/**
 * MatchKommande — Veckans match.
 *
 * Strikt struktur (per Spelmodellen-spec):
 *   1. Matchinfo       — motståndare, hemma/borta, plats, avspark, samling
 *   2. Kallad trupp    — startelva + avbytare tydligt separerade
 *   3. Matchplan       — 4 kort: försvar, anfall, omställning, fasta
 *   4. Tre viktigaste  — max 3 punkter, kort och handlingsstyrt
 *   5. Praktisk info   — kläder, schema, ansvar
 *
 * Inga upprepningar. Inga långa textstycken. Allt scannbart före match
 * från mobilen på resan till planen.
 */

import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Clock, Users, ChevronRight, Shirt, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import Formation from "@/components/match/Formation";
import {
  CALLED_SQUAD,
  FOCUS,
  MATCH_META,
  MATCH_PLAN_SHORT,
  MATCH_SCHEDULE,
  PRACTICAL_INFO,
  type PlanCard,
} from "@/data/matchplan";

/* ---------- color tokens per plan-accent ---------- */
const ACCENT: Record<PlanCard["accent"], { bar: string; text: string; bg: string; ring: string }> = {
  red:   { bar: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50",    ring: "border-rose-200" },
  blue:  { bar: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50",     ring: "border-sky-200" },
  amber: { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   ring: "border-amber-200" },
  green: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "border-emerald-200" },
};

/* =================================================================
   SECTIONS
   ================================================================= */

function MatchInfoCard() {
  const gathering = MATCH_SCHEDULE[0];
  const totalPlayers = CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-gradient-to-br from-amber-50 to-card px-6 py-5 md:px-8 md:py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
              Veckans match
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              {MATCH_META.opponent}
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {MATCH_META.home ? "Hemma" : "Borta"} · {MATCH_META.competition}
            </p>
          </div>
          <Link
            to="/motstandaranalys"
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/60 bg-amber-500 px-3.5 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400"
          >
            Motståndaranalys
            <ChevronRight className="h-3 w-3" strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        <Cell icon={<Calendar className="h-4 w-4" />} label="Avspark" value={MATCH_META.kickoff} />
        <Cell icon={<MapPin className="h-4 w-4" />} label="Plats" value={MATCH_META.venue} />
        <Cell icon={<Clock className="h-4 w-4" />} label="Samling" value={gathering?.time ?? "Enligt kallelse"} sub={gathering?.note ?? "Bekräftas av ledarstaben"} />
        <Cell
          icon={<Users className="h-4 w-4" />}
          label="Trupp"
          value={totalPlayers > 0 ? `${totalPlayers} spelare` : "Inte satt"}
          sub={totalPlayers > 0 ? `${CALLED_SQUAD.starting.length} start + ${CALLED_SQUAD.bench.length} avbytare` : "Kallelse kommer"}
        />
      </dl>
    </article>
  );
}

function Cell({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card p-4 md:p-5">
      <div className="mb-1.5 flex items-center gap-2 text-amber-700">
        {icon}
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="text-base font-extrabold leading-tight text-foreground md:text-lg">{value}</p>
      {sub && <p className="mt-0.5 text-xs font-medium text-muted-foreground">{sub}</p>}
    </div>
  );
}

function KalladTrupp() {
  const totalPlayers = CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length;
  const hasStartingLineup = CALLED_SQUAD.starting.length === 11;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
            02 · Kallad trupp
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            {totalPlayers > 0 ? `${totalPlayers} spelare · 4-2-3-1` : "Kallelse kommer"}
          </h2>
        </div>
      </header>

      {!hasStartingLineup && (
        <div className="rounded-xl border border-dashed border-amber-500/60 bg-amber-50 px-5 py-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
            Inte inlagd än
          </p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-foreground">
            Startelva, avbytare och fasta ansvar fylls i när Ytterby-kallelsen är satt.
          </p>
        </div>
      )}

      {hasStartingLineup && (
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8">
        {/* Startelva + formation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Startelva
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {CALLED_SQUAD.starting.length} spelare
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3 md:p-4">
            <Formation height={340} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CALLED_SQUAD.starting.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-sm font-bold text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Avbytare */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Avbytare
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {CALLED_SQUAD.bench.length} spelare
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-2">
              {CALLED_SQUAD.bench.map((name, i) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-muted font-mono text-[10px] font-black text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-foreground">{name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Avbytare värmer parallellt under första halvlek. Byten kommuniceras av tränaren.
            </p>
          </div>
        </div>
      </div>
      )}
    </article>
  );
}

function MatchplanIKorthet() {
  return (
    <article>
      <header className="mb-5 flex items-end justify-between gap-3 md:mb-6">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
            03 · Matchplan i korthet
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Hur vi spelar matchen
          </h2>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {MATCH_PLAN_SHORT.map((card) => {
          const a = ACCENT[card.accent];
          return (
            <div
              key={card.id}
              className={`overflow-hidden rounded-xl border ${a.ring} bg-card`}
            >
              <div className={`flex items-center gap-3 ${a.bg} px-5 py-3`}>
                <span className={`h-[2px] w-6 ${a.bar}`} aria-hidden="true" />
                <p className={`font-mono text-[10px] font-black uppercase tracking-[0.22em] ${a.text}`}>
                  {card.eyebrow}
                </p>
              </div>
              <div className="p-5">
                <h3 className="mb-3 text-lg font-black tracking-tight text-foreground md:text-xl">
                  {card.title}
                </h3>
                <ul className="space-y-2.5">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="grid grid-cols-[22px_1fr] items-baseline gap-2">
                      <span className={`font-mono text-[10px] font-black ${a.text}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function TreViktigaste() {
  return (
    <article className="rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-50 to-card p-6 md:p-8">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-700" strokeWidth={2.4} />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
              04 · Idag är detta viktigast
            </p>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Tre saker — inget annat
          </h2>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {FOCUS.slice(0, 3).map((focus, i) => (
          <div
            key={i}
            className="relative rounded-xl border border-amber-500/40 bg-card p-5"
          >
            <span className="absolute right-4 top-3 font-mono text-3xl font-black leading-none text-amber-500/30">
              {i + 1}
            </span>
            <p className="text-sm font-bold leading-relaxed text-foreground md:text-base">
              {focus}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function PraktiskInfo() {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
            05 · Praktiskt
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Tider, ansvar, kläder
          </h2>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Tidslinje */}
        <div>
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
            Schema
          </p>
          <ol className="relative space-y-3 border-l-2 border-amber-500/40 pl-5">
            {MATCH_SCHEDULE.map((step, i) => {
              const isKick = step.label === "Avspark";
              return (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 ${
                      isKick ? "border-amber-500 bg-amber-500" : "border-amber-500/50 bg-background"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className={`font-mono text-sm font-black ${isKick ? "text-amber-700" : "text-foreground"}`}>
                      {step.time}
                    </span>
                    <span className={`text-sm font-bold ${isKick ? "text-amber-700 uppercase tracking-wide" : "text-foreground/85"}`}>
                      {step.label}
                    </span>
                  </div>
                  {step.note && (
                    <p className="text-xs text-muted-foreground">{step.note}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Ansvar + kläder */}
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shirt className="h-4 w-4 text-amber-700" strokeWidth={2.2} />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                Kläder
              </p>
            </div>
            <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground/90">
              {PRACTICAL_INFO.kit}
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Ansvar
            </p>
            <dl className="grid gap-1.5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              {PRACTICAL_INFO.responsibilities.map(([role, person]) => (
                <div key={role} className="grid grid-cols-[1fr_auto] items-baseline gap-3">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {role}
                  </dt>
                  <dd className="font-bold text-foreground">{person}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =================================================================
   PAGE
   ================================================================= */

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title={`${MATCH_META.opponent} — ${MATCH_META.home ? "hemma" : "borta"}`}
      description={`${MATCH_META.venue} · ${MATCH_META.kickoff}. Allt du behöver veta inför avspark — scrolla igenom på resan till planen.`}
    />

    <div className="container space-y-8 pb-section md:space-y-10">
      <SectionReveal>
        <MatchInfoCard />
      </SectionReveal>

      <SectionReveal>
        <KalladTrupp />
      </SectionReveal>

      <SectionReveal>
        <MatchplanIKorthet />
      </SectionReveal>

      <SectionReveal>
        <TreViktigaste />
      </SectionReveal>

      <SectionReveal>
        <PraktiskInfo />
      </SectionReveal>

      {/* Footer cross-links */}
      <SectionReveal>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/match/forra"
            className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-amber-500/60 hover:bg-amber-50"
          >
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground">
              Förra matchen
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
          <Link
            to="/maj-2026"
            className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-amber-500/60 hover:bg-amber-50"
          >
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground">
              Spelmodellen 2026
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
          <Link
            to="/match/reflektioner"
            className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-amber-500/60 hover:bg-amber-50"
          >
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground">
              Reflektioner
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </div>
      </SectionReveal>
    </div>
  </>
);

export default MatchKommande;
