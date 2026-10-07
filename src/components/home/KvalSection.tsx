import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import {
  BERGDALEN_AWAY,
  BERGDALEN_AWAY_STREAK,
  BERGDALEN_FORM,
  BERGDALEN_HOME,
  BERGDALEN_INFO,
  BERGDALEN_MATCHES,
  DIV4A_TABLE,
  GAME_PLAN,
  KVAL_FIXTURES,
  KVAL_GROUP,
  KVAL_PENALTIES,
  KVAL_RULES,
  KVAL_SOURCES,
  KVAL_STATUS,
  KVAL_TEAMS,
  KVAL_TIEBREAK,
  KVAL_VERIFIED,
  OUR_FIXTURES,
  OUR_TEAM,
  PERFORMANCE_CHAIN,
  outcome,
  pointsPerMatch,
  type KvalFixture,
  type OpponentMatch,
} from "@/data/kval";

/* Kvalet till division 3 — visas bara inloggad, direkt efter Kapitel 01 på
 * startsidan. Allt innehåll kommer från `data/kval.ts`; komponenten lägger
 * inte till egna siffror. */

const PHOTO_HERO = "/home-gallery/20260727_003.webp";
const PHOTO_BREAK = "/home-gallery/20260727_002.webp";
const PHOTO_GRASS = "/home-gallery/20260625_185002.webp";

function decimal(n: number, digits = 2): string {
  return n.toFixed(digits).replace(".", ",");
}

function formatVerified(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long" }).format(d);
}

const OUTCOME_STYLE: Record<"V" | "O" | "F", string> = {
  V: "bg-kedja-lime text-kedja-ink",
  O: "bg-white text-kedja-ink border-[1.5px] border-kedja-border",
  F: "bg-kedja-ink text-white",
};

const OUTCOME_WORD: Record<"V" | "O" | "F", string> = { V: "vinst", O: "oavgjort", F: "förlust" };

function Eyebrow({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "lime" }) {
  return (
    <p
      className={cn(
        "text-[11px] font-extrabold uppercase tracking-[0.24em]",
        tone === "lime" ? "text-kedja-lime" : "text-kedja-green"
      )}
    >
      {children}
    </p>
  );
}

function Rubrik({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="mx-auto max-w-[720px] text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">{eyebrow}</p>
      <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black tracking-[-0.03em] text-kedja-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-[560px] text-[17px] leading-[1.55] text-kedja-deep">{lead}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-4 sm:px-6">
      <span className="whitespace-nowrap text-[clamp(2.2rem,5.5vw,3.6rem)] font-black leading-none tabular-nums tracking-[-0.03em] text-kedja-lime">
        {value}
      </span>
      <span className="mt-2 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-mint/80">{label}</span>
    </div>
  );
}

function KvalHero() {
  const first = OUR_FIXTURES[0];
  return (
    <div className="relative overflow-hidden bg-kedja-ink">
      <img src={PHOTO_HERO} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-b from-kedja-ink/70 via-kedja-ink/80 to-kedja-ink" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-24 text-center">
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-lime">Kapitel 01 · Kvalet</span>
          <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-white">
          {KVAL_GROUP.name}. Tre matcher.
          <br />
          <span className="text-kedja-lime">En plats i division 3.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-[19px] leading-[1.55] text-kedja-mint">
          Fyra lag, alla möter alla en gång. Bara gruppettan går upp. Första matchen är vår enda hemmamatch.
        </p>
        {first && (
          <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-kedja-lime px-6 py-3 text-[15px] font-black text-kedja-ink">
            <span>
              {first.date} · {first.kickoff}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>
              {first.home} – {first.away}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>{first.venue}</span>
          </div>
        )}
        <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 divide-kedja-mint/15 rounded-2xl border border-kedja-mint/15 bg-kedja-ink/60 sm:grid-cols-4 sm:divide-x">
          <Stat value={`${KVAL_STATUS.points} p`} label={`tvåa i 4A, ${KVAL_STATUS.played} matcher`} />
          <Stat value="3" label="kvalmatcher" />
          <Stat value="1" label="hemmamatch" />
          <Stat value="1" label="lag går upp" />
        </div>
      </div>
    </div>
  );
}

function FixtureCard({ f, index }: { f: KvalFixture; index: number }) {
  const home = f.home === OUR_TEAM;
  const opponent = home ? f.away : f.home;
  return (
    <li
      className={cn(
        "relative flex flex-col rounded-2xl border-[1.5px] p-6 text-left",
        home ? "border-kedja-ink bg-kedja-lime" : "border-kedja-border bg-white"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-kedja-ink bg-white text-[15px] font-black text-kedja-ink">
          {index + 1}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]",
            home ? "bg-kedja-ink text-kedja-lime" : "bg-kedja-mint text-kedja-ink"
          )}
        >
          {home ? "Hemma" : "Borta"}
        </span>
      </div>
      <p className="mt-5 text-[13px] font-extrabold uppercase tracking-[0.18em] text-kedja-green">
        {f.date} · {f.kickoff}
      </p>
      <p className="mt-1 text-[26px] font-black leading-tight tracking-[-0.02em] text-kedja-ink">{opponent}</p>
      <p className="mt-2 text-[15px] text-kedja-deep">{f.venue}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-bold text-kedja-ink">
        <span className="rounded-full border-[1.5px] border-kedja-border bg-white/70 px-3 py-1">
          {f.surface ?? "Underlag ej angivet"}
        </span>
        {f.gather && <span className="rounded-full border-[1.5px] border-kedja-border bg-white/70 px-3 py-1">Samling {f.gather}</span>}
      </div>
      {home && <p className="mt-4 text-[14px] font-bold text-kedja-ink">Vår enda hemmamatch i kvalet.</p>}
    </li>
  );
}

function Vagen() {
  const others = KVAL_FIXTURES.filter((f) => f.home !== OUR_TEAM && f.away !== OUR_TEAM);
  return (
    <div className="space-y-6">
      <ol className="grid gap-4 md:grid-cols-3">
        {OUR_FIXTURES.map((f, i) => (
          <FixtureCard key={`${f.home}-${f.away}`} f={f} index={i} />
        ))}
      </ol>
      <p className="text-center text-[14px] leading-[1.6] text-kedja-deep">
        Gruppens andra matcher:{" "}
        {others.map((f, i) => (
          <span key={`${f.home}-${f.away}`}>
            {i > 0 && " · "}omgång {f.round} {f.home}–{f.away}
          </span>
        ))}
      </p>
    </div>
  );
}

function GruppBars() {
  const max = 3;
  return (
    <figure className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8">
      <figcaption>
        <Eyebrow>Poäng per seriematch 2026</Eyebrow>
        <p className="mt-1 text-[15px] text-kedja-deep">Avgör vilket div 4-lag som får två hemmamatcher.</p>
      </figcaption>
      <ul className="mt-6 space-y-5">
        {KVAL_TEAMS.map((t) => {
          const ppm = pointsPerMatch(t);
          const us = t.team === OUR_TEAM;
          return (
            <li key={t.team} title={`${t.team}: ${t.points} p på ${t.played} matcher (${t.won}–${t.drawn}–${t.lost})`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className={cn("text-[17px] text-kedja-ink", us ? "font-black" : "font-bold")}>{t.team}</span>
                <span className="text-[13px] text-kedja-deep">
                  {t.series} · {t.pos}:a · {t.won}–{t.drawn}–{t.lost}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-4 flex-1 rounded-full bg-kedja-mint/50">
                  <div
                    className={cn("h-4 rounded-full", us ? "bg-kedja-lime ring-2 ring-kedja-ink" : "bg-kedja-green")}
                    style={{ width: `${(ppm / max) * 100}%` }}
                  />
                </div>
                <span className="w-14 text-right text-[17px] font-black tabular-nums text-kedja-ink">{decimal(ppm)}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-kedja-deep">
                <strong className="font-bold text-kedja-ink">
                  {t.homeGames} {t.homeGames === 1 ? "hemmamatch" : "hemmamatcher"}
                </strong>{" "}
                · {t.note}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 border-t border-kedja-border pt-4 text-[13px] leading-[1.55] text-kedja-deep">
        Bergdalens siffror kommer från division 3 — tuffare motstånd, så stapeln är inte jämförbar rakt av. Div 3-laget får alltid två hemmamatcher.
      </p>
    </figure>
  );
}

function Regler() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col rounded-2xl bg-kedja-ink p-6 text-left sm:p-8">
        <Eyebrow tone="lime">Viktigast att veta</Eyebrow>
        <p className="mt-3 text-[24px] font-black leading-tight tracking-[-0.02em] text-white">{KVAL_PENALTIES.headline}</p>
        <p className="mt-3 text-[15px] leading-[1.55] text-kedja-mint">{KVAL_PENALTIES.support}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-[32px] font-black leading-none text-kedja-lime">3–0</p>
            <p className="mt-2 text-[13px] text-kedja-mint">3 poäng och +3 i målskillnad</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-[32px] font-black leading-none text-white/70">1–0</p>
            <p className="mt-2 text-[13px] text-kedja-mint">3 poäng men bara +1</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] font-bold text-white">Målskillnad väger mycket tyngre än i en vanlig serie. Och: träna straffar redan nu.</p>
      </div>

      <div className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8">
        <Eyebrow>Lika poäng — så skiljs lagen åt</Eyebrow>
        <ol className="mt-4">
          {KVAL_TIEBREAK.map((step, i) => (
            <li key={step} className="flex items-stretch gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-black",
                    i === 0 ? "bg-kedja-lime text-kedja-ink ring-2 ring-kedja-ink" : "bg-kedja-mint text-kedja-ink"
                  )}
                >
                  {i + 1}
                </span>
                {i < KVAL_TIEBREAK.length - 1 && <span className="block w-[2px] flex-1 bg-kedja-border" aria-hidden="true" />}
              </div>
              <p className={cn("pb-3 pt-1 text-[15px] text-kedja-ink", i === 0 && "font-black")}>{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8 lg:col-span-2">
        <Eyebrow>Kort och avstängningar</Eyebrow>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {KVAL_RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-[15px] leading-[1.5] text-kedja-ink">
              <span className="mt-[9px] block h-1.5 w-1.5 shrink-0 rounded-full bg-kedja-green" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhotoBreak({ src, alt, line, sub }: { src: string; alt: string; line: string; sub: string }) {
  return (
    <figure className="relative overflow-hidden bg-kedja-ink">
      <img src={src} alt={alt} className="h-[360px] w-full object-cover opacity-60 sm:h-[440px]" loading="lazy" decoding="async" />
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-kedja-ink/90 via-kedja-ink/40 to-transparent px-6 text-center">
        <p className="text-[clamp(2rem,5vw,3.6rem)] font-black leading-[1.05] tracking-[-0.03em] text-white">{line}</p>
        <p className="mt-3 max-w-[560px] text-[17px] text-kedja-mint">{sub}</p>
      </figcaption>
    </figure>
  );
}

function SplitRow({ label, home, away, max, format }: { label: string; home: number; away: number; max: number; format: (n: number) => string }) {
  return (
    <div>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-kedja-green">{label}</p>
      {[
        { side: "Hemma", value: home, bar: "bg-kedja-green" },
        { side: "Borta", value: away, bar: "bg-kedja-ink" },
      ].map((r) => (
        <div key={r.side} className="mt-2 flex items-center gap-3" title={`${label} ${r.side.toLowerCase()}: ${format(r.value)}`}>
          <span className="w-14 text-[13px] font-bold text-kedja-deep">{r.side}</span>
          <div className="h-3 flex-1 rounded-full bg-kedja-mint/50">
            <div className={cn("h-3 rounded-full", r.bar)} style={{ width: `${Math.min(100, (r.value / max) * 100)}%` }} />
          </div>
          <span className="w-12 text-right text-[16px] font-black tabular-nums text-kedja-ink">{format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

function HemmaBorta() {
  const h = BERGDALEN_HOME;
  const a = BERGDALEN_AWAY;
  const homeShare = Math.round((h.points / (h.points + a.points)) * 100);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center rounded-2xl bg-kedja-ink p-8 text-left">
        <Eyebrow tone="lime">Bergdalen på bortaplan</Eyebrow>
        <p className="mt-4 text-[clamp(3.2rem,8vw,5rem)] font-black leading-none tracking-[-0.04em] text-kedja-lime">
          {a.won}–{a.drawn}–{a.lost}
        </p>
        <p className="mt-2 text-[17px] text-kedja-mint">
          {a.won} seger på {a.played} bortamatcher. {a.ga} insläppta mål.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-[30px] font-black leading-none text-white">{decimal(a.gaPerMatch)}</p>
            <p className="mt-2 text-[13px] text-kedja-mint">insläppta per bortamatch</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-[30px] font-black leading-none text-white">{homeShare} %</p>
            <p className="mt-2 text-[13px] text-kedja-mint">av poängen tog de hemma</p>
          </div>
        </div>
      </div>
      <figure className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8">
        <figcaption>
          <Eyebrow>Hemma mot borta, hela serien</Eyebrow>
          <p className="mt-1 text-[15px] text-kedja-deep">
            Hemma {h.won}–{h.drawn}–{h.lost} ({h.gf}–{h.ga}). Borta {a.won}–{a.drawn}–{a.lost} ({a.gf}–{a.ga}).
          </p>
        </figcaption>
        <div className="mt-6 space-y-6">
          <SplitRow label="Poäng" home={h.points} away={a.points} max={33} format={(n) => String(n)} />
          <SplitRow label="Vinster" home={h.won} away={a.won} max={11} format={(n) => String(n)} />
          <SplitRow label="Insläppta mål per match" home={h.gaPerMatch} away={a.gaPerMatch} max={4} format={(n) => decimal(n, 1)} />
        </div>
      </figure>
    </div>
  );
}

function AwayStrip() {
  const away = BERGDALEN_MATCHES.filter((m) => !m.home);
  const maxGa = Math.max(...away.map((m) => m.ga));
  const s = BERGDALEN_AWAY_STREAK;
  return (
    <figure className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <Eyebrow>Insläppta mål, varje bortamatch</Eyebrow>
          <p className="mt-1 text-[15px] text-kedja-deep">
            Sedan 18 april: {s.played} bortamatcher utan seger — {s.won}–{s.drawn}–{s.lost}, {s.gf}–{s.ga} i mål.
          </p>
        </div>
      </figcaption>
      <div className="mt-6 overflow-x-auto">
        <ol className="flex min-w-[560px] items-end gap-2" style={{ height: 200 }}>
          {away.map((m) => {
            const o = outcome(m);
            return (
              <li
                key={`${m.date}-${m.opponent}`}
                className="flex h-full flex-1 flex-col items-center justify-end"
                title={`${m.date}: ${m.opponent}–Bergdalen ${m.ga}–${m.gf} (${OUTCOME_WORD[o]} för Bergdalen)`}
              >
                <span className="mb-1 text-[13px] font-black tabular-nums text-kedja-ink">{m.ga}</span>
                <div
                  className={cn("w-full max-w-[38px] rounded-t-[4px]", m.ga >= 4 ? "bg-kedja-ink" : "bg-kedja-green")}
                  style={{ height: `${Math.max(4, (m.ga / maxGa) * 150)}px` }}
                />
                <span className={cn("mt-2 grid h-6 w-6 place-items-center rounded-full text-[11px] font-black", OUTCOME_STYLE[o])}>{o}</span>
                <span className="mt-1 w-full truncate text-center text-[11px] font-bold text-kedja-deep">{m.opponent.split(" ")[0]}</span>
                <span className="text-[10px] text-kedja-deep/70">{m.date}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-4 text-[13px] text-kedja-deep">
        Mörk stapel = fyra insläppta eller fler. V/O/F = Bergdalens resultat. Enda bortasegern: 6–1 mot Semberija 18 april.
      </p>
    </figure>
  );
}

function FormChip({ m }: { m: OpponentMatch }) {
  const o = outcome(m);
  return (
    <li className="flex flex-col items-center gap-1.5 text-center" title={`${m.date}: ${OUTCOME_WORD[o]}`}>
      <span className={cn("grid h-12 w-12 place-items-center rounded-full text-[17px] font-black", OUTCOME_STYLE[o])}>{o}</span>
      <span className="text-[13px] font-black tabular-nums text-kedja-ink">
        {m.gf}–{m.ga}
      </span>
      <span className="text-[11px] text-kedja-deep">
        {m.home ? "hemma" : "borta"} · {m.opponent.split(" ")[0]}
      </span>
    </li>
  );
}

function Respekt() {
  const all = BERGDALEN_MATCHES;
  const gf = all.reduce((s, m) => s + m.gf, 0);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left sm:p-8">
        <Eyebrow>Formen — sex sista</Eyebrow>
        <ol className="mt-5 grid grid-cols-3 gap-y-5 sm:grid-cols-6">
          {BERGDALEN_FORM.map((m) => (
            <FormChip key={`${m.date}-${m.opponent}`} m={m} />
          ))}
        </ol>
        <p className="mt-5 text-[14px] leading-[1.55] text-kedja-deep">
          Inget sönderfall: nollan hemma mot både Näset och Zenith. Problemet är bortaplan.
        </p>
      </div>
      <div className="rounded-2xl bg-kedja-mint p-6 text-left sm:p-8">
        <Eyebrow>Men underskatta dem inte</Eyebrow>
        <p className="mt-3 text-[clamp(2.6rem,6vw,3.6rem)] font-black leading-none tracking-[-0.03em] text-kedja-ink">
          {gf} mål
        </p>
        <p className="mt-2 text-[15px] text-kedja-deep">{decimal(gf / all.length)} per match i division 3.</p>
        <p className="mt-4 text-[15px] leading-[1.55] text-kedja-ink">
          De kan göra flera mål snabbt — 6–1 och 5–3 mot Semberija, 4–3 mot Västkurd. Deras matcher öppnar sig gärna.{" "}
          <strong>Bjud inte in till en match fram och tillbaka.</strong>
        </p>
      </div>
    </div>
  );
}

function Underlag() {
  const first = OUR_FIXTURES[0];
  return (
    <div className="grid overflow-hidden rounded-2xl border-[1.5px] border-kedja-border bg-white lg:grid-cols-[1fr_1.2fr]">
      <img src={PHOTO_GRASS} alt="Gunnilse herr tränar på gräsplanen i kvällssol" className="h-56 w-full object-cover lg:h-full" loading="lazy" decoding="async" />
      <div className="p-6 text-left sm:p-8">
        <Eyebrow>Underlaget</Eyebrow>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border-[1.5px] border-kedja-border p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-kedja-deep">Bergdalen hemma</p>
            <p className="mt-1 text-[20px] font-black text-kedja-ink">{BERGDALEN_INFO.homeSurface}</p>
            <p className="text-[13px] text-kedja-deep">{BERGDALEN_INFO.homeGround}</p>
          </div>
          <div className="rounded-xl bg-kedja-lime p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-kedja-ink/70">Lördag</p>
            <p className="mt-1 text-[20px] font-black text-kedja-ink">{first?.surface}</p>
            <p className="text-[13px] text-kedja-ink">{first?.venue}</p>
          </div>
        </div>
        <p className="mt-5 text-[15px] leading-[1.55] text-kedja-ink">
          De tränar och spelar hemma på konstgräs. Regnar det blir gräset tyngre — då väger{" "}
          <strong>andrabollar, kropp bakom boll och fasta situationer</strong> extra, och första uppspelet ska vara enkelt.
        </p>
      </div>
    </div>
  );
}

function Matchplan() {
  return (
    <div className="space-y-12">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {GAME_PLAN.map((p, i) => (
          <li key={p.headline} className="flex flex-col rounded-2xl border-[1.5px] border-kedja-border bg-white p-5 text-left">
            <span className="text-[40px] font-black leading-none text-kedja-lime [-webkit-text-stroke:1.5px_#06231d]">{i + 1}</span>
            <p className="mt-3 text-[17px] font-black leading-snug tracking-[-0.01em] text-kedja-ink">{p.headline}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-kedja-deep">{p.support}</p>
          </li>
        ))}
      </ol>
      <div className="mx-auto max-w-[720px]">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Prestationsmålet för lördag</p>
        <KedjaSteps tone="paper" steps={PERFORMANCE_CHAIN} />
      </div>
    </div>
  );
}

function Trupp() {
  const info = BERGDALEN_INFO;
  return (
    <details className="group rounded-2xl border-[1.5px] border-kedja-border bg-white text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:px-8">
        <div>
          <Eyebrow>Bergdalens trupp</Eyebrow>
          <p className="mt-1 text-[17px] font-bold text-kedja-ink">Tränare, spelare och vilka som spelar mest</p>
        </div>
        <span className="text-[22px] font-black text-kedja-green transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="space-y-6 border-t border-kedja-border p-6 sm:px-8">
        <p className="text-[15px] text-kedja-deep">
          <strong className="text-kedja-ink">Tränare:</strong> {info.staff.join(", ")}.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {info.squad.map((g) => (
            <div key={g.position} className="rounded-xl bg-kedja-paper p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-green">{g.position}</p>
              <ul className="mt-2 space-y-1 text-[14px] text-kedja-ink">
                {g.players.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-green">Flest seriematcher 2026</p>
          <ul className="mt-3 space-y-2">
            {info.regulars.map((r) => (
              <li key={r.name} className="flex items-center gap-3" title={`${r.name}: ${r.matches} matcher`}>
                <span className="w-56 shrink-0 truncate text-[14px] font-bold text-kedja-ink">{r.name}</span>
                <div className="h-2.5 flex-1 rounded-full bg-kedja-mint/50">
                  <div className="h-2.5 rounded-full bg-kedja-green" style={{ width: `${(r.matches / 22) * 100}%` }} />
                </div>
                <span className="w-8 text-right text-[14px] font-black tabular-nums text-kedja-ink">{r.matches}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-xl bg-kedja-mint/60 p-4 text-[14px] leading-[1.55] text-kedja-ink">{info.dataGap}</p>
      </div>
    </details>
  );
}

function Sluttabell() {
  return (
    <details className="group rounded-2xl border-[1.5px] border-kedja-border bg-white text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:px-8">
        <div>
          <Eyebrow>Division 4A — sluttabell</Eyebrow>
          <p className="mt-1 text-[17px] font-bold text-kedja-ink">
            Tvåa på {KVAL_STATUS.points} poäng, {KVAL_STATUS.gapToThird} poäng före trean
          </p>
        </div>
        <span className="text-[22px] font-black text-kedja-green transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <table className="w-full border-t border-kedja-border text-left text-[14px] text-kedja-ink">
        <caption className="sr-only">Division 4A Herr slutställning</caption>
        <thead>
          <tr className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-kedja-green">
            <th className="px-4 py-3 font-extrabold sm:px-8">#</th>
            <th className="px-2 py-3 font-extrabold">Lag</th>
            <th className="hidden px-2 py-3 text-right font-extrabold sm:table-cell">V–O–F</th>
            <th className="px-2 py-3 text-right font-extrabold">Mål</th>
            <th className="px-4 py-3 text-right font-extrabold sm:px-8">P</th>
          </tr>
        </thead>
        <tbody>
          {DIV4A_TABLE.map((r) => {
            const us = r.team === OUR_TEAM;
            return (
              <tr key={r.team} className={cn("border-t border-kedja-border", us && "bg-kedja-lime font-black", !us && r.pos === 1 && "bg-kedja-mint/60")}>
                <td className="px-4 py-2.5 tabular-nums sm:px-8">{r.pos}</td>
                <td className="px-2 py-2.5">{r.team}</td>
                <td className="hidden px-2 py-2.5 text-right tabular-nums sm:table-cell">
                  {r.won}–{r.drawn}–{r.lost}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums">
                  {r.goalsFor}–{r.goalsAgainst}
                </td>
                <td className="px-4 py-2.5 text-right font-black tabular-nums sm:px-8">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}

const KvalSection = () => {
  return (
    <section id="kvalet" className="scroll-mt-20">
      <KvalHero />

      <div className="bg-kedja-paper">
        <div className="mx-auto max-w-[1200px] space-y-24 px-6 py-20">
          <div className="space-y-10">
            <Rubrik
              eyebrow="Vägen"
              title="Hemma först, sedan två bortamatcher"
              lead="Tre lördagar i oktober. Bergdalen hemma på gräs är vårt bästa läge i hela kvalet."
            />
            <Vagen />
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Gruppen"
              title="Därför får vi bara en hemmamatch"
              lead="Div 3-laget och det bästa div 4-laget spelar två matcher hemma. Skene hade bäst poängsnitt — vi kom tvåa av tre."
            />
            <GruppBars />
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Reglerna som avgör"
              title="Målskillnad och straffar"
              lead="Tre matcher är lite. Därför avgörs gruppen ofta av detaljerna."
            />
            <Regler />
          </div>
        </div>
      </div>

      <PhotoBreak
        src={PHOTO_BREAK}
        alt="Gunnilse herr samlas vid målen med bollar uppradade före träning"
        line="Lördag: Bergdalens IK"
        sub={`Division 3-lag. Men ${BERGDALEN_AWAY.won} seger på ${BERGDALEN_AWAY.played} bortamatcher.`}
      />

      <div className="bg-kedja-paper">
        <div className="mx-auto max-w-[1200px] space-y-24 px-6 py-20">
          <div className="space-y-10">
            <Rubrik
              eyebrow="Motståndaren"
              title="Ett lag hemma, ett annat borta"
              lead={`Bergdalen slutade nia i division 3 Mellersta Götaland. Hemma tog de ${BERGDALEN_HOME.points} poäng — borta bara ${BERGDALEN_AWAY.points}.`}
            />
            <HemmaBorta />
            <AwayStrip />
            <Respekt />
          </div>

          <div className="space-y-10">
            <Rubrik eyebrow="Planen" title="Gräs mot ett konstgräslag" lead="Ett konkret övertag om vi gör det till vår sorts match." />
            <Underlag />
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Matchplanen"
              title="Fem saker vi bygger lördagen på"
              lead="Mål: tre poäng och plus i målskillnad — så vi åker till Götene med kvalet i egna händer."
            />
            <Matchplan />
          </div>

          <div className="space-y-4">
            <Trupp />
            <Sluttabell />
          </div>

          <footer className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.6] text-kedja-deep">
            <p>
              Kontrollerat mot källorna {formatVerified(KVAL_VERIFIED)}. Skenes och Götenes seriefacit är från lagens egna sidor.
            </p>
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {KVAL_SOURCES.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-kedja-green transition-colors hover:text-kedja-ink"
                  >
                    {s.label}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default KvalSection;
