import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";

const layers = [
  { label: "1 · RIKTNING", headline: "Vad vill vi uppnå?", support: "Den övergripande idén som hjälper laget att känna igen vad som är viktigt i skedet." },
  { label: "2 · PRINCIP", headline: "Vilken regel vägleder oss?", support: "En enkel prioritering som gör nästa handling tydligare när tiden och ytan är begränsad." },
  { label: "3 · SUBPRINCIP", headline: "Hur ser regeln ut här?", support: "En konkretisering för en viss situation, yta, motståndare eller relation mellan spelare." },
  { label: "4 · KONCEPT", headline: "Hur löser vi situationen ihop?", support: "Ett gemensamt mönster för flera spelare — till exempel hur vi skapar spelbarhet eller skyddar bakom bollen." },
  { label: "5 · ARBETSSÄTT", headline: "Vad gör vi i träning och match?", support: "Det synliga beteendet: spelarens aktion, coachens språk och övningen som gör idén träningsbar." },
];

const SpelmodellLager = () => (
  <div className="bg-kedja-paper">
    <KedjaHero eyebrow="5⁵ · Spelmodell" title={<>Från idé till <span className="mark-lime">beteende</span>.</>} lead="Fem lager gör att samma spelidé kan vara både enkel att minnas och tillräckligt precis för att träna. Vi börjar högt och går ner tills nästa aktion är tydlig." instruction="Läs uppifrån och ner. Djupet kommer steg för steg." />
    <KedjaSection id="lager" tone="paper" eyebrow="Spelmodell · Fem nivåer" title="Samma idé, fem nivåer." definition="En riktning utan beteende blir bara en ambition. Ett arbetssätt utan riktning blir bara en övning. Lagren håller ihop varför, vad och hur." highlight="håller ihop varför, vad och hur">
      <KedjaSteps tone="paper" steps={layers} />
      <KedjaClimax label="Kontrollfråga" text="Hjälper detta nästa beslut?" />
    </KedjaSection>
  </div>
);

export default SpelmodellLager;
