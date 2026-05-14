import { ReactNode } from "react";
import { Check, X, Lightbulb, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import TacticalPitch, { PitchPlayer, PitchArrow, PitchAnnotation } from "./TacticalPitch";

export type BlockTone = "defense" | "transition-out" | "attack" | "transition-in" | "identity" | "neutral";

const TONE_BAR: Record<BlockTone, string> = {
  defense: "bg-swedish-blue",
  "transition-out": "bg-zone-attack",
  attack: "bg-accent",
  "transition-in": "bg-destructive",
  identity: "bg-foreground",
  neutral: "bg-muted-foreground",
};

const TONE_TEXT: Record<BlockTone, string> = {
  defense: "text-swedish-blue",
  "transition-out": "text-zone-attack",
  attack: "text-accent",
  "transition-in": "text-destructive",
  identity: "text-foreground",
  neutral: "text-muted-foreground",
};

const TONE_BG: Record<BlockTone, string> = {
  defense: "bg-swedish-blue/10",
  "transition-out": "bg-zone-attack/10",
  attack: "bg-accent/10",
  "transition-in": "bg-destructive/10",
  identity: "bg-foreground/5",
  neutral: "bg-muted",
};

export interface PlayerInstruction {
  role: string;
  text: string;
}

export interface BlockPitchConfig {
  title: string;
  caption?: string;
  players?: PitchPlayer[];
  arrows?: PitchArrow[];
  annotations?: PitchAnnotation[];
  corridors?: boolean;
  thirds?: boolean;
  highlightedCorridor?: "left" | "center" | "right" | null;
  highlightedZone?: { x: number; y: number; w: number; h: number; tone?: "accent" | "primary" | "destructive" | "success" } | null;
}

export interface TacticalBlockProps {
  id: string;
  index: number;
  phaseLabel: string;
  title: string;
  Icon: LucideIcon;
  tone: BlockTone;
  explanation: string;
  playerInstructions: PlayerInstruction[];
  doList: string[];
  dontList: string[];
  remember: string;
  media: { type: "video" | "image"; title: string; description?: string };
  pitch: BlockPitchConfig;
  children?: ReactNode;
}

const TacticalBlock = ({
  id,
  index,
  phaseLabel,
  title,
  Icon,
  tone,
  explanation,
  playerInstructions,
  doList,
  dontList,
  remember,
  media,
  pitch,
  children,
}: TacticalBlockProps) => {
  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-sm border border-border bg-card shadow-[0_1px_0_0_hsl(var(--border)),0_18px_38px_-24px_hsl(215_70%_12%/0.18)] overflow-hidden"
    >
      <div className={cn("h-1 w-full", TONE_BAR[tone])} />

      <header className="border-b border-border bg-gradient-to-b from-card to-muted/30 px-5 py-6 md:px-8 md:py-7">
        <div className="flex items-start gap-4">
          <div className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border", TONE_BG[tone])}>
            <Icon className={cn("h-5 w-5", TONE_TEXT[tone])} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-black tabular text-muted-foreground">
                {String(index).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.22em]", TONE_TEXT[tone])}>
                {phaseLabel}
              </span>
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-black uppercase leading-[1.05] tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-3 max-w-prose text-sm md:text-base leading-relaxed text-muted-foreground">
              {explanation}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-5 md:grid-cols-2 md:gap-8 md:p-8">
        <div className="space-y-6">
          <section>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Spelarinstruktion</p>
            <ul className="space-y-2.5">
              {playerInstructions.map((instr, idx) => (
                <li key={`${instr.role}-${idx}`} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex flex-shrink-0 items-center rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {instr.role}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{instr.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-zone-attack/30 bg-zone-attack/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-sm bg-zone-attack text-background">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zone-attack">Gör så här</p>
              </div>
              <ul className="space-y-1.5">
                {doList.map((item) => (
                  <li key={item} className="text-sm font-semibold leading-snug text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-5 w-5 place-items-center rounded-sm bg-destructive text-destructive-foreground">
                  <X className="h-3 w-3" strokeWidth={3} />
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-destructive">Gör inte så här</p>
              </div>
              <ul className="space-y-1.5">
                {dontList.map((item) => (
                  <li key={item} className="text-sm font-semibold leading-snug text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <MediaPlaceholder type={media.type} title={media.title} description={media.description} />
        </div>

        <div className="space-y-5">
          <TacticalPitch
            title={pitch.title}
            caption={pitch.caption}
            players={pitch.players}
            arrows={pitch.arrows}
            annotations={pitch.annotations}
            corridors={pitch.corridors}
            thirds={pitch.thirds}
            highlightedCorridor={pitch.highlightedCorridor}
            highlightedZone={pitch.highlightedZone}
          />

          <div className={cn("rounded-sm border border-accent/30 bg-accent/8 p-4")}>
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.75} />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Kom ihåg</p>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{remember}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children && <div className="border-t border-border bg-muted/30 p-5 md:p-8">{children}</div>}
    </article>
  );
};

export default TacticalBlock;
