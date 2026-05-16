import { Activity, ArrowUpRight, Eye, Layers } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      </Accordion>
    </SectionReveal>
  </>
);

export default UnderProcess;
