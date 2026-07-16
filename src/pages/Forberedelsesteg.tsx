import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";

const steps = [
  { label: "1 · ANALYSERA", headline: "Vad händer egentligen?", support: "Beskriv situationen utan att hoppa direkt till lösningen. Vad ser vi, när händer det och vad blir följden?" },
  { label: "2 · SAMLA INFO", headline: "Vilka signaler behöver vi?", support: "Samla matchbilder, spelarens perspektiv och motståndarens beteende. Börja med det som påverkar nästa beslut." },
  { label: "3 · TOLKA", headline: "Vad betyder det för oss?", support: "Koppla signalerna till vår spelidé, våra fem beteenden och det skede som situationen tillhör." },
  { label: "4 · BESLUTA", headline: "Vad ska vi göra annorlunda?", support: "Välj ett tydligt fokus. Ett beslut blir användbart först när spelarna vet vad de ska försöka göra." },
  { label: "5 · AGERA", headline: "Gör det synligt i nästa aktion.", support: "Översätt beslutet till en övning, ett coachrop eller en matchnyckel — och följ upp om beteendet syns." },
];

const Forberedelsesteg = () => (
  <div className="bg-kedja-paper">
    <KedjaHero eyebrow="5⁵ · Arbetsgång" title={<>Från bild till <span className="mark-lime">aktion</span>.</>} lead="Förberedelsestegen hjälper oss att gå från det vi ser till det laget faktiskt ska göra. Fem steg — samma riktning hela vägen." instruction="Läs uppifrån och ner. Varje steg gör nästa beslut enklare." />
    <KedjaSection id="forberedelse" tone="paper" eyebrow="Arbetsgång · Fem steg" title="Se först. Agera sen." definition="Vi löser inte en situation genom att prata mer om den. Vi löser den genom att förstå vad som händer, välja ett fokus och göra det synligt i nästa träning eller match." highlight="förstå vad som händer">
      <KedjaSteps tone="paper" steps={steps} />
      <KedjaClimax label="Kom ihåg" text="Ett fokus. En nästa aktion." />
    </KedjaSection>
  </div>
);

export default Forberedelsesteg;
