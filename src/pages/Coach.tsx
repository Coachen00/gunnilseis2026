import { Link } from "react-router-dom";
import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";
import KedjaSteps from "@/components/kedja/KedjaSteps";
import KedjaClimax from "@/components/kedja/KedjaClimax";

type CoachLink = { label: string; to: string; support: string };

const sections: Array<{
  id: string;
  eyebrow: string;
  title: string;
  navShort: string;
  definition: string;
  highlight: string;
  steps: Array<{ label: string; headline: string; support: string }>;
  climax: string;
  links: CoachLink[];
}> = [
  {
    id: "riktning",
    eyebrow: "Coach 01",
    title: "Sätt riktningen",
    navShort: "BÖRJA HÄR",
    definition: "Allt startar i samma riktning: vi ska komma förberedda till nästa aktion, med ett språk som hela laget kan använda.",
    highlight: "samma riktning",
    steps: [
      { label: "Kärna", headline: "Var förberedd", support: "Gör nästa situation synlig innan den kommer." },
      { label: "Identitet", headline: "Fem identiteter", support: "Scanning, ta ytan, prata med passningen, duellspel och andrabollsspel." },
      { label: "Matchen", headline: "Fyra levande lägen", support: "Försvar, bollvinst, anfall och bolltapp. Fasta har ett eget upplägg." },
    ],
    climax: "Ett coachrop, ett pass och en matchplan ska peka åt samma håll.",
    links: [
      { label: "Spelidé", to: "/spelide", support: "Riktningen bakom alla val" },
      { label: "Prisma 2026", to: "/under-process", support: "Hela tankesystemet" },
      { label: "5⁵", to: "/under-process/5-upphojt-i-fem", support: "Minnesskelettet för språket" },
    ],
  },
  {
    id: "veckan",
    eyebrow: "Coach 02",
    title: "Planera veckan",
    navShort: "FRÅN PROBLEM TILL PASS",
    definition: "Planera från matchproblemet och arbeta bakåt: välj ett lärsteg, skapa situationer som kräver det och gör planen enkel att genomföra.",
    highlight: "från matchproblemet",
    steps: [
      { label: "1. Se", headline: "Välj ett matchproblem", support: "Beskriv situationen vi vill bli bättre på — inte bara en övning vi vill göra." },
      { label: "2. Välj", headline: "Sätt ett lärsteg", support: "Koppla problemet till ett matchläge och ett beteende som spelarna kan träna i veckan." },
      { label: "3. Bygg", headline: "Gör passet spelbart", support: "Låt regler, ytor och antal skapa besluten. Håll instruktionen kort och aktiv." },
    ],
    climax: "Ett pass är klart när spelarna möter det problem matchen kommer att ställa.",
    links: [
      { label: "Veckans arbetsyta", to: "/spelmodell-labb", support: "Bygg veckans matchbild" },
      { label: "Träningsplanering", to: "/coach/traningsplanering-host-2026", support: "Fyra moment per pass" },
      { label: "Träningsplan", to: "/traningsplan", support: "A4-versionen på planen" },
      { label: "Taktiktavla", to: "/taktiktavla", support: "Visa relationer och sekvenser" },
    ],
  },
  {
    id: "matchen",
    eyebrow: "Coach 03",
    title: "Gör matchen tydlig",
    navShort: "SPELA · SE · JUSTERA",
    definition: "Inför matchen gör vi fokus synligt. Efter matchen använder vi det vi såg för att välja nästa steg — inte för att fylla på fler ord.",
    highlight: "gör vi fokus synligt",
    steps: [
      { label: "Före", headline: "Gör en enkel plan", support: "Välj det som avgör vår matchbild och formulera vad laget ska känna igen." },
      { label: "Under", headline: "Coacha nästa aktion", support: "Påminn om signalen, förstärk rätt beteende och låt spelarna lösa resten." },
      { label: "Efter", headline: "Samla matchbevis", support: "Vad fungerade under press? Behåll, förenkla eller välj nästa lärsteg." },
    ],
    climax: "Matchen avslutar inte veckan — den ger starten på nästa.",
    links: [
      { label: "Motståndaranalys", to: "/motstandaranalys", support: "Se hot, möjligheter och vår plan" },
      { label: "Matchblad", to: "/matchblad", support: "Gör trupp och fokuspunkter tydliga" },
    ],
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
        title={<>En riktning.<br /><span className="mark-lime">Ett nästa steg.</span></>}
        lead="Coach är tråden från spelidé till nästa match: sätt riktningen, planera veckan och använd matchen för att lära vidare. Öppna verktyget först när arbetet kräver det."
        instruction="Börja med det beslut du ska fatta — inte med det dokument du råkar känna igen."
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
          <div role="region" className="mt-8 grid gap-3 text-left sm:grid-cols-3" aria-label={`${section.title}: verktyg`}>
            {section.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group min-h-24 rounded-xl border border-kedja-border bg-white px-4 py-3 transition-colors hover:border-kedja-green hover:bg-kedja-mint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kedja-green focus-visible:ring-offset-2"
              >
                <span className="block text-sm font-extrabold text-kedja-ink group-hover:text-kedja-green">{link.label} →</span>
                <span className="mt-1 block text-xs leading-5 text-kedja-deep">{link.support}</span>
              </Link>
            ))}
          </div>
        </KedjaSection>
      ))}

      <footer className="bg-kedja-deep">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[13px] font-bold text-kedja-mint">Gunnilse IS · Var förberedd</span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-kedja-mint/60">Riktning · Vecka · Match · Nästa lärsteg</span>
        </div>
      </footer>
    </div>
  );
};

export default Coach;
