/**
 * LastMatchResult — publik "senaste matchen"-scen på förstasidan.
 *
 * Sitter mellan den mörka hero:n och den ljusa NextActionsStrip och fortsätter
 * hero:ns retro-äventyrsbok-palett (amber/forest på mörk botten) som en egen
 * scoreboard-scen.
 *
 * Synlighet: PUBLIK. Till skillnad från kommande matchplan/taktik/trupp (som
 * alltid är inloggat) är spelade resultat + målskyttar redan offentliga på
 * svenskalag.se — inget känsligt läcker. Endast CTA:n till den skyddade
 * matchreflektionen är auth-gated.
 *
 * Datadriven: läser senast spelade matchen via getForraMatch() → season.ts.
 * När säsongen rullar vidare byts matchen automatiskt, ingen kod-redigering.
 * Renderar ingenting om matchen saknar rapporterat resultat.
 */

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star, Trophy } from "lucide-react";
import { getForraMatch } from "@/data/forraMatch";
import { useAuthSession } from "@/hooks/useAuthSession";

const TEAM = "Gunnilse IS";

/** Liten boll-glyf i hero:ns stil (vit boll, amber-ring) — för målskyttar. */
function BallGlyph() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-amber-400 bg-amber-100"
    />
  );
}

function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long" }).format(d);
}

export default function LastMatchResult() {
  const reduced = Boolean(useReducedMotion());
  const { isAuthed, loading: authLoading } = useAuthSession();
  const authed = !authLoading && isAuthed;

  const forra = getForraMatch();
  // Visa bara när det finns en spelad match med rapporterat resultat.
  if (!forra || forra.meta.ourScore == null || forra.meta.theirScore == null) {
    return null;
  }

  const { meta } = forra;
  const { ourScore, theirScore, opponent } = meta;
  const isHome = meta.homeAway === "home";
  const outcome = ourScore > theirScore ? "win" : ourScore < theirScore ? "loss" : "draw";
  const scorers = meta.scorers ?? [];
  const dateLabel = formatMatchDate(meta.date);

  const outcomeLabel = outcome === "win" ? "Vinst" : outcome === "loss" ? "Förlust" : "Oavgjort";
  const outcomeTone =
    outcome === "win"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      : outcome === "loss"
        ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
        : "border-amber-300/40 bg-amber-300/10 text-amber-200";

  // Hemmalaget visas till vänster i tablån.
  const leftIsUs = isHome;
  const left = { name: isHome ? TEAM : opponent };
  const right = { name: isHome ? opponent : TEAM };
  const leftScore = isHome ? ourScore : theirScore;
  const rightScore = isHome ? theirScore : ourScore;

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  return (
    <section
      aria-label="Senaste matchen"
      className="relative isolate overflow-hidden bg-[#160f07] text-[#fef3e2]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 0%, rgba(217,119,6,0.16), transparent 55%), radial-gradient(circle at 85% 100%, rgba(21,128,61,0.14), transparent 55%)",
      }}
    >
      {/* Grain-overlay — samma som hero, lättare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.10]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence baseFrequency=%221.2%22 seed=%227%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/></svg>')",
        }}
      />

      <div className="container relative py-14 md:py-20">
        {/* Eyebrow + utfalls-badge */}
        <motion.div {...reveal(0)} className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-300">
            <Trophy className="h-3.5 w-3.5" strokeWidth={2.3} aria-hidden="true" />
            Senaste matchen · {meta.competition}
          </p>
          <span
            className={`inline-flex items-center border px-3 py-1 font-mono text-[11px] font-black uppercase tracking-[0.2em] ${outcomeTone}`}
          >
            {outcomeLabel}
          </span>
        </motion.div>

        {/* Scoreboard */}
        <motion.div {...reveal(0.08)}>
          {/* Skärmläsar-sammanfattning — en enda tydlig mening */}
          <p className="sr-only">
            Slutresultat: {left.name} {leftScore}, {right.name} {rightScore}.{" "}
            {isHome ? "Hemmamatch" : "Bortamatch"} {dateLabel ? `den ${dateLabel}` : ""}.
          </p>

          <div
            aria-hidden="true"
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6"
          >
            {/* Vänster lag */}
            <div className={`text-right ${leftIsUs ? "text-amber-100" : "text-amber-100/70"}`}>
              <p className="text-lg font-black leading-tight tracking-tight sm:text-2xl md:text-3xl">
                {left.name}
              </p>
              {leftIsUs && (
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/70">
                  Hemma
                </p>
              )}
            </div>

            {/* Siffror */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ScoreBox value={leftScore} highlight={leftIsUs && outcome === "win"} />
              <span className="text-2xl font-black text-amber-300/50 sm:text-4xl">–</span>
              <ScoreBox value={rightScore} highlight={!leftIsUs && outcome === "win"} />
            </div>

            {/* Höger lag */}
            <div className={`text-left ${!leftIsUs ? "text-amber-100" : "text-amber-100/70"}`}>
              <p className="text-lg font-black leading-tight tracking-tight sm:text-2xl md:text-3xl">
                {right.name}
              </p>
              {!leftIsUs && (
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/70">
                  Hemma
                </p>
              )}
            </div>
          </div>

          {/* Metarad */}
          <p className="mt-5 text-center text-sm text-amber-100/70">
            {isHome ? "Hemma" : "Borta"} · {meta.venue}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </p>
        </motion.div>

        {/* Målskyttar */}
        {scorers.length > 0 && (
          <motion.div {...reveal(0.16)} className="mx-auto mt-10 max-w-xl">
            <p className="mb-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.26em] text-amber-300/80">
              Våra målskyttar
            </p>
            <ul className="flex flex-col gap-2.5">
              {scorers.map((s) => (
                <li
                  key={s.name}
                  className="flex flex-col items-start gap-2 border border-amber-200/12 bg-amber-200/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
                      {Array.from({ length: Math.min(s.goals, 3) }).map((_, i) => (
                        <BallGlyph key={i} />
                      ))}
                    </span>
                    <span className="font-bold tracking-tight text-amber-50">
                      {s.name}
                      {s.goals > 1 && (
                        <span className="ml-2 font-mono text-xs font-black text-amber-300">
                          ×{s.goals}
                        </span>
                      )}
                      <span className="sr-only"> {s.goals} mål</span>
                    </span>
                  </div>
                  {s.note && (
                    <span className="inline-flex items-center gap-1.5 border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200 sm:ml-auto">
                      <Star className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
                      {s.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* CTA — endast inloggade (matchreflektionen är skyddad) */}
        {authed && (
          <motion.div {...reveal(0.24)} className="mt-10 flex justify-center">
            <Link
              to="/match/forra"
              className="group inline-flex h-11 items-center justify-center gap-2 border border-amber-300/30 bg-amber-300/5 px-6 text-sm font-bold uppercase tracking-[0.12em] text-amber-100 transition hover:border-amber-300/70 hover:text-amber-300"
            >
              Hela matchreflektionen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.3} aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ScoreBox({ value, highlight }: { value: number; highlight: boolean }) {
  return (
    <span
      className={`grid h-14 w-12 place-items-center text-4xl font-black tabular-nums sm:h-20 sm:w-16 sm:text-6xl ${
        highlight ? "text-amber-300" : "text-[#fef3e2]"
      }`}
      style={highlight ? { textShadow: "0 0 28px rgba(251,191,36,0.45)" } : undefined}
    >
      {value}
    </span>
  );
}
