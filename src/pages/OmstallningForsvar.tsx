import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { OmstallningForsvarSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import CuesBlock from "@/components/CuesBlock";
import PhaseNav from "@/components/PhaseNav";

const OmstallningForsvar = () => (
  <>
    <PageHero
      eyebrow="Omställning till försvar"
      title="Bollförlust → vinn tillbaka"
      description="Vinn tillbaka bollen, hindra spel framåt, förhindra kontring. Forwarden är vår första försvarare."
    />
    <div className="container mb-16">
      <CuesBlock phaseKey="omstallning-forsvar" />
      <PrincipleBlock phase="omstallning-forsvar" showSource />
    </div>
    <div className="container space-y-24 pb-16">
      <section id="direkt" className="scroll-mt-24">
        <SectionHeader badge="01 · Direkt" title="Direkt motpress" subtitle="De första 5 sekunderna — press med central spelare, minska tid och ytor." />
        <OmstallningForsvarSection />
      </section>
      <section id="kontroll" className="scroll-mt-24">
        <SectionHeader badge="02 · Kontroll" title="Tillbaka till kontroll" subtitle="Om återerövring inte sker — flytta ned, centrera, återetablera kompakt block." />
        <div className="bg-card/85 backdrop-blur-sm rounded-lg p-6 border border-border">
          <p className="text-sm text-foreground/85 leading-relaxed">
            Efter ~5 sekunders misslyckad press: hela laget flyttar ned och centrerar, behåller 4-3-3-formen och återetablerar kompakt block. Vi hindrar enkla utgångar och behåller spel i samma korridor tills pressen kan tändas igen.
          </p>
        </div>
      </section>
    </div>
    <PhaseNav current="/omstallning-forsvar" />
  </>
);

export default OmstallningForsvar;