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
    output: "Duellspel, andrabollspel, scanning, rättvänd spelare och prata med passning.",
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
      "Gunnilse: 'Vi kommer förberedda' blir inte ett motto. Det blir filter för närvaro, passupplägg, matchplan, ansvar och kroppsspråk.",
    guardrail:
      "Använd som strukturstöd, inte som kopia. Prisma ska börja i Gunnilses verkliga problem och din egen tränartaktik.",
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
    guardrail:
      "Formationen får aldrig bli huvudmodell. Den är bara startbilden för beteenden, avstånd, triggers och nästa aktion.",
    tone: "blue" as Tone,
  },
  {
    no: "03",
    title: "Principer och subprinciper före övningsbank",
    source: "Taktisk periodisering · constraints-led metodik",
    sourceUrl: "https://spielverlagerung.com/2020/05/23/understanding-the-tactical-periodization-methodology/",
    applies:
      "Varje övning ska representera ett beteende i spelmodellen. Fysik, teknik och psykologi tränas genom det taktiska syftet.",
    extent:
      "Bygg passet runt ett tema. Max 1 huvudprincip, 1-2 subprinciper och 3 observerbara beteenden per träning.",
    case:
      "Mourinho/Porto-spåret gjorde spelidén till veckans organisatoriska centrum: träna som du vill spela, inte först fys och sedan fotboll.",
    translation:
      "Gunnilse: om temat är återerövring ska yta, regler, poäng och coachning tvinga fram direkt jakt efter bolltapp.",
    guardrail:
      "Det här är ett metodspår, inte en lag. Behåll principen: passet ska bära spelmodellen, men anpassa dos och belastning till laget.",
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
      "Sikta på hög nettotid och mycket spel i matchlika former. Exakta procentsatser ska styras av ålder, belastning och veckans syfte.",
    case:
      "Smålagsspel ger många aktioner per spelare och kan påverka både aerob kapacitet och teknisk-taktiska beteenden.",
    translation:
      "Gunnilse: maximal intensitet skapas med små ytor, korta block, återstart, poäng för rätt beteende och få stopp.",
    guardrail:
      "Matchlikt betyder inte att ledaren blir passiv. Designa constraints, coacha cue-ord och stoppa när nästa aktion blir tydligare.",
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
    guardrail:
      "Coachcase ska bara användas som spegel. Det viktiga är konsekvent språk, få prioriteringar och att spelarna förstår nästa handling.",
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
    guardrail:
      "Kopiera inte elitlagets lösning. Översätt situationen till Gunnilses nivå, roller, tid och träningsmiljö.",
    tone: "green" as Tone,
  },
];

const handoffChecks = [
  {
    from: "Planering",
    to: "Vision",
    question: "Vilket problem ska Vi kommer förberedda lösa först?",
    deliver: "Ett prioriterat problem, en avgränsning och ett beslut om vad som väntar.",
    warning: "Om allt är lika viktigt finns ingen modell ännu.",
    tone: "yellow" as Tone,
  },
  {
    from: "Vision",
    to: "Identitet",
    question: "Vilka beteenden visar att vi faktiskt kommer förberedda?",
    deliver: "Fem beteenden med godkänt, inte nog, cue och matchcase.",
    warning: "Om beteendet inte går att se på planen är det fortfarande bara värdeord.",
    tone: "green" as Tone,
  },
  {
    from: "Identitet",
    to: "Spelmodell",
    question: "I vilken fas ska beteendet avgöra matchen?",
    deliver: "En fasrad: spelbild, huvudprincip, spelarhandling, mätpunkt.",
    warning: "Om varje fas får fem principer tappar spelaren riktning.",
    tone: "blue" as Tone,
  },
  {
    from: "Spelmodell",
    to: "Träning",
    question: "Vilken övningsregel tvingar fram modellens beteende?",
    deliver: "Tema, yta, tid, motstånd, poäng, cue och stoppregel.",
    warning: "Om övningen kan lyckas utan beteendet är passet inte kopplat till modellen.",
    tone: "red" as Tone,
  },
  {
    from: "Träning",
    to: "Matchplan",
    question: "Vad har veckan bevisat att vi kan bära in i match?",
    deliver: "Tre matchnycklar: med boll, utan boll, nästa boll.",
    warning: "Om matchplanen lägger till nya språk precis före matchen blir den brus.",
    tone: "yellow" as Tone,
  },
  {
    from: "Matchplan",
    to: "Omklädningsrum",
    question: "Vad behöver spelaren komma ihåg när pulsen går upp?",
    deliver: "En minut: riktning, första aktion, tre nycklar, halvtidsfråga.",
    warning: "Om spelarna inte kan återberätta planen är den för lång.",
    tone: "blue" as Tone,
  },
  {
    from: "Match",
    to: "Nästa loop",
    question: "Vad syntes, vad saknades och vad ska vi göra om direkt?",
    deliver: "Behåll, skärp, parkera och nästa veckas första problem.",
    warning: "Om analysen inte ändrar träning eller bekräftar kursen är den lös.",
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
  word: "Vi kommer förberedda.",
  text:
    "Det egna tränarspåret. Ett värdeord som allt annat hänger på — spelidé, spelmodell, matchcase och din egen närvaro. Frågan före varje val: kommer vi förberedda?",
};

const nySpelideLevels: SpelideLevel[] = [
  {
    no: "01",
    kicker: "Värdeord",
    title: "Vi kommer förberedda",
    text:
      "Icke förhandlingsbart. Allt vi gör ska gå att spåra tillbaka hit. Förberedelse före allt annat — i planering, i ansvar, i kommunikation och i första aktionen.",
    next: "Formulera värdeordet i en mening alla kan upprepa.",
    icon: ShieldCheck,
    tone: "yellow",
  },
  {
    no: "02",
    kicker: "Identitet",
    title: "Fem beteenden som visar förberedelse",
    text:
      "Duellspel, andrabollspel, scanning, rättvänd spelare och prata med passning. Identiteten är vår spelidé i vardagsform: den ska synas i varje övning, match och korrigering.",
    next: "Gör varje identitetsord till godkänt/icke godkänt beteende.",
    icon: Compass,
    tone: "blue",
  },
  {
    no: "03",
    kicker: "Spelidé",
    title: "Vi ser först, vinner nästa kamp och spelar framåt",
    text:
      "Vi vill vara laget som är redo innan situationen händer: ser ytan före touchen, pratar passningen före bollen går, blir rättvända för att spela framåt och vinner kampen direkt efter varje lös boll.",
    next: "Skriv spelidén som en sida: med boll, utan boll och i båda omställningarna.",
    icon: Layers,
    tone: "green",
    to: "/under-process/5-upphojt-i-fem",
  },
  {
    no: "04",
    kicker: "Spelmodell · första utkast",
    title: "Fem faser, samma identitet",
    text:
      "Anfall, försvar, omställning anfall, omställning försvar och fasta situationer ska alla kunna spåras till samma fem identitetsbeteenden.",
    next: "Välj en huvudprincip per fas och två cue-ord som spelaren kan bära.",
    icon: BarChart3,
    tone: "blue",
  },
  {
    no: "05",
    kicker: "Träning och feedback",
    title: "Förberedelse mäts i beteenden",
    text:
      "Varje pass behöver tema, identitetsbeteende, constraint, cue och återkoppling. Formuläret blir användbart först när svaret kopplas till vilket beteende vi försökte skapa.",
    funkade: "Bra svar: vi vann fler andrabollar efter återstart, men tappade scanning när vi blev trötta.",
    funkadeEj: "Svagt svar: det gick bra. Det går inte att koppla till nästa träning.",
    next: "Efter varje pass: vad ville vi se, vad såg vi, vilket beteende behöver nästa repetition?",
    icon: BarChart3,
    tone: "green",
  },
  {
    no: "06",
    kicker: "Tränaren själv",
    title: "Närvaro under anspänning",
    text:
      "Coachens personliga taktik är att komma förberedd nog att vara närvarande. När nervositeten kommer ska rutinen göra dig skarp, lugn och tydlig.",
    next: "Skapa en personlig matchrutin.",
    icon: HeartPulse,
    tone: "red",
  },
];

const identityBehaviors = [
  {
    title: "Duellspel",
    why: "Förberedelse syns först i modet att gå in i kampen med rätt kropp, rätt timing och nästa aktion redo.",
    looksLike: "Vi går in i duellen med balans, riktning och beredskap för nästa boll. Vi söker kroppskontakt när situationen kräver det och backar inte ur kampen.",
    notEnough: "Vi hamnar bredvid, väntar på att någon annan agerar eller vinner duellen men tappar nästa aktion.",
    training: "Poängsätt vunnen duell plus kontrollerad nästa passning.",
    matchCase: "Lång boll mot vår ytterback: första spelaren stör, närmaste mittfältare säkrar andrabollen och laget trycker upp direkt.",
    cue: "Vinn kampen, spela nästa.",
    tone: "red" as Tone,
  },
  {
    title: "Andrabollspel",
    why: "Laget som är förberett förstår att första bollen sällan avgör. Nästa boll gör det.",
    looksLike: "Vi läser var bollen kan landa innan första duellen är avgjord och har minst en spelare som attackerar yta två.",
    notEnough: "Vi tittar på duellen, står platt eller reagerar först när bollen redan är fri.",
    training: "Starta om varje block med lös boll, retur eller avskärmad passning.",
    matchCase: "Efter rensning från motståndaren är vår sexa redan under bollen, vinner fri boll och spelar rättvänd spelare på första eller andra touch.",
    cue: "Först på fri boll.",
    tone: "yellow" as Tone,
  },
  {
    title: "Scanning",
    why: "Vi kommer förberedda när vi har sett yta, motståndare och medspelare innan bollen kommer.",
    looksLike: "Spelaren tittar över axeln före passning, justerar kroppsvinkel och vet om nästa aktion ska vara framåt, bakåt eller vägg.",
    notEnough: "Spelaren upptäcker pressen efter mottagning, tar extra touch och gör passningen långsam.",
    training: "Belöna spelare som scannar före mottagning och kan spela på ett tillslag.",
    matchCase: "Innermittfältaren scannar innan boll från mittback, tar emot halvt rättvänd och hittar tredje spelare mellan linjer.",
    cue: "Se före touch.",
    tone: "blue" as Tone,
  },
  {
    title: "Rättvänd spelare",
    why: "Rättvänd kropp gör nästa aktion snabbare. Det är förberedelse i position, vinkel och första touch.",
    looksLike: "Vi söker spelare som kan ta första touch framåt eller spela vidare med kroppen mot motståndarens mål.",
    notEnough: "Vi spelar ofta på felvänd spelare utan stöd, vilket gör att nästa passning blir bakåt eller att vi tappar tempo.",
    training: "Skapa regler där poäng bara räknas efter rättvänd mottagning eller tredje man.",
    matchCase: "Ytterback spelar inte på täckt nia, utan hittar rättvänd sexa som kan byta sida innan pressen kommer.",
    cue: "Vänd mot spelet.",
    tone: "green" as Tone,
  },
  {
    title: "Prata med passning",
    why: "Passningen ska ge mottagaren information: fart, fot, riktning och vad nästa aktion bör bli.",
    looksLike: "Passningen spelas på rätt fot, med rätt fart och i en riktning som hjälper mottagaren att ta nästa beslut snabbare.",
    notEnough: "Passningen träffar medspelaren men gör situationen svårare: fel fot, för lös, bakom kroppen eller utan nästa yta.",
    training: "Kravställ passning på rätt fot och låt mottagaren bedöma om passningen hjälpte nästa aktion.",
    matchCase: "Mittback spelar hårt på ytters fot så första touchen tar oss förbi pressen i stället för att låsa oss mot linjen.",
    cue: "Säg det med bollen.",
    tone: "yellow" as Tone,
  },
];

const spelmodellDraft = [
  {
    phase: "Anfall",
    principle: "Spela framåt när vi kan, förbered nästa passning när vi inte kan.",
    gamePicture: "Vi vill skapa rättvänd spelare bakom eller bredvid första pressen. Om framåtpassningen inte finns ska nästa passning göra den möjlig.",
    identity: "Scanning · rättvänd spelare · prata med passning",
    playerAction: "Mittback söker rättvänd sexa, sexa söker tredje spelare, ytter hotar yta bakom och bollhållare pratar med passningens fart/fot.",
    training: "Positionsspel 6v4 eller 7v5 med poäng för rättvänd mottagning, tredje man och passning som sätter fart framåt.",
    measure: "Antal rättvända mottagningar, passningar genom linje och aktioner efter scanning.",
    nextStep: "Bestäm vilka ytor vi prioriterar: central rättvänd spelare, yttre korridor eller tredje spelare mellan linjer.",
    tone: "blue" as Tone,
  },
  {
    phase: "Omställning försvar",
    principle: "Första reaktionen efter bolltapp är jakt, skydd och andraboll.",
    gamePicture: "När vi tappar bollen ska närmaste spelare bromsa, näst närmaste stänga framåtpassning och resten samla yta två.",
    identity: "Duellspel · andrabollspel · scanning",
    playerAction: "Första spelaren pressar boll, andra säkrar passningsväg, tredje plockar andraboll. Alla vet sin första reaktion innan tappet händer.",
    training: "Smålagsspel där bolltapp direkt ger fem sekunder återerövringschans med extra poäng och omedelbar återstart vid passiv reaktion.",
    measure: "Bollvinster inom fem sekunder, stoppade kontringar och närmaste spelares reaktionstid.",
    nextStep: "Definiera vår trigger: dålig touch, felvänd motståndare eller passning in centralt.",
    tone: "red" as Tone,
  },
  {
    phase: "Försvar",
    principle: "Skydda mitten, pressa tillsammans och vinn nästa kamp.",
    gamePicture: "Vi vill göra motståndaren förutsägbar: bort från centrum, in i vår pressfälla och sedan vinna duell eller andraboll.",
    identity: "Duellspel · scanning · prata med passning",
    playerAction: "Bollnära spelare styr, bakomvarande spelare scannar hotet, laget kommunicerar vem som pressar, täcker och säkrar.",
    training: "Zonspel 8v8 med pressignaler: felvänd motståndare, dålig touch, passning mot kant. Poäng för bollvinst i vald yta.",
    measure: "Stängda centrala passningar, vunna dueller och bollvinster i önskad yta.",
    nextStep: "Välj om vår grundpress ska styra utåt mot kant eller inåt mot central fälla.",
    tone: "green" as Tone,
  },
  {
    phase: "Omställning anfall",
    principle: "Första blicken framåt, första passningen med mening.",
    gamePicture: "När vi vinner boll vill vi direkt se om motståndaren är öppen. Om inte, säkrar vi första passningen och blir rättvända.",
    identity: "Scanning · rättvänd spelare · prata med passning",
    playerAction: "Bollvinnare scannar före första touch, närmaste spelare erbjuder rättvänd vinkel och passningen visar om vi ska attackera eller vila.",
    training: "Vinn boll och attackera mini-mål eller fri yta inom tre passningar. Extra poäng om första passning hjälper mottagaren framåt.",
    measure: "Första passning framåt, spelare rättvänd efter bollvinst och avslut efter återerövring.",
    nextStep: "Bestäm våra tre första alternativ efter bollvinst: djupled, rättvänd mittfältare eller säkra och flytta upp.",
    tone: "yellow" as Tone,
  },
  {
    phase: "Fasta situationer",
    principle: "Vi är förberedda innan bollen ligger still.",
    gamePicture: "Fasta ska visa samma identitet: vinna första duellen, vara först på andra bollen och kommunicera ansvar innan signalen.",
    identity: "Duellspel · andrabollspel · prata med passning",
    playerAction: "Alla vet zon, markering, screen, löpning och andrabollsroll. Ingen väntar på att bollen ska slås innan rollen startar.",
    training: "Repetera startposition, signal, yta två och andrabollsberedskap. Kör korta block med direkt returspel efter första boll.",
    measure: "Första kontakt, andraboll efter fast situation och tydlighet i ansvar.",
    nextStep: "Skapa två offensiva och två defensiva fasta med samma språk: signal, attackyta, skydd, andraboll.",
    tone: "blue" as Tone,
  },
];

const prismaFlow = [
  {
    label: "Ljus in",
    title: "Vision",
    text: "Vi kommer förberedda. Det är personlig taktik, lagets kravbild och första frågan före varje beslut.",
    tone: "yellow" as Tone,
  },
  {
    label: "Prismats ytor",
    title: "Identitet",
    text: "Duellspel, andrabollspel, scanning, rättvänd spelare och prata med passning gör visionen synlig.",
    tone: "green" as Tone,
  },
  {
    label: "Färger ut",
    title: "Spelmodell",
    text: "Samma identitet bryts ut i anfall, försvar, båda omställningarna och fasta situationer.",
    tone: "blue" as Tone,
  },
  {
    label: "Tillbaka in",
    title: "Träning och återkoppling",
    text: "Varje pass och varje svar ska säga vilket beteende vi tränar, såg och behöver förstärka.",
    tone: "red" as Tone,
  },
];

const processSteps = [
  {
    no: "01",
    title: "Starta arbetsytan",
    purpose: "Skapa en gemensam startpunkt innan ni börjar välja övningar, formation eller slogans.",
    action: "Bestäm ägare, nuläge, målbild, tidsram och vilken del av Prisma 2026 som byggs först.",
    done: "Det finns en arbetsyta, en ägare, ett första problem och ett beslut om vad som inte ska lösas ännu.",
    conversation: "Vilket problem måste modellen lösa först för att nästa träningsvecka ska bli tydligare?",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Sätt visionen",
    purpose: "Visionen är filtret som gör att varje senare val får riktning.",
    action: "Formulera vad Vi kommer förberedda betyder i match, träning, ledarskap, spelaransvar och matchförberedelse.",
    done: "Visionen kan sägas på en mening, testas mot exempel och användas för att välja bort saker.",
    conversation: "När märks det direkt att vi inte kommer förberedda?",
    tone: "green" as Tone,
  },
  {
    no: "03",
    title: "Definiera identiteten",
    purpose: "Identiteten gör visionen observerbar i beteenden.",
    action: "Sätt G/IG, matchcase och träningssignal för duellspel, andrabollspel, scanning, rättvänd spelare och prata med passning.",
    done: "Spelare och ledare kan känna igen, coacha och återkoppla varje beteende utan lång förklaring.",
    conversation: "Vilket identitetsbeteende saknas oftast när vi tappar kontroll?",
    tone: "blue" as Tone,
  },
  {
    no: "04",
    title: "Bygg spelmodellen",
    purpose: "Modellen visar hur identiteten ska se ut i varje spelfas.",
    action: "Välj en huvudprincip per fas och koppla varje fas till spelbild, identitet, spelarhandling, träning och mätpunkt.",
    done: "Anfall, försvar, omställningar och fasta kan förklaras med samma språk och bli första träningsveckan.",
    conversation: "Vilken fas behöver tydligast första version redan nu?",
    tone: "red" as Tone,
  },
  {
    no: "05",
    title: "Designa träningen",
    purpose: "Träningen är leveransen av modellen, inte en separat övningsbank.",
    action: "Gör första träningsveckan: tema, constraint, cue, poängsystem och återkopplingsfråga.",
    done: "Varje pass kan kopplas till en fas och ett identitetsbeteende.",
    conversation: "Vilken regel i övningen tvingar fram beteendet vi vill se?",
    tone: "yellow" as Tone,
  },
  {
    no: "06",
    title: "Onboarda laget",
    purpose: "Spelarna behöver få få ord, tydliga exempel och en roll i modellen.",
    action: "Skapa onboarding: 15 minuter vision, fem identitetskort, ett matchcase och första veckans fokus.",
    done: "Nya och befintliga spelare vet vad Prisma 2026 kräver av dem redan första veckan.",
    conversation: "Vad behöver en ny spelare förstå innan sin första träning?",
    tone: "green" as Tone,
  },
  {
    no: "07",
    title: "Ledarteamets samtal",
    purpose: "Ledarteamet måste bära samma språk, annars blir modellen flera parallella idéer.",
    action: "Håll ett veckosamtal: vad såg vi, vad saknas, vad coachar vi lika, vad ändrar vi inte?",
    done: "Alla ledare coachar samma identitet och vet veckans prioriterade beteende.",
    conversation: "Vilken korrigering ska alla ledare säga likadant den här veckan?",
    tone: "blue" as Tone,
  },
  {
    no: "08",
    title: "Mät och justera",
    purpose: "Feedbacken ska förbättra modellen, inte bara samla åsikter.",
    action: "Koppla formulär, video och matchreflektion till fas, identitet, mätpunkt och nästa träning.",
    done: "Varje feedback leder till en träningsjustering eller ett beslut att hålla fast vid modellen.",
    conversation: "Vilket bevis har vi för att beteendet faktiskt blev bättre?",
    tone: "red" as Tone,
  },
];

const foundationLoops = [
  {
    no: "01",
    title: "Starta arbetsytan",
    intent: "Göra Prisma till ett faktiskt arbetsflöde, inte en idébank.",
    input: "Nuläge från match/träning, kalender framåt, vilka ledare som är med, vilket problem som skaver mest.",
    work:
      "Skriv en arbetsrad: just nu bygger vi Prisma för att lösa ___. Välj ansvarig, deadline och första leverans.",
    output:
      "Prisma 2026 v0.1: en tydlig arbetsyta med ägare, första problem, första möte och första leverans.",
    critique:
      "Risk: ni försöker lösa allt direkt. Motdrag: parkera allt som inte hjälper första träningsveckan.",
    gate: "Gå vidare först när det finns ett enda prioriterat problem och alla vet vad som inte ingår.",
    previous: "Bygger på nuläget: vad ni ser i match, träning och ledarteam just nu.",
    next: "Låser upp steg 2 genom att visionen får ett konkret problem, en tidsram och en gräns.",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Sätt visionen",
    intent: "Göra Vi kommer förberedda till ett beslutssystem.",
    input: "Vilka matcher där laget känts förberett/oförberett, ledarens personliga taktik, spelaransvar före träning och match.",
    work:
      "Formulera visionen i tre nivåer: som tränare, som lag och som spelare. Testa den mot tre konkreta matchsituationer.",
    output:
      "En vision som kan användas i vardagen: vi kommer förberedda genom att se först, agera först och hjälpa nästa aktion.",
    critique:
      "Risk: visionen blir ett fint ord. Motdrag: varje mening måste kunna synas i ett beteende eller tas bort.",
    gate: "Gå vidare först när visionen kan avgöra vad ni ska träna mer, mindre eller inte alls.",
    previous: "Bygger på steg 1: visionen måste svara på det problem arbetsytan valde först.",
    next: "Låser upp steg 3 genom att identiteten får ett filter: bara beteenden som gör laget förberett får vara med.",
    tone: "green" as Tone,
  },
  {
    no: "03",
    title: "Definiera identiteten",
    intent: "Göra visionen mätbar utan att göra den stel.",
    input: "De fem orden: duellspel, andrabollspel, scanning, rättvänd spelare och prata med passning.",
    work:
      "För varje ord: skriv G, IG, ett matchcase, ett coachord och en träningsregel som tvingar fram beteendet.",
    output:
      "Fem identitetskort som ledare kan coacha och spelare kan förstå på under en minut.",
    critique:
      "Risk: fem ord blir fem separata projekt. Motdrag: bind alltid minst två identitetsord ihop i varje övning.",
    gate: "Gå vidare först när varje ord har ett konkret exempel på planen och en tydlig icke-godkänd variant.",
    previous: "Bygger på steg 2: varje identitetsord måste vara ett synligt uttryck för Vi kommer förberedda.",
    next: "Låser upp steg 4 genom att spelmodellen får fem beteenden att placera in i rätt fas och situation.",
    tone: "blue" as Tone,
  },
  {
    no: "04",
    title: "Bygg spelmodellen",
    intent: "Översätta identiteten till hur laget spelar i varje fas.",
    input: "Visionen, fem identitetskort, vanligaste matchproblemen och vilka faser som måste prioriteras först.",
    work:
      "Skriv en fasrad per fas: spelbild, huvudprincip, spelarhandling, identitet, träning, mätpunkt och nästa beslut.",
    output:
      "Första spelmodellen: fem fasrader som kan bli träningsvecka, matchgenomgång och återkoppling.",
    critique:
      "Risk: modellen blir för bred och tappar kraft. Motdrag: en huvudprincip per fas, inte fem.",
    gate: "Gå vidare först när varje fas kan coachas med ett par ord och tränas i en matchlik övning.",
    previous: "Bygger på steg 3: spelmodellen använder identitetskorten som spelarnas konkreta handlingar.",
    next: "Låser upp steg 5 genom att träningen kan byggas från fas, princip, beteende och mätpunkt.",
    tone: "red" as Tone,
  },
];

const modelSpine = [
  {
    no: "01",
    title: "Planera",
    visual: "Problem → avgränsning",
    summary: "Starta med vad modellen ska lösa först, inte med övningar eller formation.",
    connects: "Lämnar ett tydligt problem till visionen.",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    title: "Rikta",
    visual: "Vision → beslut",
    summary: "Gör Vi kommer förberedda till filtret för vad ni väljer, väljer bort och upprepar.",
    connects: "Lämnar ett krav till identiteten.",
    tone: "green" as Tone,
  },
  {
    no: "03",
    title: "Definiera",
    visual: "Ord → beteende",
    summary: "Gör duellspel, andrabollspel, scanning, rättvänd och passning till synliga handlingar.",
    connects: "Lämnar beteenden till spelmodellen.",
    tone: "blue" as Tone,
  },
  {
    no: "04",
    title: "Modellera",
    visual: "Beteende → fas",
    summary: "Placera identiteten i anfall, försvar, omställningar och fasta med en huvudprincip per fas.",
    connects: "Lämnar fas, cue och mätpunkt till träningen.",
    tone: "red" as Tone,
  },
  {
    no: "05",
    title: "Träna",
    visual: "Fas → repetition",
    summary: "Bygg pass där yta, tid, motstånd, poäng och stopp tvingar fram modellens beteende.",
    connects: "Lämnar bevis till matchplanen.",
    tone: "yellow" as Tone,
  },
  {
    no: "06",
    title: "Aktivera",
    visual: "Bevis → omklädningsrum",
    summary: "Koka ner veckan till få ord spelarna redan tränat och kan bära ut på planen.",
    connects: "Lämnar enkla matchnycklar till spelarna.",
    tone: "blue" as Tone,
  },
  {
    no: "07",
    title: "Lära",
    visual: "Match → nästa loop",
    summary: "Samla vad som syntes och saknades, och gör nästa vecka skarpare.",
    connects: "Lämnar bättre underlag till nästa planering.",
    tone: "green" as Tone,
  },
];

const sectionGuide = [
  {
    title: "Processplan",
    summary: "Visar hela resan från dag 1 till omklädningsrummet.",
    connection: "Ger läsaren ordningen innan detaljerna börjar.",
    tone: "yellow" as Tone,
  },
  {
    title: "Övergångskontroll",
    summary: "Förklarar vad varje steg måste lämna vidare.",
    connection: "Binder ihop stegen så modellen inte blir separata block.",
    tone: "blue" as Tone,
  },
  {
    title: "Åtta steg",
    summary: "Bryter ner appflödet i byggbara arbetsmoment.",
    connection: "Gör helhetsresan praktisk: gör, klart när, samtal.",
    tone: "green" as Tone,
  },
  {
    title: "Hierarkisk tratt",
    summary: "Visar vad som är viktigast och vad som är mest konkret.",
    connection: "Gör det tydligt var du backar när något känns oklart.",
    tone: "red" as Tone,
  },
  {
    title: "Steg 1-4",
    summary: "Fördjupar grundbygget innan träning och matchplan.",
    connection: "Skyddar modellen från att hoppa för snabbt till övningar.",
    tone: "yellow" as Tone,
  },
  {
    title: "Helhetsresa",
    summary: "Visar den längre tidslinjen och veckorytmen.",
    connection: "Gör modellen planeringsbar över dagar, vecka och matchdag.",
    tone: "blue" as Tone,
  },
  {
    title: "Överlappskarta",
    summary: "Visar hur vision, identitet, spelmodell, träning och onboarding påverkar varandra.",
    connection: "Gör att samma idé kan finnas i flera områden utan att bli rörig.",
    tone: "green" as Tone,
  },
  {
    title: "Spelarbrief",
    summary: "Kokar ner modellen till vad spelarna ska höra när dörren stängs.",
    connection: "Bevisar om allt innan går att säga enkelt.",
    tone: "red" as Tone,
  },
  {
    title: "Vision till spelmodell",
    summary: "Förklarar hur Vi kommer förberedda blir identitet, faser och träning.",
    connection: "Binder idé, beteende och spelhandling till samma språk.",
    tone: "yellow" as Tone,
  },
  {
    title: "Källbild",
    summary: "Visar stöd och begränsningar från förbund, metodik och forskning.",
    connection: "Faktagranskar modellen utan att göra den till en kopia av någon annan.",
    tone: "blue" as Tone,
  },
];

const planningJourney = [
  {
    no: "01",
    window: "Dag 1",
    title: "Planeringsstadiet",
    purpose: "Skapa ordning innan idéerna börjar tävla med varandra.",
    input: "Nuläge, problem, kalender, ledarteam, spelargrupp och din personliga taktik: Vi kommer förberedda.",
    action: "Välj ett prioriterat matchproblem och skriv vad Prisma 2026 måste hjälpa laget att göra annorlunda.",
    artifact: "Prisma-brief v0.1: problem, målbild, avgränsning, ansvarig, första leverans.",
    checkpoint: "Om ni inte kan säga vad som inte ingår är modellen för bred.",
    overlap: "Vision + ledarskap + tidsplan.",
    next: "Nu kan ledarteamet prata om samma problem i stället för att börja i olika lösningar.",
    tone: "yellow" as Tone,
  },
  {
    no: "02",
    window: "Dag 2-3",
    title: "Ledarteamets första samtal",
    purpose: "Göra modellen gemensam innan den möter spelarna.",
    input: "Prisma-briefen från dag 1 och ledarnas bild av vad spelarna behöver förstå först.",
    action: "Sätt visionen i tre nivåer: tränarens beteende, lagets beteende och spelarens beteende.",
    artifact: "Ledarspråk: fem ord, tre exempel, tre saker vi slutar acceptera.",
    checkpoint: "Om ledarna använder olika ord kommer spelarna få flera modeller samtidigt.",
    overlap: "Vision + identitet + standards.",
    next: "Nu kan första träningsveckan byggas med samma cue-ord och samma kravbild.",
    tone: "green" as Tone,
  },
  {
    no: "03",
    window: "Dag 4-7",
    title: "Första träningsveckan",
    purpose: "Testa om identiteten går att se i fart, kamp och beslut.",
    input: "Fem identitetskort och första fasen i spelmodellen.",
    action: "Bygg två pass där varje övning har fas, identitet, cue, poängsystem, stoppregel och återkopplingsfråga.",
    artifact: "Träningsvecka 1: passplan, coachord, mätpunkt och kort reflektion efter varje pass.",
    checkpoint: "Om övningen kan genomföras utan beteendet ni vill se är övningen felkonstruerad.",
    overlap: "Identitet + spelmodell + träningsdesign.",
    next: "Nu finns bevis från planen som kan bli matchnycklar i stället för tyckande.",
    tone: "blue" as Tone,
  },
  {
    no: "04",
    window: "Vecka 2",
    title: "Spelmodellen blir matchplan",
    purpose: "Göra modellen användbar mot en konkret motståndare utan att tappa identiteten.",
    input: "Träningsveckans bevis, fasraderna, matchproblem och motståndarens vanligaste hot.",
    action: "Välj tre matchnycklar: en med boll, en utan boll och en för nästa boll efter kamp.",
    artifact: "Matchplan: våra tre nycklar, deras trigger, vår första aktion och vad vi mäter.",
    checkpoint: "Om matchplanen kräver nya ord har ni inte översatt Prisma, ni har startat om.",
    overlap: "Spelmodell + analys + matchförberedelse.",
    next: "Nu kan omklädningsrummet korta ner modellen till få ord spelarna redan känner igen.",
    tone: "red" as Tone,
  },
  {
    no: "05",
    window: "Matchdag",
    title: "Omklädningsrummet",
    purpose: "Koka ner allt till få ord som spelarna kan bära ut på planen.",
    input: "Matchplanen, träningsveckans starkaste beteende och det viktigaste hotet.",
    action: "Säg vad vi ska känna igen, vad vi gör först, vilket ord vi använder och hur vi hjälper nästa aktion.",
    artifact: "Spelarbrief: 3 matchnycklar, 5 identitetsord, 1 första aktion efter avspark och 1 påminnelse i halvtid.",
    checkpoint: "Om spelarna inte kan återberätta planen på en minut är den inte redo för match.",
    overlap: "Onboarding + ledarskap + matchrutin.",
    next: "Nu ska matchen samla bevis: vad av modellen syntes när det blev verkligt?",
    tone: "yellow" as Tone,
  },
  {
    no: "06",
    window: "Efter match",
    title: "Tillbaka till början",
    purpose: "Göra återkoppling till nästa beslut, inte en lös samling känslor.",
    input: "Video, spelarfeedback, ledarsamtal och tre mätpunkter från matchplanen.",
    action: "Svara på vad som syntes, vad som saknades och vilken del av Prisma som ska förstärkas nästa vecka.",
    artifact: "Nästa loop: behåll, skärp, parkera och bygg vidare.",
    checkpoint: "Om analysen inte leder till en träningsändring eller ett beslut att hålla fast är den för lös.",
    overlap: "Återkoppling + träning + ny planering.",
    next: "Nu börjar nästa dag 1 med bättre underlag än förra gången.",
    tone: "green" as Tone,
  },
];

const overlapMap = [
  {
    area: "Vision",
    owns: "Varför vi gör allt: Vi kommer förberedda.",
    feeds: "Styr identitet, ledarskap, val av matchproblem och vad vi väljer bort.",
    proof: "Varje beslut kan spåras tillbaka till förberedelse.",
    tone: "yellow" as Tone,
  },
  {
    area: "Identitet",
    owns: "Det spelarna ska visa: duell, andraboll, scanning, rättvänd, prata med passning.",
    feeds: "Ger ord till spelmodell, träning, feedback, onboarding och omklädningsrum.",
    proof: "Beteendet går att se, coacha och återkoppla utan lång förklaring.",
    tone: "green" as Tone,
  },
  {
    area: "Spelmodell",
    owns: "Hur identiteten organiseras i faser och roller.",
    feeds: "Gör träningsdesignen matchlik och gör matchplanen konsekvent.",
    proof: "Varje fas har en huvudprincip, spelarhandling och mätpunkt.",
    tone: "blue" as Tone,
  },
  {
    area: "Träning",
    owns: "Hur modellen blir upprepad under press.",
    feeds: "Ger bevis till ledarsamtal, matchplan och nästa veckas justering.",
    proof: "Övningen tvingar fram det beteende modellen säger är viktigt.",
    tone: "red" as Tone,
  },
  {
    area: "Ledarteam",
    owns: "Att språket hålls ihop när flera ledare coachar.",
    feeds: "Skyddar standards, onboarding, matchmöte och korrigeringar under träning.",
    proof: "Alla ledare använder samma cue och korrigerar samma prioritet.",
    tone: "blue" as Tone,
  },
  {
    area: "Onboarding",
    owns: "Hur nya och befintliga spelare snabbt förstår modellen.",
    feeds: "Gör omklädningsrummet kortare eftersom orden redan är etablerade.",
    proof: "En spelare kan förklara vad som förväntas före första träningen.",
    tone: "green" as Tone,
  },
];

const lockerRoomBrief = [
  {
    label: "1. Riktning",
    text: "Vi kommer förberedda: vi ser situationen före den händer och hjälper nästa aktion.",
    tone: "yellow" as Tone,
  },
  {
    label: "2. Matchnyckel",
    text: "Det viktigaste i dag är att vinna nästa boll efter kamp: första spelaren stör, andra säkrar, tredje spelar framåt.",
    tone: "red" as Tone,
  },
  {
    label: "3. Med boll",
    text: "Sök rättvänd spelare. Finns den inte, prata med passningen så nästa spelare får bättre läge.",
    tone: "blue" as Tone,
  },
  {
    label: "4. Utan boll",
    text: "Skydda mitten, pressa tillsammans och var först på fri boll.",
    tone: "green" as Tone,
  },
  {
    label: "5. Halvtidsfråga",
    text: "Vad syns av vår förberedelse, och vilken aktion måste vi göra snabbare direkt efter paus?",
    tone: "yellow" as Tone,
  },
];

const planningRhythm = [
  {
    label: "Måndag",
    text: "Ledarteam: vad såg vi, vilket identitetsbeteende saknades och vilken fas styr veckan?",
    tone: "blue" as Tone,
  },
  {
    label: "Tisdag",
    text: "Träning 1: hög repetition av veckans beteende med tydlig constraint och kort feedback direkt efter passet.",
    tone: "red" as Tone,
  },
  {
    label: "Torsdag",
    text: "Träning 2: samma beteende i mer matchlik miljö, med matchnycklar och spelarnas egen återkoppling.",
    tone: "green" as Tone,
  },
  {
    label: "Fredag",
    text: "Matchplan: välj tre nycklar och ta bort allt som inte hjälper spelarna första 15 minuterna.",
    tone: "yellow" as Tone,
  },
  {
    label: "Matchdag",
    text: "Omklädningsrum: aktivera språket, första aktionen, matchnycklarna och halvtidsfrågan.",
    tone: "red" as Tone,
  },
  {
    label: "Efter match",
    text: "Stäng loopen: behåll, skärp, parkera och välj nästa veckas första problem.",
    tone: "blue" as Tone,
  },
];

const trainingLoop = [
  {
    title: "Före passet",
    text: "Välj fas, identitetsbeteende och ett konkret problem: exempelvis andrabollar efter bolltapp eller rättvänd spelare i uppbyggnad.",
    tone: "yellow" as Tone,
  },
  {
    title: "Under passet",
    text: "Bygg övningen med yta, tid, riktning, motståndare och poäng så beteendet måste uppstå i fart.",
    tone: "red" as Tone,
  },
  {
    title: "Coachningen",
    text: "Använd få ord: vinn kampen, först på fri boll, se före touch, vänd mot spelet, säg det med bollen.",
    tone: "blue" as Tone,
  },
  {
    title: "Efter passet",
    text: "Återkoppla bara på det som modellen bad om: vad syntes, vad saknades och vad blir nästa repetition?",
    tone: "green" as Tone,
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
              06
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
    <div className="min-w-0 rounded-sm border border-border bg-background p-3">
      <p className={["break-words font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[tone]].join(" ")}>
        {label}
      </p>
      <p className="mt-2 break-words text-sm leading-relaxed text-foreground/76">{text}</p>
    </div>
  );
}

function NySpelideSection() {
  return (
    <AccordionItem value="ny-spelide" className="border-t border-border">
      <AccordionTrigger className="px-4 py-4 text-left hover:no-underline md:px-6">
        <span className="flex w-full flex-col gap-2 pr-4 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-violet-400 bg-violet-50 font-mono text-[11px] font-black text-violet-700">
              05
            </span>
            <span>
              <span className="block text-xl font-black uppercase text-foreground md:text-2xl">
                Ny spelidé – Vi kommer förberedda
              </span>
              <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Vision → identitet → spelmodell → träning
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

            <div className="border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-700" strokeWidth={2.3} />
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                  Identitet
                </p>
              </div>
              <div className="grid gap-2">
                {identityBehaviors.map((behavior) => (
                  <div key={behavior.title} className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-b-0 last:pb-0">
                    <span className="text-sm font-black uppercase leading-tight text-foreground">
                      {behavior.title}
                    </span>
                    <span className={["max-w-[160px] text-right text-xs font-black leading-snug", TONE_TEXT[behavior.tone]].join(" ")}>
                      {behavior.cue}
                    </span>
                  </div>
                ))}
              </div>
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

            <div className="grid gap-3 md:grid-cols-2">
              {identityBehaviors.map((behavior) => (
                <article key={behavior.title} className="border border-border bg-card p-4 md:p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[behavior.tone]].join(" ")}>
                        Identitet
                      </p>
                      <h3 className="mt-1 text-lg font-black uppercase leading-tight text-foreground">
                        {behavior.title}
                      </h3>
                    </div>
                    <span className={["border px-2.5 py-1 text-xs font-black leading-none", TONE_BG[behavior.tone], TONE_TEXT[behavior.tone]].join(" ")}>
                      {behavior.cue}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    <StepCell label="Varför" text={behavior.why} tone={behavior.tone} />
                    <StepCell label="Godkänt" text={behavior.looksLike} tone={behavior.tone} />
                    <StepCell label="Inte nog" text={behavior.notEnough} tone={behavior.tone} />
                    <StepCell label="Tränas genom" text={behavior.training} tone={behavior.tone} />
                    <StepCell label="Matchcase" text={behavior.matchCase} tone={behavior.tone} />
                  </div>
                </article>
              ))}
            </div>

            <div className="border border-violet-300/70 bg-violet-50 p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                Första spelmodellutkast
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-foreground">
                Vi kommer förberedda i varje fas.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                Modellen ska vara enkel nog att coacha under press: en huvudprincip per fas, tydliga cue-ord och mätpunkter som visar om identiteten faktiskt syns.
              </p>
            </div>

            <div className="space-y-3">
              {spelmodellDraft.map((phase) => (
                <article key={phase.phase} className="border border-border bg-card p-4 md:p-5">
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[phase.tone]].join(" ")}>
                        Spelfas
                      </p>
                      <h3 className="mt-1 text-lg font-black uppercase leading-tight text-foreground">
                        {phase.phase}
                      </h3>
                    </div>
                    <p className="max-w-md text-sm font-black leading-relaxed text-foreground/80 md:text-right">
                      {phase.principle}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <StepCell label="Spelbild" text={phase.gamePicture} tone={phase.tone} />
                    <StepCell label="Identitet i fasen" text={phase.identity} tone={phase.tone} />
                    <StepCell label="Spelarhandling" text={phase.playerAction} tone={phase.tone} />
                    <StepCell label="Träning" text={phase.training} tone={phase.tone} />
                    <StepCell label="Mätpunkt" text={phase.measure} tone={phase.tone} />
                    <StepCell label="Nästa beslut" text={phase.nextStep} tone={phase.tone} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

const UnderProcess = () => (
  <>
    <PageHero
      eyebrow="Spelidé 2026"
      title="Prisma 2026"
      description="En sammanhållen spelmodell där visionen Vi kommer förberedda bryts ner till identitet, spelfaser, träning och återkoppling."
    />

    <SectionReveal as="section" className="container pb-section space-y-8">
      <section className="border border-border bg-card p-5 md:p-7">
        <div className="mb-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Processplan
            </p>
            <h2 className="mt-2 break-words text-3xl font-black uppercase leading-tight text-foreground md:text-4xl">
              Från dag 1 till omklädningsrummet
            </h2>
          </div>
          <p className="min-w-0 break-words text-sm font-semibold leading-relaxed text-foreground/70 md:text-base">
            Det här är appflödet: varje steg ska skapa ett tydligt beslut, ett samtal och ett underlag till nästa steg.
            Börja i planeringen, bygg ledarspråket, testa på träning och koka ner allt till få ord i omklädningsrummet.
          </p>
        </div>

        <div className="mb-6 border border-border bg-background p-4 md:p-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
                Helhetskarta
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Läs modellen som en ryggrad
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Varje ruta visar vad steget omvandlar och vad det lämnar vidare. Följ raden från vänster till höger:
              om en senare del känns lös går du ett steg bakåt.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {modelSpine.map((step) => (
              <article key={step.no} className={["min-w-0 border p-3", TONE_BG[step.tone]].join(" ")}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className={["grid h-8 w-8 flex-shrink-0 place-items-center border font-mono text-[9px] font-black", TONE_BG[step.tone], TONE_TEXT[step.tone]].join(" ")}>
                    {step.no}
                  </span>
                  <p className={["break-words text-right font-mono text-[8px] font-black uppercase tracking-[0.14em]", TONE_TEXT[step.tone]].join(" ")}>
                    {step.visual}
                  </p>
                </div>
                <h4 className="break-words text-base font-black uppercase leading-tight text-foreground">
                  {step.title}
                </h4>
                <p className="mt-2 break-words text-xs font-semibold leading-relaxed text-foreground/72">
                  {step.summary}
                </p>
                <p className="mt-3 border-t border-border pt-2 text-xs font-black leading-relaxed text-foreground/80">
                  {step.connects}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-6 border border-border bg-background p-4 md:p-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                Avsnittsguide
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Vad varje del gör i helheten
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Guiden är sidans innehållsförteckning med mening: varje avsnitt har ett jobb och en koppling till resten.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {sectionGuide.map((section) => (
              <article key={section.title} className="min-w-0 border border-border bg-card p-4">
                <p className={["break-words font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[section.tone]].join(" ")}>
                  {section.title}
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-relaxed text-foreground/76">
                  {section.summary}
                </p>
                <p className="mt-3 border-t border-border pt-2 text-xs font-black leading-relaxed text-foreground/80">
                  {section.connection}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {planningJourney.map((step) => (
            <article key={step.no} className={["border p-3", TONE_BG[step.tone]].join(" ")}>
              <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[step.tone]].join(" ")}>
                {step.window}
              </p>
              <h3 className="mt-2 break-words text-base font-black uppercase leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 break-words text-xs font-semibold leading-relaxed text-foreground/70">
                {step.artifact}
              </p>
            </article>
          ))}
        </div>

        <div className="mb-6 border-t border-border pt-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
                Övergångskontroll
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Inget steg får börja tomt
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Varje förflyttning måste lämna något vidare: en fråga, en leverans och en varningssignal.
              Det är kontrollen som hindrar Prisma från att bli lösa block.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {handoffChecks.map((item) => (
              <article key={`${item.from}-${item.to}`} className="border border-border bg-background p-4">
                <p className={["break-words font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[item.tone]].join(" ")}>
                  {item.from} → {item.to}
                </p>
                <p className="mt-2 break-words text-sm font-black leading-snug text-foreground">
                  {item.question}
                </p>
                <div className="mt-3 grid gap-2">
                  <StepCell label="Måste lämna" text={item.deliver} tone={item.tone} />
                  <StepCell label="Varning" text={item.warning} tone={item.tone} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 border-t border-border pt-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Åtta steg
            </p>
            <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
              Bygg modellen utan att tappa tråden
            </h3>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/65">
            Steg 1-4 bygger grunden. Steg 5-8 omsätter den i träning, onboarding, ledarsamtal och återkoppling.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.no} className="border border-border bg-background p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className={["grid h-9 w-9 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[step.tone], TONE_TEXT[step.tone]].join(" ")}>
                  {step.no}
                </span>
                <p className={["text-right font-mono text-[9px] font-black uppercase tracking-[0.16em]", TONE_TEXT[step.tone]].join(" ")}>
                  Steg {Number(step.no)}
                </p>
              </div>
              <h3 className="text-lg font-black uppercase leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/72">{step.purpose}</p>
              <div className="mt-4 grid gap-2">
                <StepCell label="Gör" text={step.action} tone={step.tone} />
                <StepCell label="Klart när" text={step.done} tone={step.tone} />
                <StepCell label="Samtal" text={step.conversation} tone={step.tone} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
                Hierarkisk tratt
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Från viktigast till mest konkret
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Allt ska kunna spåras uppåt. Om träningen känns lös går du till spelmodellen. Om spelmodellen känns lös går du till identiteten.
              Om identiteten känns lös går du tillbaka till visionen.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {hierarchy.map((item) => (
              <article key={item.no} className="border border-border bg-background p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className={["grid h-9 w-9 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[item.tone], TONE_TEXT[item.tone]].join(" ")}>
                    {item.no}
                  </span>
                  <p className={["text-right font-mono text-[9px] font-black uppercase tracking-[0.16em]", TONE_TEXT[item.tone]].join(" ")}>
                    {item.weight}
                  </p>
                </div>
                <h4 className="text-lg font-black uppercase leading-tight text-foreground">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-foreground/72">{item.why}</p>
                <div className="mt-4 grid gap-2">
                  <StepCell label="Sitter ihop med" text={item.connects} tone={item.tone} />
                  <StepCell label="Levererar" text={item.output} tone={item.tone} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                Steg 1-4
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Grundbygget: loopa tills varje grind håller
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Den här delen är inte inspiration. Det är arbetsgrindar: om en grind inte håller, backa ett steg och gör om innan
              Prisma blir träning, matchplan eller onboarding.
            </p>
          </div>

          <div className="space-y-3">
            {foundationLoops.map((step) => (
              <article key={step.no} className="border border-border bg-background p-4 md:p-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className={["grid h-10 w-10 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[step.tone], TONE_TEXT[step.tone]].join(" ")}>
                      {step.no}
                    </span>
                    <div>
                      <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[step.tone]].join(" ")}>
                        Kritisk loop
                      </p>
                      <h4 className="mt-1 text-xl font-black uppercase leading-tight text-foreground">
                        {step.title}
                      </h4>
                    </div>
                  </div>
                  <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/72">
                    {step.intent}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <StepCell label="Input" text={step.input} tone={step.tone} />
                  <StepCell label="Arbete" text={step.work} tone={step.tone} />
                  <StepCell label="Leverans" text={step.output} tone={step.tone} />
                  <StepCell label="Granskning" text={step.critique} tone={step.tone} />
                  <StepCell label="Stoppregel" text={step.gate} tone={step.tone} />
                  <StepCell label="Bygger på" text={step.previous} tone={step.tone} />
                  <StepCell label="Låser upp" text={step.next} tone={step.tone} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-5 md:p-7">
        <div className="mb-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
              Helhetsresa
            </p>
            <h2 className="mt-2 break-words text-3xl font-black uppercase leading-tight text-foreground md:text-4xl">
              Från dag 1 till omklädningsrummet
            </h2>
          </div>
          <p className="min-w-0 break-words text-sm font-semibold leading-relaxed text-foreground/70 md:text-base">
            Prisma ska kunna följas som en tidslinje: planering först, gemensamt ledarspråk sedan, därefter träning,
            matchplan, spelarmöte och återkoppling tillbaka in i nästa loop.
          </p>
        </div>

        <div className="space-y-3">
          {planningJourney.map((step) => (
            <article key={step.no} className="min-w-0 border border-border bg-background p-4 md:p-5">
              <div className="grid min-w-0 gap-4 xl:grid-cols-[0.55fr_1.45fr]">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={["grid h-10 w-10 flex-shrink-0 place-items-center border font-mono text-[10px] font-black", TONE_BG[step.tone], TONE_TEXT[step.tone]].join(" ")}>
                      {step.no}
                    </span>
                    <div className="min-w-0">
                      <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[step.tone]].join(" ")}>
                        {step.window}
                      </p>
                      <h3 className="mt-1 break-words text-xl font-black uppercase leading-tight text-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 break-words text-sm font-semibold leading-relaxed text-foreground/72">
                    {step.purpose}
                  </p>
                </div>

                <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <StepCell label="Underlag in" text={step.input} tone={step.tone} />
                  <StepCell label="Gör" text={step.action} tone={step.tone} />
                  <StepCell label="Artefakt ut" text={step.artifact} tone={step.tone} />
                  <StepCell label="Kritisk kontroll" text={step.checkpoint} tone={step.tone} />
                  <StepCell label="Överlapp" text={step.overlap} tone={step.tone} />
                  <StepCell label="Nästa läge" text={step.next} tone={step.tone} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-4 grid gap-3 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
                Planeringsrytm
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground md:text-3xl">
                Så får veckan ihop helheten
              </h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-foreground/70">
              Det här är minsta rytmen: ett ledarsamtal, två träningsbevis, en matchplan, ett omklädningsrum och en återkoppling.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {planningRhythm.map((item) => (
              <StepCell key={item.label} label={item.label} text={item.text} tone={item.tone} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-border bg-card p-5 md:p-7">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
                Överlappskarta
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
                Varje område påverkar nästa
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/65">
              Om ett område känns löst ska du fråga vilket område före som inte är tillräckligt tydligt.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {overlapMap.map((item) => (
              <article key={item.area} className="border border-border bg-background p-4">
                <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[item.tone]].join(" ")}>
                  {item.area}
                </p>
                <div className="mt-3 grid gap-2">
                  <StepCell label="Äger" text={item.owns} tone={item.tone} />
                  <StepCell label="Påverkar" text={item.feeds} tone={item.tone} />
                  <StepCell label="Bevis" text={item.proof} tone={item.tone} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="border border-violet-300/70 bg-violet-50 p-5 md:p-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
            Spelarbrief
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
            Det som sägs när dörren stängs
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/70">
            Om modellen är byggd rätt behöver omklädningsrummet inte bära allt. Det ska bara aktivera orden spelarna redan tränat.
          </p>
          <div className="mt-5 grid gap-3">
            {lockerRoomBrief.map((item) => (
              <StepCell key={item.label} label={item.label} text={item.text} tone={item.tone} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.5fr]">
        <div className="border border-violet-300/70 bg-violet-50 p-5 md:p-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-700">
            Vision
          </p>
          <h2 className="mt-3 text-4xl font-black leading-none text-foreground md:text-5xl">
            Vi kommer förberedda.
          </h2>
          <p className="mt-5 text-base font-semibold leading-relaxed text-foreground/80">
            Prisma 2026 är modellen som gör visionen synlig. Förberedelse betyder att laget ser situationen före den händer,
            vinner nästa kamp och hjälper varandra med passningar som redan pekar mot nästa aktion.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {prismaFlow.map((item) => (
            <article key={item.title} className={["border p-4 md:p-5", TONE_BG[item.tone]].join(" ")}>
              <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[item.tone]].join(" ")}>
                {item.label}
              </p>
              <h3 className="mt-2 text-xl font-black uppercase leading-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-border bg-card p-5 md:p-7">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
              Identitet
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
              Fem beteenden som visar att vi är förberedda
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/65">
            Identiteten är inte ett separat kapitel. Den ska kunna hittas i varje fas, varje övning och varje feedbacksvar.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {identityBehaviors.map((behavior) => (
            <article key={behavior.title} className="border border-border bg-background p-4">
              <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[behavior.tone]].join(" ")}>
                {behavior.cue}
              </p>
              <h3 className="mt-2 text-lg font-black uppercase leading-tight text-foreground">
                {behavior.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/72">{behavior.looksLike}</p>
              <div className="mt-4 border-t border-border pt-3">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Matchcase
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground/80">{behavior.matchCase}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-border bg-card p-5 md:p-7">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
              Spelmodell
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
              En huvudprincip per fas
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/65">
            Varje fas läses likadant: spelbild, identitet, spelarhandling, träning, mätpunkt och nästa beslut.
          </p>
        </div>

        <div className="space-y-3">
          {spelmodellDraft.map((phase) => (
            <article key={phase.phase} className="border border-border bg-background p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
                <div>
                  <p className={["font-mono text-[9px] font-black uppercase tracking-[0.18em]", TONE_TEXT[phase.tone]].join(" ")}>
                    Spelfas
                  </p>
                  <h3 className="mt-2 text-2xl font-black uppercase leading-tight text-foreground">
                    {phase.phase}
                  </h3>
                  <p className="mt-3 text-base font-black leading-relaxed text-foreground/85">
                    {phase.principle}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <StepCell label="Spelbild" text={phase.gamePicture} tone={phase.tone} />
                  <StepCell label="Identitet" text={phase.identity} tone={phase.tone} />
                  <StepCell label="Spelarhandling" text={phase.playerAction} tone={phase.tone} />
                  <StepCell label="Träning" text={phase.training} tone={phase.tone} />
                  <StepCell label="Mätpunkt" text={phase.measure} tone={phase.tone} />
                  <StepCell label="Nästa beslut" text={phase.nextStep} tone={phase.tone} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="border border-border bg-card p-5 md:p-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-rose-700">
            Träning
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
            Passet byggs från modellen
          </h2>
          <div className="mt-5 grid gap-3">
            {trainingLoop.map((item) => (
              <StepCell key={item.title} label={item.title} text={item.text} tone={item.tone} />
            ))}
          </div>
        </div>

        <div className="border border-border bg-card p-5 md:p-7">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-sky-700">
            Återkoppling
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
            Formuläret svarar på samma modell
          </h2>
          <div className="mt-5 grid gap-3">
            <StepCell
              label="Svagt svar"
              text="Det gick bra. Det säger inget om vilket beteende som syntes eller vad nästa pass ska förstärka."
              tone="red"
            />
            <StepCell
              label="Bra svar"
              text="Vi vann fler andrabollar efter återstart, men när vi blev trötta scannade vi för sent och fick felvända mottagningar."
              tone="green"
            />
            <StepCell
              label="Nästa träning"
              text="Börja med omställning försvar: bolltapp, fem sekunders jakt, yta två och poäng för vunnen andraboll."
              tone="blue"
            />
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-5 md:p-7">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
              Källbild
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground">
              Bakgrunden som håller ihop modellen
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-foreground/65">
            Förbunds- och forskningsspåret är stöd, inte facit. Prisma ska låna ordning och metodik, men alltid översättas till Gunnilses spelare,
            träningsvecka och matchproblem.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {researchLoop.slice(0, 6).map((item) => (
            <article key={item.no} className="border border-border bg-background p-4">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className={["font-mono text-[9px] font-black uppercase tracking-[0.18em] underline-offset-4 hover:underline", TONE_TEXT[item.tone]].join(" ")}
              >
                {item.source}
              </a>
              <h3 className="mt-2 text-base font-black uppercase leading-tight text-foreground">
                {item.title}
              </h3>
              <div className="mt-3 grid gap-2">
                <StepCell label="Stödjer" text={item.translation} tone={item.tone} />
                <StepCell label="Begränsning" text={item.guardrail} tone={item.tone} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </SectionReveal>
  </>
);

export default UnderProcess;
