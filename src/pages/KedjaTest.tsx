import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";
import KedjaMedia from "@/components/kedja/KedjaMedia";
import { useGlobalMediaMatch } from "@/hooks/useGlobalMediaMatch";

const NAV_ITEMS = [
  { num: "01", title: "Scanning", sub: "Titta innan", href: "#scanning" },
  { num: "02", title: "Yta", sub: "Förstå · ta · skydda", href: "#yta" },
  { num: "03", title: "Prata med passningen", sub: "Säg något med passen", href: "#prata-med-passningen" },
  { num: "04", title: "Duellspel", sub: "Vinn duellen", href: "#duellspel" },
  { num: "05", title: "Andrabollsspel", sub: "Bollen hos oss", href: "#andrabollsspel" },
];

const SCANNING_STEPS = [
  { label: "När", headline: "Innan bollen kommer till dig.", support: "Varje gång bollen flyttas — ny bild. Och alltid innan du själv passar." },
  { label: "Vad", headline: "Motståndare, yta, medspelare.", support: "Var kommer pressen ifrån? Var finns fri yta? Vem är spelbar — och var är målet?" },
  { label: "Hur", headline: "Korta blickar över axeln.", support: "En halv sekund räcker. Titta — bestäm — agera. Scanna igen om bilden hunnit ändras." },
];

const KedjaTest = () => {
  const { matchId } = useGlobalMediaMatch();

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Spelet · Identitet"
        title={
          <>
            Fem beteenden.
            <br />
            En <span className="mark-lime">kedja</span>.
          </>
        }
        lead="Det börjar med blicken och slutar med bollen hos oss. Varje beteende leder till nästa — samma ord från målvakten till anfallaren, i varje träning, varje match."
        instruction="Läs uppifrån och ner. Ett steg i taget."
      >
        <KedjaNav items={NAV_ITEMS} />
      </KedjaHero>

      <KedjaSection
        id="scanning"
        tone="paper"
        eyebrow="Identitet 01"
        title="Scanning"
        definition="Vet vad som finns runt dig innan bollen kommer — då har du redan bestämt dig när den landar."
        highlight="innan bollen kommer"
      >
        <KedjaSteps steps={SCANNING_STEPS} tone="paper" />
        <KedjaClimax label="Vårt rop" text="TITTA INNAN" />
        <KedjaMedia
          label="Definition · Egen bild eller karta"
          matchId={matchId}
          slotKey="kedja-test:scanning:definition"
          title="Bild eller film"
          description="Scanning"
          captionPlaceholder="Skriv bildförklaring här..."
        />
      </KedjaSection>

      <KedjaQuote text="Identiteten är inte ett dokument. Den är ett beteende." highlight="beteende" />
    </div>
  );
};

export default KedjaTest;
