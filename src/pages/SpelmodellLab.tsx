import PageHero from "@/components/PageHero";
import SpelmodellLabWorkspace from "@/components/SpelmodellLabWorkspace";

const SpelmodellLab = () => (
  <>
    <PageHero
      eyebrow="Spelmodell · Labb"
      title="Bygg träning och matchspråk från samma principer"
      description="Ett interaktivt coachrum för att välja fokus, diagnosticera matchbilden och skapa ett konkret pass med kopierbar brief."
    />
    <SpelmodellLabWorkspace />
  </>
);

export default SpelmodellLab;
