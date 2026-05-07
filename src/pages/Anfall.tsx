import PageHero from "@/components/PageHero";
import CuesBlock from "@/components/CuesBlock";
import AttackingPrincipleCard from "@/components/AttackingPrincipleCard";
import { PHASE_CUES } from "@/data/phaseCues";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";
import { MATCH_META } from "@/data/matchplan";

// Veckans anfallsfokus — vilka principer betonar vi inför nästa motståndare.
// Hålls i synk med matchplan FOCUS-bullets så texten blir konsistent.
const WEEKS_FOCUS_PRINCIPLES = ["skydda-mot-kontring", "spela-in", "spela-ut", "fyll-pa-box"] as const;

const Anfall = () => (
  <>
    <PageHero
      eyebrow="Anfall"
      title="Anfallsspel — fem principer"
      description="Vi anfaller alltid i denna ordning: skydda mot kontring, spela in, spela ut, ta med framåt, fyll på i box."
    />

    <div className="container">
      <CuesBlock set={PHASE_CUES.anfall} />

      <div className="mb-8 rounded-xl border border-accent/40 bg-accent/[0.04] p-5">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-accent mb-3">
          Veckans anfallsfokus · {MATCH_META.opponent}
        </div>
        <p className="text-sm md:text-base text-foreground/90 mb-3">
          Vi övar och utvärderar dessa principer extra denna vecka — utifrån vad vi tar med från förra match.
        </p>
        <div className="flex flex-wrap gap-2">
          {WEEKS_FOCUS_PRINCIPLES.map((slug) => {
            const p = ATTACKING_PRINCIPLES.find((x) => x.slug === slug);
            if (!p) return null;
            return (
              <a
                key={slug}
                href={`#${slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-accent/40 bg-background/60 hover:border-accent transition-colors"
              >
                <span className="font-mono font-black text-accent text-xs">
                  {String(p.order).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold">{p.headline}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="mb-12 max-w-3xl border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Fem principer i en sekvens.</span> Princip 1
          är förutsättning för alla andra — utan balans bakom bollen riskerar varje
          framåtspelad bolltapp att kosta mål. Sedan flödar bollen: vi spelar{" "}
          <em>in</em>, vid trångt centralt spelar vi <em>ut</em>, när ytan öppnas
          tar vi den <em>framåt</em>, och i sista tredjedelen <em>fyller</em> vi
          på minst fyra spelare i och runt boxen.
        </p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2 text-xs">
        {ATTACKING_PRINCIPLES.map((p) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card hover:border-accent/60 transition-colors"
          >
            <span className="font-mono font-black text-accent">
              {String(p.order).padStart(2, "0")}
            </span>
            <span className="font-bold">{p.headline}</span>
          </a>
        ))}
      </nav>
    </div>

    <div className="container pb-24 space-y-10">
      {ATTACKING_PRINCIPLES.map((p) => (
        <AttackingPrincipleCard key={p.slug} principle={p} />
      ))}
    </div>
  </>
);

export default Anfall;
