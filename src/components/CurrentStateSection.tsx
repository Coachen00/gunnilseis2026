import { Swords, Shield, Zap, RotateCcw, type LucideIcon } from "lucide-react";

type Tone = "gold" | "blue" | "green" | "red";

interface MacroPrinciple {
  name: string;
  detail: string;
}

interface MacroPhase {
  num: string;
  label: string;
  oneLiner: string;
  Icon: LucideIcon;
  tone: Tone;
  count: 5 | 3;
  principles: MacroPrinciple[];
}

const TONE: Record<
  Tone,
  { text: string; bgSoft: string; bgSolid: string; border: string; ring: string }
> = {
  gold: {
    text: "text-gunnilse-gold",
    bgSoft: "bg-gunnilse-gold/10",
    bgSolid: "bg-gunnilse-gold",
    border: "border-gunnilse-gold/25",
    ring: "ring-gunnilse-gold/20",
  },
  blue: {
    text: "text-swedish-blue",
    bgSoft: "bg-swedish-blue/10",
    bgSolid: "bg-swedish-blue",
    border: "border-swedish-blue/25",
    ring: "ring-swedish-blue/20",
  },
  green: {
    text: "text-zone-attack",
    bgSoft: "bg-zone-attack/15",
    bgSolid: "bg-zone-attack",
    border: "border-zone-attack/35",
    ring: "ring-zone-attack/25",
  },
  red: {
    text: "text-gunnilse-red",
    bgSoft: "bg-gunnilse-red/10",
    bgSolid: "bg-gunnilse-red",
    border: "border-gunnilse-red/25",
    ring: "ring-gunnilse-red/20",
  },
};

/**
 * Källor:
 *   - matchplan.ts (COHERENCE) — anfallets "gyllene femman" m.fl.
 *   - principles.ts (PHASES)  — förhindra avslut, styr press, omställningar.
 *   - phaseCues.ts (PHASE_CUES) — konkretiserande regler för förklaringstext.
 *
 * Språket är medvetet hållet enkelt så att en F14/F17-spelare följer med.
 */
const PHASES: MacroPhase[] = [
  {
    num: "01",
    label: "Anfall",
    oneLiner: "Vi har bollen — vi vill göra mål.",
    Icon: Swords,
    tone: "gold",
    count: 5,
    principles: [
      { name: "Spelbarhet", detail: "Var alltid spelbar för bollhållaren — visa upp dig." },
      { name: "Avstånd", detail: "Lagom långt mellan oss — inte för nära, inte för långt." },
      { name: "Bredd", detail: "Vi använder hela planens bredd och tvingar dem att täcka allt." },
      { name: "Djup", detail: "Någon hotar alltid bakom deras backlinje." },
      { name: "Övertal", detail: "Avslut i gyllene zonen — alltid med fler spelare än de." },
    ],
  },
  {
    num: "02",
    label: "Försvar",
    oneLiner: "De har bollen — vi vill ta den och förhindra mål.",
    Icon: Shield,
    tone: "blue",
    count: 5,
    principles: [
      { name: "Förhindra avslut i gyllene zonen", detail: "Inget skott från mitten av straffområdet." },
      { name: "Styr pressen åt en sida", detail: "Hela laget jagar åt samma håll — håll kompakt." },
      { name: "Tre korridorer", detail: "Vänster, mitt, höger — vi vet vem som täcker vad." },
      { name: "Splitta planen", detail: "Vi tätar mitten och tvingar dem ut till kanten." },
      { name: "Aldrig på insidan", detail: "Försvararen står alltid mellan motståndaren och målet." },
    ],
  },
  {
    num: "03",
    label: "Omställning till anfall",
    oneLiner: "Vi vann just bollen — snabbt framåt!",
    Icon: Zap,
    tone: "green",
    count: 3,
    principles: [
      { name: "Kontra först", detail: "Direkt efter bollvinst — sök djup eller spelvändning." },
      { name: "Annars uppbyggnad", detail: "Är kontran omöjlig — säkra bollen och bygg upp." },
      { name: "Fyra alternativ", detail: "Ytter, 9:a, spelvändning eller säkra bakåt — välj rätt." },
    ],
  },
  {
    num: "04",
    label: "Omställning till försvar",
    oneLiner: "Vi tappade just bollen — jaga eller blockera!",
    Icon: RotateCcw,
    tone: "red",
    count: 3,
    principles: [
      { name: "Direkt återerövring", detail: "Närmaste spelare pressar boll inom en sekund." },
      { name: "Indirekt återerövring", detail: "Lyckas vi inte — falla ned, centrera, kompakt block." },
      { name: "Forwarden först", detail: "9:an är vår första försvarare — pressar bakåt mot uppbygget." },
    ],
  },
];

const CurrentStateSection = () => {
  return (
    <section id="nulage" className="relative scroll-mt-24 pt-12 md:pt-20 pb-4 md:pb-8">
      {/* Toppsrubrik — egen, prominent, sticker ut */}
      <header className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-6 text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-accent">
          <span className="inline-block w-10 h-px bg-accent" />
          <span>Gunnilse IS · 2026</span>
        </div>

        {/* Standout-titeln */}
        <h1
          className="font-black leading-[0.92] tracking-[-0.05em] text-foreground"
          style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
        >
          <span className="bg-gradient-to-br from-gunnilse-gold via-gunnilse-gold to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_30px_hsl(47_84%_57%/0.25)]">
            Nuläge
          </span>
          <span className="text-accent">.</span>
        </h1>

        <div className="mt-6 md:mt-8 max-w-3xl">
          <p className="text-lg md:text-2xl text-foreground/85 leading-snug font-semibold tracking-tight">
            Så här spelar vi just nu — en gemensam idé i fyra skeden.
          </p>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <span className="font-mono font-bold text-foreground/80">5 + 5 + 3 + 3</span> principer.
            Samma ord från målvakten till anfallaren.
          </p>
        </div>
      </header>

      {/* 2x2 grid med fyra skeden */}
      <div className="grid gap-5 md:gap-6 md:grid-cols-2">
        {PHASES.map((phase) => (
          <PhaseCard key={phase.num} phase={phase} />
        ))}
      </div>

      {/* Räkneverk i fot */}
      <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border pt-6">
        {PHASES.map((phase) => (
          <div key={`count-${phase.num}`} className="flex items-baseline gap-3">
            <span className={`font-mono font-black text-2xl leading-none ${TONE[phase.tone].text}`}>
              {phase.count}
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-muted-foreground leading-tight">
              principer
              <br />
              {phase.label.toLowerCase().replace("omställning till ", "→ ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const PhaseCard = ({ phase }: { phase: MacroPhase }) => {
  const tone = TONE[phase.tone];
  const { Icon } = phase;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border ${tone.border} bg-card/85 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 ${tone.ring}`}
    >
      {/* Färgband överst */}
      <div className={`absolute inset-x-0 top-0 h-1 ${tone.bgSolid}`} aria-hidden="true" />

      {/* Korthuvud */}
      <header className="px-6 md:px-8 pt-8 pb-6 border-b border-border">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className={`flex items-center gap-2.5 mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${tone.text}`}>
              <span className="font-black text-base leading-none tracking-normal">{phase.num}</span>
              <span className="inline-block w-5 h-px bg-current opacity-50" />
              <span>Skede</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-foreground leading-[1.1]">
              {phase.label}
            </h3>
            <p className="mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
              {phase.oneLiner}
            </p>
          </div>
          <div
            className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${tone.bgSoft} ${tone.text}`}
            aria-hidden="true"
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.75} />
          </div>
        </div>
      </header>

      {/* Princip-lista */}
      <ol className="divide-y divide-border">
        {phase.principles.map((p, i) => (
          <li key={p.name} className="flex items-start gap-4 px-6 md:px-8 py-4 md:py-5 transition-colors group-hover:bg-background/30">
            <span
              className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-md text-[11px] font-mono font-black flex items-center justify-center ${tone.bgSoft} ${tone.text}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] md:text-base font-bold tracking-[-0.01em] text-foreground leading-snug">
                {p.name}
              </p>
              <p className="mt-1 text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                {p.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
};

export default CurrentStateSection;
