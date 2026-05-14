import PageHero from "@/components/PageHero";
import MediaSlot from "@/components/match/MediaSlot";
import {
  RollerSection,
  MatchExempelSection,
  MatchtruppSection,
  KvalitetSection,
} from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import SectionHeader from "@/components/SectionHeader";

const Roller = () => (
  <>
    <PageHero eyebrow="Roller & Trupp" title="Roller, exempel och matchtrupp" description="Vad varje position gör, hur principerna ser ut i match, och dagens trupp." />
    <div className="container pb-24 space-y-24">
      <RollerSection />
      <section id="malvakt" className="scroll-mt-24">
        <SectionHeader
          badge="Målvakten"
          title="Spelbar i uppbyggnad — sista försvarare i försvarsspel"
          subtitle="Målvakten är en uppbyggnadsspelare och en kommunicerande sista försvarare."
        />
        <PrincipleBlock phase="malvakt" showSource />
      </section>
      <MatchExempelSection />
      <section id="rollklipp" className="scroll-mt-24">
        <SectionHeader
          badge="Rollklipp"
          title="Filmer och bilder kopplade till roller"
          subtitle="Tre fasta platser för klipp och bilder som visar ansvar, positioner och kroppsspråk i rollen."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <MediaSlot
            slotKey="spelmodell:roller:mittfalt:ansvar"
            title="Mittfält - ansvar"
            captionPlaceholder="Beskriv ansvar, avstånd eller beslut i sekvensen..."
          />
          <MediaSlot
            slotKey="spelmodell:roller:mohammed"
            title="Rollsekvens"
            captionPlaceholder="Beskriv rollen och vad spelaren gör..."
          />
          <MediaSlot
            slotKey="spelmodell:roller:bildsekvens"
            title="Bildsekvens"
            captionPlaceholder="Beskriv vad bilden förklarar..."
          />
        </div>
      </section>
      <MatchtruppSection />
      <KvalitetSection />
    </div>
  </>
);

export default Roller;
