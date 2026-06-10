import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DUMLE_CUP,
  DUMLE_CUP_PLAYERS,
  POINT_RULES,
  QUOTE,
  SESSIONS,
  rankPlayers,
  describeMatch,
} from "@/data/tavlingar";

const MEDAL_STYLES: Record<number, string> = {
  1: "border-amber-400/50 bg-amber-400/10 text-amber-300",
  2: "border-slate-300/40 bg-slate-300/10 text-slate-200",
  3: "border-orange-500/40 bg-orange-500/10 text-orange-300",
};

const Tavlingar = () => {
  const ranked = rankPlayers();
  const rankedCup = rankPlayers(DUMLE_CUP_PLAYERS);
  const lastSession = SESSIONS[SESSIONS.length - 1];

  return (
    <>
      <PageHero
        eyebrow="Tävlingar"
        title="Poängliga & topplista"
        description={`Den interna poängligan från träningarna. Uppdateras veckovis — senast efter ${lastSession.label.toLowerCase()} (${lastSession.dateShort}). Varje närvaro ger poäng, så det lönar sig att dyka upp.`}
      />

      <div className="container pb-section">
        {/* Dumle CUP — individuell totalräkning */}
        <SectionReveal as="section" aria-labelledby="dumle-rubrik">
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Tävling
              </span>
              <h2 id="dumle-rubrik" className="text-xl text-foreground">
                {DUMLE_CUP.title} {DUMLE_CUP.emoji}
              </h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {rankedCup.length} spelare
            </span>
          </header>

          <div className="overflow-x-auto rounded-md border border-border/70 bg-card">
            <table className="w-full min-w-[22rem] text-sm">
              <caption className="sr-only">
                Dumle CUP — individuell poängtabell, sorterad fallande på total poäng.
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th
                    scope="col"
                    className="px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Spelare
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground"
                  >
                    Poäng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rankedCup.map((player) => {
                  const medal = MEDAL_STYLES[player.rank];
                  return (
                    <tr key={player.name} className="transition-colors hover:bg-muted/30">
                      <td className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            "grid h-7 w-7 mx-auto place-items-center rounded-sm border font-mono text-xs font-black",
                            medal ?? "border-border/70 text-muted-foreground"
                          )}
                        >
                          {player.rank}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-bold tracking-tight text-foreground">
                          {player.name}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {player.played === 0 ? (
                          <span className="font-mono text-sm text-muted-foreground/50">–</span>
                        ) : (
                          <span className="font-mono text-sm font-black tabular-nums text-accent">
                            {player.total}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Individuell totalräkning — poäng delas ut per träningstillfälle utifrån
            lagindelningen den dagen. <span className="font-mono">–</span> = poäng ej
            registrerad. Spelare med lika poäng delar placering.
          </p>
        </SectionReveal>

        {/* Ledord — varför vi tävlar */}
        <SectionReveal as="section" aria-label="Ledord" className="mt-12">
          <figure className="rounded-md border-l-2 border-accent bg-card px-5 py-5 sm:px-6 sm:py-6">
            <blockquote className="text-balance text-base italic leading-relaxed text-foreground/90 sm:text-lg">
              {QUOTE.text}
            </blockquote>
            <figcaption className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              {QUOTE.attribution}
            </figcaption>
          </figure>
        </SectionReveal>

        {/* Regler & poängsystem */}
        <SectionReveal as="section" aria-labelledby="regler-rubrik" className="mt-10">
          <header className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              Regler
            </span>
            <h2 id="regler-rubrik" className="text-xl text-foreground">
              Poängsystem
            </h2>
          </header>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POINT_RULES.map((rule) => (
              <div
                key={rule.label}
                className="rounded-md border border-border/70 bg-card px-4 py-4"
              >
                <div className="font-mono text-2xl font-black tracking-tight text-accent">
                  {rule.points}
                </div>
                <div className="mt-1 text-sm font-bold tracking-tight text-foreground">
                  {rule.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {rule.detail}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Leaderboard */}
        <SectionReveal
          as="section"
          aria-labelledby="leaderboard-rubrik"
          className="mt-10"
        >
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Totalt
              </span>
              <h2 id="leaderboard-rubrik" className="text-xl text-foreground">
                Aktuell topplista
              </h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {ranked.length} spelare
            </span>
          </header>

          <div className="overflow-x-auto rounded-md border border-border/70 bg-card">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">
                Poängliga totalt, sorterad fallande på total poäng.
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th
                    scope="col"
                    className="px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Spelare
                  </th>
                  {SESSIONS.map((s) => (
                    <th
                      key={s.index}
                      scope="col"
                      className="px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      <span className="block">T{s.index + 1}</span>
                      <span className="block text-[9px] font-normal tracking-normal text-muted-foreground/70">
                        {s.dateShort}
                      </span>
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-3 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {ranked.map((player) => {
                  const medal = MEDAL_STYLES[player.rank];
                  return (
                    <tr
                      key={player.name}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={cn(
                            "grid h-7 w-7 mx-auto place-items-center rounded-sm border font-mono text-xs font-black",
                            medal ?? "border-border/70 text-muted-foreground"
                          )}
                        >
                          {player.rank}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-bold tracking-tight text-foreground">
                          {player.name}
                        </span>
                        {player.alias && (
                          <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                            ({player.alias})
                          </span>
                        )}
                      </td>
                      {SESSIONS.map((s) => {
                        const score = player.scores[s.index];
                        return (
                          <td
                            key={s.index}
                            className="px-3 py-2.5 text-center font-mono text-xs tabular-nums"
                          >
                            {score === null ? (
                              <span className="text-muted-foreground/50">–</span>
                            ) : (
                              <span className="text-foreground/80">{score}</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <span className="font-mono text-sm font-black tabular-nums text-accent">
                          {player.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-mono">–</span> = ej närvarande det tillfället.
            Spelare med lika poäng delar placering.
          </p>
        </SectionReveal>

        {/* Historik & matchresultat */}
        <SectionReveal
          as="section"
          aria-labelledby="historik-rubrik"
          className="mt-12"
        >
          <header className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              Historik
            </span>
            <h2 id="historik-rubrik" className="text-xl text-foreground">
              Matchresultat
            </h2>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            {[...SESSIONS].reverse().map((session) => (
              <article
                key={session.index}
                className="rounded-md border border-border/70 bg-card overflow-hidden"
              >
                <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-sm border border-accent/40 bg-accent/10 font-mono text-[10px] font-black text-accent">
                      T{session.index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg text-foreground leading-tight">
                        {session.label}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {session.type}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {session.dateShort}
                  </span>
                </header>
                <ul className="divide-y divide-border/50">
                  {session.matches.map((match, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Match {i + 1}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-sm font-black tabular-nums text-foreground">
                        <span className="text-rose-400">{match.red}</span>
                        <span className="text-muted-foreground/60">–</span>
                        <span className="text-foreground/80">{match.black}</span>
                      </span>
                      <span className="min-w-[6.5rem] text-right text-xs text-muted-foreground">
                        {describeMatch(match)}
                      </span>
                    </li>
                  ))}
                </ul>
                {session.note && (
                  <p className="border-t border-border/50 px-5 py-3 text-xs italic text-muted-foreground">
                    {session.note} <span className="text-rose-400">Rött</span> =
                    vänster siffra.
                  </p>
                )}
              </article>
            ))}
          </div>
        </SectionReveal>
      </div>
    </>
  );
};

export default Tavlingar;
