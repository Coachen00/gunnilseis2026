import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IdentityCardProps {
  label: string;
  title: string;
  Icon: LucideIcon;
  description: string;
  cue: string;
  tone?: "accent" | "primary" | "destructive" | "success";
}

const TONE: Record<NonNullable<IdentityCardProps["tone"]>, { text: string; border: string; bg: string; bar: string }> = {
  accent: { text: "text-accent", border: "border-accent/30", bg: "bg-accent/8", bar: "bg-accent" },
  primary: { text: "text-swedish-blue", border: "border-swedish-blue/30", bg: "bg-swedish-blue/8", bar: "bg-swedish-blue" },
  destructive: { text: "text-destructive", border: "border-destructive/30", bg: "bg-destructive/8", bar: "bg-destructive" },
  success: { text: "text-zone-attack", border: "border-zone-attack/30", bg: "bg-zone-attack/8", bar: "bg-zone-attack" },
};

const IdentityCard = ({ label, title, Icon, description, cue, tone = "accent" }: IdentityCardProps) => {
  const t = TONE[tone];
  return (
    <article className={cn("group relative overflow-hidden rounded-sm border bg-card p-5 transition-all duration-200 hover:-translate-y-px", t.border)}>
      <div className={cn("absolute inset-x-0 top-0 h-0.5", t.bar)} />
      <div className="flex items-center gap-3">
        <div className={cn("grid h-9 w-9 place-items-center rounded-sm border", t.border, t.bg)}>
          <Icon className={cn("h-4 w-4", t.text)} strokeWidth={1.75} />
        </div>
        <p className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.22em]", t.text)}>{label}</p>
      </div>
      <h3 className="mt-4 text-xl font-black leading-tight tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-5 border-t border-border pt-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Cue</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{cue}</p>
      </div>
    </article>
  );
};

export default IdentityCard;
