import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Compass,
  Eye,
  GitBranch,
  HeartPulse,
  Layers,
  Lock,
  type LucideIcon,
  MessageSquare,
  MonitorPlay,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthSession } from "@/hooks/useAuthSession";
import { isOwnerEmail } from "@/lib/owner";

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

const hierarchy = [
  {
    no: "01",
    title: "Vision och riktning",
    weight: "Viktigast",
    why:
      "Den svarar på varför laget finns och vilken sorts fotboll vi vill stå för. Utan vision blir allt annat bara aktiviteter.",
    connects:
      "Visionen blir identitet när den går att se i beteenden. Den sätter riktningen för ledarskap, standards och spelmodell.",
    output: "En mening som styr varje val: vad ska Gunnilse vara när det blåser?",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Identitet",
    weight: "Översta synliga lagret",
    why:
      "Identiteten gör visionen observerbar. Det är här abstrakt riktning blir fem beteenden som spelare kan bära.",
    connects:
      "Identiteten avgör vilka standards vi håller, vilka principer vi tränar och hur vi pratar i pressade lägen.",
    output: "Dueller, andrabollsspel, ta ytan, prata med passningen och scanning.",
    tone: "green" as Tone,
  },
  {
    no: "03",
    title: "Ledarskap och standards",
    weight: "Daglig motor",
    why:
      "När identiteten är tydlig måste den få en lägstanivå. Annars blir orden fina, men beteendet valfritt.",
    connects:
      "Ledarskapet översätter identitet till krav på träning: tempo, kommunikation, ansvar, kroppsspråk och korrigering.",
    output: "Alla vet vad som gäller före, under och efter träning.",
    tone: "red" as Tone,
  },
  {
    no: "04",
    title: "Spelmodell",
    weight: "Beslutsstruktur",
    why:
      "Först när kravbilden finns kan spelet organiseras. Modellen ska hjälpa spelaren att veta vad nästa aktion är.",
    connects:
      "Spelmodellen tar identiteten in i anfall, försvar, omställningar, målvaktsspel och fasta situationer.",
    output: "Få principer per skede, tydliga triggers och roller som går att träna.",
    tone: "blue" as Tone,
  },
  {
    no: "05",
    title: "Träningsdesign",
    weight: "Leverans",
    why:
      "Träningen kommer efter modellen eftersom varje övning måste bära ett syfte. Annars tränar vi hårt men inte rätt.",
    connects:
      "Träningen pressar principerna med constraints, poängsystem, tidskrav, ytor, roller och cue-ord.",
    output: "Pass där intensitet, beslut och spelmodell repeteras samtidigt.",
    tone: "red" as Tone,
  },
  {
    no: "06",
    title: "Analys och återkoppling",
    weight: "Minst stabil, men nödvändig",
    why:
      "Feedback kommer sist eftersom vi först måste veta vad vi letar efter. Då kan vi justera utan att tappa riktning.",
    connects:
      "Analysen går tillbaka till början: stämmer beteendet med identiteten, standarden och spelmodellen?",
    output: "Nästa träningsfokus, nästa coachpunkt och nästa matchjustering.",
    tone: "green" as Tone,
  },
];

const principles = [
  {
    title: "Intensitet på träning",
    command: "Träna snabbare än matchen.",
    text:
      "Intensitet är inte bara löpning. Det är kort väntetid, hög beslutstäthet, tydliga regler, snabb återstart och krav på nästa aktion direkt efter misstag.",
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

const relationMap = [
  {
    from: "Vision",
    to: "Identitet · ledarskap · modell",
    text:
      "Visionen väljer vad som är viktigast. Därför kan den inte ligga efter övningar, formation eller matchplan.",
  },
  {
    from: "Identitet",
    to: "Standards · språk · beteenden",
    text:
      "Identiteten är bron mellan idé och vardag. Om ett beteende inte syns på träning finns det inte i modellen.",
  },
  {
    from: "Standards",
    to: "Träningsintensitet · ansvar · kultur",
    text:
      "Standards gör att spelarna vet vad som är normalt. De skyddar intensiteten när energin, vädret eller resultatet stör.",
  },
  {
    from: "Spelmodell",
    to: "Principer · roller · övningar",
    text:
      "Modellen gör identiteten spelbar. Varje princip ska kunna bli en rollcue, en övning och ett matchbeteende.",
  },
  {
    from: "Analys",
    to: "Nästa fokus · ny standard · ny träning",
    text:
      "Analysen får inte bli en sidogren. Den ska peka tillbaka på kedjan och säga vilket led som behöver skärpas.",
  },
];

const usageAreas = [
  {
    title: "När vi sätter standards",
    text:
      "Börja i identiteten. En standard är giltig först när den hjälper oss visa vilka vi är: tid, tempo, kommunikation, kroppsspråk och ansvar.",
    tone: "red" as Tone,
  },
  {
    title: "När vi pratar ledarskap på träning",
    text:
      "Ledarskap är översättning: idé till cue, cue till beteende, beteende till feedback. Få ord, skarp korrigering, samma språk varje vecka.",
    tone: "yellow" as Tone,
  },
  {
    title: "När vi jagar maximal intensitet",
    text:
      "Använd små ytor, korta block, poäng för rätt beteende, omedelbar återstart, numerära över-/underlägen och stopp bara när nästa aktion blir tydligare.",
    tone: "green" as Tone,
  },
  {
    title: "När vi bygger matchplan",
    text:
      "Matchplanen är sista filtret. Den får anpassa triggers och ytor, men aldrig byta ut identiteten eller spelmodellens huvudprinciper.",
    tone: "blue" as Tone,
  },
];

const researchLoop = [
  {
    no: "01",
    title: "Identitet och kontext före metod",
    source: "England DNA · FA 4 Corner Model · SvFF spelarutbildningsplan",
    sourceUrl: "https://www.thefa.com/bootroom/resources/coaching/understanding-the-core-elements-of-the-england-dna",
    applies:
      "Börja med vilka vi är, hur vi vill spela, vilken spelare vi vill utveckla och vilken miljö spelaren behöver.",
    extent:
      "En sida räcker: 3-5 identitetsbeteenden, 3 standards, 1 mening om ledarskap. Revideras sällan.",
    case:
      "England DNA delar upp helheten i who we are, how we play, future player, how we coach och how we support. Det gör identitet till styrning, inte pynt.",
    translation:
      "Gunnilse: 'Vi är förberedda' blir inte ett motto. Det blir filter för närvaro, passupplägg, matchplan, ansvar och kroppsspråk.",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Spelvision före formation",
    source: "DFB Spielvision · England Football style of play",
    sourceUrl: "https://www.dfb-akademie.de/spielvision/-/id-11008585",
    applies:
      "Formationen är bara startposition. Spelvisionen beskriver kvaliteterna i anfall, försvar och omställningar.",
    extent:
      "4-6 huvudprinciper totalt. Per skede: 1 huvudprincip, 2-3 subprinciper, 2 cue-ord.",
    case:
      "DFB:s Spielvision beskriver övergripande, offensiva och defensiva riktlinjer som ska påverka allt från landslag till barnfotboll.",
    translation:
      "Gunnilse: skriv modellen som beteenden: var vi vill vinna boll, hur vi tar yta, hur vi skyddar oss när vi anfaller.",
    tone: "blue" as Tone,
  },
  {
    no: "03",
    title: "Principer och subprinciper före övningsbank",
    source: "Tactical Periodization · UEFA/RFEF coach education",
    sourceUrl: "https://spielverlagerung.com/2020/05/23/understanding-the-tactical-periodization-methodology/",
    applies:
      "Varje övning ska representera ett beteende i spelmodellen. Fysik, teknik och psykologi tränas genom det taktiska syftet.",
    extent:
      "Bygg passet runt ett tema. Max 1 huvudprincip, 1-2 subprinciper och 3 observerbara beteenden per träning.",
    case:
      "Mourinho/Porto-spåret gjorde spelidén till veckans organisatoriska centrum: träna som du vill spela, inte först fys och sedan fotboll.",
    translation:
      "Gunnilse: om temat är återerövring ska yta, regler, poäng och coachning tvinga fram direkt jakt efter bolltapp.",
    tone: "green" as Tone,
  },
  {
    no: "04",
    title: "Matchlik träning före isolerad instruktion",
    source: "Constraints-led approach · Representative learning design · SSG-forskning",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7880470/",
    applies:
      "Spelare lär sig beslut i miljöer som liknar matchen: motståndare, riktning, yta, tid, mål, risk och konsekvens.",
    extent:
      "Minst halva passet i spel eller matchlika former. DFB anger nettotid i smålagsspel som veckomått; SvFF-checklistor anger minst 50 procent spel.",
    case:
      "Smålagsspel ger många aktioner per spelare och kan påverka både aerob kapacitet och teknisk-taktiska beteenden.",
    translation:
      "Gunnilse: maximal intensitet skapas med små ytor, korta block, återstart, poäng för rätt beteende och få stopp.",
    tone: "red" as Tone,
  },
  {
    no: "05",
    title: "Ledarskap som översättning",
    source: "RFEF · Del Bosque · Arteta · FA coach education",
    sourceUrl: "https://rfef.es/es/noticias/vicente-del-bosque-clausura-jornadas-metodologia-seleccion-espanola",
    applies:
      "Ledaren ska göra modellen begriplig, lyssna på laget, välja få ord och korrigera det som hotar identiteten.",
    extent:
      "Varje pass: 60 sekunder syfte, 3 cue-ord, korta stopp, en konkret efterfråga efter passet.",
    case:
      "Del Bosques landslagsmetodik betonade kommunikation, lyssnande och delad kunskap. Arteta betonar relation och tävlingsmodell.",
    translation:
      "Gunnilse: ledarskapet på träning är inte föreläsning. Det är att koppla varje stopp till beteendet vi jagar.",
    tone: "yellow" as Tone,
  },
  {
    no: "06",
    title: "Case först när principen är tydlig",
    source: "Guardiola · Klopp/Bielsa · De Zerbi · Coaches' Voice",
    sourceUrl: "https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/",
    applies:
      "Studera elitcase för att se principen levande, inte för att kopiera formationen rakt av.",
    extent:
      "Ett case per problem. Beskriv situation, princip, constraint, cue och mätpunkt. Allt annat bort.",
    case:
      "Guardiola visar positionsspel och zonlogik. Klopp/Bielsa visar omedelbar återerövring. De Zerbi visar hur uppbyggnad kan locka press.",
    translation:
      "Gunnilse: välj bara det case som förstärker nästa steg i kedjan. Case utan koppling blir inspiration utan effekt.",
    tone: "green" as Tone,
  },
];

const systemSteps = [
  {
    no: "01",
    title: "Vision och syfte",
    before: "Kommer först eftersom den bestämmer vad allt annat ska tjäna.",
    do: "Sätt riktningen: vilket lag vill vi vara, varför spelar vi så och vad får aldrig försvinna?",
    output: "Alla senare val kan spåras tillbaka till samma varför.",
    icon: ShieldCheck,
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Identitet",
    before: "Kommer efter visionen eftersom den gör riktningen synlig i beteenden.",
    do: "Välj få identitetsbeteenden och definiera hur de ser ut som godkänt och icke godkänt.",
    output: "Spelaren vet vad laget ska visa även utan lång taktisk förklaring.",
    icon: Users,
    tone: "green" as Tone,
  },
  {
    no: "03",
    title: "Ledarskap och standarder",
    before: "Kommer efter identiteten eftersom ledaren måste veta vilka beteenden som ska skyddas.",
    do: "Sätt lägstanivån för närvaro, tempo, ansvar, kommunikation, kroppsspråk och återerövring.",
    output: "Kraven blir dagliga och konkreta, inte bara något vi säger inför match.",
    icon: GitBranch,
    tone: "red" as Tone,
  },
  {
    no: "04",
    title: "Kultur",
    before: "Kommer efter standards eftersom kultur är vad gruppen upprepar utan att ledaren tjatar.",
    do: "Fira rätt beteenden, korrigera avvikelser och låt spelarna bära nivån tillsammans.",
    output: "Miljön förstärker modellen även när träningen blir stressig.",
    icon: GitBranch,
    tone: "green" as Tone,
  },
  {
    no: "05",
    title: "Spelmodell",
    before: "Kommer när identitet, krav och kultur pekar åt samma håll.",
    do: "Översätt idén till skeden: anfall, försvar, omställningar, målvaktsspel och fasta situationer.",
    output: "Spelarna vet var de ska stå, vad de ska se och vilken nästa aktion som prioriteras.",
    icon: Layers,
    tone: "blue" as Tone,
  },
  {
    no: "06",
    title: "Principer och koncept",
    before: "Kommer efter modellen eftersom principerna ska vara modellens korta beslutsspråk.",
    do: "Gör principerna till cue-ord: stäng, vrid, ta ytan, prata med passningen, jaga direkt.",
    output: "Spelaren får få ord som går att agera på i fart.",
    icon: BookOpen,
    tone: "yellow" as Tone,
  },
  {
    no: "07",
    title: "Roller och truppbygge",
    before: "Kommer efter principerna eftersom varje roll måste bära samma modell på sin plats.",
    do: "Beskriv vad varje roll gör i varje skede och vilka egenskaper som krävs för rollen.",
    output: "Rätt spelare får rätt ansvar och rätt träningsfeedback.",
    icon: ClipboardList,
    tone: "green" as Tone,
  },
  {
    no: "08",
    title: "Fysik och hälsa",
    before: "Kommer efter rollerna eftersom belastningen ska följa hur vi faktiskt spelar.",
    do: "Koppla fys, återhämtning, skadeprevention och livsstil till löpkrav, duellkrav och intensitet.",
    output: "Spelare som orkar utföra modellen i minut 90 och håller över tid.",
    icon: Activity,
    tone: "red" as Tone,
  },
  {
    no: "09",
    title: "Träningsdesign",
    before: "Kommer efter kraven eftersom övningen ska träna rätt beteende i rätt belastning.",
    do: "Planera pass med tema, nyckelbeteenden, constraints, poängsystem och matchlika beslut.",
    output: "Träningen blir en repetition av modellen, inte lösryckta övningar.",
    icon: CheckCircle2,
    tone: "blue" as Tone,
  },
  {
    no: "10",
    title: "Analys och lärandeloop",
    before: "Kommer efter träningsdesignen eftersom vi först måste veta vilka beteenden vi försökte skapa.",
    do: "Följ upp video och data: bollvinster, spelvändningar, attacker i assistytan, spelare i boxen och bolltapp.",
    output: "Vi justerar utifrån vad som faktiskt händer och kopplar lärdomarna tillbaka till kedjan.",
    icon: BarChart3,
    tone: "green" as Tone,
  },
  {
    no: "11",
    title: "Matchplan och kommunikation",
    before: "Kommer sist eftersom matchplanen är en anpassning av systemet, inte systemet självt.",
    do: "Anpassa triggers, fällor, fasta och cue-ord till motståndaren utan att tappa vår modell.",
    output: "Spelarna får få ord, tydliga handlingar och en plan de kan bära under press.",
    icon: MessageSquare,
    tone: "yellow" as Tone,
  },
];

const everydayLoop = [
  "Före träning: välj vilken del av kedjan passet ska stärka.",
  "Start av träning: säg temat, beteendet och varför det hänger ihop med identiteten.",
  "Under träning: höj intensiteten med yta, tid, poäng, återstart och numerär.",
  "Efter träning: skriv vad vi ville se, vad vi såg och vilket led som behöver skärpas.",
  "Inför match: ta bara med det som hjälper spelaren att agera snabbare.",
  "Efter match: koppla lärdomar tillbaka till identitet, standard och modell.",
];

type SpelideLevel = {
  no: string;
  kicker: string;
  title: string;
  text: string;
  next: string;
  icon: LucideIcon;
  tone: Tone;
  funkade?: string;
  funkadeEj?: string;
  to?: string;
};

const nySpelideCore = {
  kicker: "Värdeord",
  word: "Vi är förberedda.",
  text:
    "Det egna tränarspåret. Ett värdeord som allt annat hänger på — spelidé, spelmodell, matchcase och din egen närvaro. Frågan före varje val: är vi förberedda?",
};

const nySpelideLevels: SpelideLevel[] = [
  {
    no: "01",
    kicker: "Värdeord",
    title: "Vi är förberedda",
    text:
      "Icke förhandlingsbart. Allt vi gör ska gå att spåra tillbaka hit. Förberedelse före allt annat — i planering, i ansvar och i känsla.",
    next: "Formulera värdeordet i en mening alla kan upprepa.",
    icon: ShieldCheck,
    tone: "yellow",
  },
  {
    no: "02",
    kicker: "Spelidé",
    title: "Så vill vi spela",
    text:
      "Hur vi vill spela med boll, utan boll och i båda omställningarna. Kort nog att rymmas på en sida och tydligt nog att en spelare kan upprepa det.",
    next: "Skriv spelidén på 1 sida.",
    icon: Compass,
    tone: "blue",
  },
  {
    no: "03",
    kicker: "Spelmodell · 5⁵",
    title: "Förutsättningar och principer",
    text:
      "5 upphöjt i fem är grunden till egen spelmodell och tränarskap. Lista vad som krävs för att modellen ska fungera och koppla varje krav till en princip per spelfas.",
    next: "Lista förutsättningarna och koppla dem till spelmodellens principer.",
    icon: Layers,
    tone: "green",
    to: "/under-process/5-upphojt-i-fem",
  },
  {
    no: "04",
    kicker: "Matchcase · Flora / Floden",
    title: "Vad fungerade?",
    text:
      "Spelarna fick mer ansvar tidigare än förr. Skriv både det som höll och det som inte höll — annars blir caset bara en bekräftelse.",
    funkade: "Alla i tid · fördelat ansvar före match · lättsam känsla · bättre förberedda.",
    funkadeEj: "Fyll i: vad höll inte, och vilken lärdom om ansvar tar vi med?",
    next: "Gör matchcaset: vad fungerade, vad fungerade inte, vilken lärdom om ansvar?",
    icon: BarChart3,
    tone: "blue",
  },
  {
    no: "05",
    kicker: "Tränaren själv",
    title: "Närvaro under anspänning",
    text:
      "Lära sig älska känslan av nervositet och full närvaro. En personlig rutin som tar dig till full närvaro varje match.",
    next: "Skapa en personlig matchrutin.",
    icon: HeartPulse,
    tone: "red",
  },
];

function OwnerOnlySystem() {
  const { session, loading } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

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
              05
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
            Coachens arbetsmodell från vision till matchplan.
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
          <aside className="space-y-4">
            <Link
              to="/under-process/spelmodell-neon"
              className="group flex items-center gap-4 border border-cyan-400/70 bg-slate-950 p-5 transition-colors hover:bg-slate-900"
            >
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center border border-cyan-400 bg-cyan-400/10 text-cyan-300">
                <MonitorPlay className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  Interaktivt deck · WIP
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-base font-black text-white">
                  Spelmodell Neon
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.4} />
                </span>
                <span className="mt-1 block text-xs font-semibold leading-relaxed text-white/55">
                  Helskärms-presentation av tränarskapets portfölj.
                </span>
              </span>
            </Link>

            <div className="border border-emerald-400/60 bg-emerald-50 p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                Sammanfattning
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-foreground">
                Ett system, inte en checklista.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                Modellen kopplar ihop vision, identitet, ledarskap, kultur, spelmodell,
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
                    <StepCell label="Varför här" text={step.before} tone={step.tone} />
                    <StepCell label="Insats" text={step.do} tone={step.tone} />
                    <StepCell label="Påverkar nästa led" text={step.output} tone={step.tone} />
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

function OwnerNySpelide() {
  const { session, loading } = useAuthSession();
  const isOwner = isOwnerEmail(session?.user?.email);

  if (loading || !isOwner) {
    return null;
  }

  return (
    <AccordionItem value="ny-spelide" className="border-t border-border">
      <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
        <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-violet-400 bg-violet-50 font-mono text-[11px] font-black text-violet-700">
              06
            </span>
            <span>
              <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                Ny spelidé – Vi är förberedda
              </span>
              <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Låst · värdeord → spelmodell → match
              </span>
            </span>
          </span>
          <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
            Eget tränarspår: från värdeord till matchrutin.
          </span>
        </span>
      </AccordionTrigger>

      <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
          <aside className="space-y-4">
            <div className="border border-violet-300/70 bg-violet-50 p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                {nySpelideCore.kicker}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-foreground">
                {nySpelideCore.word}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                {nySpelideCore.text}
              </p>
            </div>

            <div className="border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Compass className="h-4 w-4 text-violet-700" strokeWidth={2.3} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                  Spårets fem steg
                </p>
              </div>
              <ol className="space-y-2.5">
                {nySpelideLevels.map((level) => (
                  <li key={level.no} className="grid grid-cols-[24px_1fr] gap-2 text-sm leading-relaxed text-foreground/80">
                    <span className="font-mono text-[10px] font-black text-violet-700">
                      {level.no}
                    </span>
                    <span>{level.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="space-y-3">
            {nySpelideLevels.map((level) => {
              const Icon = level.icon;
              return (
                <article key={level.no} className="border border-border bg-card p-4 md:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={["grid h-9 w-9 place-items-center border font-mono text-[10px] font-black", TONE_BG[level.tone], TONE_TEXT[level.tone]].join(" ")}>
                        {level.no}
                      </span>
                      <div>
                        <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[level.tone]].join(" ")}>
                          {level.kicker}
                        </p>
                        <h3 className="text-lg font-black uppercase leading-tight text-foreground">
                          {level.title}
                        </h3>
                      </div>
                    </div>
                    <Icon className={["h-5 w-5", TONE_TEXT[level.tone]].join(" ")} strokeWidth={2.2} />
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/76">{level.text}</p>

                  {level.funkade ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <StepCell label="Fungerade" text={level.funkade} tone="green" />
                      <StepCell label="Att fylla i" text={level.funkadeEj ?? ""} tone="red" />
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-start gap-2 border-t border-border pt-3">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-violet-700">
                      Nästa handling
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground/85">
                      {level.next}
                    </span>
                  </div>

                  {level.to ? (
                    <Link
                      to={level.to}
                      className="group mt-3 inline-flex items-center gap-1.5 border border-violet-400 bg-violet-50 px-3 py-2 text-sm font-black text-violet-700 transition-colors hover:bg-violet-100"
                    >
                      Öppna 5⁵
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.4} />
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
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
        defaultValue="rod-trad"
        className="overflow-hidden rounded-md border border-border bg-card"
      >
        <AccordionItem value="rod-trad" className="border-0">
          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
            <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-amber-400 bg-amber-50 font-mono text-[11px] font-black text-amber-700">
                  01
                </span>
                <span>
                  <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                    Start här: röd tråd
                  </span>
                  <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Vision · identitet · standards · spelmodell
                  </span>
                </span>
              </span>
              <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
                Ordningen från viktigast till minst viktigt, och varför allt hänger ihop.
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.55fr]">
              <div className="border border-amber-400/60 bg-amber-50 p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Kärnregel
                </p>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground md:text-lg">
                  Vi börjar aldrig med övningar. Vi börjar med varför laget finns, vad vi ska visa, och vilka beteenden som måste hålla när pressen kommer.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Kedjan går från mest stabilt till mest konkret: visionen styr identiteten, identiteten styr standarderna,
                  standarderna bär kulturen, kulturen gör spelmodellen möjlig, och träningsdesignen levererar modellen varje vecka.
                </p>
                <div className="mt-5 border-t border-amber-400/40 pt-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                    Läseriktning
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/80">
                    Uppifrån och ned för att bygga. Nedifrån och upp för att felsöka.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {hierarchy.map((level) => (
                  <article key={level.no} className="border border-border bg-card p-4 md:p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={["grid h-9 w-9 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[level.tone], TONE_TEXT[level.tone]].join(" ")}>
                          {level.no}
                        </span>
                        <div className="min-w-0">
                          <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[level.tone]].join(" ")}>
                            {level.weight}
                          </p>
                          <h2 className="mt-1 text-lg font-black uppercase leading-tight text-foreground">
                            {level.title}
                          </h2>
                        </div>
                      </div>
                      <p className="max-w-sm text-sm font-semibold leading-relaxed text-foreground/70 md:text-right">
                        {level.output}
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <StepCell label="Varför här" text={level.why} tone={level.tone} />
                      <StepCell label="Sitter ihop med" text={level.connects} tone={level.tone} />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-emerald-700" strokeWidth={2.3} />
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                    Påverkanskarta
                  </p>
                </div>
                <div className="grid gap-3">
                  {relationMap.map((relation) => (
                    <div key={relation.from} className="border-l-2 border-emerald-400 pl-4">
                      <p className="text-sm font-black uppercase leading-tight text-foreground">
                        {relation.from} → {relation.to}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/72">{relation.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {usageAreas.map((area) => (
                  <article key={area.title} className={["border p-4", TONE_BG[area.tone]].join(" ")}>
                    <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[area.tone]].join(" ")}>
                      Används när
                    </p>
                    <h3 className="mt-2 text-base font-black uppercase leading-tight text-foreground">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/75">{area.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="kallbild-case" className="border-t border-border">
          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
            <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-emerald-400 bg-emerald-50 font-mono text-[11px] font-black text-emerald-700">
                  02
                </span>
                <span>
                  <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                    Källbild och case
                  </span>
                  <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Forskning · förbund · tränare · omfattning
                  </span>
                </span>
              </span>
              <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
                Vad som gäller, i vilken ordning, och hur det ser ut i praktiken.
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.58fr]">
              <div className="border border-emerald-400/60 bg-emerald-50 p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                  Syntes
                </p>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground md:text-lg">
                  Den starkaste gemensamma linjen är: identitet och kontext först, spelmodell sedan, träning som matchlik leverans, analys sist som återkoppling.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Det skiljer i språk mellan Sverige, England, Tyskland och Spanien, men riktningen är densamma:
                  spelaren ska förstå spelet i situationer, inte bara utföra isolerade instruktioner.
                </p>
                <div className="mt-5 border-t border-emerald-400/40 pt-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                    Praktisk regel
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/80">
                    En källa eller ett elitcase får bara komma in om det hjälper oss förklara nästa led i Gunnilses kedja.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {researchLoop.map((item) => (
                  <article key={item.no} className="border border-border bg-card p-4 md:p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={["grid h-9 w-9 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[item.tone], TONE_TEXT[item.tone]].join(" ")}>
                          {item.no}
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-lg font-black uppercase leading-tight text-foreground">
                            {item.title}
                          </h2>
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={["mt-1 inline-flex items-center gap-1 text-xs font-black leading-snug underline-offset-4 hover:underline", TONE_TEXT[item.tone]].join(" ")}
                          >
                            {item.source}
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.3} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <StepCell label="Gäller" text={item.applies} tone={item.tone} />
                      <StepCell label="Omfattning" text={item.extent} tone={item.tone} />
                      <StepCell label="Case" text={item.case} tone={item.tone} />
                      <StepCell label="Gunnilse" text={item.translation} tone={item.tone} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="huvudprinciper" className="border-t border-border">
          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
            <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-red-400 bg-red-50 font-mono text-[11px] font-black text-red-700">
                  03
                </span>
                <span>
                  <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                    Träningsprinciper
                  </span>
                  <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Intensitet · scanning · rättvänd · förståelse
                  </span>
                </span>
              </span>
              <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
                Verktygen som gör spelidén synlig i varje pass.
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.45fr]">
              <div className="border border-red-300/70 bg-red-50 p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-red-700">
                  Varför
                </p>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground md:text-lg">
                  Träningsprinciperna kommer efter den röda tråden. De är inte visionen, men de är verktygen som får visionen att hända i tempo.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Varje pass ska kunna svara på tre frågor: vilket beteende tränar vi, vilken princip hör det till, och hur höjer vi intensiteten utan att tappa kvalitet?
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

        <AccordionItem value="formularet" className="border-t border-border">
          <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
            <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-sky-400 bg-sky-50 font-mono text-[11px] font-black text-sky-700">
                  04
                </span>
                <span>
                  <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                    Formuläret
                  </span>
                  <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Återkoppling · vad ni ser
                  </span>
                </span>
              </span>
              <span className="hidden max-w-xs text-right text-xs font-semibold leading-relaxed text-foreground/60 md:block">
                Skriv konkret — det styr vad vi tränar på.
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-border bg-background px-4 pb-6 pt-5 md:px-6">
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.45fr]">
              <div className="border border-sky-300/70 bg-sky-50 p-5">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
                  Varför
                </p>
                <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">
                  Formuläret är inte bara en kontroll. Det hjälper oss ledare att
                  förstå vad ni ser, vad ni kan och vad vi behöver träna mer på.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Skriv konkret: vad såg du, vad gjorde vi bra och vad behöver bli bättre?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <article className="border border-rose-300/80 bg-rose-50 p-5">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
                    Svagt svar
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    &ldquo;Det gick bra.&rdquo;
                  </p>
                </article>
                <article className="border border-emerald-300/80 bg-emerald-50 p-5">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                    Bra svar
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    &ldquo;Vi lyckades vända spelet till högerkanten flera gånger, men
                    när vi ledde blev vi för långa i laget och tappade kontroll.&rdquo;
                  </p>
                </article>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <OwnerOnlySystem />
        <OwnerNySpelide />
      </Accordion>
    </SectionReveal>
  </>
);

export default UnderProcess;
