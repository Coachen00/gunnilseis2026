import PageHero from "@/components/PageHero";
import CuesBlock from "@/components/CuesBlock";
import AttackingPrincipleCard from "@/components/AttackingPrincipleCard";
import { PHASE_CUES } from "@/data/phaseCues";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";

const Anfall = () => (
  <>
    <PageHero
      eyebrow="Anfall"
      title="Anfallsspel — fem principer"
      description="Vi anfaller alltid i denna ordning: skydda mot kontring, spela in, spela ut, ta med framåt, fyll på i box."
    />

    <div className="container">
      <CuesBlock set={PHASE_CUES.anfall} />

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
