import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningAnfallSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import PhaseNav from "@/components/PhaseNav";

const OmstallningAnfall = () => (
  <>
    <PageHero
      eyebrow="Omställning till anfall"
      title="Bollvinst → utnyttja obalansen"
      description="Snabba omställningspass eller spelvändningar — utnyttja motståndarens obalans. Press- och brytteknik skapar offensiva omställningar."
    />
    <div className="container mb-16">
      <CuesBlock phaseKey="omstallning-anfall" />
      <PrincipleBlock phase="omstallning-anfall" showSource />
    </div>
    <div className="container space-y-24 pb-16">
      <section id="kontring" className="scroll-mt-24">
        <SectionHeader badge="01 · Kontring" title="Direkt kontring" subtitle="Rättvänd spelare → spelvändning eller djupledspass → full fart mot gyllene zonen." />
        <OmstallningAnfallSection />
      </section>
      <section id="uppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="02 · Uppbyggnad" title="Starta speluppbyggnad" subtitle="Om kontring inte är möjlig — säkra bollen, etablera de fyra grundförutsättningarna och bygg lugnt." />
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            När bollvinst sker djupt i egen halva eller mot organiserat motstånd: säkra första passningen, etablera <em>spelbarhet, spelavstånd, spelbredd och speldjup</em> — och påbörja uppbyggnad enligt principerna i <strong>Uppbyggnadsspel</strong>.
          </p>
        </div>
      </section>
    </div>
    <PhaseNav current="/omstallning-anfall" />
  </>
);

export default OmstallningAnfall;