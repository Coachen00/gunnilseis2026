import PageHero from "@/components/PageHero";
import { AnfallsspelSection, OmstallningAnfallSection } from "@/components/sections/TacticsSections";

const Anfall = () => (
  <>
    <PageHero
      eyebrow="Anfall"
      title="Anfallsspel & Omställning"
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
      <AnfallsspelSection />
      <OmstallningAnfallSection />
    </div>
  </>
);

export default Anfall;
