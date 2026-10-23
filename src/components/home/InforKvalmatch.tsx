import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CALLED_SQUAD,
  FOCUS,
  GATHERING_PLACE,
  MATCH_META,
  SAMLING_TIME,
} from "@/data/matchplan";
import {
  KVAL_FIXTURES,
  KVAL_GROUP,
  KVAL_PENALTIES,
  KVAL_ROUNDS_PLAYED,
  KVAL_RULES,
  KVAL_TABLE,
  KVAL_TEAMS,
  OTHER_REMAINING,
  OUR_TEAM,
  WIN_CLINCHES,
} from "@/data/kval";

/* Förutsättningarna inför veckans kvalmatch — först på startsidan efter
 * inloggning. Matchen är alltid `MATCH_META`; kvalmatchen slås upp på
 * motståndaren, och blocket visas inte när veckans match inte är en
 * kvalmatch. */

const FIXTURE = KVAL_FIXTURES.find(
  (f) => (f.home === MATCH_META.opponent || f.away === MATCH_META.opponent) && (f.home === OUR_TEAM || f.away === OUR_TEAM)
);
const OPPONENT = KVAL_TEAMS.find((t) => t.team === MATCH_META.opponent);

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

function Fakta({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-kedja-mint/80">{label}</p>
      <p className="mt-1 text-[20px] font-black leading-tight text-white">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-kedja-mint">{sub}</p>}
    </div>
  );
}

function Punkt({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.5] text-kedja-ink">
      <span className="mt-[9px] block h-1.5 w-1.5 shrink-0 rounded-full bg-kedja-green" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

const InforKvalmatch = () => {
  if (!FIXTURE) return null;
  const called = [...CALLED_SQUAD.starting, ...CALLED_SQUAD.bench];
  const otherMatch = OTHER_REMAINING.map((f) => `${f.home}–${f.away}`).join(" och ");

  return (
    <section id="infor-matchen" className="scroll-mt-20 bg-kedja-ink">
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-20 sm:px-6">
        <div className="text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-lime">
              Inför lördag · {KVAL_GROUP.name} · match {FIXTURE.round} av 3
            </span>
            <span className="block h-px w-10 bg-kedja-lime/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.2rem,5.5vw,4.2rem)] font-black leading-[1.02] tracking-[-0.03em] text-white">
            {FIXTURE.home} – {FIXTURE.away}
          </h2>
          {WIN_CLINCHES && (
            <p className="mt-5 text-[clamp(1.8rem,4.5vw,3.2rem)] font-black leading-none tracking-[-0.02em] text-kedja-lime">
              Vinst = division 3
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-[900px] gap-3 sm:grid-cols-3">
          <Fakta label="Avspark" value={MATCH_META.kickoff} sub={MATCH_META.home ? "Hemma" : "Borta"} />
          <Fakta label="Plats" value={MATCH_META.venue} sub={FIXTURE.surface ?? "Underlag ej angivet"} />
          <Fakta label="Samling" value={SAMLING_TIME} sub={GATHERING_PLACE} />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 text-left sm:p-8">
            <Eyebrow>Läget efter omgång {KVAL_ROUNDS_PLAYED}</Eyebrow>
            <ol className="mt-4 divide-y divide-kedja-border">
              {KVAL_TABLE.map((r) => (
                <li
                  key={r.team}
                  className={cn(
                    "flex items-center justify-between gap-4 py-2.5 text-[15px] text-kedja-ink",
                    r.team === OUR_TEAM && "font-black"
                  )}
                >
                  <span>
                    <span className="mr-3 tabular-nums text-kedja-green">{r.pos}</span>
                    {r.team}
                  </span>
                  <span className="tabular-nums">{r.points} p</span>
                </li>
              ))}
            </ol>
            <ul className="mt-5 space-y-2">
              {WIN_CLINCHES && <Punkt>Vinner vi kan ingen nå oss — då är vi gruppetta och klara för division 3.</Punkt>}
              {otherMatch && <Punkt>Oavgjort eller förlust: då avgör även {otherMatch}.</Punkt>}
              <Punkt>
                <span className="font-bold">{KVAL_PENALTIES.headline}.</span> {KVAL_PENALTIES.support}
              </Punkt>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 text-left sm:p-8">
            <Eyebrow>Våra fokus</Eyebrow>
            <ol className="mt-4 space-y-3">
              {FOCUS.map((f, i) => (
                <li key={f} className="flex gap-3 text-[15px] leading-[1.5] text-kedja-ink">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-kedja-lime text-[13px] font-black text-kedja-ink">
                    {i + 1}
                  </span>
                  {f}
                </li>
              ))}
            </ol>
            {OPPONENT && (
              <div className="mt-6 border-t border-kedja-border pt-5">
                <Eyebrow>Motståndaren</Eyebrow>
                <p className="mt-2 text-[15px] leading-[1.5] text-kedja-ink">
                  <span className="font-bold">{OPPONENT.team}</span>, {OPPONENT.pos}:a i {OPPONENT.series}: {OPPONENT.won}–{OPPONENT.drawn}–
                  {OPPONENT.lost}, {OPPONENT.points} poäng. {OPPONENT.note}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 text-left sm:p-8">
            <Eyebrow>Kort och avstängningar</Eyebrow>
            <ul className="mt-4 space-y-2">
              {KVAL_RULES.map((rule) => (
                <Punkt key={rule}>{rule}</Punkt>
              ))}
            </ul>
          </div>

          <div className="flex flex-col rounded-2xl border-2 border-dashed border-kedja-lime/60 bg-white/5 p-6 text-left sm:p-8">
            <Eyebrow tone="lime">Truppen</Eyebrow>
            {called.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-3 py-4">
                <Users className="h-8 w-8 text-kedja-lime" strokeWidth={2} aria-hidden="true" />
                <p className="text-[24px] font-black leading-tight text-white">Truppen publiceras senare</p>
                <p className="text-[15px] leading-[1.5] text-kedja-mint">Alla förbereder sig som om de startar.</p>
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[15px] text-white">
                {called.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link
            to="/match/kommande"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kedja-lime transition-colors hover:text-white"
          >
            Hela matchplanen
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <a
            href="#kvalet"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kedja-lime transition-colors hover:text-white"
          >
            Hela kvalet
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
          </a>
          <a
            href="#spelprinciper"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kedja-lime transition-colors hover:text-white"
          >
            Spelprinciperna
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InforKvalmatch;
