import { ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SectionReveal from "@/components/SectionReveal";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import EffectLogic from "@/components/period/EffectLogicBlock";
import { cn } from "@/lib/utils";
import {
  MAJ_2026_BLOCKS,
  MAJ_2026_EFFECT_LOGIC,
  MAJ_2026_HERO,
  MAJ_2026_NAV_CARDS,
  MAJ_2026_QUICK_ACTIONS,
  type BlockColor,
  type MajBlock,
} from "@/data/majSpelmodell";

const ACCENT_RING: Record<BlockColor, string> = {
  red: "border-destructive/60 hover:border-destructive shadow-[0_0_0_1px_hsl(var(--destructive)/0.15)]",
  blue: "border-swedish-blue/60 hover:border-swedish-blue",
  yellow: "border-accent/60 hover:border-accent",
  green: "border-pitch/60 hover:border-pitch",
  white: "border-border hover:border-foreground",
};

const ACCENT_TEXT: Record<BlockColor, string> = {
  red: "text-destructive",
  blue: "text-swedish-blue",
  yellow: "text-accent",
  green: "text-pitch",
  white: "text-foreground",
};

const ACCENT_BG: Record<BlockColor, string> = {
  red: "bg-destructive/10",
  blue: "bg-swedish-blue/10",
  yellow: "bg-accent/10",
  green: "bg-pitch/10",
  white: "bg-card",
};

const NavCardGrid = () => (
  <SectionReveal>
    <div className="container -mt-6 pb-section-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MAJ_2026_NAV_CARDS.map((card) => (
          <a
            key={card.id}
            href={`#${card.id}`}
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card/60 px-5 py-4 transition-all duration-200 hover:-translate-y-px hover:border-accent hover:bg-card hover:shadow-[0_8px_24px_-12px_hsl(0_0%_0%/0.35)]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                {card.number}
              </span>
              <span className="truncate text-base font-bold tracking-tight text-foreground">
                {card.label}
              </span>
            </div>
            <ArrowRight
              className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
              strokeWidth={2}
            />
          </a>
        ))}
      </div>
    </div>
  </SectionReveal>
);

const QuickActionsSection = () => (
  <SectionReveal as="section">
    <section id="snabbversion" className="scroll-mt-24">
      <SectionHeader
        badge="Snabbversion för spelare"
        title="DETTA SKA DU GÖRA PÅ PLANEN"
        subtitle="Sex situationer — vad du gör i varje. Inget annat behöver du komma ihåg."
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {MAJ_2026_QUICK_ACTIONS.map((qa) => (
          <li
            key={qa.scenario}
            className="rounded-lg border border-border bg-card/60 p-5"
          >
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
              {qa.scenario}
            </p>
            <p className="mt-2 text-base font-bold leading-snug text-foreground">
              {qa.actions.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  </SectionReveal>
);

const TacticIllustration = ({ caption, accent }: { caption: string; accent: BlockColor }) => (
  <div className={cn("rounded-lg border bg-pitch/20 p-4", ACCENT_RING[accent])}>
    <svg
      viewBox="0 0 320 200"
      className="h-auto w-full rounded-md bg-pitch"
      role="img"
      aria-label={caption}
    >
      <rect x="2" y="2" width="316" height="196" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1.5" />
      <line x1="160" y1="2" x2="160" y2="198" stroke="hsl(var(--pitch-lines))" strokeWidth="1.5" />
      <circle cx="160" cy="100" r="22" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1.5" />
      <rect x="2" y="62" width="36" height="76" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1.5" />
      <rect x="282" y="62" width="36" height="76" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="1.5" />
      <rect x="220" y="40" width="98" height="120" fill="hsl(var(--accent) / 0.15)" stroke="hsl(var(--accent))" strokeDasharray="4 3" strokeWidth="1.2" />
      <text x="269" y="105" textAnchor="middle" className="fill-accent" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        ASSIST
      </text>
    </svg>
    <p className="mt-2 text-xs leading-snug text-muted-foreground">{caption}</p>
  </div>
);

const BlockSection = ({ block }: { block: MajBlock }) => (
  <SectionReveal as="section">
    <section
      id={block.id}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-card/40 p-6 md:p-10",
        ACCENT_RING[block.accent]
      )}
    >
      <header className="mb-8 flex items-start gap-4">
        <span
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md font-mono text-base font-black tracking-[0.05em]",
            ACCENT_BG[block.accent],
            ACCENT_TEXT[block.accent]
          )}
        >
          {block.number}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "font-mono text-[11px] font-black uppercase tracking-[0.22em]",
              ACCENT_TEXT[block.accent]
            )}
          >
            Block {block.number}
          </p>
          <h2 className="mt-1 text-3xl font-black leading-[1.05] tracking-tight text-foreground md:text-4xl">
            {block.title}
          </h2>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Förklaring
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground">
              {block.kidExplanation}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Spelarinstruktion
            </p>
            <p className="mt-2 text-base font-semibold leading-snug text-foreground">
              {block.playerInstruction}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-pitch/40 bg-pitch/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-pitch">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                  Gör så här
                </p>
              </div>
              <ul className="space-y-1.5 text-sm leading-snug text-foreground">
                {block.doList.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-pitch" aria-hidden>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-destructive">
                <XCircle className="h-4 w-4" strokeWidth={2} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                  Gör inte så här
                </p>
              </div>
              <ul className="space-y-1.5 text-sm leading-snug text-foreground">
                {block.dontList.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-destructive" aria-hidden>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <MediaPlaceholder
            type="video"
            title={block.mediaTitle}
            description={block.mediaDescription}
          />
          <TacticIllustration caption={block.illustrationCaption} accent={block.accent} />
          <div
            className={cn(
              "rounded-lg border p-4",
              ACCENT_RING[block.accent],
              ACCENT_BG[block.accent]
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className={cn("h-4 w-4", ACCENT_TEXT[block.accent])} strokeWidth={2} />
              <p
                className={cn(
                  "font-mono text-[10px] font-black uppercase tracking-[0.22em]",
                  ACCENT_TEXT[block.accent]
                )}
              >
                Kom ihåg
              </p>
            </div>
            <p className="text-base font-bold leading-snug text-foreground">
              {block.remember}
            </p>
          </div>
        </div>
      </div>
    </section>
  </SectionReveal>
);

const MajSpelmodell = () => (
  <>
    <PageHero
      eyebrow={MAJ_2026_HERO.eyebrow}
      title={MAJ_2026_HERO.title}
      description={MAJ_2026_HERO.description}
    />
    <NavCardGrid />

    <div className="container pb-section space-y-20 md:space-y-24">
      <SectionReveal as="section">
        <section id="effektlogik" className="scroll-mt-24">
          <SectionHeader
            badge="Effektlogik"
            title="Från resurs till effekt på planen"
            subtitle="Vad vi har, vad vi gör, vad vi vill nå, och vad det ger för effekt."
          />
          <EffectLogic blocks={MAJ_2026_EFFECT_LOGIC} />
        </section>
      </SectionReveal>

      <QuickActionsSection />

      <div className="space-y-12">
        {MAJ_2026_BLOCKS.map((block) => (
          <BlockSection key={block.id} block={block} />
        ))}
      </div>
    </div>
  </>
);

export default MajSpelmodell;
