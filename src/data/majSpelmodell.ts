import type { EffectLogicBlock } from "@/data/period1";

export type BlockColor = "red" | "blue" | "yellow" | "green" | "white";

export interface PlayerQuickAction {
  scenario: string;
  actions: string[];
}

export interface PrincipleDef {
  id: string;
  label: string;
  oneLiner: string;
  definition: string;
  matchSignal: string;
  playerAction: string;
  teamAction: string;
  trainingAction: string;
  matchMetric: string;
}

/**
 * Statisk media-tile renderad på /maj-2026. Komplement till den
 * Supabase-backade `PrincipleMediaSlot` (som är admin-editerbar).
 * `src` är relativ från sajtens root — `public/` serveras på `/` — eller en extern URL.
 */
export type MediaKind = "video" | "image";

export interface MediaAsset {
  src: string;
  label: string;
  kind: MediaKind;
}

export interface MajBlock {
  id: string;
  number: string;
  navLabel: string;
  title: string;
  kidExplanation: string;
  playerInstruction: string;
  doList: string[];
  dontList: string[];
  mediaTitle: string;
  mediaDescription: string;
  illustrationCaption: string;
  remember: string;
  accent: BlockColor;
  principles: PrincipleDef[];
}

export const MAJ_2026_HERO = {
  eyebrow: "Spelmodellen 2026",
  title: "Så spelar Gunnilse",
  description:
    "Vår spelmodell är vårt gemensamma språk för matchen. Den säger vad vi gör när vi har bollen, när motståndaren har bollen, när vi vinner bollen, när vi tappar bollen och när spelet står still.",
} as const;

export const MAJ_2026_NAV_CARDS: Array<{ id: string; label: string; number: string }> = [
  { id: "forsvarsspel", number: "01", label: "Försvarsspel" },
  { id: "overgang-anfall", number: "02", label: "När vi vinner bollen" },
  { id: "anfallsspel", number: "03", label: "Anfallsspel" },
  { id: "overgang-forsvar", number: "04", label: "När vi tappar bollen" },
  { id: "identitet", number: "05", label: "Identitet" },
  { id: "fasta-situationer", number: "06", label: "Fasta situationer" },
];

export const MAJ_2026_EFFECT_LOGIC: EffectLogicBlock[] = [
  {
    label: "Resurser",
    items: [
      "Spelartrupp + tränarteam",
      "Träningstid 3 pass/vecka",
      "Match som mätpunkt varje vecka",
      "Plan, film och taktiktavla",
    ],
  },
  {
    label: "Aktiviteter",
    items: [
      "Försvara tillsammans, pressa på trigger",
      "Ställa om framåt direkt vid bollvinst",
      "Anfalla assistytan via in- och utspel",
      "Återerövra inom 5 sekunder",
    ],
  },
  {
    label: "Mål",
    items: [
      "Få in bollen i assistytan",
      "Fyll boxen vid varje inlägg",
      "Vinn andrabollar och dueller",
      "Återta initiativet efter bolltapp",
    ],
  },
  {
    label: "Effekt",
    items: [
      "Fler målchanser i rätt zoner",
      "Färre baklängesmål i omställning",
      "Tydlig identitet — spelarna vet vad de gör",
      "Stolt lagkultur som syns på planen",
    ],
  },
];

export const MAJ_2026_QUICK_ACTIONS: PlayerQuickAction[] = [
  {
    scenario: "När vi försvarar",
    actions: ["Skydda mitten", "Pressa på trigger", "Markera på bollsida"],
  },
  {
    scenario: "När vi vinner bollen",
    actions: ["Titta framåt", "Spela framåt", "Löp diagonalt"],
  },
  {
    scenario: "När vi anfaller",
    actions: ["Ha kontringsskydd", "Spela in, spela ut", "Nå assistytan", "Fyll boxen"],
  },
  {
    scenario: "När vi tappar bollen",
    actions: ["Pressa direkt", "Stäng passning", "Vinn tillbaka"],
  },
  {
    scenario: "Oavsett matchbild",
    actions: ["Vinn dueller", "Vinn andrabollar", "Spring i djupled", "Visa värdigt kroppsspråk"],
  },
  {
    scenario: "På fasta situationer",
    actions: ["Veta din plats", "Din löpning", "Ditt ansvar"],
  },
];

const principle = (
  id: string,
  label: string,
  oneLiner: string,
  definition: string,
  matchSignal: string,
  playerAction: string,
  teamAction: string,
  trainingAction: string,
  matchMetric: string
): PrincipleDef => ({
  id,
  label,
  oneLiner,
  definition,
  matchSignal,
  playerAction,
  teamAction,
  trainingAction,
  matchMetric,
});

export const MAJ_2026_BLOCKS: MajBlock[] = [
  {
    id: "forsvarsspel",
    number: "01",
    navLabel: "Försvarsspel",
    title: "Försvarsspel",
    kidExplanation:
      "När motståndaren har bollen är vi ett lag som jobbar tillsammans. Vi täcker mitten först, sen pressar vi när rätt signal kommer.",
    playerInstruction:
      "Stå rätt, kommunicera, och vänta på triggern. När den kommer pressar du hårt och snabbt — utan att lämna luckor bakom dig.",
    doList: [
      "Skydda mitten — tvinga ut spelet på sidan",
      "Pressa på trigger: dålig touch, bakåtpassning, vänd rygg",
      "Markera bollsida — täta avstånd i kedjan",
      "Prata: 'press', 'håll', 'byt'",
    ],
    dontList: [
      "Pressa ensam utan att laget är med",
      "Stå platt — alltid någon som backar upp",
      "Tappa bollen ur ögonen för att se motståndaren",
      "Tysta laget — försvaret behöver röst",
    ],
    mediaTitle: "Press på trigger — exempel från match",
    mediaDescription: "Visa när hela kedjan rör sig samtidigt på rätt signal.",
    illustrationCaption: "Mittblock som tvingar ut spelet på sidan, bollsida markerad.",
    remember: "Skydda mitten. Pressa på trigger. Aldrig ensam.",
    accent: "red",
    principles: [
      principle("hogt", "Högt försvar", "Pressa högt — vinn boll på motståndarens planhalva.", "Vi försvarar framåt när deras första passning eller touch ger oss chans att låsa dem.", "Bakåtpassning, dålig första touch eller boll till kant med ryggen mot spel.", "Pressa bollhållaren med fart och styr bort från mitten.", "Närmaste pressar, nästa stänger insida, resten flyttar upp.", "Spela 7v7 med krav på gemensam pressignal innan brytning.", "Vi vinner boll eller tvingar lång boll inom fem sekunder."),
      principle("medel", "Medelhögt försvar", "Kompakt mittblock — stäng mitten, tvinga ut spelet.", "Vi samlar laget runt mittlinjen och gör mitten trång.", "Motståndaren bygger kontrollerat men saknar fri rättvänd spelare centralt.", "Håll avståndet till närmaste lagkamrat och skydda passningen genom dig.", "Kedjorna flyttar som ett block och styr bollen mot sidan.", "Träna 8v8 där försvarande lag får poäng för brutna centrala passningar.", "Motståndaren spelar runt oss, inte igenom oss."),
      principle("lagt", "Lågt försvar", "Skydda boxen — kompakt kedja, kontringshot framåt.", "Vi försvarar nära eget mål med boxen som första prioritet.", "Bollen är på sista tredjedelen eller motståndaren kan slå inlägg/skott.", "Stå mellan boll och mål, vinn duellen och rensa framåt.", "Backlinje och mittfält tätar boxen, forwards gör sig spelbara för kontring.", "Träna inläggsförsvar med tydliga zoner, markeringar och första pass ut.", "Inga fria avslut i gyllene zonen."),
    ],
  },
  {
    id: "overgang-anfall",
    number: "02",
    navLabel: "Övergång till anfall",
    title: "När vi vinner bollen",
    kidExplanation:
      "Just när vi vinner bollen är motståndaren ostrukturerad. Då är det dags att titta framåt — inte bakåt eller åt sidan.",
    playerInstruction:
      "Första touchen framåt. Första blicken framåt. Spring så du kan ta emot, eller spring så du drar med dig en försvarare.",
    doList: [
      "Titta framåt direkt — sök djupledspass",
      "Spela framåt om det finns en lucka",
      "Löp diagonalt mot assistytan",
      "Säkra bollen om framåtspelet inte är på",
    ],
    dontList: [
      "Spela tillbaka som default",
      "Stå still och vänta — alla rör sig",
      "Dribbla in i press utan stöd",
      "Glömma att täcka kontringsrisken",
    ],
    mediaTitle: "Bollvinst → första passning framåt",
    mediaDescription: "Sekvenser där vi går från bollvinst till avslut på under 8 sekunder.",
    illustrationCaption: "Diagonala löpningar mot assistytan när bollen vinns på mittplan.",
    remember: "Titta framåt. Spela framåt. Löp diagonalt.",
    accent: "blue",
    principles: [
      principle("kontring", "Kontring", "Utnyttja motståndarens oordning — spela direkt mot mål.", "Kontring är första valet när vi vinner boll och har yta framför oss.", "Bollvinst med rättvänd spelare eller fri yta bakom deras backlinje.", "Titta framåt först och spela eller löp i djupled.", "Yttrar och nia hotar djup, bollnära spelare ger stöd bakom.", "Träna 5 sekunder från bollvinst till avslut i smålagsspel.", "Första framåtaktion sker inom tre sekunder."),
      principle("speluppbyggnad", "Starta speluppbyggnad", "Säkra bollen, bygg lugnt om — vi kontrar inte alltid.", "Om framåtspel inte finns tar vi kontroll och börjar anfallet på nytt.", "Bollvinst utan rättvänd spelare, med press runt bollen eller dålig balans bakom.", "Säkra första passningen och skapa ny spelbarhet.", "Laget breddar, sexan visar sig och backlinjen ger trygg riktning.", "Träna bollvinst där laget måste välja kontring eller säkring på signal.", "Vi behåller bollen och etablerar anfall utan farligt bolltapp."),
    ],
  },
  {
    id: "anfallsspel",
    number: "03",
    navLabel: "Anfallsspel",
    title: "Anfallsspel",
    kidExplanation:
      "När vi har bollen jobbar vi mot ett tydligt mål: in i assistytan, sen ett bra inlägg eller djupledspass, sen fylla boxen.",
    playerInstruction:
      "Spela in bollen, spela ut den till en fri spelare, ta in den på sidan, vinn assistytan, och se till att vi är minst fyra i boxen.",
    doList: [
      "Ha kontringsskydd bakom bollen alltid",
      "Spela in — locka in motståndaren först",
      "Spela ut — bryt pressen med tredje man",
      "Nå assistytan via halvyta eller djupledslöpning",
      "Fyll boxen: minst fyra spelare när bollen kommer in",
    ],
    dontList: [
      "Glömma kontringsskydd — vi tappar bollen ibland",
      "Spela bara säkert sidled",
      "Slå inlägg utan någon i boxen",
      "Köra ensam — bryta strukturen",
    ],
    mediaTitle: "Sekvens: in → ut → assistyta → box",
    mediaDescription: "Visa fyra fullföljda anfall där alla led syns.",
    illustrationCaption: "Spelytor markerade: halvytor, korridorer, assistyta, box.",
    remember: "Kontringsskydd. In, ut, ut till sida. Fyll boxen.",
    accent: "yellow",
    principles: [
      principle("skydda-mot-kontring", "Skydda mot kontring", "Restförsvar bakom bollen — alltid.", "Vi anfaller med spelare bakom bollen så ett bolltapp inte blir målchans emot.", "Vi har längre anfall eller många spelare framför bollen.", "Kolla balansen innan du fyller på.", "Sexa och mittbackar håller avstånd och täcker centralt.", "Träna anfall mot försvar där kontringsmål räknas dubbelt för motståndaren.", "Inga farliga kontringar efter eget anfall."),
      principle("spela-in", "Spela in bollen", "Locka in motståndaren först — vänd sen ut spelet.", "Vi spelar centralt eller in i halvyta för att dra ihop motståndaren.", "Motståndaren är utspridd och det finns en spelbar linje inåt.", "Visa dig i vinkel och spela vidare snabbt.", "När bollen går in gör nästa spelare sig redo för spel ut.", "Träna rondo/positionsspel där poäng ges för pass in genom linje.", "Vi hittar spelare mellan deras lagdelar."),
      principle("spela-ut", "Spela ut bollen", "Bryt pressen via tredje man — sök fri spelare i halvyta.", "När motståndaren samlas runt bollen flyttar vi den till fri sida.", "Bollsidan är trång men motsatt korridor eller halvyta är fri.", "Spela med få tillslag och var spelbar som tredje man.", "Basen styr vändningen och yttern/ytterbacken tar ny yta.", "Träna spelvändning med krav på tredje man innan avslut.", "Spelvändningen ger oss tid framåt på ny sida."),
      principle("ta-med-framat", "Ta med den framåt", "Driv eller passa upp till assistytan.", "När vi är rättvända ska bollen vinna meter mot mål.", "Rättvänd spelare har minst fem meter yta eller löpning framför sig.", "Driv, passa framåt eller hota bakom direkt.", "Främre spelare löper så bollhållaren får två framåtval.", "Träna rättvänd mottagning följt av driv, djupledspass eller väggspel.", "Vi når sista tredjedelen utan sidledstapp."),
      principle("fyll-pa-box", "Fyll på i och runt box", "Minst fyra spelare i boxen när inlägget kommer.", "Sista passningen är värdelös om ingen fyller målområdet.", "Bollen är i assistytan, kortlinjen eller inläggsläge.", "Ta din boxyta: första, straffpunkt, bortre, cutback eller andraboll.", "Laget fyller minst fyra ytor och säkrar retur bakom.", "Träna inspel där mål bara räknas om boxytorna är fyllda.", "Vi har fyra spelare i/runt box vid inspel."),
    ],
  },
  {
    id: "overgang-forsvar",
    number: "04",
    navLabel: "Övergång till försvar",
    title: "När vi tappar bollen",
    kidExplanation:
      "I sekunden vi tappar bollen är motståndaren öppen för kontring. Då är det inte tid att tänka — det är tid att pressa direkt.",
    playerInstruction:
      "Närmaste spelaren pressar bollhållaren. Resten stänger passningslinjer och täcker djupet. Vi vinner tillbaka eller bromsar tills laget är hemma.",
    doList: [
      "Pressa direkt — närmaste spelare attackerar bollen",
      "Stäng passningslinjer — släck framåtspelet",
      "Vinn tillbaka inom 5 sekunder om möjligt",
      "Bromsa och retirera om återerövring inte sker",
    ],
    dontList: [
      "Klaga eller peka — det kostar sekunder",
      "Gå långsamt hem — sprinta",
      "Pressa utan att stänga passningen bakom",
      "Glömma vem du är ansvarig för i kedjan",
    ],
    mediaTitle: "Motpress inom 5 sekunder",
    mediaDescription: "Klipp där hela laget reagerar samtidigt på bolltapp.",
    illustrationCaption: "Närmaste man pressar, två stänger passning, kedja retirerar.",
    remember: "Pressa direkt. Stäng passning. Vinn tillbaka.",
    accent: "red",
    principles: [
      principle("direkt", "Direkt motpress", "Närmaste man pressar bollen inom 1 sekund.", "Första sekunden efter bolltapp avgör om vi kan vinna tillbaka direkt.", "Vi tappar boll med flera spelare nära situationen.", "Attackera bollhållaren direkt och stoppa första passningen.", "Närmaste pressar, två runt stänger vägar, resten skyddar djup.", "Träna 5-sekundersregel i possessionspel efter varje tapp.", "Vi återvinner eller tvingar bakåt inom fem sekunder."),
      principle("kontroll", "Tillbaka till kontroll", "Bromsa och retirera kompakt om återerövring inte sker.", "När pressen inte vinner boll måste laget snabbt bli organiserat igen.", "Motståndaren spelar igenom första pressen eller har rättvänd spelare framåt.", "Spring hem och stäng centralt först.", "Backlinjen faller, mittfältet smalnar, forwards bromsar boll.", "Träna tapp där laget måste välja motpress eller reträtt på tränarsignal.", "Motståndaren får inget fritt djupledsläge efter vårt tapp."),
    ],
  },
  {
    id: "identitet",
    number: "05",
    navLabel: "Identitet",
    title: "Identitet",
    kidExplanation:
      "Identiteten är hur vi spelar oavsett resultat, motståndare och väder. Det är saker som syns i varje aktion — i hur vi rör oss och hur vi pratar.",
    playerInstruction:
      "Vinn din duell. Vinn andrabollen. Spring i djupled. Visa värdigt kroppsspråk — i medgång och motgång.",
    doList: [
      "Vinn dueller — gå in i varje 50/50",
      "Vinn andrabollar — var närmast när bollen släpps",
      "Spring i djupled — sträck spelet och skapa luckor",
      "Visa värdigt kroppsspråk — peppa, inte gnälla",
    ],
    dontList: [
      "Backa ur en duell",
      "Stå still efter ett huvudspel",
      "Spring bara fötterna utan att hota djupet",
      "Klaga på domare eller medspelare",
    ],
    mediaTitle: "Identitetsmoment från säsongen",
    mediaDescription: "Kort montage som visar duell, andraboll, djupled, kroppsspråk.",
    illustrationCaption: "Fyra ikoner kopplade till de fyra identitetsbeteendena.",
    remember: "Dueller. Andrabollar. Djupled. Värdigt kroppsspråk.",
    accent: "yellow",
    principles: [
      principle("duellspel", "Duellspel", "Vinn varje 50/50 — kropp först, boll sen.", "Duellen är när två spelare slåss om samma yta eller boll.", "Bollen är lös, passningen är svag eller motståndaren tar emot nära dig.", "Gå in beslutsamt och avsluta situationen.", "När en går i duell säkrar nästa spelare andrabollen.", "Träna närkampsspel med direkt andraboll efter varje duell.", "Vi vinner fler dueller än motståndaren."),
      principle("andrabollsspel", "Andrabollsspel", "Var närmast när bollen släpps — läs studsen innan den händer.", "Andrabollen är nästa boll efter duell, nick, block eller räddning.", "Bollen är på väg att studsa, rensas eller falla mellan lag.", "Rör dig innan bollen landar och ta första touch framåt om möjligt.", "Laget samlar spelare runt duellen, inte bara i duellen.", "Träna långa bollar där poängen kommer på andra aktionen.", "Vi är först på lösa bollar runt dueller."),
      principle("djupledslopningar", "Djupledslöpningar", "Spring bakom backlinjen — du får bollen eller öppnar ytan.", "Djupledslöpningen hotar ytan bakom deras backlinje.", "Bollhållaren är rättvänd eller deras backlinje står still.", "Starta löpningen med timing och full fart.", "En spelare hotar bakom, en visar fötter, en säkrar bakom.", "Träna rättvänd spelare som måste hitta löpning eller tredje man.", "Vi hotar bakom flera gånger per halvlek."),
      principle("vardigt-kroppssprak", "Värdigt kroppsspråk", "Peppa, inte gnälla — i medgång och motgång.", "Kroppsspråket ska hjälpa nästa aktion, inte förstora misstaget.", "Vi släpper in mål, missar passning, får domslut emot eller blir trötta.", "Prata kort, positivt och rikta fokus mot nästa aktion.", "Laget samlar energi snabbt och undviker gnällkedjor.", "Träna stopp efter misstag: fem sekunder att organisera nästa aktion.", "Vi återgår till uppgift direkt efter misstag."),
    ],
  },
  {
    id: "fasta-situationer",
    number: "06",
    navLabel: "Fasta situationer",
    title: "Fasta situationer",
    kidExplanation:
      "Hörnor, frisparkar, inkast, avspark — de är planerade. Du vet redan innan domaren blåser var du ska vara och vad du ska göra.",
    playerInstruction:
      "Kolla rutan på matchbladet. Vet din plats, din löpning och ditt ansvar. Inga gissningar — kör mönstret.",
    doList: [
      "Veta din plats innan situationen börjar",
      "Köra din löpning — sälj den helt",
      "Ta ditt ansvar — markering eller zon",
      "Kommunicera kort: 'min', 'din', 'kontra'",
    ],
    dontList: [
      "Stå still och titta på bollen",
      "Byta uppgift med någon annan mitt i",
      "Glömma kontringsskydd vid offensiv fast",
      "Förlora koncentrationen — fast situation = mål eller baklänges",
    ],
    mediaTitle: "Fast situation — vår rutin",
    mediaDescription: "En offensiv hörna och en defensiv frispark, mönstret stegvis.",
    illustrationCaption: "Numrerade positioner och löpvägar på en hörna.",
    remember: "Din plats. Din löpning. Ditt ansvar.",
    accent: "green",
    principles: [
      principle("hornor", "Hörnor", "Offensiv: mönstret. Defensiv: zon eller markering enligt matchblad.", "Hörnor är planerade situationer där varje spelare har plats och uppgift.", "Domaren pekar på hörna för eller emot.", "Ta din startposition och kör din löpning/markering fullt.", "Laget täcker första boll, retur och kontringsskydd.", "Träna hörna i tre faser: första boll, andraboll, omställning.", "Alla vet uppgift innan hörnan slås."),
      principle("inlaggsfrisparkar", "Inläggsfrisparkar", "Position + löpväg klar innan domaren blåser.", "Frisparkar med inlägg behandlas som hörnor med tydlig startlinje.", "Bollen ligger på kanten eller halvytan och kan slås in i box.", "Stå på rätt linje och tajma löpning eller markering.", "Laget håller linje, attackerar yta och säkrar andraboll.", "Träna offensiv och defensiv frispark med samma signalord som matchbladet.", "Vi ger inte bort fria nickar eller missar egen löpväg."),
      principle("inkast", "Inkast", "Snabba kombinationer — undvik förutsägbara kast.", "Inkast är en chans att behålla tempo och spela oss ur trånga ytor.", "Bollen går ut nära oss och motståndaren hinner inte organisera sig.", "Visa dig snabbt: fötter, bakom eller tillbaka.", "Tre spelare skapar triangel runt kastaren.", "Träna inkast med tre fasta alternativ och max fem sekunder till kast.", "Vi behåller boll eller vinner yta på inkast."),
      principle("avspark", "Avspark", "Vi äger andrabollen — direkt press när motståndaren startar.", "Avspark är första press- eller andrabollssituationen i en period.", "Vi eller motståndaren startar spelet från mittpunkten.", "Var redo på nästa boll, inte bara första passningen.", "Laget står för att vinna andrabollen och stänga mitten direkt.", "Träna avspark med första pass, lång boll och pressignal.", "Vi är först organiserade efter avspark."),
    ],
  },
];

/* =========================================================================
   MEDIA — filmer & bilder per princip
   Källfiler i public/media/maj-2026/. Renderas ovanför admin-slotten.
   ========================================================================= */

const M = (file: string, label: string, kind: MediaKind = "video"): MediaAsset => ({
  src: `/media/maj-2026/${file}`,
  label,
  kind,
});

const U = (url: string, label: string, kind: MediaKind = "video"): MediaAsset => ({
  src: url,
  label,
  kind,
});

export const MAJ_2026_PRINCIPLE_MEDIA: Record<string, Record<string, MediaAsset[]>> = {
  forsvarsspel: {
    medel: [
      M("forsvar-tre-korridorer.mp4", "Försvar — tre korridorer"),
      M("forsvar-trigger.mp4", "Försvar — trigger"),
      M("def-mitt-ansvar.mp4", "Defensiv mitt — ansvar"),
      M("forsvar-misslyckat.mp4", "Försvar — misslyckat"),
      M("forsvar-avstand.png", "Försvar — avstånd", "image"),
      U("https://youtu.be/ByjV5xoRi64", "försvar. styr mot yttre korridor för att vi"),
    ],
  },
  "overgang-anfall": {
    kontring: [
      U("https://youtu.be/v9GPU-jxFF4", "2:a bollsspel — start om anfall högt"),
      U("https://youtu.be/fD5GS8Ez4pc", "Omställning till anfall, kontring. mål"),
    ],
  },
  "overgang-forsvar": {
    direkt: [
      U("https://youtu.be/NBdI1FkHtiI", "Direkt bollåtererövring"),
      U("https://youtu.be/ehAbno5VYdM", "Direkt bollåtererövring — leder till mål"),
      U("https://youtu.be/YhS2r2rip8A", "omställning till försvar. direkt reaktion"),
    ],
  },
  anfallsspel: {
    "skydda-mot-kontring": [
      M("anf-skydd-fem-korridorer.mp4", "Anfall — skydd + fem korridorer"),
    ],
    "spela-in": [
      M("anf-passa-mellan-linjer-till-nasta-spelyta.mp4", "Anfall — passa mellan linjer till nästa spelyta"),
      M("anf-mellan-tva-spelare-till-nasta-spelyta.mp4", "Anfall — mellan två spelare till nästa spelyta"),
    ],
    "spela-ut": [
      M("anf-vandning-utnyttjar-inte-2-vs-1.mp4", "Anfall — vändning, utnyttjar inte 2 vs 1"),
      M("anf-2-vs-1-ej-lyckat.png", "Anfall — 2 vs 1 ej lyckat", "image"),
      U("https://youtu.be/l1H5hwu3CNQ", "anfallsspel. Spelvändning, fram, avslut"),
      U("https://youtu.be/FNiuGVbptI4", "anfall. In, in, ut"),
      U("https://youtu.be/JIi84a_FrY0", "anfallsspel. Spelvändning.mp4"),
    ],
    "ta-med-framat": [
      M("assistytan-2-vs-1.png", "Assistytan — 2 vs 1", "image"),
      M("anf-djupled.mp4", "Anfall — djupled"),
      M("galvan-1-ej-assist.mp4", "Vi följer inte idén om assistytan — 1"),
      M("galvan-2-ej-assistyta.mp4", "Vi följer inte idén om assistytan — 2"),
      U("https://youtu.be/5Ub2i3J9rdQ", "Anfallsspel. In, ut, fram, mål."),
    ],
    "fyll-pa-box": [
      U("https://youtu.be/MtKIJtFnU6E", "Anfall. In, ut, fram, box. MÅL"),
    ],
  },
  identitet: {
    duellspel: [
      M("for-anf-vedad-duell-och-passning-mellan-linjer.mp4", "Vedad — duell och passning mellan linjer"),
    ],
    andrabollsspel: [
      U("https://youtu.be/uESC24-VDLQ", "2:a bollsspel — exempel 1"),
      M("forsv-2a-bollsspel.mp4", "Försvar — 2:a bollsspel"),
      U("https://youtu.be/2YAQ5wXf_2M", "2:a bollsspel — ej lyckat"),
      U("https://youtu.be/PSP_YpetKYc", "2:a bollsspel — var beredd på lång boll"),
      U("https://youtu.be/q5Y4ThoZqK4", "Identitet. 2a boll, Ihab, bollvinst"),
      M("2a-bollsspel-misslyckat.png", "2:a bollsspel — misslyckat", "image"),
    ],
    "vardigt-kroppssprak": [
      M("identitet-vardigt-kroppssprak.mp4", "Identitet — värdigt kroppsspråk"),
    ],
  },
};

export const MAJ_2026_OVRIGT_MEDIA: MediaAsset[] = [];
