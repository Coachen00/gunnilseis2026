import { cn } from "@/lib/utils";

interface CoachCueProps {
  cue: string;
  variant?: "primary" | "accent" | "muted";
}

const CoachCue = ({ cue, variant = "primary" }: CoachCueProps) => {
  return (
    <div className={cn(
      "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]",
      variant === "accent" 
        ? "bg-accent/15 text-accent border border-accent/30"
        : variant === "muted"
        ? "bg-muted text-muted-foreground border border-border"
        : "bg-primary/10 text-primary border border-primary/20"
    )}>
      "{cue}"
    </div>
  );
};

export default CoachCue;
