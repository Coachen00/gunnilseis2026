import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningForsvarSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlot from "@/components/match/MediaSlot";

const OmstallningForsvar = () => (
  <>
    <PageHero
      eyebrow="Omställning till försvar"
      title="Bollförlust → vinn tillbaka"
      description="Vinn tillbaka bollen, hindra spel framåt, förhindra kontring. Forwarden är vår första försvarare."
    />
    <div className="container mb-16">
      <CuesBlock set={PHASE_CUES["omstallning-forsvar"]} />
      <PrincipleBlock phase="omstallning-forsvar" showSource />
    </div>
    <div className="container pb-24 space-y-24">
      <section id="direkt" className="scroll-mt-24">
        <SectionHeader badge="01 · Direkt" title="Direkt motpress" subtitle="De första 5 sekunderna — press med central spelare, minska tid och ytor." />
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:direkt:press" title="Press" description="Direkt motpress - närmaste spelare" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:direkt:stang" title="Stäng vägar" description="Direkt motpress - stäng passningsvägar" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:direkt:atererovring" title="Återerövring" description="Direkt motpress - återerövring" compact />
        </div>
        <OmstallningForsvarSection />
      </section>
      <section id="kontroll" className="scroll-mt-24">
        <SectionHeader badge="02 · Kontroll" title="Tillbaka till kontroll" subtitle="Om återerövring inte sker — flytta ned, centrera, återetablera kompakt block." />
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:kontroll:ned" title="Flytta ned" description="Tillbaka till kontroll - flytta ned" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:kontroll:centrera" title="Centrera" description="Tillbaka till kontroll - centrera" compact />
          <MediaSlot matchId={undefined} slotKey="spelmodell:omstallning-forsvar:kontroll:block" title="Block" description="Tillbaka till kontroll - kompakt block" compact />
        </div>
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            Efter ~5 sekunders misslyckad press: hela laget flyttar ned och centrerar, behåller 4-3-3-formen och återetablerar kompakt block. Vi hindrar enkla utgångar och behåller spel i samma korridor tills pressen kan tändas igen.
          </p>
        </div>
      </section>
    </div>
  </>
);

export default OmstallningForsvar;
