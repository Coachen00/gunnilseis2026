import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import {
  DIV4A_TABLE,
  GOTEBORG_B_RACE,
  KVAL_FORMAT,
  KVAL_GROUPS,
  KVAL_RULES,
  KVAL_SOURCES,
  KVAL_STATUS,
  KVAL_TIMELINE,
  KVAL_VERIFIED,
  OUR_TEAM,
  type KvalMilestone,
} from "@/data/kval";

/* Kvalet till division 3 — visas bara inloggad, direkt efter Kapitel 01 på
 * startsidan. Allt innehåll kommer från `data/kval.ts`; komponenten lägger
 * inte till egna siffror. */

const KIND_STYLE: Record<KvalMilestone["kind"], string> = {
  match: "bg-white text-kedja-ink",
  forbund: "bg-kedja-mint text-kedja-ink",
  kval: "bg-kedja-lime text-kedja-ink",
};

const KIND_LABEL: Record<KvalMilestone["kind"], string> = {
  match: "Seriematch",
  forbund: "Förbundet",
  kval: "Kval",
};

function formatVerified(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long" }).format(d);
}

function Stat({ value, label, compact = false }: { value: string; label: string; compact?: boolean }) {
  return (
    <div className="flex flex-col items-center px-4 py-3 sm:px-6">
      <span
        className={cn(
          "whitespace-nowrap font-black leading-none tabular-nums tracking-[-0.03em] text-kedja-lime",
          compact ? "text-[clamp(1.6rem,3.6vw,2.4rem)]" : "text-[clamp(2.4rem,6vw,4rem)]"
        )}
      >
        {value}
      </span>
      <span className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-mint/70">{label}</span>
    </div>
  );
}

function KvalHero() {
  const s = KVAL_STATUS;
  return (
    <div className="bg-kedja-ink">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-24 text-center">
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-lime">Kapitel 01 · Kvalet</span>
          <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-white">
          {s.secured ? "Klara för kval till division 3." : "Kvalplatsen är inom räckhåll."}
        </h2>
        <p className="mx-auto mt-5 max-w-[620px] text-[19px] leading-[1.55] text-kedja-mint">
          Vi är tvåa i Division 4A. Tvåan går till kval — fyra lag i en grupp, tre matcher, ettan går upp.
        </p>
        <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 divide-kedja-mint/15 rounded-2xl border border-kedja-mint/15 sm:grid-cols-4 sm:divide-x">
          <Stat value={`${s.position}:a`} label="i tabellen" />
          <Stat value={`${s.points} p`} label={`på ${s.played} matcher`} />
          <Stat value={String(s.remaining)} label="seriematcher kvar" />
          <Stat value={KVAL_FORMAT.window.replace(" oktober", " okt")} label="kvalet spelas" compact />
        </div>
      </div>
    </div>
  );
}

function Tabell() {
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-kedja-border bg-white">
      <table className="w-full text-left text-[14px] text-kedja-ink">
        <caption className="sr-only">Division 4A Herr efter omgång {DIV4A_TABLE[0]?.played}</caption>
        <thead>
          <tr className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-kedja-green">
            <th className="px-4 py-3 font-extrabold">#</th>
            <th className="px-2 py-3 font-extrabold">Lag</th>
            <th className="px-2 py-3 text-right font-extrabold">M</th>
            <th className="hidden px-2 py-3 text-right font-extrabold sm:table-cell">V–O–F</th>
            <th className="hidden px-2 py-3 text-right font-extrabold sm:table-cell">Mål</th>
            <th className="px-4 py-3 text-right font-extrabold">P</th>
          </tr>
        </thead>
        <tbody>
          {DIV4A_TABLE.map((r) => {
            const us = r.team === OUR_TEAM;
            const kvalZone = r.pos <= 2;
            return (
              <tr
                key={r.team}
                className={cn(
                  "border-t border-kedja-border",
                  us && "bg-kedja-lime font-black",
                  !us && kvalZone && "bg-kedja-mint/60"
                )}
              >
                <td className="px-4 py-2.5 tabular-nums">{r.pos}</td>
                <td className="px-2 py-2.5">{r.team}</td>
                <td className="px-2 py-2.5 text-right tabular-nums">{r.played}</td>
                <td className="hidden px-2 py-2.5 text-right tabular-nums sm:table-cell">
                  {r.won}–{r.drawn}–{r.lost}
                </td>
                <td className="hidden px-2 py-2.5 text-right tabular-nums sm:table-cell">
                  {r.goalsFor}–{r.goalsAgainst}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-black">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-kedja-border px-4 py-3 text-[13px] text-kedja-deep">
        Ettan går upp direkt, tvåan går till kval. Trean har {KVAL_STATUS.gapToThird} poäng upp till oss med tre matcher kvar.
      </p>
    </div>
  );
}

function Tidslinje() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {KVAL_TIMELINE.map((m, i) => (
        <li
          key={m.title}
          className={cn("flex flex-col rounded-2xl border-[1.5px] border-kedja-border px-5 py-4 text-left", KIND_STYLE[m.kind])}
        >
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.2em]">
            <span className="text-kedja-green">{m.date}</span>
            <span className="text-kedja-deep/60">
              {i + 1} · {KIND_LABEL[m.kind]}
            </span>
          </div>
          <p className="mt-2 text-lg font-bold tracking-[-0.01em]">{m.title}</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-kedja-deep">{m.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function Grupper() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {KVAL_GROUPS.map((g) => (
        <article key={g.id} className="flex flex-col rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-2xl font-black tracking-tight text-kedja-ink">{g.name}</h4>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-green">adm {g.admin}</span>
          </div>
          <p className="mt-1 text-[15px] text-kedja-deep">
            Nian i <strong className="font-bold text-kedja-ink">{g.div3Series}</strong> + tvåor från{" "}
            {g.slots.slice(1).join(", ")}.
          </p>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-green">Kan bli våra motståndare</p>
          <ul className="mt-2 divide-y divide-kedja-border">
            {g.candidates.map((c) => (
              <li key={`${g.id}-${c.team}`} className="flex flex-col py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="shrink-0 font-bold text-kedja-ink">{c.team}</span>
                <span className="text-[13px] text-kedja-deep sm:text-right">
                  {c.slot} · {c.status}
                </span>
              </li>
            ))}
          </ul>
          {g.precedent && <p className="mt-4 text-[13px] italic text-kedja-deep">{g.precedent}</p>}
        </article>
      ))}
    </div>
  );
}

function Regler() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-2xl bg-kedja-ink p-6 text-left">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-lime">Spelordning · SvFF</p>
        <ul className="mt-3 divide-y divide-kedja-mint/15">
          {KVAL_FORMAT.schedule.map((r) => (
            <li key={r.round} className="py-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-mint/70">{r.round}</p>
              {r.matches.map((m) => (
                <p key={m} className="mt-1 text-[15px] font-bold text-white">
                  {m}
                </p>
              ))}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-[1.5] text-kedja-mint/80">{KVAL_FORMAT.windowNote}</p>
      </div>
      <div className="rounded-2xl border-[1.5px] border-kedja-border bg-white p-6 text-left">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-green">Regler som gäller oss</p>
        <ul className="mt-3 space-y-3">
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

function Rubrik({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="mx-auto max-w-[720px] text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">{eyebrow}</p>
      <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black tracking-[-0.03em] text-kedja-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-[560px] text-[17px] leading-[1.55] text-kedja-deep">{lead}</p>
    </div>
  );
}

const KvalSection = () => {
  return (
    <section id="kvalet" className="scroll-mt-20">
      <KvalHero />

      <div className="bg-kedja-paper">
        <div className="mx-auto max-w-[1200px] space-y-20 px-6 py-20">
          <div className="space-y-10">
            <Rubrik
              eyebrow="Läget"
              title="Tabellen som tog oss hit"
              lead="Lerum är klara seriesegrare. Vi är tvåa och Velebit kan inte komma ikapp — kvalplatsen är vår."
            />
            <Tabell />
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Så går det till"
              title="Fyra lag, tre matcher, en plats"
              lead={`SvFF fastställde formatet i april. ${KVAL_FORMAT.teamsFromDiv4} lag från division 4 spelar om ${KVAL_FORMAT.groups} platser i division 3.`}
            />
            <div className="mx-auto max-w-[720px]">
              <KedjaSteps tone="paper" steps={[...KVAL_FORMAT.steps]} />
            </div>
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Vägen dit"
              title="Sex datum att ha koll på"
              lead="Tre seriematcher kvar. Sedan avgör förbundet grupp och motstånd, och kvalet spelas på tre helger i oktober."
            />
            <Tidslinje />
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Vilka vi kan möta"
              title="Två grupper med Göteborgslag"
              lead="Göteborgs FF bestämmer vilken av Göteborgs två tvåor som hamnar i vilken grupp. Det är inte klart förrän serierna är färdigspelade 4 oktober."
            />
            <Grupper />
            <p className="mx-auto max-w-[720px] text-center text-[14px] leading-[1.55] text-kedja-deep">
              {GOTEBORG_B_RACE.note}{" "}
              {GOTEBORG_B_RACE.contenders.map((c) => `${c.team} (${c.status})`).join(", ")}.
            </p>
          </div>

          <div className="space-y-10">
            <Rubrik
              eyebrow="Spelschema och regler"
              title="Var vi spelar och vad som gäller"
              lead="Hemmalaget bestämmer speldag. Blir vi bästa kvallag får vi två matcher på Hjällbovallen."
            />
            <Regler />
          </div>

          <footer className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.6] text-kedja-deep">
            <p>Kontrollerat mot källorna {formatVerified(KVAL_VERIFIED)}. Kandidatlagen ändras varje omgång.</p>
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
