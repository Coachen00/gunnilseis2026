import KedjaHero from "@/components/kedja/KedjaHero";
import SpelmodellLabWorkspace from "@/components/SpelmodellLabWorkspace";
import CoachTacticsAnimation from "@/components/coach/CoachTacticsAnimation";

const SpelmodellLab = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Labb"
      title="Bygg träning och matchspråk från samma principer"
      lead="Ett interaktivt coachrum för att välja fokus, diagnosticera matchbilden och skapa ett konkret pass med kopierbar brief."
    />
    <CoachTacticsAnimation variant="spelmodellLabb" />
    <SpelmodellLabWorkspace />
  </div>
);

export default SpelmodellLab;
