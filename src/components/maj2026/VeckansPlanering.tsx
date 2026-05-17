import { ArrowRight, CalendarDays, Crosshair, Dumbbell, Flag, Shield, Target, Zap } from "lucide-react";
import { VECKANS_PLANERING, type SessionItem, type TacticalFocus } from "@/data/veckansPlanering";

/* ---- Färgtoner — matchar planindelning-spec ----
 * yellow = princip / nyckelaktion
 * red    = press / duell / hot
 * blue   = egen löpning / passningsväg
 * green  = plan / yta / balans
 */

const FOCUS_TONE: Record<TacticalFocus["accent"], { border: string; bg: string; chip: string; text: string; iconBg: string }> = {
  yellow: {
    border: "border-amber-400/70",
    bg: "bg-amber-50",
    chip: "bg-amber-100 text-amber-800 border-amber-300",
    text: "text-amber-800",
    iconBg: "bg-amber-100 text-amber-800",
  },
  red: {
    border: "border-rose-300",
    bg: "bg-rose-50",
    chip: "bg-rose-100 text-rose-800 border-rose-300",
    text: "text-rose-800",
    iconBg: "bg-rose-100 text-rose-800",
  },
  blue: {
    border: "border-sky-300",
    bg: "bg-sky-50",
    chip: "bg-sky-100 text-sky-800 border-sky-300",
    text: "text-sky-800",
    iconBg: "bg-sky-100 text-sky-800",
  },
  green: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-800 border-emerald-300",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100 text-emerald-800",
  },
};

const SESSION_KIND_META = {
  trening: { Icon: Dumbbell, label: "Träning", chip: "border-border bg-card text-foreground" },
  match: { Icon: Flag, label: "Match", chip: "border-amber-400/80 bg-amber-50 text-amber-900" },
  vila: { Icon: CalendarDays, label: "Vila", chip: "border-border bg-muted text-muted-foreground" },
} as const;

function GoalBlock() {
  const goal = VECKANS_PLANERING.goal;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      {/* Vänster: stor rubrik + lead */}
      <div className="rounded-xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-50 to-amber-100/40 p-6 md:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1">
          <Target className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.4} />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-800">
            {goal.eyebrow}
          </span>
        </div>
        <h3 className="mb-3 text-3xl font-black uppercase leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {goal.title}
        </h3>
        <p className="text-base leading-relaxed text-foreground/80 md:text-lg">{goal.subtitle}</p>
      </div>

      {/* Höger: varför — punktlista */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-7">
        <div className="mb-4 flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-amber-700" strokeWidth={2.2} />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-800">
            Varför diagonalen
          </p>
        </div>
        <ul className="space-y-3">
          {goal.why.map((line, i) => (
            <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
              <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border border-amber-300 bg-amber-50 font-mono text-[10px] font-black text-amber-800">
                {i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---- Liten taktisk SVG — visar diagonalen mellan spelytor + pressfälla mot ytterback ---- */
function FocusDiagram() {
  return (
    <svg viewBox="0 0 800 600" className="h-auto w-full" role="img" aria-label="Diagonalpass mellan spelytor + pressfälla mot ytterback">
      <defs>
        <linearGradient id="vp-pitch" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1f6a47" />
          <stop offset="100%" stopColor="#0d2f20" />
        </linearGradient>
        <marker id="vp-arrow-blue" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 12 6 L 0 12 z" fill="#3a6fc6" />
        </marker>
        <marker id="vp-arrow-red" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 12 6 L 0 12 z" fill="#cf3a3a" />
        </marker>
      </defs>

      {/* Pitch */}
      <rect x="0" y="0" width="800" height="600" fill="url(#vp-pitch)" />

      {/* Mowing stripes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * 75}
          width="800"
          height="37.5"
          fill={i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)"}
        />
      ))}

      <g fill="none" stroke="rgba(220,255,230,0.6)" strokeWidth="3">
        <rect x="40" y="40" width="720" height="520" />
        <line x1="400" y1="40" x2="400" y2="560" />
        <circle cx="400" cy="300" r="68" />
        <rect x="40" y="180" width="120" height="240" />
        <rect x="640" y="180" width="120" height="240" />
      </g>

      {/* Spelytor — vågräta zoner */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" letterSpacing="3" fill="rgba(255,255,255,0.55)">
        <line x1="40" y1="450" x2="760" y2="450" stroke="rgba(245,194,66,0.4)" strokeWidth="2" strokeDasharray="6 8" />
        <line x1="40" y1="300" x2="760" y2="300" stroke="rgba(245,194,66,0.4)" strokeWidth="2" strokeDasharray="6 8" />
        <line x1="40" y1="160" x2="760" y2="160" stroke="rgba(245,194,66,0.4)" strokeWidth="2" strokeDasharray="6 8" />
        <text x="48" y="525">UTG&#197;NGSYTA</text>
        <text x="48" y="380">SPELYTA 1</text>
        <text x="48" y="230">SPELYTA 2</text>
        <text x="48" y="100">ASSISTYTA</text>
      </g>

      {/* Motståndarens ytterback med boll (vänster) — RÖD pressfälla */}
      <circle cx="120" cy="395" r="38" fill="rgba(207,58,58,0.18)" stroke="#cf3a3a" strokeWidth="3" strokeDasharray="8 6" />
      <circle cx="120" cy="395" r="20" fill="#22498f" stroke="#8ab7ff" strokeWidth="4" />
      <text x="120" y="402" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#fff">YB</text>
      <circle cx="120" cy="418" r="6" fill="#f5c242" stroke="#fff" strokeWidth="2" />

      {/* Tre röda press-pilar — triangeln */}
      <path d="M 240 380 Q 200 380 165 395" fill="none" stroke="#cf3a3a" strokeWidth="5" markerEnd="url(#vp-arrow-red)" />
      <path d="M 200 470 Q 175 440 150 415" fill="none" stroke="#cf3a3a" strokeWidth="5" markerEnd="url(#vp-arrow-red)" />
      <path d="M 100 320 L 110 380" fill="none" stroke="#cf3a3a" strokeWidth="5" markerEnd="url(#vp-arrow-red)" />

      {/* Vårt lag: forward (anfallare som blockerar mitten), 8a (pressar yb), VYB (täcker upp), MB (steget upp) */}
      <g>
        <circle cx="100" cy="290" r="20" fill="#f2f5f4" stroke="#dce8e4" strokeWidth="4" />
        <text x="100" y="297" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">9</text>
      </g>
      <g>
        <circle cx="260" cy="370" r="20" fill="#f5c242" stroke="#fff4b8" strokeWidth="4" />
        <text x="260" y="377" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">8</text>
      </g>
      <g>
        <circle cx="220" cy="490" r="20" fill="#f2f5f4" stroke="#dce8e4" strokeWidth="4" />
        <text x="220" y="497" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">3</text>
      </g>
      <g>
        <circle cx="350" cy="495" r="20" fill="#f2f5f4" stroke="#dce8e4" strokeWidth="4" />
        <text x="350" y="502" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">4</text>
      </g>

      {/* Bortre 8an (täcker centrum) */}
      <g>
        <circle cx="500" cy="320" r="20" fill="#f2f5f4" stroke="#dce8e4" strokeWidth="4" />
        <text x="500" y="327" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">8</text>
      </g>

      {/* DIAGONAL — blå passningsväg från Spelyta 1 → Assistyta */}
      <path
        d="M 320 380 Q 460 260 660 130"
        fill="none"
        stroke="#3a6fc6"
        strokeWidth="9"
        strokeLinecap="round"
        markerEnd="url(#vp-arrow-blue)"
      />
      <text x="500" y="225" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700" letterSpacing="3" fill="#9cc1ff">
        DIAGONALEN
      </text>

      {/* Mottagare i Assistytan */}
      <g>
        <circle cx="680" cy="120" r="22" fill="#f5c242" stroke="#fff4b8" strokeWidth="4" />
        <text x="680" y="128" textAnchor="middle" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" fill="#0c2018">7</text>
      </g>

      {/* Legend nere */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" letterSpacing="2">
        <rect x="40" y="560" width="720" height="0.5" fill="none" />
        <circle cx="60" cy="585" r="6" fill="#cf3a3a" />
        <text x="75" y="590" fill="rgba(255,255,255,0.75)">PRESS</text>
        <circle cx="170" cy="585" r="6" fill="#3a6fc6" />
        <text x="185" y="590" fill="rgba(255,255,255,0.75)">DIAGONALPASS</text>
        <circle cx="345" cy="585" r="6" fill="#f5c242" />
        <text x="360" y="590" fill="rgba(255,255,255,0.75)">N&#214;DLISARE / FOKUS</text>
      </g>
    </svg>
  );
}

function FocusCard({ focus }: { focus: TacticalFocus }) {
  const tone = FOCUS_TONE[focus.accent];
  return (
    <article className={`rounded-xl border-2 ${tone.border} ${tone.bg} p-6 md:p-7`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md font-mono text-sm font-black ${tone.iconBg}`}>
          {focus.number}
        </span>
        <div>
          <p className={`font-mono text-[10px] font-black uppercase tracking-[0.22em] ${tone.text}`}>
            {focus.category}
          </p>
          <h3 className="mt-0.5 text-xl font-black uppercase leading-tight tracking-tight text-foreground md:text-2xl">
            {focus.title}
          </h3>
        </div>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-foreground/80 md:text-base">{focus.lead}</p>

      <div className="mb-5">
        <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55">
          Så här gör vi
        </p>
        <ul className="space-y-2.5">
          {focus.how.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
              <span className={`mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${tone.iconBg.split(" ")[0]}`} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`rounded-md border px-4 py-3 ${tone.chip}`}>
        <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.22em]">
          Spelarens cue
        </p>
        <p className="text-sm font-bold leading-snug">{focus.playerCue}</p>
      </div>
    </article>
  );
}

function SessionCard({ session }: { session: SessionItem }) {
  const meta = SESSION_KIND_META[session.kind];
  const Icon = meta.Icon;
  const isMatch = session.kind === "match";
  return (
    <article
      className={`rounded-xl border bg-card p-5 transition-shadow hover:shadow-md md:p-6 ${
        isMatch ? "border-amber-400 ring-2 ring-amber-100" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${isMatch ? "text-amber-700" : "text-muted-foreground"}`} strokeWidth={2.2} />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/65">
            {session.day}
            {session.date && <span className="ml-1.5 text-foreground/40">· {session.date}</span>}
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] ${meta.chip}`}>
          {meta.label}
        </span>
      </div>
      <h4 className={`mb-2 text-base font-black uppercase leading-tight tracking-tight ${isMatch ? "text-amber-900" : "text-foreground"} md:text-lg`}>
        {session.headline}
      </h4>
      <p className="mb-4 text-xs leading-relaxed text-foreground/70 md:text-sm">{session.oneLiner}</p>
      <ul className="space-y-1.5">
        {session.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80">
            <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

const VeckansPlanering = () => {
  return (
    <section
      id="veckans-planering"
      className="scroll-mt-24 border-b border-border bg-gradient-to-b from-background to-muted/40 py-14 md:py-20"
    >
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
                Veckans planering
              </p>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {VECKANS_PLANERING.weekLabel}
            </h2>
          </div>
          <a
            href="#veckans-pass"
            className="inline-flex items-center gap-2 self-start rounded-md border border-amber-400 bg-amber-50 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-800 transition-colors hover:bg-amber-100 md:self-end"
          >
            Hoppa till veckans pass
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </a>
        </div>

        {/* Målsättning */}
        <div className="mb-12">
          <GoalBlock />
        </div>

        {/* Två fokus + diagram */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid grid-cols-1 gap-5">
            {VECKANS_PLANERING.focus.map((f) => (
              <FocusCard key={f.number} focus={f} />
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-3 md:p-4">
            <div className="mb-3 flex items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-foreground/60" strokeWidth={2.2} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/60">
                  Veckans bild — diagonalen + pressfällan
                </p>
              </div>
              <Zap className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.2} />
            </div>
            <FocusDiagram />
            <p className="px-2 pt-3 text-xs leading-relaxed text-foreground/65">
              Vänstra triangeln stänger Vardars ytterback. När bollen vinns reser den diagonalt
              över planen — från Spelyta 1 till Assistytan på höger sida, där en löpning väntar.
            </p>
          </div>
        </div>

        {/* Veckans pass */}
        <div id="veckans-pass" className="scroll-mt-24">
          <div className="mb-6 flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-foreground/60" strokeWidth={2.2} />
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-foreground/60">
              Veckans pass · {VECKANS_PLANERING.sessions.length} tillfällen
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {VECKANS_PLANERING.sessions.map((s) => (
              <SessionCard key={s.day} session={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VeckansPlanering;
