import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Swords,
  Repeat,
  Flame,
  Target,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  X,
  Eye,
  Footprints,
  Crown,
  Box,
  CornerDownLeft,
  Film,
  Play,
  AlertTriangle,
  Activity,
  Wrench,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_EFFECT_LOGIC,
  MAJ_2026_HERO,
  MAJ_2026_NAV_CARDS,
  MAJ_2026_OVRIGT_MEDIA,
  MAJ_2026_PRINCIPLE_MEDIA,
  MAJ_2026_QUICK_ACTIONS,
  type BlockColor,
  type MajBlock,
  type MediaAsset,
} from "@/data/majSpelmodell";
import PrincipleMediaSlot from "@/components/PrincipleMediaSlot";
import FilmLibrary from "@/components/maj/FilmLibrary";
import VeckansPlanering from "@/components/maj2026/VeckansPlanering";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/** Renderar bara children om inloggad användare är admin. Tyst annars. */
const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useIsAdmin();
  if (loading || !isAdmin) return null;
  return <>{children}</>;
};

/* =========================================================================
   COLOR TOKENS — light palette (matchar sajtens default-tema)
   ========================================================================= */

type Tone = BlockColor;

const TONE_BG: Record<Tone, string> = {
  yellow: "bg-amber-50 border-amber-400/70",
  red: "bg-rose-50 border-rose-300/80",
  blue: "bg-sky-50 border-sky-300/80",
  green: "bg-emerald-50 border-emerald-300/80",
  white: "bg-muted border-border",
};

const TONE_DOT: Record<Tone, string> = {
  yellow: "bg-amber-500",
  red: "bg-rose-500",
  blue: "bg-sky-600",
  green: "bg-emerald-600",
  white: "bg-foreground",
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-amber-700",
  red: "text-rose-700",
  blue: "text-sky-700",
  green: "text-emerald-700",
  white: "text-foreground",
};

const BLOCK_ICON: Record<string, typeof Shield> = {
  forsvarsspel: Shield,
  "overgang-anfall": Zap,
  anfallsspel: Swords,
  "overgang-forsvar": Repeat,
  identitet: Flame,
  "fasta-situationer": Target,
};

const BLOCK_EYEBROW: Record<string, string> = {
  forsvarsspel: "När motståndaren har bollen",
  "overgang-anfall": "I sekunden bollen är vår",
  anfallsspel: "När vi har bollen",
  "overgang-forsvar": "I sekunden bollen är deras",
  identitet: "Det här är vi varje match",
  "fasta-situationer": "Stillastående boll = poäng",
};

/* =========================================================================
   SHARED COMPONENTS
   ========================================================================= */

function MediaGrid({ items, columns = 2 }: { items: MediaAsset[]; columns?: 2 | 3 }) {
  const uniqueItems = uniqueMediaItems(items);
  if (uniqueItems.length === 0) return null;
  const cols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 gap-3 ${cols}`}>
      {uniqueItems.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-md border border-border bg-background"
        >
          <div className="bg-black">
            {item.kind === "video" ? (
              <DeferredVideo item={item} />
            ) : (
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="max-h-72 w-full bg-black object-contain"
              />
            )}
          </div>
          <figcaption className="px-4 py-3 text-xs font-bold leading-snug text-foreground/85">
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function uniqueMediaItems(items: MediaAsset[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = mediaIdentityKey(item.src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mediaIdentityKey(src: string) {
  const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) return `youtube:${youtube[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `vimeo:${vimeo[1]}`;
  return src.split("?")[0];
}

function DeferredVideo({ item }: { item: MediaAsset }) {
  const [active, setActive] = useState(false);
  const embedUrl = videoEmbedUrl(item.src);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={item.label}
        className="aspect-video w-full bg-black"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (active) {
    return (
      <video
        src={item.src}
        controls
        autoPlay
        preload="metadata"
        playsInline
        className="aspect-video w-full bg-black"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,hsl(var(--muted))_0%,#050505_78%)] text-left"
      aria-label={`Spela film: ${item.label}`}
    >
      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,194,66,0.16),transparent_42%,rgba(58,111,198,0.16))]" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg transition-transform group-hover:scale-105">
        <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={1.8} />
      </span>
      <span className="absolute bottom-3 left-3 right-3 rounded bg-black/65 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/85">
        Spela film
      </span>
    </button>
  );
}

function videoEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
  if (youtube) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
    });
    return `https://www.youtube-nocookie.com/embed/${youtube[1]}?${params.toString()}`;
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;

  return null;
}

function getBlockMedia(blockId: string): MediaAsset[] {
  const principleGroups = Object.values(MAJ_2026_PRINCIPLE_MEDIA[blockId] ?? {});
  const unique = new Map<string, MediaAsset>();
  for (const items of principleGroups) {
    for (const item of items) {
      if (!unique.has(item.src)) unique.set(item.src, item);
    }
  }
  return Array.from(unique.values());
}

function BlockMediaOverview({ items }: { items: MediaAsset[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8 border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-amber-700" strokeWidth={2.1} />
          <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">
            Matchklipp i blocket
          </h3>
        </div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {items.length} filer
        </p>
      </div>
      <MediaGrid items={items} columns={items.length >= 3 ? 3 : 2} />
    </div>
  );
}

function MediaSlot({ label = "Lägg in film eller bild här", description }: { label?: string; description?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex h-44 w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-card px-4 text-center"
    >
      <div className="flex items-center gap-3 text-foreground/55">
        <Film className="h-5 w-5" strokeWidth={1.6} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em]">{label}</span>
      </div>
      {description && <p className="text-xs text-foreground/45">{description}</p>}
    </div>
  );
}

function DoColumn({
  variant,
  items,
  title,
}: {
  variant: "do" | "dont" | "remember";
  items: string[];
  title: string;
}) {
  const styles = {
    do: {
      border: "border-emerald-300",
      bg: "bg-emerald-50",
      Icon: Check,
      iconClass: "text-emerald-700",
      dotBg: "bg-emerald-600",
      titleClass: "text-emerald-800",
    },
    dont: {
      border: "border-rose-300",
      bg: "bg-rose-50",
      Icon: X,
      iconClass: "text-rose-700",
      dotBg: "bg-rose-500",
      titleClass: "text-rose-800",
    },
    remember: {
      border: "border-amber-300",
      bg: "bg-amber-50",
      Icon: AlertTriangle,
      iconClass: "text-amber-700",
      dotBg: "bg-amber-500",
      titleClass: "text-amber-800",
    },
  }[variant];

  const Icon = styles.Icon;

  return (
    <div className={["rounded-md border p-5", styles.border, styles.bg].join(" ")}>
      <div className="mb-3 flex items-center gap-2.5">
        <Icon className={["h-4 w-4", styles.iconClass].join(" ")} strokeWidth={2.4} />
        <p className={["font-mono text-[11px] font-black uppercase tracking-[0.22em]", styles.titleClass].join(" ")}>
          {title}
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
            <span className={["mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full", styles.dotBg].join(" ")} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================================
   TACTICAL PITCH BASE
   ========================================================================= */

function PitchSurface({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 1000 1500"
      className="h-auto w-full"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pitchSurface" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#143d2a" />
          <stop offset="55%" stopColor="#0d2f20" />
          <stop offset="100%" stopColor="#071d13" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="1500" fill="url(#pitchSurface)" />

      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * 150}
          width="1000"
          height="75"
          fill={i % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.07)"}
        />
      ))}

      <g fill="none" stroke="rgba(220,255,230,0.65)" strokeWidth="5">
        <rect x="70" y="70" width="860" height="1360" />
        <line x1="70" x2="930" y1="750" y2="750" />
        <circle cx="500" cy="750" r="118" />
        <circle cx="500" cy="750" r="8" fill="rgba(220,255,230,0.82)" stroke="none" />
        <rect x="250" y="70" width="500" height="220" />
        <rect x="345" y="70" width="310" height="90" />
        <path d="M 385 290 A 150 150 0 0 0 615 290" />
        <rect x="250" y="1210" width="500" height="220" />
        <rect x="345" y="1340" width="310" height="90" />
        <path d="M 385 1210 A 150 150 0 0 1 615 1210" />
      </g>

      {children}
    </svg>
  );
}

function PlayerDot({
  x,
  y,
  label,
  variant = "own",
}: {
  x: number;
  y: number;
  label: string;
  variant?: "own" | "opp" | "focus";
}) {
  const fill = variant === "opp" ? "#22498f" : variant === "focus" ? "#f5c242" : "#f2f5f4";
  const stroke = variant === "opp" ? "#8ab7ff" : variant === "focus" ? "#fff4b8" : "#dce8e4";
  const textFill = variant === "opp" ? "#fff" : "#0c2018";
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="20" rx="26" ry="9" fill="rgba(0,0,0,0.32)" />
      <circle r="26" fill={fill} stroke={stroke} strokeWidth="5" />
      <text
        y="8"
        textAnchor="middle"
        fontSize="24"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fill={textFill}
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({
  d,
  color = "#f5c242",
  width = 8,
  dashed = false,
  id,
}: {
  d: string;
  color?: string;
  width?: number;
  dashed?: boolean;
  id: string;
}) {
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 12 6 L 0 12 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${id})`}
        strokeDasharray={dashed ? "14 14" : undefined}
      />
    </>
  );
}

/* =========================================================================
   BLOCK-SPECIFIC TACTICAL VISUALS
   ========================================================================= */

function ForsvarPitch() {
  return (
    <PitchSurface label="Försvarsspel — tre korridorer, press på trigger">
      <g>
        <rect x="70" y="70" width="287" height="1360" fill="#cf3a3a" opacity="0.10" />
        <rect x="357" y="70" width="286" height="1360" fill="#f5c242" opacity="0.14" />
        <rect x="643" y="70" width="287" height="1360" fill="#cf3a3a" opacity="0.10" />
        <line x1="357" y1="70" x2="357" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
        <line x1="643" y1="70" x2="643" y2="1430" stroke="rgba(245,194,66,0.45)" strokeWidth="3" strokeDasharray="12 12" />
      </g>

      <g fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="rgba(255,255,255,0.5)" letterSpacing="6">
        <text x="213" y="125" textAnchor="middle">YTTRE</text>
        <text x="500" y="125" textAnchor="middle">CENTRUM</text>
        <text x="787" y="125" textAnchor="middle">YTTRE</text>
      </g>

      <PlayerDot x={500} y={220} label="9" variant="opp" />
      <PlayerDot x={210} y={420} label="11" variant="opp" />
      <PlayerDot x={790} y={420} label="7" variant="opp" />
      <PlayerDot x={350} y={620} label="10" variant="opp" />
      <PlayerDot x={650} y={620} label="8" variant="opp" />
      <g>
        <circle cx={140} cy={520} r="42" fill="rgba(207,58,58,0.18)" stroke="#cf3a3a" strokeWidth="4" />
        <PlayerDot x={140} y={520} label="3" variant="opp" />
      </g>
      <circle cx="140" cy="555" r="11" fill="#f5c242" stroke="#fff" strokeWidth="3" />

      <PlayerDot x={500} y={1280} label="1" />
      <PlayerDot x={240} y={1080} label="2" />
      <PlayerDot x={420} y={1080} label="3" />
      <PlayerDot x={580} y={1080} label="4" />
      <PlayerDot x={760} y={1080} label="5" />
      <PlayerDot x={500} y={900} label="6" />
      <PlayerDot x={340} y={780} label="8" />
      <PlayerDot x={680} y={780} label="10" />
      <PlayerDot x={250} y={620} label="11" variant="focus" />
      <PlayerDot x={500} y={520} label="9" />
      <PlayerDot x={780} y={620} label="7" />

      <Arrow id="ar-forsvar-1" d="M 250 620 Q 200 580 170 540" color="#cf3a3a" width={10} />

      <line x1="340" y1="780" x2="350" y2="620" stroke="rgba(207,58,58,0.45)" strokeWidth="4" strokeDasharray="10 10" />
      <line x1="500" y1="900" x2="500" y2="520" stroke="rgba(207,58,58,0.4)" strokeWidth="3" strokeDasharray="10 10" />
    </PitchSurface>
  );
}

function OvergangAnfallPitch() {
  return (
    <PitchSurface label="Övergång till anfall — diagonal utgång efter bollvinst">
      <circle cx="400" cy="900" r="80" fill="rgba(245,194,66,0.10)" stroke="#f5c242" strokeWidth="4" strokeDasharray="12 8" />
      <text x="400" y="1010" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#f5c242" letterSpacing="4">
        BOLLVINST
      </text>

      <Arrow id="ar-omsta-1" d="M 400 900 Q 600 700 820 360" color="#3a6fc6" width={12} />
      <Arrow id="ar-omsta-2" d="M 320 1080 Q 540 880 800 460" color="#3a6fc6" width={8} dashed />

      <rect x="650" y="280" width="280" height="280" fill="#3a6fc6" opacity="0.18" stroke="#3a6fc6" strokeWidth="3" strokeDasharray="14 10" />
      <text x="790" y="430" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#9cc1ff" letterSpacing="4">
        ASSISTYTA
      </text>

      <PlayerDot x={400} y={900} label="6" variant="focus" />
      <PlayerDot x={320} y={1080} label="8" />
      <PlayerDot x={680} y={1100} label="10" />
      <PlayerDot x={780} y={460} label="7" />
      <PlayerDot x={250} y={520} label="11" />
      <PlayerDot x={500} y={400} label="9" />

      <PlayerDot x={500} y={780} label="10" variant="opp" />
      <PlayerDot x={620} y={620} label="8" variant="opp" />
      <PlayerDot x={400} y={500} label="6" variant="opp" />
    </PitchSurface>
  );
}

function AnfallsspelPitch() {
  return (
    <PitchSurface label="Anfallsspel — kontringsskydd, spela in, korridor, assistyta, box">
      <rect x="70" y="1100" width="860" height="330" fill="#3a6fc6" opacity="0.14" />
      <rect x="70" y="850" width="860" height="250" fill="#3a6fc6" opacity="0.12" />
      <rect x="70" y="600" width="860" height="250" fill="#3a6fc6" opacity="0.10" />
      <rect x="650" y="280" width="280" height="320" fill="#f5c242" opacity="0.16" stroke="#f5c242" strokeWidth="3" strokeDasharray="14 10" />
      <rect x="250" y="70" width="500" height="220" fill="#cf3a3a" opacity="0.16" stroke="#cf3a3a" strokeWidth="3" strokeDasharray="14 10" />

      <g fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="20" letterSpacing="4">
        <text x="90" y="1410" fill="#9cc1ff">1 · KONTRINGSSKYDD</text>
        <text x="90" y="1160" fill="#9cc1ff">2 · SPELA IN</text>
        <text x="90" y="900" fill="#9cc1ff">3 · SPELA UT</text>
        <text x="675" y="270" fill="#f5c242">4 · ASSISTYTA</text>
        <text x="270" y="55" fill="#ff7a7a">5 · FYLL BOXEN</text>
      </g>

      <Arrow id="ar-anfall-1" d="M 500 1270 L 500 1170" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-2" d="M 500 1100 L 500 950" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-3" d="M 500 850 Q 620 700 760 540" color="#3a6fc6" width={10} />
      <Arrow id="ar-anfall-4" d="M 760 380 Q 600 280 500 200" color="#f5c242" width={12} />

      <Arrow id="ar-anfall-r1" d="M 320 600 Q 380 380 460 240" color="#3a6fc6" width={6} dashed />
      <Arrow id="ar-anfall-r2" d="M 680 600 Q 620 380 540 240" color="#3a6fc6" width={6} dashed />

      <PlayerDot x={500} y={1300} label="3" />
      <PlayerDot x={300} y={1170} label="2" />
      <PlayerDot x={700} y={1170} label="4" />
      <PlayerDot x={500} y={950} label="6" />
      <PlayerDot x={320} y={780} label="8" />
      <PlayerDot x={680} y={780} label="10" />
      <PlayerDot x={780} y={460} label="7" variant="focus" />
      <PlayerDot x={500} y={200} label="9" />
      <PlayerDot x={250} y={420} label="11" />
    </PitchSurface>
  );
}

function OvergangForsvarPitch() {
  return (
    <PitchSurface label="Övergång till försvar — återerövring direkt efter bolltapp">
      <circle cx="500" cy="500" r="120" fill="rgba(207,58,58,0.16)" stroke="#cf3a3a" strokeWidth="4" strokeDasharray="14 10" />
      <text x="500" y="370" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22" fill="#ff7a7a" letterSpacing="4">
        BOLLTAPP
      </text>

      <Arrow id="ar-omsta-d-1" d="M 720 620 Q 620 560 540 510" color="#cf3a3a" width={10} />
      <Arrow id="ar-omsta-d-2" d="M 280 620 Q 380 560 460 510" color="#cf3a3a" width={10} />
      <Arrow id="ar-omsta-d-3" d="M 500 720 L 500 540" color="#cf3a3a" width={10} />

      <Arrow id="ar-omsta-d-4" d="M 360 420 L 540 380" color="#cf3a3a" width={5} dashed />
      <Arrow id="ar-omsta-d-5" d="M 640 420 L 460 380" color="#cf3a3a" width={5} dashed />

      <g transform="translate(820 1330)">
        <circle r="78" fill="#0a1f15" stroke="#cf3a3a" strokeWidth="4" />
        <text textAnchor="middle" y="-12" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="48" fill="#fff">5</text>
        <text textAnchor="middle" y="32" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="16" fill="#ff7a7a" letterSpacing="4">SEK</text>
      </g>

      <g>
        <circle cx="500" cy="500" r="38" fill="rgba(207,58,58,0.28)" />
        <PlayerDot x={500} y={500} label="6" variant="opp" />
      </g>
      <PlayerDot x={400} y={420} label="8" variant="opp" />
      <PlayerDot x={600} y={420} label="10" variant="opp" />

      <PlayerDot x={500} y={720} label="6" variant="focus" />
      <PlayerDot x={280} y={620} label="8" />
      <PlayerDot x={720} y={620} label="10" />
      <PlayerDot x={500} y={900} label="3" />
      <PlayerDot x={300} y={1000} label="2" />
      <PlayerDot x={700} y={1000} label="4" />
      <PlayerDot x={500} y={1280} label="1" />
    </PitchSurface>
  );
}

const IDENTITET_CARDS = [
  { title: "Duell", Icon: Swords, color: "#cf3a3a", desc: "Vinn närkampen. Aldrig backa från en boll vi själva sagt är vår." },
  { title: "Andraboll", Icon: Footprints, color: "#f5c242", desc: "Läs duellen innan den händer. Var först på den lösa bollen." },
  { title: "Djupled", Icon: ArrowUpRight, color: "#3a6fc6", desc: "Spring bakom backlinjen. Hota djupet. Öppna ytan framför." },
  { title: "Kroppsspråk", Icon: Crown, color: "#5ec98a", desc: "Bär laget i nästa sekund. Beslut. Energi. Ansvar." },
];

function IdentitetGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {IDENTITET_CARDS.map((c) => {
        const Icon = c.Icon;
        return (
          <div
            key={c.title}
            className="relative overflow-hidden border border-border bg-muted/40 p-6"
            style={{ boxShadow: `inset 0 -4px 0 0 ${c.color}` }}
          >
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center border"
              style={{ borderColor: `${c.color}88`, backgroundColor: `${c.color}1c`, color: c.color }}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-foreground">{c.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/75">{c.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

const FASTA_FIELDS: { title: string; Icon: typeof Shield; hint: string }[] = [
  { title: "Hörnor", Icon: CornerDownLeft, hint: "Anfall + försvar" },
  { title: "Frisparkar", Icon: Target, hint: "Inläggsfrisparkar & direkt" },
  { title: "Inkast", Icon: ArrowRight, hint: "Korta & långa zoner" },
  { title: "Straffstrategi", Icon: Box, hint: "Skyttar & ordning" },
  { title: "Returansvar", Icon: Eye, hint: "Vem täcker andrabollen" },
  { title: "Kontringsskydd", Icon: Shield, hint: "Backlinjens position" },
];

function FastaGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FASTA_FIELDS.map((f) => {
        const Icon = f.Icon;
        return (
          <div
            key={f.title}
            className="border border-dashed border-border bg-card/60 p-5 transition-colors hover:border-emerald-400 hover:bg-emerald-50"
          >
            <div className="mb-3 flex items-center gap-3">
              <Icon className="h-5 w-5 text-emerald-700" strokeWidth={1.8} />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">{f.hint}</p>
            </div>
            <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">{f.title}</h3>
            <div className="border-t border-dashed border-white/15 pt-3">
              <p className="text-xs italic text-foreground/45">Tomt fält — fyll med uppställning, löpningar, ansvar.</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BlockVisual({ id }: { id: string }) {
  if (id === "forsvarsspel") return <ForsvarPitch />;
  if (id === "overgang-anfall") return <OvergangAnfallPitch />;
  if (id === "anfallsspel") return <AnfallsspelPitch />;
  if (id === "overgang-forsvar") return <OvergangForsvarPitch />;
  if (id === "identitet")
    return (
      <div className="p-5">
        <IdentitetGrid />
      </div>
    );
  if (id === "fasta-situationer")
    return (
      <div className="p-5">
        <FastaGrid />
      </div>
    );
  return null;
}

/* =========================================================================
   BLOCK SECTION
   ========================================================================= */

function BlockSection({ block, num }: { block: MajBlock; num: string }) {
  const Icon = BLOCK_ICON[block.id] ?? Shield;
  const eyebrow = BLOCK_EYEBROW[block.id] ?? "";
  const blockMedia = getBlockMedia(block.id);
  return (
    <AccordionItem
      value={block.id}
      id={block.id}
      className="scroll-mt-24 border-t border-border bg-background data-[state=open]:bg-muted/30"
    >
      <AccordionTrigger
        data-testid={`block-trigger-${block.id}`}
        className="container w-full px-4 py-4 hover:no-underline hover:bg-muted/40 md:py-5 [&[data-state=open]>div>div:last-child>svg]:rotate-180"
      >
        <div className="flex w-full items-center justify-between gap-4 text-left">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <span
              className={[
                "font-mono text-[11px] font-black tabular-nums",
                TONE_TEXT[block.accent],
              ].join(" ")}
            >
              {num}
            </span>
            <div
              className={[
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border",
                TONE_BG[block.accent],
              ].join(" ")}
            >
              <Icon className={["h-4 w-4", TONE_TEXT[block.accent]].join(" ")} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight tracking-tight text-foreground md:text-lg">
                {block.title}
              </h2>
              {eyebrow && (
                <p className="mt-0.5 truncate text-xs leading-snug text-muted-foreground">
                  {eyebrow}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 text-muted-foreground">
            {block.principles.length > 0 && (
              <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] sm:inline">
                {block.principles.length} principer
              </span>
            )}
            <ArrowDown className="h-4 w-4 transition-transform" strokeWidth={2.2} />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="overflow-hidden">
        <div className="container pb-16 pt-2 md:pb-20">
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
            {block.kidExplanation}
          </p>

          {/* Spelarinstruktion + Planvy */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className={["h-1.5 w-1.5 rounded-full", TONE_DOT[block.accent]].join(" ")} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-foreground/60">
                  Spelarinstruktion
                </p>
              </div>
              <p className="text-base font-bold leading-snug text-foreground/90">{block.playerInstruction}</p>
            </div>

            <div className="overflow-hidden border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55">
                  Taktisk planvy
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/35">
                  Block {num}
                </p>
              </div>
              <BlockVisual id={block.id} />
            </div>
          </div>

          {/* Media-placeholder */}
          <div className="mb-8">
            <BlockMediaOverview items={blockMedia} />
            <MediaSlot label={block.mediaTitle} description={block.mediaDescription} />
          </div>

          {/* Do / Don't / Remember — title strings MUST match test regex /^gör så här$/i etc */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DoColumn variant="do" title="Gör så här" items={block.doList} />
            <DoColumn variant="dont" title="Gör inte så här" items={block.dontList} />
            <DoColumn variant="remember" title="Kom ihåg" items={[block.remember]} />
          </div>

          {/* Triggers — bara för försvarsspel */}
          {block.id === "forsvarsspel" && (
            <div className="mt-10">
              <TriggersBand />
            </div>
          )}

          {/* Principer — nested rullgardiner, en per princip */}
          {block.principles.length > 0 && (
            <div className="mt-10">
              <div className="mb-3 flex items-center gap-3 px-1">
                <Layers className={["h-4 w-4", TONE_TEXT[block.accent]].join(" ")} strokeWidth={2.2} />
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground">
                  Principer · {block.principles.length}
                </p>
              </div>
              <Accordion type="multiple" className="overflow-hidden rounded-md border border-border bg-card">
                {block.principles.map((p) => (
                  <AccordionItem
                    key={p.id}
                    value={`${block.id}-${p.id}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <AccordionTrigger
                      data-testid={`principle-trigger-${block.id}-${p.id}`}
                      className="px-4 py-3 hover:no-underline hover:bg-muted/40 md:px-5 md:py-3.5"
                    >
                      <div className="flex w-full items-center gap-3 text-left">
                        <span
                          className={[
                            "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                            TONE_DOT[block.accent],
                          ].join(" ")}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold leading-tight text-foreground">
                            {p.label}
                          </p>
                          <p className="mt-0.5 truncate text-xs leading-snug text-muted-foreground">
                            {p.oneLiner}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border bg-background px-4 pb-5 pt-4 md:px-5">
                      {(() => {
                        const staticItems = MAJ_2026_PRINCIPLE_MEDIA[block.id]?.[p.id] ?? [];
                        return staticItems.length > 0 ? (
                          <div className="mb-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <Film className="h-3.5 w-3.5 text-foreground/55" strokeWidth={2} />
                              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55">
                                Filmer & bilder · {staticItems.length}
                              </p>
                            </div>
                            <MediaGrid items={staticItems} />
                          </div>
                        ) : null;
                      })()}
                      <AdminOnly>
                        <PrincipleMediaSlot
                          blockId={block.id}
                          principleId={p.id}
                          principleLabel={p.label}
                          oneLiner={p.oneLiner}
                          hideHeader
                        />
                      </AdminOnly>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-20 pb-16 md:pt-28 md:pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ backgroundImage: "linear-gradient(180deg, transparent 0%, hsl(var(--muted) / 0.8) 100%)" }}
      />

      <div className="container relative">
        <div className="mb-6 inline-flex items-center gap-3 border border-amber-400 bg-card px-3 py-2">
          <span className="h-[2px] w-8 bg-amber-500" aria-hidden="true" />
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">
            {MAJ_2026_HERO.eyebrow} · Spelmodell
          </span>
        </div>

        <h1 className="max-w-5xl text-[2.5rem] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {MAJ_2026_HERO.title}
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/78 md:text-lg">
          Vi <span className="font-bold text-rose-700">försvarar tillsammans</span>, ställer om{" "}
          <span className="font-bold text-amber-700">framåt</span>, attackerar{" "}
          <span className="font-bold text-sky-700">assistytan</span>,{" "}
          <span className="font-bold text-rose-700">återerövrar direkt</span> och visar{" "}
          <span className="font-bold text-amber-700">identitet</span> i varje sekund. Sex block. Inga ursäkter.
        </p>

        {/* Nav cards — anchor links matching the test by name */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {MAJ_2026_NAV_CARDS.map((card) => {
            const block = MAJ_2026_BLOCKS.find((b) => b.id === card.id);
            const accent: Tone = block?.accent ?? "white";
            const Icon = BLOCK_ICON[card.id] ?? Shield;
            return (
              <a
                key={card.id}
                href={`#${card.id}`}
                className="group relative flex flex-col gap-3 border border-border bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-500 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <span className={["font-mono text-[11px] font-black tracking-[0.16em]", TONE_TEXT[accent]].join(" ")}>
                    {card.number}
                  </span>
                  <Icon className={["h-4 w-4", TONE_TEXT[accent]].join(" ")} strokeWidth={2} />
                </div>
                <p className="text-sm font-black uppercase leading-tight tracking-tight text-foreground">{card.label}</p>
                <ArrowDown className="h-4 w-4 text-foreground/30 transition-transform group-hover:translate-y-0.5 group-hover:text-amber-600" strokeWidth={2} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   EFFEKTLOGIK — own dark version, includes texts "Resurser", "Aktiviteter", "Mål", "Effekt"
   ========================================================================= */

const EFFEKT_ICONS = {
  Resurser: Wrench,
  Aktiviteter: Activity,
  Mål: Target,
  Effekt: Sparkles,
} as const;

function EffektlogikStrip() {
  return (
    <section id="effektlogik" className="scroll-mt-24 border-b border-border py-16 md:py-20">
      <div className="container">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Effektlogik</p>
        </div>
        <h2 className="mb-12 max-w-3xl text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
          Från vad vi har — till vad vi blir.
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {MAJ_2026_EFFECT_LOGIC.map((block, i) => {
            const Icon = EFFEKT_ICONS[block.label];
            return (
              <div key={block.label} className="contents">
                <div className="border border-border bg-card p-5">
                  <div className="mb-3 flex items-center gap-2 text-amber-700">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-amber-700">{block.label}</h3>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-foreground/70">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {i < MAJ_2026_EFFECT_LOGIC.length - 1 && (
                  <div className="hidden items-center justify-center md:flex" aria-hidden="true">
                    <ArrowRight className="h-6 w-6 text-amber-700/70" strokeWidth={2.2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SNABBVERSION — "DETTA SKA DU GÖRA PÅ PLANEN"
   ========================================================================= */

const SNABB_TONES: Tone[] = ["red", "yellow", "blue", "red", "yellow", "green"];

function SpelarenSnabbversion() {
  return (
    <section id="snabbversion" className="scroll-mt-24 border-b border-border bg-muted/40 py-16 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Spelarens snabbversion</p>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground md:text-5xl">DETTA SKA DU GÖRA PÅ PLANEN</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-foreground/65">
            Sex skeden. Tre–fyra ord per kommando. Det här är det enda du behöver komma ihåg i 90 minuter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MAJ_2026_QUICK_ACTIONS.map((qa, i) => {
            const tone = SNABB_TONES[i] ?? "white";
            return (
              <div key={qa.scenario} className="border border-border bg-background p-5 transition-colors hover:border-accent/40">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{qa.scenario}</h3>
                  <span className={["inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]", TONE_BG[tone], TONE_TEXT[tone]].join(" ")}>
                    <span className={["h-1.5 w-1.5 rounded-full", TONE_DOT[tone]].join(" ")} />
                    Skede
                  </span>
                </div>
                <ul className="space-y-2">
                  {qa.actions.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className={["mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0", TONE_DOT[tone]].join(" ")} />
                      <span className="text-sm leading-relaxed text-foreground/85">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   TRIGGERS BAND — placed between Försvarsspel and Övergång-anfall
   ========================================================================= */

const TRIGGERS = [
  "Backens första touch tvingar bollen utåt",
  "Bakåtspel från motståndaren",
  "Slarvig 1:a-touch",
  "Tappad rättvändhet hos mottagaren",
  "Passning till svagare fot",
];

function TriggersBand() {
  return (
    <section className="border-b border-border py-8">
      <div className="container">
        <div className="border border-rose-300 bg-rose-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Flame className="h-4 w-4 text-rose-700" strokeWidth={2.2} />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
              Triggers — pressa när du ser detta
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {TRIGGERS.map((t, i) => (
              <li key={t} className="flex items-start gap-3 text-sm text-foreground/85">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-rose-300 bg-rose-100 font-mono text-[10px] font-black text-rose-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PAGE
   ========================================================================= */

const BLOCK_IDS = new Set(MAJ_2026_BLOCKS.map((b) => b.id));

function useHashControlledAccordion() {
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    const focusFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || !BLOCK_IDS.has(hash)) return;
      setOpen((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      // Scrolla efter att Radix har öppnat och innehållet renderats.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };
    focusFromHash();
    window.addEventListener("hashchange", focusFromHash);
    return () => window.removeEventListener("hashchange", focusFromHash);
  }, []);

  return [open, setOpen] as const;
}

const MajSpelmodell = () => {
  const [openBlocks, setOpenBlocks] = useHashControlledAccordion();

  return (
  <div className="relative -mt-px bg-background text-foreground">
    <Hero />
    <VeckansPlanering />
    <EffektlogikStrip />
    <SpelarenSnabbversion />

    <FilmLibrary />

    <Accordion
      type="multiple"
      value={openBlocks}
      onValueChange={setOpenBlocks}
      className="border-t border-border"
    >
      {MAJ_2026_BLOCKS.map((block, i) => (
        <BlockSection key={block.id} block={block} num={String(i + 1).padStart(2, "0")} />
      ))}
    </Accordion>

    {/* Övrigt — filmer/bilder utan koppling till specifik princip */}
    {MAJ_2026_OVRIGT_MEDIA.length > 0 && (
      <section id="ovrigt" className="scroll-mt-24 border-t border-border bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-amber-500" aria-hidden="true" />
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">
              Övrigt
            </p>
          </div>
          <h2 className="mb-4 max-w-3xl text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
            Filmer & bilder utan princip-koppling
          </h2>
          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Material som inte hör till ett specifikt block eller en specifik princip — hero-takes, identifierande klipp och referensbilder. Sortera senare vid behov.
          </p>
          <MediaGrid items={MAJ_2026_OVRIGT_MEDIA} columns={3} />
        </div>
      </section>
    )}

    {/* Closing strip */}
    <section className="border-t border-border bg-muted/40 py-16">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Slut</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
              Sex block. En idé. Ett lag.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#forsvarsspel"
              className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-500 px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-amber-400"
            >
              <ArrowDown className="h-4 w-4" strokeWidth={2.4} />
              Tillbaka till block 01
            </a>
            <Link
              to="/period/1"
              className="inline-flex items-center gap-2 border border-border bg-card px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-foreground transition-colors hover:border-accent hover:text-amber-700"
            >
              Träna det
              <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default MajSpelmodell;
