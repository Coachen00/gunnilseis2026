import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image, Link } from "lucide-react";

interface StepData {
  label: string;
  fieldLabel: string;
  fieldPlaceholder: string;
}

const steps: StepData[] = [
  { label: "Situation", fieldLabel: "Matchminut", fieldPlaceholder: "t.ex. 34'" },
  { label: "Beslut", fieldLabel: "Vad gör vi?", fieldPlaceholder: "t.ex. Spelvändning via 6:an" },
  { label: "Resultat", fieldLabel: "Vad blev effekten?", fieldPlaceholder: "t.ex. Cutback → mål" },
];

const MatchExampleTimeline = () => {
  const [values, setValues] = useState(["", "", ""]);
  const [urls, setUrls] = useState(["", "", ""]);

  const updateValue = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    setValues(next);
  };

  const updateUrl = (i: number, v: string) => {
    const next = [...urls];
    next[i] = v;
    setUrls(next);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {steps.map((step, i) => (
        <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">{step.label}</h4>
          </div>
          <input
            type="text"
            value={values[i]}
            onChange={(e) => updateValue(i, e.target.value)}
            placeholder={step.fieldPlaceholder}
            className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 mb-3 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <label className="text-xs text-muted-foreground font-medium">{step.fieldLabel}</label>
          
          <div className="flex items-center gap-2 mt-3">
            <Link className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <input
              type="url"
              value={urls[i]}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder="Bildlänk"
              className="flex-1 text-xs bg-muted/50 border border-border rounded-lg px-2 py-1.5 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {urls[i].trim() ? (
            <img src={urls[i]} alt={step.label} loading="lazy" decoding="async" className="w-full h-24 object-cover rounded-lg border border-border mt-2" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-20 rounded-lg bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center gap-1 mt-2">
              <Image className="w-4 h-4 text-muted-foreground/40" />
              <span className="text-[10px] text-muted-foreground/60">Klistra in bildlänk</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MatchExampleTimeline;
