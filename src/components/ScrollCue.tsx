import { ChevronDown } from "lucide-react";

const ScrollCue = ({ label = "Scrolla" }: { label?: string }) => (
  <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce-slow">
    <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{label}</span>
    <ChevronDown className="w-5 h-5 text-accent" />
  </div>
);

export default ScrollCue;