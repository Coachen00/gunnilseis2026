import { Sparkles } from "lucide-react";
import type { Reference } from "@/data/period1";

const ReferenceCard = ({ reference }: { reference: Reference }) => (
  <article className="rounded-xl border border-border bg-card/35 p-5">
    <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-3">
      <h3 className="flex items-center gap-2 text-lg font-black tracking-normal text-foreground">
        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
        {reference.team}
      </h3>
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-accent">
        {reference.tag}
      </span>
    </header>
    <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
      {reference.bullets.map((b) => (
        <li key={b} className="flex items-baseline gap-2">
          <span className="text-accent">›</span>
          {b}
        </li>
      ))}
    </ul>
    <p className="mt-3 text-[11px] italic text-muted-foreground/70">
      Inspirerat av principer från {reference.team} — vi kopierar inte, vi anpassar.
    </p>
  </article>
);

export default ReferenceCard;
