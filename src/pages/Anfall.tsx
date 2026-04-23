import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import { AnfallsspelSection } from "@/components/sections/TacticsSections";

const Anfall = () => (
  <>
    <PageHero
      eyebrow="Anfall"
      title="Anfallsspel"
      description="3-2-2-3 med inverterad ytterback. Vi bygger via inre korridor och accelererar mot gyllene zonen."
    />
    <div className="container">
      <div className="max-w-3xl mb-16 border-l-2 border-accent/60 pl-6">
        <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
          <span className="font-bold">Varför inverterad ytterback?</span> Genom att flytta in en ytterback skapar vi numerisk överlägsenhet centralt, två "hängande" mittfältare i inre korridor och tre rena anfallare högt. Resultatet: fler rättvända spelare och snabbare spelvändningar.
        </p>
      </div>
    </div>
    <div className="container pb-24 space-y-24">
      <section id="speluppbyggnad" className="scroll-mt-24">
        <SectionHeader badge="01 · Speluppbyggnad" title="Speluppbyggnad" subtitle="3-2-2-3 från botten — säkra första passningarna och hitta rättvänd spelare." />
        <AnfallsspelSection />
      </section>
      <section id="skapa" className="scroll-mt-24">
        <SectionHeader badge="02 · Skapa" title="Skapa chans" subtitle="Spelvändning, överbelastning och acceleration mot gyllene zonen." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">
          Detaljer kring chansskapande — överlapp/underlapp, kortsida, cutback — finns inom Speluppbyggnad ovan. Fyll på med specifika mönster.
        </div>
      </section>
      <section id="avsluta" className="scroll-mt-24">
        <SectionHeader badge="03 · Avsluta" title="Avsluta" subtitle="Cutback in i gyllene zonen — tydliga löpvägar och avslutsregler." />
        <div className="bg-card/85 rounded-lg p-6 border border-border text-sm text-muted-foreground">
          Fyll på med avslutsprinciper, löpmönster i boxen och regler för andraboll.
        </div>
      </section>
    </div>
  </>
);

export default Anfall;
