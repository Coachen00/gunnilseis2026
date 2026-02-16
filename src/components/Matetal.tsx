import { cn } from "@/lib/utils";

interface MatetalProps {
  className?: string;
}

const Matetal = ({ className }: MatetalProps) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">PPDA</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Spelvändningar</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Inspel till assistytan</span>
      </div>
    </div>
  );
};

export default Matetal;
