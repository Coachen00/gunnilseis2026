import FasTrappa from "@/components/FasTrappa";
import { OmstallningAnfallSection } from "@/components/sections/TacticsSections";
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

const OMSTALLNING_ANFALL_CUES = PHASE_CUES["omstallning-anfall"];

const NAV_ITEMS = [
  { num: "01", title: "Kontring", sub: "Direkt kontring efter bollvinst", href: "#kontring" },
  { num: "02", title: "Uppbyggnad", sub: "Säkra bollen och bygg lugnt", href: "#uppbyggnad" },
];

/** Fyra spelregler — samma rader som CuesBlock, ihopdragna med sina matchande cues. */
const MATCH_CUE_STEPS = OMSTALLNING_ANFALL_CUES.rules.map((rule, i) => ({
  label: `Regel 0${i + 1}`,
  headline: rule,
  support: `${OMSTALLNING_ANFALL_CUES.cues[i].trigger} → ${OMSTALLNING_ANFALL_CUES.cues[i].action}`,
}));

const OmstallningAnfall = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Omställning anfall"
      title={
        <>
          Bollvinst.
          <br />
          Utnyttja <span className="mark-lime">obalansen</span>.
        </>
      }
      lead="Snabba omställningspass eller spelvändningar — utnyttja motståndarens obalans. Press- och brytteknik skapar offensiva omställningar."
      instruction="Läs uppifrån och ner. Kontring först, annars bygg upp lugnt."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <div className="bg-kedja-paper py-16">
      <FasTrappa blockId="overgang-anfall" />
    </div>

    <KedjaSection
      id="matchcues"
      tone="paper"
      eyebrow="Omställning anfall · Match-cues"
      title="Utnyttja obalansen direkt."
      definition={PHASES["omstallning-anfall"].oneLiner}
      highlight="utnyttja motståndarens obalans"
    >
      <KedjaSteps tone="paper" steps={MATCH_CUE_STEPS} />
      <KedjaClimax label="Vårt rop" text={OMSTALLNING_ANFALL_CUES.oneLiner} />
    </KedjaSection>

    <div className="bg-white py-24">
      <div className="container">
        <PrincipleBlock phase="omstallning-anfall" showSource />
      </div>
    </div>

    <section id="kontring" className="scroll-mt-20 bg-kedja-paper">
      <div className="container pb-[88px] pt-24">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Omställning anfall 01</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">Direkt kontring</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Rättvänd spelare → spelvändning eller djupledspass → full fart mot{" "}
            <em className="mark-lime not-italic">gyllene zonen</em>.
          </p>
        </div>
        <div className="mt-12 text-left">
          <MediaSlotGroup
            className="mb-6"
            slots={[
              { slotKey: "spelmodell:omstallning-anfall:kontring:rattvand", title: "Rättvänd", description: "Kontring - rättvänd spelare" },
              { slotKey: "spelmodell:omstallning-anfall:kontring:djupled", title: "Djupled", description: "Kontring - djupledspass" },
              { slotKey: "spelmodell:omstallning-anfall:kontring:gyllene-zonen", title: "Gyllene zonen", description: "Kontring - attackera gyllene zonen" },
            ]}
          />
          <OmstallningAnfallSection />
        </div>
      </div>
    </section>

    <KedjaQuote text="Yttrar och 9:a startar löpning i djupled vid bollvinst — alltid." highlight="alltid" />

    <KedjaSection
      id="uppbyggnad"
      tone="white"
      eyebrow="Omställning anfall 02"
      title="Starta speluppbyggnad"
      definition="Om kontring inte är möjlig — säkra bollen, etablera de fyra grundförutsättningarna och bygg lugnt."
      highlight="de fyra grundförutsättningarna"
    >
      <MediaSlotGroup
        className="mb-6"
        slots={[
          { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:sakra", title: "Säkra boll", description: "Starta uppbyggnad - säkra första passningen" },
          { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:bredd", title: "Bredd", description: "Starta uppbyggnad - etablera bredd" },
          { slotKey: "spelmodell:omstallning-anfall:uppbyggnad:kontroll", title: "Kontroll", description: "Starta uppbyggnad - kontroll" },
        ]}
      />
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        När bollvinst sker djupt i egen halva eller mot organiserat motstånd: säkra första passningen, etablera{" "}
        <em className="not-italic font-semibold text-kedja-ink">spelbarhet, spelavstånd, spelbredd och speldjup</em> —
        och påbörja uppbyggnad enligt principerna i <strong>Uppbyggnadsspel</strong>.
      </div>
    </KedjaSection>
  </div>
);

export default OmstallningAnfall;
