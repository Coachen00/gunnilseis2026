import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SpelmodellLevel, SpelmodellLevelId } from "@/data/spelmodellLevels";

interface LevelPathProps {
  levels: readonly SpelmodellLevel[];
  selectedLevelId: SpelmodellLevelId;
  onSelect: (levelId: SpelmodellLevelId) => void;
  className?: string;
}

export default function LevelPath({
  levels,
  selectedLevelId,
  onSelect,
  className,
}: LevelPathProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = useMemo(
    () => Math.max(0, levels.findIndex((level) => level.id === selectedLevelId)),
    [levels, selectedLevelId]
  );

  const focusLevel = (index: number) => {
    buttonRefs.current[index]?.focus();
  };

  const selectIndex = (index: number) => {
    const clampedIndex = Math.min(levels.length - 1, Math.max(0, index));
    const nextLevel = levels[clampedIndex];

    focusLevel(clampedIndex);
    onSelect(nextLevel.id);
  };

  return (
    <nav className={cn("w-full", className)} aria-label="Spelartrappa">
      <ol className="flex flex-wrap gap-2">
        {levels.map((level, index) => {
          const isSelected = level.id === selectedLevelId;

          return (
            <li key={level.id}>
              <button
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-amber-500 bg-amber-100 text-amber-950 shadow-sm"
                    : "border-border bg-card text-foreground hover:border-amber-400 hover:bg-amber-50/60"
                )}
                aria-current={isSelected ? "step" : undefined}
                aria-pressed={isSelected}
                data-selected={isSelected ? "true" : "false"}
                onClick={() => onSelect(level.id)}
                onKeyDown={(event) => {
                  switch (event.key) {
                    case "ArrowRight":
                    case "ArrowDown":
                      event.preventDefault();
                      selectIndex(index + 1);
                      break;
                    case "ArrowLeft":
                    case "ArrowUp":
                      event.preventDefault();
                      selectIndex(index - 1);
                      break;
                    case "Home":
                      event.preventDefault();
                      selectIndex(0);
                      break;
                    case "End":
                      event.preventDefault();
                      selectIndex(levels.length - 1);
                      break;
                    default:
                      break;
                  }
                }}
              >
                {level.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
