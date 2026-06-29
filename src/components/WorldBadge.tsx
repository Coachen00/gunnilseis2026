import { cn } from "@/lib/utils";
import type { WorldId } from "@/lib/worlds";
import { WORLD_ACCENTS } from "@/lib/worlds";

/**
 * Konsekvent metadata-system enligt rubrikspecen:
 *  - <Label> — metadata-eyebrow: IDENTITET, SKEDE, VERKTYG, MATCH, COACH.
 *  - <StatusBadge> — status: äkta, strukturell, låst, coach, ny, viktig.
 *  - <WorldBadge> — vilken värld en sida tillhör (färgad efter world-accent).
 */

interface LabelProps {
  children: React.ReactNode;
  /** Färga labeln efter en värld. Default neutral. */
  world?: WorldId;
  className?: string;
}

export function Label({ children, world, className }: LabelProps) {
  const accent = world ? WORLD_ACCENTS[world] : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.22em]",
        accent ? accent.label : "text-accent",
        className
      )}
    >
      <span aria-hidden="true" className={cn("inline-block h-px w-6", accent ? accent.bar : "bg-accent")} />
      {children}
    </span>
  );
}

type StatusTone = "neutral" | "true" | "structural" | "locked" | "coach" | "new" | "important";

const STATUS_TONE: Record<StatusTone, string> = {
  neutral: "bg-muted border-border text-foreground/70",
  true: "bg-emerald-50 border-emerald-300/80 text-emerald-700",
  structural: "bg-violet-50 border-violet-300/80 text-violet-700",
  locked: "bg-amber-50 border-amber-400/70 text-amber-700",
  coach: "bg-zinc-900 border-zinc-700 text-amber-300",
  new: "bg-sky-50 border-sky-300/80 text-sky-700",
  important: "bg-rose-50 border-rose-300/80 text-rose-700",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em]",
        STATUS_TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function WorldBadge({ world, label, className }: { world: WorldId; label: string; className?: string }) {
  const accent = WORLD_ACCENTS[world];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em]",
        accent.chip,
        className
      )}
    >
      {label}
    </span>
  );
}

export default WorldBadge;
