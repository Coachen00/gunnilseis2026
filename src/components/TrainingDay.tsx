import { cn } from "@/lib/utils";
import CoachCue from "./CoachCue";
import TrainingVideo from "./TrainingVideo";

export interface TrainingVideoItem {
  title: string;
  url: string;
  duration?: string;
}

interface TrainingDayProps {
  day: string;
  theme: string;
  focus: string;
  cues: string[];
  videos?: TrainingVideoItem[];
  isHighlighted?: boolean;
}

const TrainingDay = ({ day, theme, focus, cues, videos = [], isHighlighted = false }: TrainingDayProps) => {
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
      
      {/* Videos section */}
      {videos.length > 0 && (
        <div className="mb-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-0.5 bg-primary rounded-full" />
            Övningsfilmer
          </h4>
          <div className="grid gap-3">
            {videos.map((video, index) => (
              <TrainingVideo 
                key={index}
                title={video.title}
                url={video.url}
                duration={video.duration}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {cues.map((cue, index) => (
          <CoachCue key={index} cue={cue} variant={isHighlighted ? "primary" : "muted"} />
        ))}
      </div>
    </div>
  );
};

export default TrainingDay;
