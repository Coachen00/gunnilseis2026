import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaPlaceholder from "@/components/MediaPlaceholder";

export interface SetPieceBlockProps {
  id: string;
  label: string;
  title: string;
  Icon: LucideIcon;
  tone: "offensive" | "defensive" | "neutral";
  mediaTitle: string;
  mediaType?: "video" | "image";
}

const TONE: Record<SetPieceBlockProps["tone"], { text: string; border: string; bg: string; bar: string }> = {
  offensive: { text: "text-accent", border: "border-accent/30", bg: "bg-accent/8", bar: "bg-accent" },
  defensive: { text: "text-swedish-blue", border: "border-swedish-blue/30", bg: "bg-swedish-blue/8", bar: "bg-swedish-blue" },
  neutral: { text: "text-foreground", border: "border-border", bg: "bg-muted", bar: "bg-foreground" },
};

const FIELDS = [
  { key: "rutin", label: "Rutin / signal", placeholder: "Vilken rutin kör vi? Hand-signal? Kalla namn?" },
  { key: "roller", label: "Roller & löpningar", placeholder: "Vem slår? Vem löper kort/lång? Vem stör målvakt?" },
  { key: "trigger", label: "Trigger för variant", placeholder: "När byter vi rutin? Vad utlöser plan B?" },
  { key: "kom-ihag", label: "Kom ihåg", placeholder: "Den enda regeln spelarna inte får glömma." },
];

const SetPieceBlock = ({ id, label, title, Icon, tone, mediaTitle, mediaType = "video" }: SetPieceBlockProps) => {
  const t = TONE[tone];
  return (
    <article id={id} className="scroll-mt-24 overflow-hidden rounded-sm border border-border bg-card">
      <div className={cn("h-0.5 w-full", t.bar)} />
      <div className="p-5 md:p-6">
        <header className="flex items-center gap-3">
          <div className={cn("grid h-9 w-9 place-items-center rounded-sm border", t.border, t.bg)}>
            <Icon className={cn("h-4 w-4", t.text)} strokeWidth={1.75} />
          </div>
          <div>
            <p className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.22em]", t.text)}>{label}</p>
            <h3 className="mt-0.5 text-lg font-black uppercase leading-tight tracking-tight text-foreground">{title}</h3>
          </div>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
          <MediaPlaceholder type={mediaType} title={mediaTitle} description="Film/bild laddas upp av tränaren senare." />

          <div className="space-y-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {f.label}
                </span>
                <textarea
                  rows={2}
                  placeholder={f.placeholder}
                  className="mt-1.5 w-full resize-none rounded-sm border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/55 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SetPieceBlock;
