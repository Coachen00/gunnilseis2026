import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Flag,
  Gauge,
  ListChecks,
  RotateCcw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import {
  BESLUT,
  CONFIRM_QUESTIONS,
  EFFEKTLOGIK,
  EGENPERIOD_BUDSKAP,
  EGENPERIOD_KRAV,
  GYM_MATCHVECKA,
  GYM_REGEL,
  GYM_SOMMAR,
  HERO,
  KALENDER,
  MENTALITET,
  NASTA_HANDLING,
  PASS,
  PROGNOS,
  SEED_STATUS,
  SLUTREK,
  STATUS_META,
  STATUS_ORDER,
  UTGANGSPUNKT,
  type AvailabilityStatus,
  type ConfirmKey,
  type Pass,
} from "@/data/sommaruppstart";
import { useSquad } from "@/hooks/useSquad";
import {
  clearAllSommaruppstart,
  loadChecks,
  loadConfirms,
  loadStatuses,
  saveChecks,
  saveConfirms,
  saveStatuses,
  type ConfirmState,
} from "@/lib/sommaruppstartLocal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* =========================================================================
   TONE TOKENS — light palette, matchar Sommaren 2026-sidan
   ========================================================================= */

type Accent = "green" | "blue" | "amber" | "rose" | "slate";

const TONE: Record<Accent, { border: string; bg: string; text: string; dot: string; chip: string }> = {
  green: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-600", chip: "border-emerald-300 bg-emerald-100 text-emerald-800" },
  blue: { border: "border-sky-300", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-600", chip: "border-sky-300 bg-sky-100 text-sky-800" },
  amber: { border: "border-amber-400/70", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", chip: "border-amber-300 bg-amber-100 text-amber-800" },
  rose: { border: "border-rose-300", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", chip: "border-rose-300 bg-rose-100 text-rose-800" },
  slate: { border: "border-border", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-foreground/40", chip: "border-border bg-card text-foreground/70" },
};

const LOAD_TONE: Record<string, Accent> = {
  Egen: "slate",
  Låg: "slate",
  Medel: "blue",
  Hög: "green",
  Match: "rose",
};

/* =========================================================================
   SHARED — sektionsrubrik
   ========================================================================= */

function SectionHead({
  eyebrow,
  title,
  desc,
  id,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
        <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">{eyebrow}</p>
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-4xl">{title}</h2>
      {desc && <p className="mb-2 mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{desc}</p>}
    </div>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

function Hero({ counts, total }: { counts: Record<AvailabilityStatus, number>; total: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-20 pb-14 md:pt-28 md:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="container relative">
        <div className="mb-6 inline-flex items-center gap-3 border border-amber-400 bg-card px-3 py-2">
          <span className="h-[2px] w-8 bg-amber-500" aria-hidden="true" />
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">{HERO.eyebrow}</span>
        </div>

        <h1 className="max-w-4xl text-[2.5rem] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          {HERO.title}
        </h1>

        <div className="mt-6 inline-flex items-center gap-2 border border-rose-300 bg-rose-50 px-3 py-2">
          <Flag className="h-4 w-4 text-rose-700" strokeWidth={2.2} />
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-rose-700">
            Första match · {HERO.matchDate}
          </span>
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/78 md:text-lg">{HERO.lead}</p>

        {/* Live truppbild */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
          {STATUS_ORDER.map((s) => {
            const t = TONE[STATUS_META[s].accent];
            return (
              <a
                key={s}
                href="#tavla"
                className={`flex flex-col gap-1 border ${t.border} ${t.bg} p-4 transition-transform hover:-translate-y-0.5`}
              >
                <span className={`text-3xl font-black tabular-nums ${t.text}`}>{counts[s]}</span>
                <span className="font-mono text-[10px] font-black uppercase leading-tight tracking-[0.14em] text-foreground/70">
                  {STATUS_META[s].label}
                </span>
              </a>
            );
          })}
          <a
            href="#tavla"
            className="flex flex-col gap-1 border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-3xl font-black tabular-nums text-foreground/50">{counts.oklassad}</span>
            <span className="font-mono text-[10px] font-black uppercase leading-tight tracking-[0.14em] text-foreground/50">
              Oklassad · {total} totalt
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   UTGÅNGSPUNKT
   ========================================================================= */

function Utgangspunkt() {
  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Utgångspunkt" title="HEMMA ≠ MATCHREDO" desc={UTGANGSPUNKT.intro} />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {UTGANGSPUNKT.distinctions.map((d) => (
            <div key={d.n} className="border border-border bg-card p-6">
              <span className="font-mono text-[11px] font-black tabular-nums text-amber-700">{d.n}</span>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">{d.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-l-4 border-amber-500 bg-amber-50 p-5">
          <p className="text-sm leading-relaxed text-foreground/85 md:text-base">{UTGANGSPUNKT.conclusion}</p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SPELARTAVLA — dynamisk (4 grupper + oklassad pool)
   ========================================================================= */

const STATUS_SELECT_ORDER: AvailabilityStatus[] = ["oklassad", "startklar", "tillganglig", "tranar", "ej"];

function PlayerChip({
  name,
  note,
  status,
  onChange,
}: {
  name: string;
  note?: string;
  status: AvailabilityStatus;
  onChange: (s: AvailabilityStatus) => void;
}) {
  const t = TONE[STATUS_META[status].accent];
  return (
    <div className={`flex items-center justify-between gap-2 border ${t.border} bg-background px-3 py-2`}>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold leading-tight text-foreground">{name}</p>
        {note && <p className="truncate text-[11px] leading-snug text-muted-foreground">{note}</p>}
      </div>
      <label className="flex-shrink-0">
        <span className="sr-only">Flytta {name} till annan grupp</span>
        <select
          value={status}
          onChange={(e) => onChange(e.target.value as AvailabilityStatus)}
          className={`rounded border ${t.border} ${t.bg} px-1.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.1em] ${t.text} focus:outline-none focus:ring-2 focus:ring-amber-400`}
        >
          {STATUS_SELECT_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].short}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function StatusColumn({
  status,
  players,
  onChange,
}: {
  status: AvailabilityStatus;
  players: { name: string; note?: string }[];
  onChange: (name: string, s: AvailabilityStatus) => void;
}) {
  const meta = STATUS_META[status];
  const t = TONE[meta.accent];
  return (
    <div className="flex flex-col">
      <div className={`flex items-center justify-between border ${t.border} ${t.bg} px-3 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${t.dot}`} />
          <p className={`font-mono text-[11px] font-black uppercase tracking-[0.16em] ${t.text}`}>{meta.label}</p>
        </div>
        <span className={`font-mono text-sm font-black tabular-nums ${t.text}`}>{players.length}</span>
      </div>
      <p className="border-x border-border bg-card/40 px-3 py-1.5 text-[11px] leading-snug text-muted-foreground">{meta.blurb}</p>
      <div className="flex flex-1 flex-col gap-1.5 border border-t-0 border-border bg-muted/20 p-2">
        {players.length === 0 ? (
          <p className="px-1 py-3 text-center text-[11px] italic text-foreground/35">Tom</p>
        ) : (
          players.map((p) => (
            <PlayerChip key={p.name} name={p.name} note={p.note} status={status} onChange={(s) => onChange(p.name, s)} />
          ))
        )}
      </div>
    </div>
  );
}

function Spelartavla({
  byStatus,
  onChange,
}: {
  byStatus: Record<AvailabilityStatus, { name: string; note?: string }[]>;
  onChange: (name: string, s: AvailabilityStatus) => void;
}) {
  return (
    <section className="border-b border-border bg-muted/30 py-14 md:py-20">
      <div className="container">
        <SectionHead
          id="tavla"
          eyebrow="Arbetsyta · spelartavla"
          title="TRUPPBILDEN INFÖR 8/8"
          desc="Sortera varje spelare i rätt grupp via menyn på spelarkortet. Räknarna och hero uppdateras direkt. Förvalet kommer från dokumentets tillgänglighetsläge — ändra fritt. Sparas lokalt i din webbläsare."
        />

        {/* Oklassad pool */}
        {byStatus.oklassad.length > 0 && (
          <div className="mt-8 border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-foreground/55" strokeWidth={2.1} />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55">
                Oklassade · {byStatus.oklassad.length} att placera
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {byStatus.oklassad.map((p) => (
                <PlayerChip key={p.name} name={p.name} note={p.note} status="oklassad" onChange={(s) => onChange(p.name, s)} />
              ))}
            </div>
          </div>
        )}

        {/* Fyra arbetsgrupper */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((s) => (
            <StatusColumn key={s} status={s} players={byStatus[s]} onChange={onChange} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   BEKRÄFTELSE-TRACKER — dynamisk
   ========================================================================= */

function triNext(v: boolean | null): boolean | null {
  if (v === null) return true;
  if (v === true) return false;
  return null;
}

function TriCell({ value, onClick, label }: { value: boolean | null; onClick: () => void; label: string }) {
  const styles =
    value === true
      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
      : value === false
        ? "border-rose-300 bg-rose-100 text-rose-800"
        : "border-border bg-muted text-foreground/40";
  const txt = value === true ? "Ja" : value === false ? "Nej" : "–";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`min-w-[3.25rem] rounded border px-2 py-1 font-mono text-[11px] font-black uppercase tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${styles}`}
    >
      {txt}
    </button>
  );
}

function BekraftelseTracker({
  players,
  confirms,
  onToggle,
}: {
  players: { name: string }[];
  confirms: Record<string, ConfirmState>;
  onToggle: (name: string, key: ConfirmKey) => void;
}) {
  const answered = players.filter((p) => {
    const c = confirms[p.name];
    return c && CONFIRM_QUESTIONS.every((q) => c[q.key] !== null && c[q.key] !== undefined);
  }).length;

  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead
          eyebrow="Arbetsyta · bekräftelser"
          title="TRE FRÅGOR PER SPELARE"
          desc="Bocka av varje spelares svar på de tre obligatoriska frågorna. Tryck på en cell för att växla Ja → Nej → tomt. Sparas lokalt."
        />

        <div className="mt-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: players.length ? `${(answered / players.length) * 100}%` : "0%" }}
            />
          </div>
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-foreground/60">
            {answered}/{players.length} klara
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55">
                  Spelare
                </th>
                {CONFIRM_QUESTIONS.map((q) => (
                  <th
                    key={q.key}
                    title={q.full}
                    className="px-2 py-2 text-center font-mono text-[10px] font-black uppercase tracking-[0.12em] text-foreground/55"
                  >
                    {q.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const c = confirms[p.name];
                return (
                  <tr key={p.name} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="px-2 py-1.5 text-sm font-bold text-foreground">{p.name}</td>
                    {CONFIRM_QUESTIONS.map((q) => (
                      <td key={q.key} className="px-2 py-1.5 text-center">
                        <TriCell
                          value={c?.[q.key] ?? null}
                          onClick={() => onToggle(p.name, q.key)}
                          label={`${p.name}: ${q.full}`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PROGNOS PER DATUM
   ========================================================================= */

function Prognos() {
  return (
    <section className="border-b border-border bg-muted/30 py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Prognos" title="DATUM FÖR DATUM" />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-border">
                {["Datum", "Aktivitet", "Bedömning"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-foreground/55">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROGNOS.map((r) => {
                const t = TONE[r.tone];
                return (
                  <tr key={r.datum} className="border-b border-border/60">
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.12em] ${t.chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                        {r.datum}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-bold text-foreground">{r.aktivitet}</td>
                    <td className="px-3 py-3 text-sm leading-relaxed text-foreground/75">{r.bedomning}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   KALENDER + CHECKLISTA — dynamisk
   ========================================================================= */

function KalenderChecklista({
  checks,
  onToggle,
}: {
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = KALENDER.filter((s) => checks[s.id]).length;
  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead
          eyebrow="Arbetsyta · kalender"
          title="VÄGEN 25/6 → 8/8"
          desc="Bocka av varje steg när det är genomfört. Sparas lokalt."
        />

        <div className="mt-6 flex items-center gap-3">
          <ListChecks className="h-4 w-4 text-emerald-700" strokeWidth={2.2} />
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-foreground/60">
            {done}/{KALENDER.length} genomförda
          </span>
        </div>

        <ol className="mt-6 space-y-2">
          {KALENDER.map((s) => {
            const t = TONE[LOAD_TONE[s.load]];
            const checked = !!checks[s.id];
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onToggle(s.id)}
                  aria-pressed={checked}
                  className={`flex w-full items-start gap-3 border px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    checked ? "border-emerald-300 bg-emerald-50" : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${checked ? "text-emerald-600" : "text-foreground/25"}`}
                    strokeWidth={2.2}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-foreground/60">{s.date}</span>
                      <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.12em] ${t.chip}`}>
                        {s.load}
                      </span>
                    </div>
                    <p className={`mt-0.5 text-sm font-bold leading-tight ${checked ? "text-foreground/60 line-through" : "text-foreground"}`}>
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.detail}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* =========================================================================
   PASSUPPLÄGG
   ========================================================================= */

function PassCard({ p }: { p: Pass }) {
  const t = TONE[p.accent];
  return (
    <AccordionItem value={p.id} className={`overflow-hidden border ${t.border} bg-background`}>
      <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-muted/30 md:px-5">
        <div className="flex w-full items-center gap-3 text-left">
          <span className={`h-2 w-2 flex-shrink-0 rounded-full ${t.dot}`} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-foreground/55">{p.date}</span>
              <span className={`inline-flex border px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.12em] ${t.chip}`}>
                {p.tag}
              </span>
              {p.totaltid && (
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-foreground/40">{p.totaltid}</span>
              )}
            </div>
            <p className="mt-0.5 text-base font-black uppercase tracking-tight text-foreground">{p.title}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border bg-card/40 px-4 pb-5 pt-4 md:px-5">
        {p.syfte && (
          <ul className="mb-4 space-y-1.5">
            {p.syfte.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/80">
                <span className={`mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full ${t.dot}`} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
        {p.upplagg && (
          <div className="mb-4 space-y-1.5">
            {p.upplagg.map((u) => (
              <div key={u.namn} className="flex items-baseline gap-3 border-l-2 border-border pl-3">
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.1em] text-foreground/70">{u.namn}</span>
                {u.tid && <span className="font-mono text-[10px] font-bold text-amber-700">{u.tid}</span>}
                <span className="text-sm leading-snug text-foreground/75">{u.text}</span>
              </div>
            ))}
          </div>
        )}
        {p.punkter?.map((blk) => (
          <div key={blk.rubrik} className={`mt-3 border ${t.border} ${t.bg} p-4`}>
            <p className={`mb-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] ${t.text}`}>{blk.rubrik}</p>
            <ul className="space-y-1.5">
              {blk.rader.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
                  <span className={`mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${t.dot}`} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function Passupplagg() {
  return (
    <section className="border-b border-border bg-muted/30 py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Passupplägg" title="VARJE PASS, STEG FÖR STEG" desc="Öppna ett pass för fullt upplägg, syfte och nyckelpunkter." />
        <Accordion type="multiple" className="mt-8 space-y-2">
          {PASS.map((p) => (
            <PassCard key={p.id} p={p} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* =========================================================================
   GYM- & FYSPLAN
   ========================================================================= */

function SimpleTable({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-border">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-foreground/55">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className="border-b border-border/60">
              <td className="whitespace-nowrap px-3 py-2.5 text-sm font-bold text-foreground">{a}</td>
              <td className="px-3 py-2.5 text-sm leading-relaxed text-foreground/75">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GymFys() {
  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Gym & fys" title="STÖDJER FOTBOLLEN — STÖR DEN INTE" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-amber-700" strokeWidth={2.2} />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">Sommarperiodisering</p>
            </div>
            <SimpleTable head={["Period", "Fokus"]} rows={GYM_SOMMAR.map((r) => [r.period, r.fokus])} />
          </div>
          <div className="border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-amber-700" strokeWidth={2.2} />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">Matchveckan</p>
            </div>
            <SimpleTable head={["Dag", "Gym / fys"]} rows={GYM_MATCHVECKA.map((r) => [r.dag, r.gym])} />
          </div>
        </div>

        <div className="mt-6 border-l-4 border-rose-400 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-800">Regel: {GYM_REGEL}</p>
        </div>

        {/* Egenperiod */}
        <div className="mt-8 border border-border bg-card p-5">
          <p className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">Egenperiod 25/6–27/7 · minimikrav</p>
          <SimpleTable head={["Område", "Krav"]} rows={EGENPERIOD_KRAV.map((r) => [r.omrade, r.krav])} />
          <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm font-bold leading-relaxed text-foreground/85">“{EGENPERIOD_BUDSKAP}”</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   MENTALITET
   ========================================================================= */

function Mentalitet() {
  return (
    <section className="border-b border-border bg-muted/30 py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Mentalitet" title="ANSVAR ÄR DET VIKTIGASTE" />
        <div className="mt-8 border-2 border-amber-400/70 bg-gradient-to-br from-amber-50 to-amber-100/40 p-6 md:p-8">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-800">Ledarbudskap</p>
          <p className="mt-2 text-xl font-black leading-tight tracking-tight text-foreground md:text-2xl">“{MENTALITET.ledarbudskap}”</p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border border-border bg-card p-5">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Krav på spelarna</p>
            <ul className="space-y-2">
              {MENTALITET.kravSpelare.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-card p-5">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Ledarens ansvar</p>
            <ul className="space-y-2">
              {MENTALITET.kravLedare.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm italic leading-relaxed text-foreground/70">
          Extra viktigt för spelare som kommer hem sent: {MENTALITET.sentLandande}
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   BESLUT + EFFEKTLOGIK + NÄSTA HANDLING
   ========================================================================= */

function BeslutSektion() {
  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Beslut" title="DET ÄR BESTÄMT" />
        <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {BESLUT.map((b, i) => (
            <li key={b} className="flex items-start gap-3 border border-border bg-card p-4">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-amber-300 bg-amber-50 font-mono text-[11px] font-black text-amber-800">
                {i + 1}
              </span>
              <span className="text-sm font-bold leading-snug text-foreground/90">{b}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Effektlogik() {
  return (
    <section className="border-b border-border bg-muted/30 py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Effektlogik" title="FRÅN RESURS TILL EFFEKT" />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-border">
                {["Resurser", "Aktiviteter", "Mål", "Effekt"].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EFFEKTLOGIK.map((r) => (
                <tr key={r.resurs} className="border-b border-border/60">
                  <td className="px-3 py-3 text-sm font-bold text-foreground">{r.resurs}</td>
                  <td className="px-3 py-3 text-sm text-foreground/75">{r.aktivitet}</td>
                  <td className="px-3 py-3 text-sm text-foreground/75">{r.mal}</td>
                  <td className="px-3 py-3 text-sm font-bold text-emerald-700">{r.effekt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function NastaHandling() {
  return (
    <section className="border-b border-border py-14 md:py-20">
      <div className="container">
        <SectionHead eyebrow="Nästa handling" title="SAMLA IN EXAKTA BESKED" desc={NASTA_HANDLING.intro} />
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {NASTA_HANDLING.fragor.map((q, i) => (
            <div key={q} className="border border-sky-300 bg-sky-50 p-5">
              <span className="font-mono text-[11px] font-black tabular-nums text-sky-700">F{i + 1}</span>
              <p className="mt-2 text-sm font-bold leading-snug text-foreground/90">{q}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 p-5">
          <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" strokeWidth={2.1} />
          <p className="text-sm leading-relaxed text-foreground/85 md:text-base">{SLUTREK}</p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

const SommarUppstart = () => {
  const { players } = useSquad();

  const [statuses, setStatuses] = useState<Record<string, AvailabilityStatus>>({});
  const [confirms, setConfirms] = useState<Record<string, ConfirmState>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setStatuses(loadStatuses());
    setConfirms(loadConfirms());
    setChecks(loadChecks());
  }, []);

  // Effektiv status: lagrat override → frö → oklassad.
  const effectiveStatus = (name: string): AvailabilityStatus =>
    statuses[name] ?? SEED_STATUS[name]?.status ?? "oklassad";

  const setStatus = (name: string, s: AvailabilityStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [name]: s };
      saveStatuses(next);
      return next;
    });
  };

  const toggleConfirm = (name: string, key: ConfirmKey) => {
    setConfirms((prev) => {
      const cur: ConfirmState = prev[name] ?? { hemma: null, minuter: null, skadefri: null };
      const next = { ...prev, [name]: { ...cur, [key]: triNext(cur[key]) } };
      saveConfirms(next);
      return next;
    });
  };

  const toggleCheck = (id: string) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecks(next);
      return next;
    });
  };

  const resetAll = () => {
    clearAllSommaruppstart();
    setStatuses({});
    setConfirms({});
    setChecks({});
  };

  // Gruppera spelare per effektiv status + räkna.
  const { byStatus, counts } = useMemo(() => {
    const groups: Record<AvailabilityStatus, { name: string; note?: string }[]> = {
      oklassad: [],
      startklar: [],
      tillganglig: [],
      tranar: [],
      ej: [],
    };
    const c: Record<AvailabilityStatus, number> = { oklassad: 0, startklar: 0, tillganglig: 0, tranar: 0, ej: 0 };
    for (const p of players) {
      const s = effectiveStatus(p.name);
      groups[s].push({ name: p.name, note: SEED_STATUS[p.name]?.note });
      c[s] += 1;
    }
    return { byStatus: groups, counts: c };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, statuses]);

  return (
    <div className="relative -mt-px bg-background text-foreground">
      <Hero counts={counts} total={players.length} />
      <Utgangspunkt />
      <Spelartavla byStatus={byStatus} onChange={setStatus} />
      <BekraftelseTracker players={players} confirms={confirms} onToggle={toggleConfirm} />
      <Prognos />
      <KalenderChecklista checks={checks} onToggle={toggleCheck} />
      <Passupplagg />
      <GymFys />
      <Mentalitet />
      <BeslutSektion />
      <Effektlogik />
      <NastaHandling />

      {/* Closing — reset + tillbaka till spelmodellen */}
      <section className="bg-muted/40 py-14">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Arbetsyta</p>
            <h2 className="mt-2 max-w-2xl text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
              Allt sparas i din webbläsare
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Spelarstatus, bekräftelser och checklista är personliga för den här enheten.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-md border border-rose-300 bg-rose-50 px-4 py-2.5 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-rose-700 transition-colors hover:bg-rose-100"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              Nollställ arbetsytan
            </button>
            <Link
              to="/spelmodell"
              className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-500 px-4 py-2.5 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-amber-400"
            >
              <Target className="h-4 w-4" strokeWidth={2.2} />
              Till spelmodellen
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SommarUppstart;
