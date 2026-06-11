import PageHero from "@/components/PageHero";
import FasTrappa from "@/components/FasTrappa";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningForsvarSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlotGroup from "@/components/match/MediaSlotGroup";

const OmstallningForsvar = () => (
  <>
    <PageHero
      eyebrow="Omställning till försvar"
      title="Bollförlust → vinn tillbaka"
      description="Vinn tillbaka bollen, hindra spel framåt, förhindra kontring. Forwarden är vår första försvarare."
    />
    <FasTrappa blockId="overgang-forsvar" />
    <div className="container mb-16">
      <CuesBlock set={PHASE_CUES["omstallning-forsvar"]} />
      <PrincipleBlock phase="omstallning-forsvar" showSource />
    </div>
    <div className="container pb-section space-y-24">
      <section id="direkt" className="scroll-mt-24">
        <SectionHeader badge="01 · Direkt" title="Direkt motpress" subtitle="De första 5 sekunderna — press med central spelare, minska tid och ytor." />
        <MediaSlotGroup
          className="mb-6"
          slots={[
            { slotKey: "spelmodell:omstallning-forsvar:direkt:press", title: "Press", description: "Direkt motpress - närmaste spelare" },
            { slotKey: "spelmodell:omstallning-forsvar:direkt:stang", title: "Stäng vägar", description: "Direkt motpress - stäng passningsvägar" },
            { slotKey: "spelmodell:omstallning-forsvar:direkt:atererovring", title: "Återerövring", description: "Direkt motpress - återerövring" },
          ]}
        />
        <OmstallningForsvarSection />
      </section>
      <section id="kontroll" className="scroll-mt-24">
        <SectionHeader badge="02 · Kontroll" title="Tillbaka till kontroll" subtitle="Om återerövring inte sker — flytta ned, centrera, återetablera kompakt block." />
        <MediaSlotGroup
          className="mb-6"
          slots={[
            { slotKey: "spelmodell:omstallning-forsvar:kontroll:ned", title: "Flytta ned", description: "Tillbaka till kontroll - flytta ned" },
            { slotKey: "spelmodell:omstallning-forsvar:kontroll:centrera", title: "Centrera", description: "Tillbaka till kontroll - centrera" },
            { slotKey: "spelmodell:omstallning-forsvar:kontroll:block", title: "Block", description: "Tillbaka till kontroll - kompakt block" },
          ]}
        />
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            Efter ~5 sekunders misslyckad press: hela laget flyttar ned och centrerar, behåller 4-3-3-formen och återetablerar kompakt block. Vi hindrar enkla utgångar och behåller spel i samma korridor tills pressen kan tändas igen.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningForsvar;
