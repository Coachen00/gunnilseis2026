import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { AnfallsspelSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlot from "@/components/match/MediaSlot";

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
        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:uppbyggnad:spelbarhet" title="Spelbarhet" description="Uppbyggnad - spelbarhet" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:uppbyggnad:spelavstand" title="Spelavstånd" description="Uppbyggnad - spelavstånd" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:uppbyggnad:spelbredd" title="Spelbredd" description="Uppbyggnad - spelbredd" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:uppbyggnad:speldjup" title="Speldjup" description="Uppbyggnad - speldjup" compact />
        </div>
        <div className="mb-10">
          <PrincipleBlock phase="uppbyggnad" showSource />
        </div>
        <AnfallsspelSection />
      </section>
      <section id="skapa" className="scroll-mt-24">
        <SectionHeader badge="02 · Progression" title="Framspel — progression" subtitle="Vi för bollen framåt med spelvändningar och löpningar i djupled för att bryta motståndarlinjer." />
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:progression:rattvand" title="Rättvänd" description="Progression - rättvänd spelare" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:progression:spelvandning" title="Spelvändning" description="Progression - spelvändning" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:progression:djupled" title="Djupled" description="Progression - djupledslöpning" compact />
        </div>
        <PrincipleBlock phase="progression" showSource />
      </section>
      <section id="avsluta" className="scroll-mt-24">
        <SectionHeader badge="03 · Avsluta" title="Avslut — gör mål" subtitle="Avslut i gyllene zonen med övertal — via assistytan." />
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:avslut:gyllene-zonen" title="Gyllene zonen" description="Avslut - gyllene zonen" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:avslut:assistytan" title="Assistytan" description="Avslut - assistytan" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:anfall:avslut:overtal" title="Övertal" description="Avslut - övertal" compact />
        </div>
        <PrincipleBlock phase="avslut" showSource />
      </section>
    </div>
  </>
);

export default Anfall;
