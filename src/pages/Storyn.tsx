import { Link } from "react-router-dom";
import OwnerOnly from "@/components/OwnerOnly";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaClimax from "@/components/kedja/KedjaClimax";

const chapters = [
  {
    id: "riktning",
    title: "Riktning",
    sub: "VARFÖR VI BYGGER",
    definition: "Vi bygger en spelmodell som gör nästa beslut tydligare och laget bättre förberett.",
    highlight: "nästa beslut tydligare",
    text: "Var förberedd är berättelsen över allt annat: spelaren ska hinna se, förstå och agera innan situationen blir akut.",
  },
  {
    id: "kedjan",
    title: "Kedjan",
    sub: "DET SOM SKA HÄNGA IHOP",
    definition: "Standard, ledarskap, träning, spelbeteende och lärande behöver bilda samma kedja.",
    highlight: "samma kedja",
    text: "En formulering är inte färdig för att den låter bra. Den är färdig när tränaren kan använda den, spelaren kan känna igen den och laget kan visa den i match.",
  },
  {
    id: "risk",
    title: "Risken",
    sub: "DET VI INTE FÅR MISSA",
    definition: "Fler ord och principer hjälper inte om spelaren inte vet vad den ska se och göra härnäst.",
    highlight: "vet vad den ska se och göra",
    text: "Därför måste varje rubrik landa i en situation, en prioritering och ett observerbart beteende.",
  },
  {
    id: "hypoteser",
    title: "Hypoteser",
    sub: "UNDER UTVECKLING",
    definition: "Idéer blir spelarens material först när de har prövats i träning och match.",
    highlight: "prövats i träning och match",
    text: "Det här är arbetsytan för formuleringar, frågor och samband som ännu inte ska låsas som sanningar.",
  },
  {
    id: "lärloop",
    title: "Lärloop",
    sub: "FRÅN MATCH TILL NÄSTA VAL",
    definition: "Vi går från observation till nästa lärsteg — inte från text till mer text.",
    highlight: "observation till nästa lärsteg",
    text: "Det vi faktiskt såg avgör vad vi förstärker, förenklar eller tränar på nytt.",
  },
] as const;

export default function Storyn() {
  const navItems = chapters.map((chapter, index) => ({
    num: String(index + 1).padStart(2, "0"),
    title: chapter.title,
    sub: chapter.sub,
    href: `#${chapter.id}`,
  }));

  return (
    <OwnerOnly>
      <div className="bg-kedja-paper">
        <KedjaHero
          eyebrow="Storyn · övergripande riktning"
          title={<>Var <span className="mark-lime">förberedd.</span></>}
          lead="Storyn håller ihop varför vi bygger modellen, vad den ska hjälpa laget att göra och hur vi vet att den fungerar."
          instruction="Läs från riktning till lärloop. Fördjupa sedan i Spelmodell eller Coach."
        >
          <KedjaNav items={navItems} />
        </KedjaHero>

        {chapters.map((chapter, index) => (
          <KedjaSection
            key={chapter.id}
            id={chapter.id}
            tone={index % 2 === 0 ? "paper" : "white"}
            eyebrow={`Storyn ${String(index + 1).padStart(2, "0")}`}
            title={chapter.title}
            definition={chapter.definition}
            highlight={chapter.highlight}
          >
            <p className="mx-auto max-w-[560px] text-[17px] leading-[1.6] text-kedja-deep">{chapter.text}</p>
          </KedjaSection>
        ))}

        <section className="bg-kedja-deep px-6 py-16 text-center md:py-20" aria-label="Nästa fördjupning">
          <div className="mx-auto max-w-[720px]">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-kedja-mint/70">Nästa fördjupning</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-kedja-lime md:text-5xl">Gör berättelsen spelbar.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-kedja-mint">
              Spelmodellen beskriver lösningarna. Coach gör dem träningsbara och möjliga att följa upp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/spelmodell" className="inline-flex min-h-11 items-center bg-kedja-lime px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-kedja-ink">Öppna spelmodellen →</Link>
              <Link to="/coach" className="inline-flex min-h-11 items-center border border-kedja-mint/40 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-kedja-mint">Öppna Coach →</Link>
            </div>
            <KedjaClimax label="Den röda tråden" text="Se → förstå → agera → observera → lär." connector={false} />
          </div>
        </section>
      </div>
    </OwnerOnly>
  );
}
