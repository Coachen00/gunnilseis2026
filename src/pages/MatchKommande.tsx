/**
 * MatchKommande — Veckans match.
 *
 * Strikt struktur (per Spelmodellen-spec):
 *   1. Matchinfo       — motståndare, hemma/borta, plats, avspark, samling
 *   2. Kallad trupp    — startelva + avbytare tydligt separerade
 *   3. Matchplan       — 4 kort: försvar, anfall, omställning, fasta
 *   4. Tre viktigaste  — max 3 punkter, kort och handlingsstyrt
 *   5. Praktisk info   — schema, ansvar
 *   6. Spelarvård-länk — "Ta hand om dig själv" bor på egen sida (/spelarvard)
 *
 * Inga upprepningar. Inga långa textstycken. Allt scannbart före match
 * från mobilen på resan till planen.
 */

import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ChevronRight, ExternalLink, HeartPulse, Star, Sun } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import Formation from "@/components/match/Formation";
import {
  CALLED_SQUAD,
  FOCUS,
  MATCH_META,
  MATCH_PLAN_SHORT,
  MATCH_PRESENTATION_URL,
  MATCH_SCHEDULE,
  PRACTICAL_INFO,
  SEASON_BREAK,
  type PlanCard,
} from "@/data/matchplan";
import { SPELARVARD_INTRO, SPELARVARD_TITLE } from "@/data/spelarvard";

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

function SasongsuppehallCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-50 via-card to-card p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <Sun className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
            Säsongsuppehåll
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-4xl">
            Sommaruppehåll
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-muted-foreground md:text-base">
            Vårsäsongen är slut — vi avslutade med {SEASON_BREAK.lastResult}. Vi laddar om och
            drar igång igen {SEASON_BREAK.trainingResumes.toLowerCase()}.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background px-4 py-3">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                Träning åter
              </p>
              <p className="mt-1 text-base font-black text-foreground">{SEASON_BREAK.trainingResumes}</p>
            </div>
            <div className="rounded-lg border border-border bg-background px-4 py-3">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                Höstpremiär
              </p>
              <p className="mt-1 text-base font-black text-foreground">{SEASON_BREAK.nextMatchLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MatchInfoCard() {
  const gathering = MATCH_SCHEDULE[0];
  const totalPlayers = CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length;
  const kickoffTime = MATCH_META.kickoff.split("·").at(-1)?.trim() ?? MATCH_META.kickoff;
  const onBreak = SEASON_BREAK.active;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-0 border-b border-border md:grid-cols-[minmax(0,1fr)_340px]">
        <div className="bg-gradient-to-br from-amber-50 via-card to-card px-5 py-5 md:px-8 md:py-7">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
            {onBreak ? "Nästa match" : "Veckans match"}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {MATCH_META.opponent}
          </h1>
          <p className="mt-2 text-sm font-bold text-muted-foreground md:text-base">
            {MATCH_META.home ? "Hemma" : "Borta"} · {MATCH_META.competition}
          </p>
        </div>
        <div className="grid grid-cols-2 border-t border-border bg-card md:border-l md:border-t-0">
          <BigFact label="Avspark" value={kickoffTime} icon={<Clock className="h-4 w-4" />} strong />
          <BigFact label="Samling" value={onBreak ? "Inför premiären" : (gathering?.time ?? "Se kallelse")} icon={<Users className="h-4 w-4" />} />
          <BigFact label="Plats" value={MATCH_META.venue} icon={<MapPin className="h-4 w-4" />} wide />
          <BigFact label="Trupp" value={totalPlayers > 0 ? `${totalPlayers} spelare` : "Ej publicerad"} icon={<Calendar className="h-4 w-4" />} wide />
        </div>
      </div>

      <div className="grid gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:px-8">
        <div>
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
            {onBreak ? "Inför premiären" : "Matchdag i ordning"}
          </p>
          {onBreak ? (
            <div className="rounded-lg border border-dashed border-amber-500/60 bg-amber-50 px-4 py-3">
              <p className="text-sm font-bold leading-relaxed text-foreground">
                Matchdagsschema, samling och kallelse sätts när vi närmar oss höstpremiären. Håll
                igång genom uppehållet — vi samlas igen {SEASON_BREAK.trainingResumes.toLowerCase()}.
              </p>
            </div>
          ) : (
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MATCH_SCHEDULE.map((step) => (
                <li key={`${step.time}-${step.label}`} className="rounded-lg border border-border bg-background px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-black text-amber-700">{step.time}</span>
                    <span className="text-sm font-black text-foreground">{step.label}</span>
                  </div>
                  {step.note && <p className="mt-0.5 text-xs font-medium text-muted-foreground">{step.note}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-wrap content-start gap-2 md:w-56">
          <a
            href={MATCH_PRESENTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-sky-500/60 bg-sky-500 px-3.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-sky-950 transition hover:bg-sky-400"
            aria-label="Öppna redigerbar presentation för veckans match"
          >
            Presentation
            <ExternalLink className="h-3 w-3" strokeWidth={2.4} />
          </a>
          <Link
            to="/motstandaranalys"
            className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-amber-500/60 bg-amber-500 px-3.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-950 transition hover:bg-amber-400"
          >
            Motståndaranalys
            <ChevronRight className="h-3 w-3" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function BigFact({
  icon,
  label,
  value,
  strong = false,
  wide = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  strong?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={`border-border p-4 ${wide ? "col-span-2 border-t" : "border-t first:border-r md:border-t-0 md:first:border-r"}`}>
      <div className="mb-1.5 flex items-center gap-2 text-amber-700">
        {icon}
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className={`${strong ? "text-3xl md:text-4xl" : "text-base md:text-lg"} font-black leading-tight text-foreground`}>
        {value}
      </p>
    </div>
  );
}

function KalladTrupp() {
  const totalPlayers = CALLED_SQUAD.starting.length + CALLED_SQUAD.bench.length;
  const hasStartingLineup = CALLED_SQUAD.starting.length === 11;
  const calledPlayers = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench];

  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
            Kallad trupp
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            {totalPlayers > 0
              ? hasStartingLineup
                ? `${totalPlayers} spelare · 4-2-3-1`
                : `${totalPlayers} spelare kallade`
              : "Kallelse kommer"}
          </h2>
        </div>
      </header>

      {totalPlayers === 0 && (
        <div className="rounded-xl border border-dashed border-amber-500/60 bg-amber-50 px-5 py-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
            Inte inlagd än
          </p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-foreground">
            Startelva, avbytare och fasta ansvar fylls i när kallelsen är satt.
          </p>
        </div>
      )}

      {totalPlayers > 0 && !hasStartingLineup && (
        <div className="rounded-xl border border-border bg-background p-4 md:p-5">
          <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
            Kallade spelare
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {calledPlayers.map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-50 font-mono text-[10px] font-black text-amber-800">
                  {i + 1}
                </span>
                <span className="text-sm font-bold text-foreground">{name}</span>
              </div>
            ))}
          </div>
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
            Matchplan i korthet
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
              Idag är detta viktigast
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
    <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">
            Praktiskt
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-foreground md:text-2xl">
            Ansvar
          </h2>
        </div>
      </header>

      <div>
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
    </article>
  );
}

function SpelarvardCTA() {
  return (
    <Link
      to="/spelarvard"
      className="group flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-amber-50 via-card to-card p-5 transition hover:border-amber-500/60 hover:shadow-md md:p-7"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
        <HeartPulse className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
          Spelarvård
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-foreground md:text-2xl">
          {SPELARVARD_TITLE}
        </h2>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-muted-foreground">
          {SPELARVARD_INTRO}
        </p>
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-amber-700"
        strokeWidth={2.4}
        aria-hidden="true"
      />
    </Link>
  );
}

/* =================================================================
   PAGE
   ================================================================= */

const MatchKommande = () => (
  <>
    <PageHero
      eyebrow="Match · Veckans"
      title={SEASON_BREAK.active ? "Säsongsuppehåll" : `${MATCH_META.opponent} — ${MATCH_META.home ? "hemma" : "borta"}`}
      description={
        SEASON_BREAK.active
          ? `Träning åter ${SEASON_BREAK.trainingResumes.toLowerCase()}. Nästa match: ${SEASON_BREAK.nextMatchLabel}.`
          : `${MATCH_META.venue} · ${MATCH_META.kickoff}. Allt du behöver veta inför avspark — scrolla igenom på resan till planen.`
      }
    />

    <div className="container space-y-8 pb-section md:space-y-10">
      {SEASON_BREAK.active && (
        <SectionReveal>
          <SasongsuppehallCard />
        </SectionReveal>
      )}

      <SectionReveal>
        <MatchInfoCard />
      </SectionReveal>

      <SectionReveal>
        <KalladTrupp />
      </SectionReveal>

      {!SEASON_BREAK.active && (
        <SectionReveal>
          <TreViktigaste />
        </SectionReveal>
      )}

      <SectionReveal>
        <MatchplanIKorthet />
      </SectionReveal>

      <SectionReveal>
        <PraktiskInfo />
      </SectionReveal>

      <SectionReveal>
        <SpelarvardCTA />
      </SectionReveal>
    </div>
  </>
);

export default MatchKommande;
