import { Link } from "react-router-dom";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";

const sections = [
  {
    id: "riktning",
    eyebrow: "Coach 01",
    title: "Riktning",
    navShort: "VART SKA VI?",
    definition: "Var förberedd är vår riktning: laget ska komma förberett till nästa aktion.",
    highlight: "komma förberett",
    steps: [
      { label: "Kärna", headline: "Var förberedd", support: "Se nästa situation innan den kommer." },
      { label: "Identitet", headline: "Fem beteenden", support: "Scanning, ta ytan, prata med passningen, duellspel och andrabollsspel." },
      { label: "Utfall", headline: "Nästa aktion", support: "Spelaren vet vad som ska göras och varför." },
    ],
    climax: "Allt vi tränar ska göra laget bättre förberett.",
    link: { label: "Fördjupa i Spelidé", to: "/spelide" },
  },
  {
    id: "sprak",
    eyebrow: "Coach 02",
    title: "Språk",
    navShort: "SÅ PRATAR VI",
    definition: "Ett gemensamt språk gör en komplex spelmodell möjlig att minnas och använda tillsammans.",
    highlight: "gemensamt språk",
    steps: [
      { label: "Identitet", headline: "Fem beteenden", support: "Scanning, ta ytan, prata med passningen, duellspel och andrabollsspel." },
      { label: "Matchen", headline: "Fyra levande lägen", support: "Försvar, bollvinst, anfall och bolltapp. Fasta har ett eget upplägg." },
      { label: "Översättning", headline: "Från idé till coachrop", support: "Övergripande riktning blir konkret i spelarens nästa val." },
    ],
    climax: "Samma ord ska betyda samma sak för hela tränarteamet.",
    link: { label: "Fördjupa i 5⁵", to: "/under-process/5-upphojt-i-fem" },
  },
  {
    id: "spel",
    eyebrow: "Coach 03",
    title: "Spel",
    navShort: "SÅ SPELAR VI",
    definition: "Spelmodellen beskriver vad vi gör tillsammans när matchen byter läge.",
    highlight: "vad vi gör tillsammans",
    steps: [
      { label: "Anfall", headline: "Spela framåt och skapa yta", support: "Spela in, spela ut, ta ytan och fyll på runt boxen." },
      { label: "Försvar", headline: "Skydda mitten och pressa tillsammans", support: "Stäng vägen framåt och pressa när laget är redo." },
      { label: "Omställning", headline: "Agera direkt vid bollbyte", support: "Titta framåt vid bollvinst och återerövra eller falla hem vid bolltapp." },
    ],
    climax: "Principerna ska hjälpa spelaren att fatta beslut — inte ersätta beslutet.",
    link: { label: "Fördjupa i Spelmodell", to: "/spelmodell" },
  },
  {
    id: "traning",
    eyebrow: "Coach 04",
    title: "Träning",
    navShort: "SÅ GÖR VI",
    definition: "Träningsarbetet gör principerna synliga i rätt problem, rätt fart och rätt beslut.",
    highlight: "gör principerna synliga",
    steps: [
      { label: "Förbered", headline: "Välj ett beteende", support: "Knyt passet till veckans lärsteg och ett tydligt matchproblem." },
      { label: "Genomför", headline: "Bygg en situation", support: "Övningen ska kräva den scanning, det coachrop eller den relation vi vill se." },
      { label: "Coacha", headline: "Säg det som hjälper nästa aktion", support: "Ställ frågor, förstärk beteendet och håll språket kort." },
    ],
    climax: "En bra träning gör det lättare att göra rätt i match.",
    link: { label: "Öppna träningsplanering", to: "/coach/traningsplanering-host-2026" },
  },
  {
    id: "bevis",
    eyebrow: "Coach 05",
    title: "Bevis",
    navShort: "SÅ VET VI",
    definition: "Vi går vidare när beteendet syns i match och laget kan upprepa det utan att tränaren bär allt.",
    highlight: "syns i match",
    steps: [
      { label: "Se", headline: "Observera beteendet", support: "Vad hände faktiskt — i vilken situation och med vilken kvalitet?" },
      { label: "Pröva", headline: "Samla matchbevis", support: "Kan spelarna använda principen när matchen pressar dem?" },
      { label: "Fortsätt", headline: "Välj nästa lärsteg", support: "Behåll, förenkla eller gå vidare beroende på beviset." },
    ],
    climax: "Dokumentet är klart när beteendet fungerar utan att texten behöver förklara det.",
    link: { label: "Öppna veckans arbetsyta", to: "/spelmodell-labb" },
  },
];

const Coach = () => {
  const navItems = sections.map((section, index) => ({
    num: String(index + 1).padStart(2, "0"),
    title: section.title,
    sub: section.navShort,
    href: `#${section.id}`,
  }));

  return (
    <div className="bg-kedja-paper">
      <KedjaHero
        eyebrow="Coach · Arbetsmaterial"
        title={
          <>
            Gör spelidén
            <br />
            <span className="mark-lime">spelbar.</span>
          </>
        }
        lead="En karta för tränarteamet: riktning, språk, spel, träning och bevis. Läs uppifrån och ner — öppna fördjupning först när du behöver den."
        instruction="Börja med riktningen. Följ sedan kedjan till matchbeviset."
      >
        <KedjaNav items={navItems} />
      </KedjaHero>

      {sections.map((section, index) => (
        <KedjaSection
          key={section.id}
          id={section.id}
          tone={index % 2 === 0 ? "paper" : "white"}
          eyebrow={section.eyebrow}
          title={section.title}
          definition={section.definition}
          highlight={section.highlight}
        >
          <KedjaSteps steps={section.steps} tone={index % 2 === 0 ? "paper" : "white"} />
          <KedjaClimax label="Arbetsprincip" text={section.climax} />
          <Link
            to={section.link.to}
            className="mt-8 inline-flex min-h-11 items-center border-b-2 border-kedja-green px-1 text-sm font-extrabold uppercase tracking-[0.14em] text-kedja-green transition-colors hover:border-kedja-ink hover:text-kedja-ink"
          >
            {section.link.label} →
          </Link>
        </KedjaSection>
      ))}

      <footer className="bg-kedja-deep">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[13px] font-bold text-kedja-mint">Gunnilse IS · Var förberedd</span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-kedja-mint/60">
            Riktning · Språk · Spel · Träning · Bevis
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Coach;
