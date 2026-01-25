import { cn } from "@/lib/utils";
import CoachCue from "./CoachCue";

interface TrainingDayProps {
  day: string;
  theme: string;
  focus: string;
  cues: string[];
  isHighlighted?: boolean;
}

const TrainingDay = ({ day, theme, focus, cues, isHighlighted = false }: TrainingDayProps) => {
  return (
    <div className={cn(
      "card-gradient rounded-2xl p-6 border transition-all duration-300",
      isHighlighted 
        ? "border-primary/50 glow-primary" 
        : "border-border hover:border-muted-foreground/50"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider",
          isHighlighted 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          {day}
        </div>
        <h3 className="text-lg font-bold text-foreground">{theme}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{focus}</p>
      
      <div className="flex flex-wrap gap-2">
        {cues.map((cue, index) => (
          <CoachCue key={index} cue={cue} variant={isHighlighted ? "primary" : "muted"} />
        ))}
      </div>
    </div>
  );
};

export default TrainingDay;
