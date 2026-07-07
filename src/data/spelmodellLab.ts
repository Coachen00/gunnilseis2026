import {
  Activity,
  ArrowRightLeft,
  CircleDot,
  Goal,
  LockKeyhole,
  MapPinned,
  Radar,
  RefreshCw,
  Shield,
  Swords,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type LabPhase =
  | "identitet"
  | "anfall"
  | "forsvar"
  | "omst-forsvar"
  | "omst-anfall"
  | "fasta";

export type LabTone = "gold" | "blue" | "green" | "red" | "neutral";
export type Intensity = "low" | "medium" | "high";
export type PrincipleTag =
  | "spelbarhet"
  | "avstand"
  | "bredd"
  | "djup"
  | "overtal"
  | "press"
  | "kompakt"
  | "box"
  | "duell"
  | "andraboll"
  | "transition"
  | "territorium"
  | "kommunikation"
  | "fasta";

export type LabPhaseMeta = {
  id: LabPhase;
  order: number;
  label: string;
  shortLabel: string;
  headline: string;
  intent: string;
  tone: LabTone;
  Icon: LucideIcon;
};

export type LabPrinciple = {
  id: string;
  phase: LabPhase;
  title: string;
  plain: string;
  trigger: string;
  cue: string;
  correction: string;
  metric: string;
  danger: string;
  tags: PrincipleTag[];
  intensity: Intensity;
};

export type TrainingBlock = {
  id: string;
  title: string;
  phase: LabPhase;
  minutes: number;
  organisation: string;
  scoring: string;
  coaching: string[];
  progressions: string[];
  tags: PrincipleTag[];
  intensity: Intensity;
};

export type MatchScenario = {
  id: string;
  label: string;
  phase: LabPhase;
  symptom: string;
  diagnosis: string;
  correction: string;
  sideline: string;
  trainingBlockIds: string[];
  tags: PrincipleTag[];
  tone: LabTone;
};

export type ReadinessItem = {
  id: string;
  label: string;
  detail: string;
  weight: number;
  phase?: LabPhase;
};

export type SessionPreset = {
  id: string;
  label: string;
  minutes: number;
  goal: string;
  recommendedPrinciples: string[];
  recommendedScenario: string;
};

export const LAB_PHASES: LabPhaseMeta[] = [
  {
    id: "identitet",
    order: 1,
    label: "Identitet",
    shortLabel: "Identitet",
    headline: "Kampen sätter nivån",
    intent: "Duell, andraboll och löpvilja ska synas innan taktiken blir fin.",
    tone: "gold",
    Icon: Swords,
  },
  {
    id: "anfall",
    order: 2,
    label: "Anfall",
    shortLabel: "Anfall",
    headline: "In, ut, fram, box",
    intent: "Flytta blocket, hitta rättvänd spelare och fyll rätt ytor när bollen går in.",
    tone: "green",
    Icon: Target,
  },
  {
    id: "forsvar",
    order: 3,
    label: "Försvar",
    shortLabel: "Försvar",
    headline: "Samla, lås, vinn",
    intent: "Korta laget, styr pressen och skydda gyllene zonen före modiga beslut.",
    tone: "blue",
    Icon: Shield,
  },
  {
    id: "omst-forsvar",
    order: 4,
    label: "Omställning till försvar",
    shortLabel: "Tapp",
    headline: "Jaga när bilden är rätt",
    intent: "Direkt återerövring när vi är nära och samlade, annars centrera och bromsa.",
    tone: "red",
    Icon: RefreshCw,
  },
  {
    id: "omst-anfall",
    order: 5,
    label: "Omställning till anfall",
    shortLabel: "Vinst",
    headline: "Ut ur pressen",
    intent: "Första beslutet efter bollvinst ska ge luft, diagonal eller djupled.",
    tone: "green",
    Icon: Zap,
  },
  {
    id: "fasta",
    order: 6,
    label: "Fasta situationer",
    shortLabel: "Fasta",
    headline: "Kontakt först",
    intent: "Tydliga roller, första kontakt och andraboll före allt annat.",
    tone: "neutral",
    Icon: CircleDot,
  },
];

export const LAB_PRINCIPLES: LabPrinciple[] = [
  {
    id: "duell-fore-plan",
    phase: "identitet",
    title: "Duell före plan",
    plain: "Spelaren närmast situationen måste påverka bollhållare eller bollbana direkt.",
    trigger: "Första fem minuterna, efter mål emot eller när tempot faller.",
    cue: "Vinn kropp.",
    correction: "Flytta närmaste spelare närmare duellen och säkra nästa boll med understöd.",
    metric: "Minst 60 procent vunna första kontakter i valt block.",
    danger: "Vi tittar på boll och blir passiva i landningsytan.",
    tags: ["duell", "andraboll", "kommunikation"],
    intensity: "high",
  },
  {
    id: "andraboll-landningsyta",
    phase: "identitet",
    title: "Äg landningsytan",
    plain: "Nästa spelare läser var bollen hamnar, inte bara var den är nu.",
    trigger: "Långa bollar, rensningar, inkast och alla dueller i mittzonen.",
    cue: "Läs andra.",
    correction: "Skapa en triangel runt duellen: press, säkring och landningsyta.",
    metric: "Tre spelare på rätt sida om andrabollen innan den studsar två gånger.",
    danger: "Alla går mot första boll och ytan bakom blir fri.",
    tags: ["andraboll", "duell", "kompakt"],
    intensity: "high",
  },
  {
    id: "lopvilja-utan-boll",
    phase: "identitet",
    title: "Löpning skapar passningen",
    plain: "Djupledslöpningen är värdefull även när den inte får bollen.",
    trigger: "När rättvänd spelare får tid eller när motståndaren backar.",
    cue: "En bakom.",
    correction: "Ytter eller nia startar bakom linjen, tia fyller nästa yta.",
    metric: "Minst en hotande löpning bakom varje gång vi blir rättvända centralt.",
    danger: "Alla möter boll och gör planen kort åt motståndaren.",
    tags: ["djup", "spelbarhet", "kommunikation"],
    intensity: "medium",
  },
  {
    id: "spelbarhet-tre-hojder",
    phase: "anfall",
    title: "Spelbarhet i tre höjder",
    plain: "Bollhållaren ska se ett kort stöd, en rättvänd länk och ett djupt hot.",
    trigger: "När vi startar speluppbyggnad eller vinner bollen och vill behålla den.",
    cue: "Tre höjder.",
    correction: "Justera avstånd mellan sexa, tia och nia så passningslinjerna inte ligger på samma rad.",
    metric: "Tre tydliga passningsalternativ inom två sekunder efter mottagning.",
    danger: "Vi hamnar platt och kan pressas med en enda löpning.",
    tags: ["spelbarhet", "avstand", "djup"],
    intensity: "medium",
  },
  {
    id: "bredd-som-vapen",
    phase: "anfall",
    title: "Bredd som vapen",
    plain: "Bredden är inte dekoration, den ska tvinga blocket att flytta sig.",
    trigger: "När motståndaren är kompakt centralt eller styr oss mot en sida.",
    cue: "Gör planen stor.",
    correction: "Ytter håller utsida tills bollhållaren är rättvänd, ytterback väljer stöd eller överlapp.",
    metric: "Bollvändning eller isolering inom fyra pass när motståndaren stänger mitten.",
    danger: "Båda yttrarna kommer in samtidigt och ger oss ingen utsida.",
    tags: ["bredd", "avstand", "spelbarhet"],
    intensity: "medium",
  },
  {
    id: "in-ut-fram-box",
    phase: "anfall",
    title: "In, ut, fram, box",
    plain: "Vi flyttar blocket inifrån, isolerar kanten, hotar framåt och fyller boxen.",
    trigger: "När vi etablerat spel på offensiv planhalva.",
    cue: "In, ut, fram, box.",
    correction: "Sök rättvänd i spelyta 1/2 innan bollen går ut, sedan djupled eller inlägg.",
    metric: "Fem ytor i boxen fyllda innan inlägg eller cutback.",
    danger: "Kanten blir slutstation och boxen är tom.",
    tags: ["box", "bredd", "djup", "overtal"],
    intensity: "high",
  },
  {
    id: "rattvand-i-yta-två",
    phase: "anfall",
    title: "Rättvänd i spelyta 2",
    plain: "Den farliga passningen är den som gör att nästa spelare kan se framåt.",
    trigger: "När deras mittfält pressar framåt eller blir draget åt kanten.",
    cue: "Hitta rättvänd.",
    correction: "Attrahera press på en sida och spela in bakom första presslinjen.",
    metric: "Minst sex rättvända mottagningar i spelyta 2 per halvlek.",
    danger: "Vi spelar på felvänd spelare utan tredje man och tappar centralt.",
    tags: ["spelbarhet", "avstand", "djup"],
    intensity: "medium",
  },
  {
    id: "box-fem-ytor",
    phase: "anfall",
    title: "Fyll fem ytor",
    plain: "Första stolpe, straffpunkt, bortre, cutback och andraboll ska ha ansvar.",
    trigger: "När bollen når yttre korridor eller när vi vinner högt.",
    cue: "Fyll fem.",
    correction: "Nia attackerar centralt, bortre ytter bortre, tia cutback, sexa/åtta andraboll.",
    metric: "Minst fyra av fem ytor fyllda vid varje ren inläggsbild.",
    danger: "Alla söker samma yta och målvakten får lätt boll.",
    tags: ["box", "overtal", "andraboll"],
    intensity: "high",
  },
  {
    id: "samla-fore-press",
    phase: "forsvar",
    title: "Samla före press",
    plain: "Pressen blir modig först när laget är kort nog för att vinna nästa boll.",
    trigger: "När motståndaren spelar bakåt, felvänd eller mot kant.",
    cue: "Samla först.",
    correction: "Backlinje upp, mittfält in, forward styr tills avstånden är rätt.",
    metric: "Max 25 meter mellan backlinje och forward innan pressignal.",
    danger: "En ensam press öppnar mitten och ger spelvändning.",
    tags: ["press", "kompakt", "kommunikation"],
    intensity: "high",
  },
  {
    id: "las-bollsida",
    phase: "forsvar",
    title: "Lås bollsida",
    plain: "När vi har styrt bollen till en sida ska den stanna där.",
    trigger: "Boll på kant med felvänd mottagare eller svag passningsvinkel bakåt.",
    cue: "Lås.",
    correction: "Närmaste pressar utsida, nästa stänger insida, bortre kant smalnar av.",
    metric: "Motståndaren får max en ren spelvändning per tiominutersblock.",
    danger: "Bortre ytter står för brett och öppnar diagonal.",
    tags: ["press", "kompakt", "bredd"],
    intensity: "high",
  },
  {
    id: "skydda-gyllene-zon",
    phase: "forsvar",
    title: "Skydda gyllene zonen",
    plain: "Allt försvarsspel börjar med att stänga de farligaste avslutsytorna.",
    trigger: "När motståndaren kommer in centralt sista tredjedelen.",
    cue: "Inget centralt.",
    correction: "Mittback styr kropp mellan boll och mål, sexa faller in framför ytan.",
    metric: "Inga fria avslut centralt innanför straffpunkten.",
    danger: "Vi jagar boll och lämnar cutback eller straffpunkt.",
    tags: ["kompakt", "press", "box"],
    intensity: "medium",
  },
  {
    id: "tre-korridorer",
    phase: "forsvar",
    title: "Tre korridorer",
    plain: "Alla vet vilken korridor de försvarar och när de ska lämna den.",
    trigger: "När motståndaren försöker spela igenom oss på marken.",
    cue: "Tre korridorer.",
    correction: "Sätt relationerna mellan ytter, ytterback, sexa och mittback innan pressen går.",
    metric: "Ingen passning genom två korridorer utan press på mottagare.",
    danger: "Vi överförsvarar boll och tappar nästa korridor.",
    tags: ["kompakt", "press", "kommunikation"],
    intensity: "medium",
  },
  {
    id: "direkt-atererovring",
    phase: "omst-forsvar",
    title: "Direkt återerövring",
    plain: "När vi tappar nära varandra ska första sekunden vara aggressiv.",
    trigger: "Bolltapp med minst tre egna runt boll och täckning bakom.",
    cue: "Nu direkt.",
    correction: "Närmaste pressar boll, två närmaste stänger passningar, nästa säkrar djup.",
    metric: "Boll återvunnen eller motståndaren tvingad bakåt inom fem sekunder.",
    danger: "Alla går på boll utan säkring bakom.",
    tags: ["transition", "press", "kompakt"],
    intensity: "high",
  },
  {
    id: "indirekt-bromsa",
    phase: "omst-forsvar",
    title: "Indirekt: bromsa och centrera",
    plain: "Om vi är utdragna ska vi inte tokpressa, vi ska stoppa fart och samla laget.",
    trigger: "Centralt tapp, rättvänd motståndare eller stor yta bakom oss.",
    cue: "Bromsa.",
    correction: "Första spelaren styr tempo, övriga faller in centralt och tar bort passningen framåt.",
    metric: "Kontringen bromsad innan motståndaren når sista tredjedelen.",
    danger: "Vi pressar en och en och gör deras kontring enklare.",
    tags: ["transition", "kompakt", "press"],
    intensity: "medium",
  },
  {
    id: "forwarden-forst",
    phase: "omst-forsvar",
    title: "Forwarden först",
    plain: "Nian startar försvarsspelet genom att styra deras första passning.",
    trigger: "När motståndaren säkrar hem efter vårt tapp.",
    cue: "Nia styr.",
    correction: "Nian bågar press, tian skär sexa, yttrar låser ytterbackar.",
    metric: "Motståndaren tvingas spela där vi vill inom två pass.",
    danger: "Nian springer rakt och ger fri central passning.",
    tags: ["press", "transition", "kommunikation"],
    intensity: "medium",
  },
  {
    id: "forsta-pass-ut",
    phase: "omst-anfall",
    title: "Första pass ut",
    plain: "Efter bollvinst ska första passningen bort från het yta när ytan är trång.",
    trigger: "Bollvinst centralt eller i pressad sidledsyta.",
    cue: "Ut ur press.",
    correction: "Första blicken diagonal ut. Om passningen saknas, säkra bakåt och bygg ny attack.",
    metric: "Första pass efter bollvinst leder till rättvänd spelare eller fri yta.",
    danger: "Vi spelar tillbaka in i samma press och tappar igen.",
    tags: ["transition", "spelbarhet", "bredd"],
    intensity: "high",
  },
  {
    id: "kontra-nar-bilden-ar-ratt",
    phase: "omst-anfall",
    title: "Kontra när bilden är rätt",
    plain: "Vi kontrar när vi har fart, rättvänd bollhållare och löpning framför.",
    trigger: "Bollvinst med motståndaren oorganiserad och yta bakom backlinjen.",
    cue: "Fram nu.",
    correction: "Rättvänd spelare söker djup, närmaste stöd löper med och bortre spelare fyller box.",
    metric: "Avslut eller inträde i box inom åtta sekunder efter bollvinst.",
    danger: "Vi kontrar utan stöd och tappar på första passningen.",
    tags: ["transition", "djup", "box"],
    intensity: "high",
  },
  {
    id: "saker-uppbyggnad-efter-vinst",
    phase: "omst-anfall",
    title: "Säkra uppbyggnad efter vinst",
    plain: "När kontringen saknas ska vi behålla bollen och flytta upp laget.",
    trigger: "Bollvinst när laget är lågt eller bollhållaren är felvänd.",
    cue: "Säkra och upp.",
    correction: "Spela hem eller sida, få upp ytterbackar och sexor, starta speluppbyggnad med tålamod.",
    metric: "Minst fem egna pass eller kontrollerad progression efter låg bollvinst.",
    danger: "Vi slår chansboll och får försvara igen direkt.",
    tags: ["transition", "spelbarhet", "avstand"],
    intensity: "low",
  },
  {
    id: "fasta-forsta-kontakt",
    phase: "fasta",
    title: "Första kontakt",
    plain: "På fasta situationer är första kontakt och andra boll viktigare än snygga löpvägar.",
    trigger: "Alla hörnor, inläggsfrisparkar och djupt slagna inkast.",
    cue: "Kontakt först.",
    correction: "Bestäm vem som attackerar boll, vem som screenar, vem som tar andraboll.",
    metric: "Första kontakt vunnen eller störd på varje defensiv fast situation.",
    danger: "Vi blir bolltittande och tappar markering bakom ryggen.",
    tags: ["fasta", "duell", "andraboll"],
    intensity: "high",
  },
  {
    id: "fasta-atererovring",
    phase: "fasta",
    title: "Direkt återerövring på inkast",
    plain: "Djupt inkast är ett anfall även om vi inte hittar första spelaren.",
    trigger: "Inkast sista tredjedelen eller boll nära hörnflagga.",
    cue: "Tryck kvar.",
    correction: "Kasta mot yta, fyll nära, lås retur och vinn nästa boll högt.",
    metric: "Bollen stannar sista tredjedelen efter minst två av tre djupa inkast.",
    danger: "Vi kastar in och faller ur, så motståndaren kan kontra.",
    tags: ["fasta", "territorium", "andraboll"],
    intensity: "medium",
  },
];

export const TRAINING_BLOCKS: TrainingBlock[] = [
  {
    id: "duell-andraboll-box",
    title: "Duell och andraboll i korridor",
    phase: "identitet",
    minutes: 14,
    organisation: "Tre korridorer, 4v4+2 neutrala. Tränaren serverar första boll i luften eller studs.",
    scoring: "Poäng för vunnen första kontakt, extra poäng om laget vinner andra boll och spelar framåt.",
    coaching: ["Vinn kropp", "Säkra landningsyta", "Första pass bort från press"],
    progressions: ["Minska korridoren", "Lägg till mål efter andraboll", "Starta från inkast"],
    tags: ["duell", "andraboll", "transition"],
    intensity: "high",
  },
  {
    id: "tre-hojder-rondo",
    title: "Tre höjder i uppbyggnad",
    phase: "anfall",
    minutes: 12,
    organisation: "6v4 i rektangel med tre horisontella zoner. Minst en spelare i varje höjd.",
    scoring: "Poäng när laget spelar igenom alla tre höjder och hittar rättvänd mottagare.",
    coaching: ["Kort stöd", "Rättvänd länk", "Djupt hot"],
    progressions: ["Touchbegränsning", "Två försvarare får pressa över zon", "Avsluta mot mini-mål"],
    tags: ["spelbarhet", "avstand", "djup"],
    intensity: "medium",
  },
  {
    id: "in-ut-fram-box",
    title: "In, ut, fram, box",
    phase: "anfall",
    minutes: 18,
    organisation: "8v7 från mittzon till mål. Anfall måste spela in centralt innan kant används.",
    scoring: "Mål räknas dubbelt om cutback eller fem boxytor finns.",
    coaching: ["Hitta rättvänd", "Isolera kanten", "Fyll fem"],
    progressions: ["Lägg till kontringsmål för försvar", "Krav på andraboll efter inlägg", "Start från bollvinst"],
    tags: ["box", "bredd", "djup", "overtal"],
    intensity: "high",
  },
  {
    id: "samla-las-vinn",
    title: "Samla, lås, vinn",
    phase: "forsvar",
    minutes: 16,
    organisation: "7v7+3 zoner. Försvarande lag får pressa först när alla är under markerad linje.",
    scoring: "Poäng för stoppad spelvändning och bollvinst på låst sida.",
    coaching: ["Samla först", "Lås bollsida", "Bortre in"],
    progressions: ["Kortare tid till press", "Motståndare får extra neutral", "Direkt kontring efter vinst"],
    tags: ["press", "kompakt", "bredd"],
    intensity: "high",
  },
  {
    id: "gyllene-zon-skydd",
    title: "Skydda gyllene zonen",
    phase: "forsvar",
    minutes: 14,
    organisation: "Backlinje+sexa mot fem anfallare. Starta från kant och cutback-läge.",
    scoring: "Försvar får poäng för blockerat centralt avslut eller styrt avslut utanför zon.",
    coaching: ["Kropp mellan boll och mål", "Se cutback", "Prata markering"],
    progressions: ["Lägg till bortre ytter", "Start från inspel centralt", "Kontring efter brytning"],
    tags: ["kompakt", "box", "kommunikation"],
    intensity: "medium",
  },
  {
    id: "fem-sekunderspress",
    title: "Femsekunderspress",
    phase: "omst-forsvar",
    minutes: 13,
    organisation: "5v5+3. Tränaren ropar tapp och laget måste återerövra eller styra bakåt.",
    scoring: "Poäng för återerövring inom fem sekunder, halv poäng om motståndaren tvingas hem.",
    coaching: ["Närmaste på boll", "Stäng insida", "Säkra djup"],
    progressions: ["Större yta", "Färre egna runt boll", "Direkt avslut efter återerövring"],
    tags: ["transition", "press", "kompakt"],
    intensity: "high",
  },
  {
    id: "bromsa-kontring",
    title: "Bromsa kontringen",
    phase: "omst-forsvar",
    minutes: 12,
    organisation: "4v3 mot mål efter centralt tapp. Försvararna ska styra tempo och samla.",
    scoring: "Poäng om anfallet tvingas utåt eller tappar fart före sista tredjedelen.",
    coaching: ["Bromsa", "Centrera", "Ta bort pass framåt"],
    progressions: ["Starta med större yta", "Lägg till jagande sexa", "Krav på kontring efter brytning"],
    tags: ["transition", "kompakt", "press"],
    intensity: "medium",
  },
  {
    id: "ut-ur-press",
    title: "Ut ur press efter bollvinst",
    phase: "omst-anfall",
    minutes: 15,
    organisation: "6v6 i central zon med fria ytterkorridorer. Bollvinst ska spelas diagonal ut.",
    scoring: "Poäng för första pass ut från het yta, extra poäng för djupled inom tre sekunder.",
    coaching: ["Första blick ut", "Rättvänd efter vinst", "Djupled direkt"],
    progressions: ["Lås en ytterkorridor", "Lägg till boxmål", "Krav på säkring om kontring saknas"],
    tags: ["transition", "bredd", "djup"],
    intensity: "high",
  },
  {
    id: "kontra-eller-sakra",
    title: "Kontra eller säkra",
    phase: "omst-anfall",
    minutes: 14,
    organisation: "7v7. Tränaren varierar bollvinst med rättvänd eller felvänd bollhållare.",
    scoring: "Poäng för rätt beslut: kontra med fart eller behålla och flytta upp laget.",
    coaching: ["Se bilden", "Fram om rättvänd", "Säkra om felvänd"],
    progressions: ["Tidskrav på beslut", "Två målval", "Försvar får direkt återpressa"],
    tags: ["transition", "spelbarhet", "djup"],
    intensity: "medium",
  },
  {
    id: "fasta-forsta-andra",
    title: "Fasta: första och andra",
    phase: "fasta",
    minutes: 16,
    organisation: "Hörnor, frisparkar och inkast i serie. Varje boll har bestämd första och andra yta.",
    scoring: "Poäng för första kontakt, andraboll och avslut eller rensning med kontroll.",
    coaching: ["Kontakt först", "Andraboll", "Tryck kvar"],
    progressions: ["Byt ansvar", "Lägg till kontringshot", "Krav på andra våg"],
    tags: ["fasta", "duell", "andraboll"],
    intensity: "high",
  },
];

export const MATCH_SCENARIOS: MatchScenario[] = [
  {
    id: "tappar-dueller",
    label: "Vi tappar duellerna",
    phase: "identitet",
    symptom: "Motståndaren vinner första kontakt och får äga andrabollen.",
    diagnosis: "Vi står för långt från duellen och reagerar först efter att bollen landat.",
    correction: "Flytta understöd närmare första boll och ge en spelare tydligt ansvar för landningsytan.",
    sideline: "Vinn kropp. Läs andra.",
    trainingBlockIds: ["duell-andraboll-box", "fasta-forsta-andra"],
    tags: ["duell", "andraboll"],
    tone: "gold",
  },
  {
    id: "pressen-spricker",
    label: "Pressen spricker",
    phase: "forsvar",
    symptom: "Vi pressar högt men blir spelade igenom eller över till bortre sida.",
    diagnosis: "Första pressen går innan laget är kort och bortre korridor hinner inte in.",
    correction: "Sänk startsignalen, samla laget och lås bollsida först när alla relationer sitter.",
    sideline: "Samla först. Lås sen.",
    trainingBlockIds: ["samla-las-vinn", "gyllene-zon-skydd"],
    tags: ["press", "kompakt", "bredd"],
    tone: "blue",
  },
  {
    id: "tom-box",
    label: "Vi kommer runt men boxen är tom",
    phase: "anfall",
    symptom: "Kanten slår inlägg men bara en spelare attackerar mål.",
    diagnosis: "Ytorna är inte fördelade och för många spelare tittar på boll bakom situationen.",
    correction: "Lås fem boxroller och repetera att kanten är transporten, inte målet.",
    sideline: "Fyll fem.",
    trainingBlockIds: ["in-ut-fram-box", "tre-hojder-rondo"],
    tags: ["box", "bredd", "overtal"],
    tone: "green",
  },
  {
    id: "fast-centralt",
    label: "Vi fastnar centralt",
    phase: "anfall",
    symptom: "Vi försöker spela igenom mitten utan rättvänd spelare och tappar farligt.",
    diagnosis: "Avstånden är platta och ingen hotar bakom när bollhållaren lyfter blicken.",
    correction: "Sök tre höjder, flytta blocket ut och använd djupt inkast eller spelvändning när mitten är stängd.",
    sideline: "Tre höjder. Gör planen stor.",
    trainingBlockIds: ["tre-hojder-rondo", "in-ut-fram-box"],
    tags: ["spelbarhet", "avstand", "djup"],
    tone: "green",
  },
  {
    id: "tappar-efter-vinst",
    label: "Vi tappar direkt efter bollvinst",
    phase: "omst-anfall",
    symptom: "Vi vinner boll men första passningen går tillbaka in i pressen.",
    diagnosis: "Bollhållaren saknar första blick ut och närmaste spelare erbjuder bara fötter i trång yta.",
    correction: "Skapa diagonal utgång, ett säkert stöd och ett djupt hot direkt efter bollvinst.",
    sideline: "Ut ur press.",
    trainingBlockIds: ["ut-ur-press", "kontra-eller-sakra"],
    tags: ["transition", "bredd", "djup"],
    tone: "green",
  },
  {
    id: "kontringar-emot",
    label: "Kontringar emot",
    phase: "omst-forsvar",
    symptom: "Ett centralt tapp leder till löpning mot vår backlinje.",
    diagnosis: "Vi går i direktpress fast bilden kräver broms och central säkring.",
    correction: "Första spelaren bromsar, övriga centrerar och tar bort passningen framåt.",
    sideline: "Bromsa. Centrera.",
    trainingBlockIds: ["bromsa-kontring", "fem-sekunderspress"],
    tags: ["transition", "kompakt", "press"],
    tone: "red",
  },
  {
    id: "fasta-passiva",
    label: "Fasta blir passiva",
    phase: "fasta",
    symptom: "Vi markerar men attackerar inte bollbanan och tappar andra vågen.",
    diagnosis: "Rollerna finns på papper men inte i beteende när bollen kommer.",
    correction: "Ge varje spelare första kontakt, blockeringsroll eller andrabollsroll.",
    sideline: "Kontakt först.",
    trainingBlockIds: ["fasta-forsta-andra", "duell-andraboll-box"],
    tags: ["fasta", "duell", "andraboll"],
    tone: "neutral",
  },
];

export const READINESS_ITEMS: ReadinessItem[] = [
  {
    id: "shared-words",
    label: "Tre gemensamma ord är satta",
    detail: "Spelarna vet vilka sidlinjeord som gäller idag.",
    weight: 12,
  },
  {
    id: "first-action",
    label: "Första aktion efter avspark är tydlig",
    detail: "Alla vet om första minuterna handlar om duell, press eller bollkontroll.",
    weight: 12,
  },
  {
    id: "phase-priority",
    label: "Ett skede är prioriterat",
    detail: "Matchplanen har ett huvudfokus och två stödprinciper.",
    weight: 14,
  },
  {
    id: "box-roles",
    label: "Boxroller är fördelade",
    detail: "Första, straffpunkt, bortre, cutback och andraboll är bemannade.",
    weight: 10,
    phase: "anfall",
  },
  {
    id: "press-trigger",
    label: "Pressignal är överenskommen",
    detail: "Laget vet när vi samlar, när vi låser och när vi går.",
    weight: 13,
    phase: "forsvar",
  },
  {
    id: "transition-rule",
    label: "Regel vid bolltapp och bollvinst är enkel",
    detail: "Direkt eller indirekt vid tapp, kontra eller säkra vid vinst.",
    weight: 13,
  },
  {
    id: "set-piece-contacts",
    label: "Fasta har första och andra ansvar",
    detail: "Första kontakt och andraboll är inte frivilliga.",
    weight: 8,
    phase: "fasta",
  },
  {
    id: "halftime-question",
    label: "Pausens första fråga är vald",
    detail: "Ledarna vet vilken matchbild som ska kontrolleras först.",
    weight: 10,
  },
  {
    id: "training-transfer",
    label: "Träningen har matchkoppling",
    detail: "Minst ett träningsblock återkommer som matchspråk.",
    weight: 8,
  },
];

export const SESSION_PRESETS: SessionPreset[] = [
  {
    id: "matchdag-minus-1",
    label: "MD-1: kort och skarpt",
    minutes: 45,
    goal: "Sätta tre matchord, fasta situationer och första aktionen.",
    recommendedPrinciples: ["duell-fore-plan", "samla-fore-press", "fasta-forsta-kontakt"],
    recommendedScenario: "fasta-passiva",
  },
  {
    id: "matchdag-minus-2",
    label: "MD-2: matchplan",
    minutes: 70,
    goal: "Repetera försvarstrigger, anfallsväg och omställningsbeslut.",
    recommendedPrinciples: ["samla-fore-press", "las-bollsida", "in-ut-fram-box", "forsta-pass-ut"],
    recommendedScenario: "pressen-spricker",
  },
  {
    id: "aterstart",
    label: "Återstart efter match",
    minutes: 60,
    goal: "Få tillbaka identitet, dueller och enkla beslut.",
    recommendedPrinciples: ["duell-fore-plan", "andraboll-landningsyta", "lopvilja-utan-boll"],
    recommendedScenario: "tappar-dueller",
  },
  {
    id: "anfallslyft",
    label: "Anfallslyft",
    minutes: 75,
    goal: "Skapa fler hot genom rättvänd spelare, bredd och boxfyllnad.",
    recommendedPrinciples: ["spelbarhet-tre-hojder", "bredd-som-vapen", "in-ut-fram-box", "box-fem-ytor"],
    recommendedScenario: "tom-box",
  },
  {
    id: "transition",
    label: "Omställningskväll",
    minutes: 65,
    goal: "Skilja på jaga, bromsa, kontra och säkra.",
    recommendedPrinciples: ["direkt-atererovring", "indirekt-bromsa", "forsta-pass-ut", "kontra-nar-bilden-ar-ratt"],
    recommendedScenario: "kontringar-emot",
  },
];

export const TAG_LABELS: Record<PrincipleTag, string> = {
  spelbarhet: "Spelbarhet",
  avstand: "Avstånd",
  bredd: "Bredd",
  djup: "Djup",
  overtal: "Övertal",
  press: "Press",
  kompakt: "Kompakt",
  box: "Box",
  duell: "Duell",
  andraboll: "Andraboll",
  transition: "Omställning",
  territorium: "Territorium",
  kommunikation: "Kommunikation",
  fasta: "Fasta",
};

export const LAB_TONE_CLASSES: Record<
  LabTone,
  { text: string; bg: string; border: string; solid: string; softBorder: string }
> = {
  gold: {
    text: "text-gunnilse-gold",
    bg: "bg-gunnilse-gold/10",
    border: "border-gunnilse-gold/35",
    solid: "bg-gunnilse-gold",
    softBorder: "border-gunnilse-gold/20",
  },
  blue: {
    text: "text-swedish-blue",
    bg: "bg-swedish-blue/10",
    border: "border-swedish-blue/35",
    solid: "bg-swedish-blue",
    softBorder: "border-swedish-blue/20",
  },
  green: {
    text: "text-zone-attack",
    bg: "bg-zone-attack/10",
    border: "border-zone-attack/35",
    solid: "bg-zone-attack",
    softBorder: "border-zone-attack/20",
  },
  red: {
    text: "text-gunnilse-red",
    bg: "bg-gunnilse-red/10",
    border: "border-gunnilse-red/35",
    solid: "bg-gunnilse-red",
    softBorder: "border-gunnilse-red/20",
  },
  neutral: {
    text: "text-foreground",
    bg: "bg-muted/40",
    border: "border-border",
    solid: "bg-muted-foreground",
    softBorder: "border-border",
  },
};

export const LAB_ICONS = {
  Activity,
  ArrowRightLeft,
  Goal,
  LockKeyhole,
  MapPinned,
  Radar,
};
