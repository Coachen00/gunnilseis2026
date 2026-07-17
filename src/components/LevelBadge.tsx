import { cn } from "@/lib/utils";
import {
  LEGACY_LEVEL_TO_SPELMODELL_LEVEL_ID,
  SPELMODELL_LEVELS,
  type SpelmodellLevelId,
} from "@/data/spelmodellLevels";

export type PedagogicLevel = 0 | 1 | 2 | 3;
export type LevelBadgeValue = PedagogicLevel | SpelmodellLevelId;

const LEVEL_STYLES: Record<SpelmodellLevelId, string> = {
  novis: "border-amber-500/60 bg-amber-400/15 text-amber-800",
  "level-1": "border-amber-500/45 bg-amber-400/[0.1] text-amber-700",
  "level-2": "border-sky-300 bg-sky-50 text-sky-900",
  "level-3": "border-emerald-300 bg-emerald-50 text-emerald-900",
  "level-4": "border-violet-300 bg-violet-50 text-violet-900",
  "level-5": "border-rose-300 bg-rose-50 text-rose-900",
  advanced: "border-border bg-background text-muted-foreground",
};

export default function LevelBadge({
  level,
  className,
}: {
  level: LevelBadgeValue;
  className?: string;
}) {
  const normalizedLevelId =
    typeof level === "number" ? LEGACY_LEVEL_TO_SPELMODELL_LEVEL_ID[level] : level;
  const stepIndex = Math.max(
    0,
    SPELMODELL_LEVELS.findIndex((item) => item.id === normalizedLevelId)
  );
  const badge = SPELMODELL_LEVELS[stepIndex];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em]",
        LEVEL_STYLES[normalizedLevelId],
        className
      )}
    >
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {SPELMODELL_LEVELS.map((_, index) => (
          <span
            key={index}
            className={cn(
              "w-[3px] rounded-[1px]",
              index <= stepIndex ? "bg-current opacity-90" : "bg-current opacity-25"
            )}
            style={{ height: 4 + index * 2 }}
          />
        ))}
      </span>
      {badge.label}
    </span>
  );
}
