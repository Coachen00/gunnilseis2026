import FasTrappa from "@/components/FasTrappa";
import { ForsvarsspelSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import { PHASE_CUES } from "@/data/phaseCues";
import MediaSlotGroup from "@/components/match/MediaSlotGroup";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";

const FORSVAR_CUES = PHASE_CUES.forsvar;

const NAV_ITEMS = [
  { num: "01", title: "Högt", sub: "Press hög upp i plan", href: "#hogt" },
  { num: "02", title: "Medelhögt", sub: "Block runt mittlinjen", href: "#medel" },
  { num: "03", title: "Lågt", sub: "Lågt block nära egen box", href: "#lagt" },
];

/** Fyra spelregler — samma rader som CuesBlock, ihopdragna med sina matchande cues. */
const MATCH_CUE_STEPS = FORSVAR_CUES.rules.map((rule, i) => ({
  label: `Regel 0${i + 1}`,
  headline: rule,
  support: `${FORSVAR_CUES.cues[i].trigger} → ${FORSVAR_CUES.cues[i].action}`,
}));

const Forsvar = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Försvar"
      title={
        <>
          Försvarsspel.
          <br />
          En princip, tre <span className="mark-lime">höjder</span>.
        </>
      }
      lead="Vi förhindrar avslut i gyllene zonen genom positionering, press och markering — tre höjder, samma logik."
      instruction="Läs uppifrån och ner. Tre höjder, samma princip."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <div className="bg-kedja-paper py-16">
      <FasTrappa blockId="forsvarsspel" />
    </div>

    <KedjaSection
      id="matchcues"
      tone="paper"
      eyebrow="Försvar · Match-cues"
      title="En princip — tre höjder."
      definition="Oavsett om vi pressar högt, står medelhögt eller faller lågt så är målet detsamma: förhindra avslut i gyllene zonen."
      highlight="gyllene zonen"
    >
      <p className="text-[15px] leading-[1.55] text-kedja-deep">
        Vi styr pressen åt en sida, håller kompakt form och vinner andrabollar tillsammans.
      </p>
      <div className="mt-10">
        <KedjaSteps tone="paper" steps={MATCH_CUE_STEPS} />
      </div>
      <KedjaClimax label="Vårt rop" text={FORSVAR_CUES.oneLiner} />
    </KedjaSection>

    <div className="bg-white py-24">
      <div className="container">
        <PrincipleBlock phase="forsvar" showSource />
      </div>
    </div>

    <section id="hogt" className="scroll-mt-20 bg-kedja-paper">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Försvar 01</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">Högt försvar</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Press hög upp i plan — trigger på deras <em className="mark-lime not-italic">vänsterback</em>.
          </p>
        </div>
        <div className="mt-12 text-left">
          <MediaSlotGroup
            className="mb-6"
            slots={[
              { slotKey: "spelmodell:forsvar:hogt:press", title: "Press", description: "Högt försvar - press" },
              { slotKey: "spelmodell:forsvar:hogt:styrning", title: "Styrning", description: "Högt försvar - styr pressen" },
              { slotKey: "spelmodell:forsvar:hogt:andraboll", title: "Andraboll", description: "Högt försvar - andrabollar" },
            ]}
          />
          <ForsvarsspelSection />
        </div>
      </div>
    </section>

    <KedjaQuote text="Alltid en spelare mer i restförsvaret än vad motståndaren har framåt." highlight="restförsvaret" />

    <KedjaSection
      id="medel"
      tone="white"
      eyebrow="Försvar 02"
      title="Medelhögt försvar"
      definition="Block runt mittlinjen — stäng inre korridorer, tvinga utåt."
      highlight="stäng inre korridorer"
    >
      <MediaSlotGroup
        className="mb-6"
        slots={[
          { slotKey: "spelmodell:forsvar:medel:block", title: "Block", description: "Medelhögt försvar - block" },
          { slotKey: "spelmodell:forsvar:medel:korridor", title: "Korridor", description: "Medelhögt försvar - stäng inre korridor" },
          { slotKey: "spelmodell:forsvar:medel:trigger", title: "Trigger", description: "Medelhögt försvar - press-trigger" },
        ]}
      />
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Block runt mittlinjen. Vi styr pressen åt en sida via överflyttning och centrering, stänger inre korridorer och
        tvingar bollen utåt. Triggers: passning bakåt, tung mottagning, eller motståndaren riktad mot egen kort sida.
      </div>
    </KedjaSection>

    <KedjaSection
      id="lagt"
      tone="paper"
      eyebrow="Försvar 03"
      title="Lågt försvar"
      definition="Lågt block nära egen box — kompakthet, andraboll och kontringsskydd."
      highlight="kompakthet"
    >
      <MediaSlotGroup
        className="mb-6"
        slots={[
          { slotKey: "spelmodell:forsvar:lagt:box", title: "Box", description: "Lågt försvar - box" },
          { slotKey: "spelmodell:forsvar:lagt:markering", title: "Markering", description: "Lågt försvar - markering" },
          { slotKey: "spelmodell:forsvar:lagt:kontringsskydd", title: "Kontringsskydd", description: "Lågt försvar - kontringsskydd" },
        ]}
      />
      <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Lågt block nära egen box. Korrekt positionering, tät markering på spelare i gyllene zonen, blockera
        avslutsytor. Trigger för att pressa upp igen: bollen bakåt till deras backlinje + vår 9:a närmast bollen.
      </div>
    </KedjaSection>
  </div>
);

export default Forsvar;
