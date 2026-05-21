import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Eye,
  GitBranch,
  Layers,
  Lock,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthSession } from "@/hooks/useAuthSession";

type Tone = "yellow" | "red" | "blue" | "green";

const TONE_BG: Record<Tone, string> = {
  yellow: "bg-amber-50 border-amber-400/70",
  red: "bg-rose-50 border-rose-300/80",
  blue: "bg-sky-50 border-sky-300/80",
  green: "bg-emerald-50 border-emerald-300/80",
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-amber-700",
  red: "text-rose-700",
  blue: "text-sky-700",
  green: "text-emerald-700",
};

const principles = [
  {
    title: "Intensitet på träning",
    command: "Träna snabbare än matchen.",
    text:
      "Träningens tempo ska vara högre än matchens tempo. Då blir matchen tydligare, besluten snabbare och spelaren mer redo när pressen kommer.",
    icon: Activity,
    tone: "red" as Tone,
  },
  {
    title: "Scanning",
    command: "Se ytan innan du får bollen.",
    text:
      "Alla spelare ska scanna sin omgivning. Vi vill förstå vilka ytor som är bäst för oss och attackera dem med boll, löpning eller kropp.",
    icon: Eye,
    tone: "blue" as Tone,
  },
  {
    title: "Rättvänd spelare",
    command: "Ta ytan så första tillslaget kan gå framåt.",
    text:
      "Ytan du tar ska hjälpa dig att bli rättvänd. När kroppen är vänd mot spelet kan första tillslaget gå framåt och nästa aktion bli farlig.",
    icon: ArrowUpRight,
    tone: "yellow" as Tone,
  },
  {
    title: "Taktisk uthållighet och förståelse",
    command: "Kunna basen så bra att du kan lära ut den.",
    text:
      "Vi behöver en gemensam grund som alla kan stå på. När spelarna förstår basen blir laget uthålligt, tryggt och svårt att bryta sönder.",
    icon: Layers,
    tone: "green" as Tone,
  },
];

const ownerLogin = "leojsjoqvist";

const systemSteps = [
  {
    no: "01",
    title: "Identitet och syfte",
    before: "Starta inte med övningar, formation eller matchplan.",
    do: "Skriv ner vilka vi är, varför laget finns och vilka beteenden som ska synas när det blåser.",
    output: "En gemensam självbild: detta är Gunnilse, detta accepterar vi, detta accepterar vi inte.",
    icon: ShieldCheck,
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Ledarskap och standarder",
    before: "Gör detta först när identiteten är tydlig nog att styra val.",
    do: "Sätt lägstanivån: närvaro, intensitet, kommunikation, kroppsspråk, återerövring och ansvar.",
    output: "Spelarna vet vad som krävs varje dag, inte bara vad som sägs inför match.",
    icon: Users,
    tone: "red" as Tone,
  },
  {
    no: "03",
    title: "Kultur",
    before: "Gör detta först när standarderna är uttalade och möjliga att följa upp.",
    do: "Fira rätt beteenden, korrigera avvikelser och låt spelarna hjälpa varandra att hålla nivån.",
    output: "En miljö där gruppen bär kraven även när tränaren inte tittar.",
    icon: GitBranch,
    tone: "green" as Tone,
  },
  {
    no: "04",
    title: "Spelmodell",
    before: "Gör detta först när identitet, krav och kultur pekar åt samma håll.",
    do: "Översätt idén till fyra faser: försvar, omställning anfall, anfall och omställning försvar.",
    output: "Spelarna vet var de ska stå, vad de ska se och vad nästa aktion är.",
    icon: Layers,
    tone: "blue" as Tone,
  },
  {
    no: "05",
    title: "Principer och koncept",
    before: "Gör detta först när spelmodellen är enkel nog att förklara för en spelare på 30 sekunder.",
    do: "Gör principerna till korta beslut: stäng mitten, spela framåt, fyll boxen, jaga direkt.",
    output: "Ett gemensamt språk som gör besluten snabbare på planen.",
    icon: BookOpen,
    tone: "yellow" as Tone,
  },
  {
    no: "06",
    title: "Roller och truppbygge",
    before: "Gör detta först när principerna är tydliga nog att kopplas till positioner.",
    do: "Beskriv vad varje roll gör i varje fas och vilka egenskaper som behövs för rollen.",
    output: "Rätt spelare på rätt plats, med ansvar som går att förstå och träna.",
    icon: ClipboardList,
    tone: "green" as Tone,
  },
  {
    no: "07",
    title: "Fysik och hälsa",
    before: "Gör detta först när spelmodellens löpkrav, duellkrav och intensitet är tydliga.",
    do: "Koppla fys, återhämtning, skadeprevention och livsstil till hur laget faktiskt spelar.",
    output: "Spelare som orkar utföra modellen i minut 90 och håller över tid.",
    icon: Activity,
    tone: "red" as Tone,
  },
  {
    no: "08",
    title: "Träningsdesign",
    before: "Gör detta först när principerna, rollerna och fysiska kraven är klara.",
    do: "Planera pass med tema, nyckelbeteenden, progressiv svårighet och matchlika beslut.",
    output: "Träningen blir en repetition av vår modell, inte lösryckta övningar.",
    icon: CheckCircle2,
    tone: "blue" as Tone,
  },
  {
    no: "09",
    title: "Analys och lärandeloop",
    before: "Gör detta först när vi vet exakt vilka beteenden vi vill mäta.",
    do: "Följ upp video och data: bollvinster, spelvändningar, assistyta, boxfyllnad och bolltapp.",
    output: "Vi justerar utifrån vad som faktiskt händer, inte bara magkänsla.",
    icon: BarChart3,
    tone: "green" as Tone,
  },
  {
    no: "10",
    title: "Matchplan och kommunikation",
    before: "Gör detta sist. Matchplanen får aldrig ersätta identiteten.",
    do: "Anpassa triggers, fällor, fasta och cue-ord till motståndaren utan att tappa vår modell.",
    output: "Spelarna får få ord, tydliga handlingar och en plan de kan bära under press.",
    icon: MessageSquare,
    tone: "yellow" as Tone,
  },
];

const everydayLoop = [
  "Före träning: välj ett tema och tre beteenden vi vill se.",
  "Under träning: coacha cue-ord, inte föreläsningar.",
  "Efter träning: skriv vad vi ville se, vad vi såg och vad vi ändrar.",
  "Inför match: ta bara med det som hjälper spelaren att agera snabbare.",
  "Efter match: koppla lärdomar tillbaka till principerna.",
];

function OwnerOnlySystem() {
  const { session, loading } = useAuthSession();
  const email = session?.user?.email?.toLowerCase() ?? "";
  const isOwner = email === ownerLogin || email.startsWith(`${ownerLogin}@`);

  if (loading) {
    return (
      <div className="rounded-md border border-border bg-card p-5 text-sm font-semibold text-muted-foreground">
        Verifierar coachåtkomst...
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-amber-400 bg-amber-50 text-amber-700">
            <Lock className="h-4 w-4" strokeWidth={2.3} />
          </span>
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Låst coachmaterial
            </p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Tränarskapets system visas bara för leojsjoqvist-inloggningen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccordionItem value="tranarskapets-system" className="border-t border-border">
      <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
        <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-emerald-400 bg-emerald-50 font-mono text-[11px] font-black text-emerald-700">
              02
            </span>
            <span>
              <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                Tränarskapets system
              </span>
              <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Låst · metodik · effektlogik
              </span>
            </span>
          </span>
          <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
            Coachens arbetsmodell från identitet till matchplan.
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
          <aside className="space-y-4">
            <div className="border border-emerald-400/60 bg-emerald-50 p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                Sammanfattning
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-foreground">
                Ett system, inte en checklista.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                Modellen kopplar ihop identitet, ledarskap, kultur, spelmodell,
                principer, roller, fysik, träning, analys och matchplan. Varje del
                ska göra nästa del enklare att förstå och lättare att utföra.
              </p>
            </div>

            <div className="border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-amber-700" strokeWidth={2.3} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Vardagsloop
                </p>
              </div>
              <ol className="space-y-2.5">
                {everydayLoop.map((item, index) => (
                  <li key={item} className="grid grid-cols-[24px_1fr] gap-2 text-sm leading-relaxed text-foreground/80">
                    <span className="font-mono text-[10px] font-black text-amber-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="space-y-3">
            {systemSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.no} className="border border-border bg-card p-4 md:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={["grid h-9 w-9 place-items-center border font-mono text-[10px] font-black", TONE_BG[step.tone], TONE_TEXT[step.tone]].join(" ")}>
                        {step.no}
                      </span>
                      <h3 className="text-lg font-black uppercase leading-tight text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <Icon className={["h-5 w-5", TONE_TEXT[step.tone]].join(" ")} strokeWidth={2.2} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <StepCell label="Gör först" text={step.before} tone={step.tone} />
                    <StepCell label="Gör nu" text={step.do} tone={step.tone} />
                    <StepCell label="Klart när" text={step.output} tone={step.tone} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function StepCell({ label, text, tone }: { label: string; text: string; tone: Tone }) {
  return (
    <div className="rounded-sm border border-border bg-background p-3">
      <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[tone]].join(" ")}>
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/76">{text}</p>
    </div>
  );
}

const UnderProcess = () => (
  <>
    <PageHero
      eyebrow="Arbetsyta"
      title="Under process"
      description="Principer som styr hur vi tränar, lär oss och flyttar matchens rytm dit vi vill."
    />

    <SectionReveal as="section" className="container pb-section">
      <Accordion
        type="single"
        collapsible
        defaultValue="huvudprinciper"
        className="overflow-hidden rounded-md border border-border bg-card"
      >
        <AccordionItem value="huvudprinciper" className="border-0">
          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
            <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-amber-400 bg-amber-50 font-mono text-[11px] font-black text-amber-700">
                  01
                </span>
                <span>
                  <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                    Huvudprinciper
                  </span>
                  <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Matchrytm · utbildning · kollektiv
                  </span>
                </span>
              </span>
              <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
                Fyra saker som ska synas i varje träning och varje match.
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.45fr]">
              <div className="border border-amber-400/60 bg-amber-50 p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Varför
                </p>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground md:text-lg">
                  Här är våra huvudprinciper för att få matchens rytm, momentum och tempo dit vi vill.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Vi använder dem för att utveckla och utbilda spelare till att bli sitt bästa jag, eller redo för nästa steg.
                  Spelarna ska bli bättre rustade, bättre atleter och bättre beslutsfattare. Målet är ett kollektiv där helheten
                  är större än summan av delarna.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {principles.map((principle, index) => {
                  const Icon = principle.icon;
                  return (
                    <article key={principle.title} className="border border-border bg-card p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className={["flex h-9 w-9 flex-shrink-0 items-center justify-center border font-mono text-[10px] font-black", TONE_BG[principle.tone], TONE_TEXT[principle.tone]].join(" ")}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon className={["h-5 w-5", TONE_TEXT[principle.tone]].join(" ")} strokeWidth={2.2} />
                      </div>
                      <h2 className="text-lg font-black uppercase leading-tight text-foreground">
                        {principle.title}
                      </h2>
                      <p className={["mt-3 text-sm font-black leading-snug", TONE_TEXT[principle.tone]].join(" ")}>
                        {principle.command}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/72">
                        {principle.text}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <OwnerOnlySystem />
      </Accordion>
    </SectionReveal>
  </>
);

export default UnderProcess;
