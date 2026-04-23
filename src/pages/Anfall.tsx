import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { AnfallsspelSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";

const Anfall = () => (
  <>
    <PageHero
      eyebrow="Anfall"
      title="Anfallsspel"
      description="Tre skeden — uppbyggnad, progression, avslut. Vi söker rättvänd spelare, vänder spelet och avslutar i gyllene zonen."
    />
    <div className="container">
      <CuesBlock set={PHASE_CUES.anfall} />
      <div className="max-w-3xl mb-16 border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Tre skeden, samma logik.</span> Vi maximerar de fyra grundförutsättningarna — <em>spelbarhet, spelavstånd, spelbredd, speldjup</em> — i uppbyggnaden, söker rättvänd spelare i progressionen, och avslutar med övertal i gyllene zonen via assistytan.
        </p>
      </div>
    </div>
    <div className="container pb-24 space-y-24">
      <section id="speluppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="01 · Uppbyggnad" title="Uppbyggnadsspel" subtitle="Vi behåller bollen genom spelbarhet, spelavstånd, spelbredd och speldjup." />
        <div className="mb-10">
          <PrincipleBlock phase="uppbyggnad" showSource />
        </div>
        <AnfallsspelSection />
      </section>
      <section id="skapa" className="scroll-mt-24">
        <SectionHeader badge="02 · Progression" title="Framspel — progression" subtitle="Vi för bollen framåt med spelvändningar och löpningar i djupled för att bryta motståndarlinjer." />
        <PrincipleBlock phase="progression" showSource />
      </section>
      <section id="avsluta" className="scroll-mt-24">
        <SectionHeader badge="03 · Avsluta" title="Avslut — gör mål" subtitle="Avslut i gyllene zonen med övertal — via assistytan." />
        <PrincipleBlock phase="avslut" showSource />
      </section>
    </div>
  </>
);

export default Anfall;
