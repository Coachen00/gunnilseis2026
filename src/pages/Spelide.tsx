import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import TacticalBlock from "@/components/spelide/TacticalBlock";
import IdentityCard from "@/components/spelide/IdentityCard";
import SetPieceBlock from "@/components/spelide/SetPieceBlock";
import { TACTICAL_BLOCKS, IDENTITY_CARDS, SET_PIECES } from "@/data/spelideMaj2026";
import { CalendarDays, Flag } from "lucide-react";

const Spelide = () => {
  return (
    <>
      <PageHero
        eyebrow="Maj 2026"
        title="Så spelar vi fotboll"
        description="En spelare läser den här sidan och vet vad han ska göra på planen. Sex block: fyra skeden, en identitet, en fast situation. Korta verb. Tydliga regler."
      />

      <div className="container pb-section">
        <SectionReveal>
          <Maj2026Banner />
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <QuickNav />
        </SectionReveal>

        <div className="mt-12 space-y-10 md:space-y-14">
          {TACTICAL_BLOCKS.map((block) => (
            <SectionReveal key={block.id} as="div">
              <TacticalBlock {...block}>
                {block.id === "identitet" ? <IdentityCardGrid /> : null}
              </TacticalBlock>
            </SectionReveal>
          ))}

          <SectionReveal>
            <SetPieceSection />
          </SectionReveal>
        </div>
      </div>
    </>
  );
};

/* ── Banner: "Maj 2026" som tydlig sektion-anchor ───────────────── */
const Maj2026Banner = () => (
  <section id="maj-2026" className="scroll-mt-24 overflow-hidden rounded-sm border border-foreground/15 bg-foreground text-background">
    <div className="grid items-stretch md:grid-cols-[auto_1fr_auto]">
      <div className="flex items-center gap-3 border-b border-background/15 p-5 md:border-b-0 md:border-r md:p-7">
        <CalendarDays className="h-5 w-5 text-accent" strokeWidth={1.75} />
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Tidsstämpel</p>
          <p className="mt-0.5 text-lg font-black tracking-tight">Maj 2026</p>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Lagets spelmodell</p>
        <p className="mt-1.5 text-2xl md:text-3xl font-black uppercase leading-[1.05] tracking-tight">
          Så spelar vi fotboll
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-background/75">
          Den här sidan är vårt taktiska kontrollrum. Sex block, klara verb, illustrationer per
          skede. Använd den inför träning, match och videoanalys.
        </p>
      </div>
      <div className="hidden items-center justify-end gap-3 p-7 md:flex">
        <span className="grid h-12 w-12 place-items-center rounded-sm border border-background/20 bg-background/5">
          <Flag className="h-5 w-5 text-accent" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  </section>
);

/* ── Snabbnavigation: hopp till varje block ─────────────────────── */
const QuickNav = () => {
  const items = [
    ...TACTICAL_BLOCKS.map((b) => ({ id: b.id, label: b.phaseLabel, num: b.index })),
    { id: "fasta-situationer", label: "Fasta situationer", num: 6 },
  ];
  return (
    <nav aria-label="Sidans block" className="mt-6 rounded-sm border border-border bg-card p-4 md:p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Block i den här sidan</p>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group flex h-full items-center gap-2.5 rounded-sm border border-transparent bg-muted/40 px-3 py-2.5 transition-all hover:border-accent/40 hover:bg-accent/5"
            >
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-sm border border-border bg-background font-mono text-[11px] font-black tabular text-foreground group-hover:border-accent group-hover:text-accent">
                {String(item.num).padStart(2, "0")}
              </span>
              <span className="text-xs font-bold leading-tight text-foreground group-hover:text-accent">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

/* ── Identitetskort-grid (renderas inom block 5) ────────────────── */
const IdentityCardGrid = () => (
  <div>
    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
      Fyra identitetskort — det här syns oavsett ställning
    </p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {IDENTITY_CARDS.map((card) => (
        <IdentityCard key={card.title} {...card} />
      ))}
    </div>
  </div>
);

/* ── Fasta situationer: block 6 ─────────────────────────────────── */
const SetPieceSection = () => (
  <article id="fasta-situationer" className="scroll-mt-24 rounded-sm border border-border bg-card overflow-hidden">
    <div className="h-1 w-full bg-foreground" />
    <header className="border-b border-border bg-gradient-to-b from-card to-muted/30 px-5 py-6 md:px-8 md:py-7">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-sm border border-foreground/15 bg-foreground/5">
          <Flag className="h-5 w-5 text-foreground" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-black tabular text-muted-foreground">06</span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-foreground">
              Fasta situationer
            </span>
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl font-black uppercase leading-[1.05] tracking-tight text-foreground">
            Varje stillastående boll är en chans att vinna matchen
          </h2>
          <p className="mt-3 max-w-prose text-sm md:text-base leading-relaxed text-muted-foreground">
            Fem typer av fasta situationer. Varje block har plats för film/bild och fyra fält där
            tränaren fyller i rutin, roller, trigger och kom-ihåg.
          </p>
        </div>
      </div>
    </header>

    <div className="grid gap-5 p-5 md:grid-cols-2 md:gap-6 md:p-8">
      {SET_PIECES.map((piece) => (
        <SetPieceBlock key={piece.id} {...piece} />
      ))}
    </div>
  </article>
);

export default Spelide;
