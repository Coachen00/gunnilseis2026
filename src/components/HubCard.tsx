import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorldId } from "@/lib/worlds";
import { WORLD_ACCENTS } from "@/lib/worlds";

export interface HubCardProps {
  to: string;
  /** Metadata-label överst, t.ex. SKEDE / BETEENDE / ANSVAR. */
  label: string;
  /** Kort rubrik (H3). */
  title: string;
  /** En konkret mening. */
  description: string;
  Icon?: LucideIcon;
  world: WorldId;
  /** Visa hash-länkar i samma route (#…) utan helsidladdning. */
  className?: string;
}

/**
 * HubCard — den enda klickbara kort-byggstenen för hubbarna och systemkartan.
 * Hela kortet är klickyta (≫44px). Label → rubrik → mening → pil. Lugn neutral
 * yta, världens accent bara på ikon, label och hover-ram.
 */
const HubCard = ({ to, label, title, description, Icon, world, className }: HubCardProps) => {
  const accent = WORLD_ACCENTS[world];
  return (
    <Link
      to={to}
      className={cn(
        "group flex min-h-[7rem] flex-col gap-3 border border-border bg-card p-5 transition-colors",
        accent.ring,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("font-mono text-[10px] font-black uppercase tracking-[0.2em]", accent.label)}>
          {label}
        </span>
        {Icon && <Icon className={cn("h-5 w-5 flex-shrink-0", accent.icon)} strokeWidth={1.9} aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-black leading-tight text-foreground">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-foreground/70">{description}</p>
      <span className={cn("mt-1 inline-flex items-center gap-1.5 text-xs font-bold", accent.label)}>
        Öppna
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} aria-hidden="true" />
      </span>
    </Link>
  );
};

export default HubCard;
