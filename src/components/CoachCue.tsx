import { cn } from "@/lib/utils";

interface CoachCueProps {
  cue: string;
  variant?: "primary" | "accent" | "muted";
}

const CoachCue = ({ cue, variant = "primary" }: CoachCueProps) => {
  return (
    <div className={cn(
      "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105",
      variant === "accent" 
        ? "bg-accent text-accent-foreground border border-accent" 
        : variant === "muted"
        ? "bg-white text-muted-foreground border border-border"
        : "bg-primary text-primary-foreground border border-primary"
    )}>
      "{cue}"
    </div>
  );
};

export default CoachCue;
