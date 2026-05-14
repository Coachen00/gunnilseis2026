import MediaSlot from "@/components/match/MediaSlot";
import { cn } from "@/lib/utils";

export type MediaSlotItem = {
  slotKey: string;
  title: string;
  description: string;
};

interface Props {
  /** Array av slots — renderas som 3-kolumn-grid på md+. */
  slots: MediaSlotItem[];
  /** Optional matchId — utelämna för global media-fallback. */
  matchId?: string;
  className?: string;
}

/**
 * Tre MediaSlots i grid — det dominerande mönstret för spelmodellens
 * exempel-bilder per princip. Tidigare upprepad inline-JSX på 7 ställen
 * (Forsvar, Omstallning*, SessionCard).
 *
 * Alla slots renderas i `compact`-läge.
 */
export default function MediaSlotGroup({ slots, matchId, className }: Props) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-3", className)}>
      {slots.map((s) => (
        <MediaSlot
          key={s.slotKey}
          matchId={matchId}
          slotKey={s.slotKey}
          title={s.title}
          description={s.description}
          compact
        />
      ))}
    </div>
  );
}
