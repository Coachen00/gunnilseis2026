import { Shield, Zap, Swords, RotateCcw } from "lucide-react";

const phases = [
  { icon: Shield, label: "Försvar", sub: "4-3-3 kompakt" },
  { icon: Zap, label: "Omställning", sub: "till anfall" },
  { icon: Swords, label: "Anfall", sub: "3-2-2-3" },
  { icon: RotateCcw, label: "Omställning", sub: "till försvar" },
];

const PhaseFlow = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-3">
    {phases.map((p, i) => (
      <div key={i} className="relative">
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-5 md:p-6 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <p.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">
            Skede {i + 1}
          </div>
          <div className="text-lg font-black tracking-tight">{p.label}</div>
          <div className="text-xs opacity-80 mt-0.5">{p.sub}</div>
        </div>
        {i < phases.length - 1 && (
          <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center text-white/60 text-xl font-bold">
            ›
          </div>
        )}
      </div>
    ))}
  </div>
);

export default PhaseFlow;