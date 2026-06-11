import PageHero from "@/components/PageHero";
import FasTrappa from "@/components/FasTrappa";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningAnfallSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlotGroup from "@/components/match/MediaSlotGroup";

const OmstallningAnfall = () => (
  <>
    <PageHero
      eyebrow="Omställning till anfall"
      title="Bollvinst → utnyttja obalansen"
      description="Snabba omställningspass eller spelvändningar — utnyttja motståndarens obalans. Press- och brytteknik skapar offensiva omställningar."
    />
    <FasTrappa blockId="overgang-anfall" />
    <div className="container mb-16">
      <CuesBlock set={PHASE_CUES["omstallning-anfall"]} />
      <PrincipleBlock phase="omstallning-anfall" showSource />
    </div>
    <div className="container pb-section space-y-24">
      <section id="kontring" className="scroll-mt-24">
        <SectionHeader badge="01 · Kontring" title="Direkt kontring" subtitle="Rättvänd spelare → spelvändning eller djupledspass → full fart mot gyllene zonen." />
        <MediaSlotGroup
          className="mb-6"
          slots={[
            { slotKey: "spelmodell:omstallning-anfall:kontring:rattvand", title: "Rättvänd", description: "Kontring - rättvänd spelare" },
            { slotKey: "spelmodell:omstallning-anfall:kontring:djupled", title: "Djupled", description: "Kontring - djupledspass" },
            { slotKey: "spelmodell:omstallning-anfall:kontring:gyllene-zonen", title: "Gyllene zonen", description: "Kontring - attackera gyllene zonen" },
          ]}
        />
        <OmstallningAnfallSection />
      </section>
      <section id="uppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="02 · Uppbyggnad" title="Starta speluppbyggnad" subtitle="Om kontring inte är möjlig — säkra bollen, etablera de fyra grundförutsättningarna och bygg lugnt." />
        <MediaSlotGroup
          className="mb-6"
          slots={[
            { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:sakra", title: "Säkra boll", description: "Starta uppbyggnad - säkra första passningen" },
            { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:bredd", title: "Bredd", description: "Starta uppbyggnad - etablera bredd" },
            { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:kontroll", title: "Kontroll", description: "Starta uppbyggnad - kontroll" },
          ]}
        />
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            När bollvinst sker djupt i egen halva eller mot organiserat motstånd: säkra första passningen, etablera <em>spelbarhet, spelavstånd, spelbredd och speldjup</em> — och påbörja uppbyggnad enligt principerna i <strong>Uppbyggnadsspel</strong>.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningAnfall;
