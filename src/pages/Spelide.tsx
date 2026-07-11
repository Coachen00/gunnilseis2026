import { GenerelltSection, IdentitetSection } from "@/components/sections/TacticsSections";
import PrincipleBlock from "@/components/PrincipleBlock";
import { ATTACKING_PRINCIPLES } from "@/data/attackingPrinciples";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";
import KedjaQuote from "@/components/kedja/KedjaQuote";

/** Fyra makroskeden — samma innehåll som tidigare CurrentStateSection. */
const NULAGE_PHASES = [
  {
    label: "Anfall",
    oneLiner: "Skydda kontring först — sen in, ut, framåt, fyll boxen.",
    principles: ["Skydda", "In", "Ut", "Framåt", "Box"],
  },
  {
    label: "Försvar",
    oneLiner: "Samla först, lås sedan bollsida.",
    principles: ["Gyllene zon", "Styr press", "Tre korridorer", "Kompakt", "Insidan stängd"],
  },
  {
    label: "Bollvinst",
    oneLiner: "Kontra när bilden är rätt, annars säkra.",
    principles: ["Kontra", "Diagonal ut", "Djupled"],
  },
  {
    label: "Bolltapp",
    oneLiner: "Jaga nära, bromsa när vi är utdragna.",
    principles: ["Direkt", "Indirekt", "Forwarden först"],
  },
];

const NAV_ITEMS = [
  { num: "01", title: "Nuläge", sub: "Fyra skeden", href: "#nulage" },
  { num: "02", title: "Anfall", sub: "Fem principer i sekvens", href: "#anfall" },
  { num: "03", title: "Övriga skeden", sub: "Försvar, omställningar, målvakt", href: "#ovriga-skeden" },
  { num: "04", title: "Generellt", sub: "Vår spelkarta", href: "#generellt" },
  { num: "05", title: "Identitet", sub: "Vilka vill vi vara?", href: "#identitet" },
];

/** Anfallssekvensen — kedja-stegkort med bevarad länk till /anfall#slug. */
function AnfallSteps() {
  const cardBg = "bg-kedja-paper";
  return (
    <ol className="flex flex-col items-center">
      {ATTACKING_PRINCIPLES.map((p, i) => (
        <li key={p.slug} className="flex w-full flex-col items-center">
          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-kedja-ink bg-kedja-lime text-[15px] font-black text-kedja-ink">
            {i + 1}
          </span>
          <a
            href={`/anfall#${p.slug}`}
            className={`-mt-5 block w-full rounded-2xl border-[1.5px] border-kedja-border px-7 pb-6 pt-[34px] text-center transition-colors hover:border-kedja-green ${cardBg}`}
          >
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">
              {p.coachrop[0].replace(/!$/, "")}
            </div>
            <p className="text-lg font-bold tracking-[-0.01em] text-kedja-ink">{p.headline}</p>
            <p className="mt-2 text-[15px] leading-[1.55] text-kedja-deep">{p.oneLiner}</p>
          </a>
          {i < ATTACKING_PRINCIPLES.length - 1 && (
            <span className="block h-[34px] w-[2px] bg-kedja-green" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}

const Spelide = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelidé"
      title={
        <>
          Hela vårt spel.
          <br />
          Från nuläge till <span className="mark-lime">identitet</span>.
        </>
      }
      lead="Nuläget, fem anfallsprinciper, övriga skeden och vad vi gör generellt. Sidans röda tråd ner till varje detalj."
      instruction="Läs uppifrån och ner, eller hoppa direkt dit du vill."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <KedjaSection
      id="nulage"
      tone="paper"
      eyebrow="Kapitel 01"
      title="En enkel spelidé i fyra skeden."
      definition="Samma ord i träning, matchgenomgång och analys."
      highlight="Samma ord"
    >
      <KedjaSteps
        tone="paper"
        steps={NULAGE_PHASES.map((phase) => ({
          label: phase.label,
          headline: phase.oneLiner,
          support: phase.principles.join(" · "),
        }))}
      />
    </KedjaSection>

    <KedjaSection
      id="anfall"
      tone="white"
      eyebrow="Kapitel 02"
      title="Fem principer i sekvens"
      definition="När vi har bollen följer vi alltid samma flöde. Princip 1 är förutsättning, sen flödar bollen genom 2 → 5."
      highlight="samma flöde"
    >
      <AnfallSteps />
      <KedjaClimax
        label="Anfallssekvensen"
        text="Skydda mot kontring. Spela in. Spela ut. Ta med framåt. Fyll på box."
      />
    </KedjaSection>

    <KedjaSection
      id="ovriga-skeden"
      tone="paper"
      eyebrow="Kapitel 03"
      title="Försvar, omställningar, målvakt"
      definition="En vass princip per skede — samma vokabulär används överallt på sidan."
      highlight="samma vokabulär"
    >
      <div className="space-y-10 text-left">
        <PrincipleBlock phase="omstallning-forsvar" limit={1} />
        <PrincipleBlock phase="forsvar" limit={1} />
        <PrincipleBlock phase="omstallning-anfall" limit={1} />
        <PrincipleBlock phase="malvakt" limit={1} />
      </div>
    </KedjaSection>

    <KedjaQuote
      text="Avslut i gyllene zonen — alltid via assistytan, helst med övertal."
      highlight="gyllene zonen"
    />

    <div className="bg-white py-24">
      <div className="container">
        <GenerelltSection />
      </div>
    </div>

    <div className="bg-kedja-paper py-24">
      <div className="container">
        <IdentitetSection />
      </div>
    </div>
  </div>
);

export default Spelide;
