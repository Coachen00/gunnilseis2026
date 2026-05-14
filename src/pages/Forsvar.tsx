import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { ForsvarsspelSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import SectionReveal from "@/components/SectionReveal";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlot from "@/components/match/MediaSlot";

const Forsvar = () => (
  <>
    <PageHero
      eyebrow="Försvar"
      title="Försvarsspel"
      description="Vi förhindrar avslut i gyllene zonen genom positionering, press och markering — tre höjder, samma logik."
    />
    <div className="container">
      <SectionReveal>
        <CuesBlock set={PHASE_CUES.forsvar} />
      </SectionReveal>
      <SectionReveal>
        <div className="max-w-3xl mb-16 border-l-2 border-accent pl-6">
          <p className="text-base md:text-lg text-foreground/85 leading-relaxed">
            <span className="font-bold">En princip — tre höjder.</span> Oavsett om vi pressar högt, står medelhögt eller faller lågt så är målet detsamma: förhindra avslut i gyllene zonen. Vi styr pressen åt en sida, håller kompakt form och vinner andrabollar tillsammans.
          </p>
        </div>
      </SectionReveal>
      <SectionReveal>
        <div className="mb-16">
          <PrincipleBlock phase="forsvar" showSource />
        </div>
      </SectionReveal>
    </div>
    <div className="container pb-24 space-y-24">
      <SectionReveal as="section">
      <section id="hogt" className="scroll-mt-24">
        <SectionHeader badge="01 · Högt" title="Högt försvar" subtitle="Press hög upp i plan — trigger på deras vänsterback." />
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <MediaSlot slotKey="spelmodell:forsvar:hogt:press" title="Press" description="Högt försvar - press" compact />
          <MediaSlot slotKey="spelmodell:forsvar:hogt:styrning" title="Styrning" description="Högt försvar - styr pressen" compact />
          <MediaSlot slotKey="spelmodell:forsvar:hogt:andraboll" title="Andraboll" description="Högt försvar - andrabollar" compact />
        </div>
        <ForsvarsspelSection />
      </section>
      </SectionReveal>
      <SectionReveal as="section">
      <section id="medel" className="scroll-mt-24">
        <SectionHeader badge="02 · Medel" title="Medelhögt försvar" subtitle="Block runt mittlinjen — stäng inre korridorer, tvinga utåt." />
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <MediaSlot slotKey="spelmodell:forsvar:medel:block" title="Block" description="Medelhögt försvar - block" compact />
          <MediaSlot slotKey="spelmodell:forsvar:medel:korridor" title="Korridor" description="Medelhögt försvar - stäng inre korridor" compact />
          <MediaSlot slotKey="spelmodell:forsvar:medel:trigger" title="Trigger" description="Medelhögt försvar - press-trigger" compact />
        </div>
        <div className="bg-card rounded-sm p-6 border border-border text-sm text-foreground/85 leading-relaxed">
          Block runt mittlinjen. Vi styr pressen åt en sida via överflyttning och centrering, stänger inre korridorer och tvingar bollen utåt. Triggers: passning bakåt, tung mottagning, eller motståndaren riktad mot egen kort sida.
        </div>
      </section>
      </SectionReveal>
      <SectionReveal as="section">
      <section id="lagt" className="scroll-mt-24">
        <SectionHeader badge="03 · Lågt" title="Lågt försvar" subtitle="Lågt block nära egen box — kompakthet, andraboll och kontringsskydd." />
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <MediaSlot slotKey="spelmodell:forsvar:lagt:box" title="Box" description="Lågt försvar - box" compact />
          <MediaSlot slotKey="spelmodell:forsvar:lagt:markering" title="Markering" description="Lågt försvar - markering" compact />
          <MediaSlot slotKey="spelmodell:forsvar:lagt:kontringsskydd" title="Kontringsskydd" description="Lågt försvar - kontringsskydd" compact />
        </div>
        <div className="bg-card rounded-sm p-6 border border-border text-sm text-foreground/85 leading-relaxed">
          Lågt block nära egen box. Korrekt positionering, tät markering på spelare i gyllene zonen, blockera avslutsytor. Trigger för att pressa upp igen: bollen bakåt till deras backlinje + vår 9:a närmast bollen.
        </div>
      </section>
      </SectionReveal>
    </div>
  </>
);

export default Forsvar;
