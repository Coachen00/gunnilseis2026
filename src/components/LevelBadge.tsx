/**
 * LevelBadge — genomgående nivåmärkning för sajtens pedagogiska hierarki.
 *
 * Nivåerna (hierarkisk koherens, minst→mest):
 *   0 GRUNDEN    — fyra ord + en mening. Det enda alla MÅSTE kunna.
 *   1 SEX FASER  — en rad per spelfas (blockens "kom ihåg").
 *   2 PRINCIPER  — 3–5 principer per fas.
 *   3 FÖRDJUPNING — detaljer, övningar, film, träningsperioder.
 *
 * Samma badge används på alla sidor så att läsaren alltid vet var i
 * trappan hen befinner sig. Färgerna stegrar från guld (grunden, varmast
 * och viktigast) mot neutralt (fördjupning).
 */

import { cn } from "@/lib/utils";

export type PedagogicLevel = 0 | 1 | 2 | 3;

const LEVELS: Record<PedagogicLevel, { label: string; klass: string }> = {
  0: { label: "Nivå 0 · Grunden", klass: "border-amber-500/60 bg-amber-400/15 text-amber-800" },
  1: { label: "Nivå 1 · Sex faser", klass: "border-amber-500/40 bg-amber-400/[0.08] text-amber-700" },
  2: { label: "Nivå 2 · Principer", klass: "border-border bg-muted/60 text-foreground/70" },
  3: { label: "Nivå 3 · Fördjupning", klass: "border-border bg-background text-muted-foreground" },
};

export default function LevelBadge({
  level,
  className,
}: {
  level: PedagogicLevel;
  className?: string;
}) {
  const def = LEVELS[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em]",
        def.klass,
        className
      )}
    >
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {([0, 1, 2, 3] as const).map((i) => (
          <span
            key={i}
            className={cn(
              "w-[3px] rounded-[1px]",
              i <= level ? "bg-current opacity-90" : "bg-current opacity-25"
            )}
            style={{ height: 4 + i * 2 }}
          />
        ))}
      </span>
      {def.label}
    </span>
  );
}
