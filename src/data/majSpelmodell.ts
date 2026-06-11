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
  eyebrow: "Sommaren 2026",
  title: "SÅ SPELAR VI FOTBOLL",
  description:
    "Vi försvarar tillsammans, ställer om framåt, attackerar assistytan, återerövrar direkt och visar vår identitet i varje aktion.",
} as const;

export const MAJ_2026_NAV_CARDS: Array<{ id: string; label: string; number: string }> = [
  { id: "forsvarsspel", number: "01", label: "Försvarsspel" },
  { id: "overgang-anfall", number: "02", label: "Övergång till anfall" },
  { id: "anfallsspel", number: "03", label: "Anfallsspel" },
  { id: "overgang-forsvar", number: "04", label: "Övergång till försvar" },
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
      { id: "hogt", label: "Högt försvar", oneLiner: "Pressa högt — vinn boll på motståndarens planhalva." },
      { id: "medel", label: "Medelhögt försvar", oneLiner: "Kompakt mittblock — stäng mitten, tvinga ut spelet." },
      { id: "lagt", label: "Lågt försvar", oneLiner: "Skydda boxen — kompakt kedja, kontringshot framåt." },
    ],
  },
  {
    id: "overgang-anfall",
    number: "02",
    navLabel: "Övergång till anfall",
    title: "Övergång till anfallsspel",
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
      { id: "kontring", label: "Kontring", oneLiner: "Utnyttja motståndarens oordning — spela direkt mot mål." },
      { id: "speluppbyggnad", label: "Starta speluppbyggnad", oneLiner: "Säkra bollen, bygg lugnt om — vi kontrar inte alltid." },
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
      { id: "skydda-mot-kontring", label: "Skydda mot kontring", oneLiner: "Restförsvar bakom bollen — alltid." },
      { id: "spela-in", label: "Spela in bollen", oneLiner: "Locka in motståndaren först — vänd sen ut spelet." },
      { id: "spela-ut", label: "Spela ut bollen", oneLiner: "Bryt pressen via tredje man — sök fri spelare i halvyta." },
      { id: "ta-med-framat", label: "Ta med den framåt", oneLiner: "Driv eller passa upp till assistytan." },
      { id: "fyll-pa-box", label: "Fyll på i och runt box", oneLiner: "Minst fyra spelare i boxen när inlägget kommer." },
    ],
  },
  {
    id: "overgang-forsvar",
    number: "04",
    navLabel: "Övergång till försvar",
    title: "Övergång till försvarsspel",
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
      { id: "direkt", label: "Direkt motpress", oneLiner: "Närmaste man pressar bollen inom 1 sekund." },
      { id: "kontroll", label: "Tillbaka till kontroll", oneLiner: "Bromsa och retirera kompakt om återerövring inte sker." },
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
      { id: "duellspel", label: "Duellspel", oneLiner: "Vinn varje 50/50 — kropp först, boll sen." },
      { id: "andrabollsspel", label: "2:a bollsspel", oneLiner: "Var närmast när bollen släpps — läs studsen innan den händer." },
      { id: "djupledslopningar", label: "Djupledslöpningar", oneLiner: "Spring bakom backlinjen — du får bollen eller öppnar ytan." },
      { id: "vardigt-kroppssprak", label: "Värdigt kroppsspråk", oneLiner: "Peppa, inte gnälla — i medgång och motgång." },
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
      { id: "hornor", label: "Hörnor", oneLiner: "Offensiv: mönstret. Defensiv: zon eller markering enligt matchblad." },
      { id: "inlaggsfrisparkar", label: "Inläggsfrisparkar", oneLiner: "Position + löpväg klar innan domaren blåser." },
      { id: "inkast", label: "Inkast", oneLiner: "Snabba kombinationer — undvik förutsägbara kast." },
      { id: "avspark", label: "Avspark", oneLiner: "Vi äger andrabollen — direkt press när motståndaren startar." },
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
