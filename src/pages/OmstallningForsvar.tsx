import FasTrappa from "@/components/FasTrappa";
import { OmstallningForsvarSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import { PHASES } from "@/data/principles";
import MediaSlotGroup from "@/components/match/MediaSlotGroup";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";

const OMSTALLNING_CUES = PHASE_CUES["omstallning-forsvar"];

const NAV_ITEMS = [
  { num: "01", title: "Direkt", sub: "Press boll direkt — ingen tvekan", href: "#direkt" },
  { num: "02", title: "Kontroll", sub: "Flytta ned, centrera", href: "#kontroll" },
];

/** Fyra spelregler — samma rader som CuesBlock, ihopdragna med sina matchande cues. */
const MATCH_CUE_STEPS = OMSTALLNING_CUES.rules.map((rule, i) => ({
  label: `Regel 0${i + 1}`,
  headline: rule,
  support: `${OMSTALLNING_CUES.cues[i].trigger} → ${OMSTALLNING_CUES.cues[i].action}`,
}));

const OmstallningForsvar = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Omställning försvar"
      title={
        <>
          Bollförlust.
          <br />
          Vinn <span className="mark-lime">tillbaka</span>.
        </>
      }
      lead="Vinn tillbaka bollen, hindra spel framåt, förhindra kontring. Forwarden är vår första försvarare."
      instruction="Läs uppifrån och ner. Motpress i 5 sekunder, annars faller vi tillbaka."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <div className="bg-kedja-paper py-16">
      <FasTrappa blockId="overgang-forsvar" />
    </div>

    <KedjaSection
      id="matchcues"
      tone="paper"
      eyebrow="Omställning · Match-cues"
      title="Motpress i 5 sekunder."
      definition={PHASES["omstallning-forsvar"].oneLiner}
      highlight="hindra spel framåt"
    >
      <KedjaSteps tone="paper" steps={MATCH_CUE_STEPS} />
      <KedjaClimax label="Vårt rop" text={OMSTALLNING_CUES.oneLiner} />
    </KedjaSection>

    <div className="bg-white py-24">
      <div className="container">
        <PrincipleBlock phase="omstallning-forsvar" showSource />
      </div>
    </div>

    <section id="direkt" className="scroll-mt-20 bg-kedja-paper">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Omställning 01</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">Direkt motpress</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            De första 5 sekunderna — <em className="mark-lime not-italic">press med central spelare</em>, minska tid
            och ytor.
          </p>
        </div>
        <div className="mt-12 text-left">
          <MediaSlotGroup
            className="mb-6"
            slots={[
              { slotKey: "spelmodell:omstallning-forsvar:direkt:press", title: "Press", description: "Direkt motpress - närmaste spelare" },
              { slotKey: "spelmodell:omstallning-forsvar:direkt:stang", title: "Stäng vägar", description: "Direkt motpress - stäng passningsvägar" },
              { slotKey: "spelmodell:omstallning-forsvar:direkt:atererovring", title: "Återerövring", description: "Direkt motpress - återerövring" },
            ]}
          />
          <OmstallningForsvarSection />
        </div>
      </div>
    </section>

    <KedjaQuote text="Press- och brytteknik avgör." highlight="avgör" />

    <KedjaSection
      id="kontroll"
      tone="paper"
      eyebrow="Omställning 02"
      title="Tillbaka till kontroll"
      definition="Om återerövring inte sker — flytta ned, centrera, återetablera kompakt block."
      highlight="kompakt block"
    >
      <MediaSlotGroup
        className="mb-6"
        slots={[
          { slotKey: "spelmodell:omstallning-forsvar:kontroll:ned", title: "Flytta ned", description: "Tillbaka till kontroll - flytta ned" },
          { slotKey: "spelmodell:omstallning-forsvar:kontroll:centrera", title: "Centrera", description: "Tillbaka till kontroll - centrera" },
          { slotKey: "spelmodell:omstallning-forsvar:kontroll:block", title: "Block", description: "Tillbaka till kontroll - kompakt block" },
        ]}
      />
      <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Efter ~5 sekunders misslyckad press: hela laget flyttar ned och centrerar, behåller 4-3-3-formen och
        återetablerar kompakt block. Vi hindrar enkla utgångar och behåller spel i samma korridor tills pressen kan
        tändas igen.
      </div>
    </KedjaSection>
  </div>
);

export default OmstallningForsvar;
