import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningAnfallSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlot from "@/components/match/MediaSlot";

const OmstallningAnfall = () => (
  <>
    <PageHero
      eyebrow="Omställning till anfall"
      title="Bollvinst → utnyttja obalansen"
      description="Snabba omställningspass eller spelvändningar — utnyttja motståndarens obalans. Press- och brytteknik skapar offensiva omställningar."
    />
    <div className="container mb-16">
      <CuesBlock set={PHASE_CUES["omstallning-anfall"]} />
      <PrincipleBlock phase="omstallning-anfall" showSource />
    </div>
    <div className="container pb-24 space-y-24">
      <section id="kontring" className="scroll-mt-24">
        <SectionHeader badge="01 · Kontring" title="Direkt kontring" subtitle="Rättvänd spelare → spelvändning eller djupledspass → full fart mot gyllene zonen." />
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:kontring:rattvand" title="Rättvänd" description="Kontring - rättvänd spelare" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:kontring:djupled" title="Djupled" description="Kontring - djupledspass" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:kontring:gyllene-zonen" title="Gyllene zonen" description="Kontring - attackera gyllene zonen" compact />
        </div>
        <OmstallningAnfallSection />
      </section>
      <section id="uppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="02 · Uppbyggnad" title="Starta speluppbyggnad" subtitle="Om kontring inte är möjlig — säkra bollen, etablera de fyra grundförutsättningarna och bygg lugnt." />
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:uppbyggnad:sakra" title="Säkra boll" description="Starta uppbyggnad - säkra första passningen" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:uppbyggnad:bredd" title="Bredd" description="Starta uppbyggnad - etablera bredd" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-anfall:uppbyggnad:kontroll" title="Kontroll" description="Starta uppbyggnad - kontroll" compact />
        </div>
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            När bollvinst sker djupt i egen halva eller mot organiserat motstånd: säkra första passningen, etablera <em>spelbarhet, spelavstånd, spelbredd och speldjup</em> — och påbörja uppbyggnad enligt principerna i <strong>Uppbyggnadsspel</strong>.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningAnfall;
