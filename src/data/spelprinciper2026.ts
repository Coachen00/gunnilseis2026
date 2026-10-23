/**
 * Spelprinciperna 2026 — tre i försvar, tre i anfall och de fasta.
 *
 * Källa: "Gunnilse IS — Spelprinciper 2026" (PDF, sammanställd 22 okt 2026),
 * vars text i sin tur kommer ur `phaseCues`, `attackingPrinciples`,
 * `principles`, `majSpelmodell` och matchplanerna. Principerna valdes på hur
 * ofta orden förekommer i årets material, inte på hur ofta laget gjorde det på
 * planen. Texten är PDF:ens, kortad till några rader per princip — skriv inte
 * om den här utan att ändra PDF:en, annars läser spelaren två versioner.
 *
 * Filmerna är PDF:ens tolv scener, nedskalade till 1280 px utan ljud.
 */

import { PHASE_CUES } from "./phaseCues";

const MEDIA = "/media/spelprinciper-2026";

export const SPELPRINCIPER_PDF = `${MEDIA}/Gunnilse-IS-spelprinciper-2026.pdf`;

export type PrincipFilm = {
  src: string;
  poster: string;
  /** Vad filmen visar — bildtext och alt-text. */
  caption: string;
};

function film(id: string, caption: string): PrincipFilm {
  return { src: `${MEDIA}/${id}.mp4`, poster: `${MEDIA}/${id}.webp`, caption };
}

export type Spelprincip = {
  id: string;
  num: number;
  title: string;
  lead: string;
  steps: string[];
  calls: string[];
  films: PrincipFilm[];
  /** Sidan där skedet beskrivs i sin helhet. */
  route: string;
};

export const FORMATION = {
  title: "Formation 4-3-3 och de fyra skedena",
  lead: "Fyra backar. 6:an längst bak på mitten, 8:an och 10:an framför. Två yttrar och en 9:a. Vi kallar det ibland 4-2-1-3: fyra backar, två balans, en länk, tre hot.",
  film: film("01-formation", "4-3-3, fem korridorer, assistytan och gyllene zonen."),
  phases: [
    { label: "Vi försvarar", rule: "Kompakt 4-3-3. Skydda mitten. Styr dem utåt. Vänta på en trigger." },
    { label: "Vi vinner bollen", rule: "Första passen framåt. Yttrar och 9:an löper i djupled. 5 till 8 sekunder att slå till." },
    { label: "Vi anfaller", rule: "Säkra. Spela in. Spela ut. Ta med framåt. Fyll boxen. I den ordningen." },
    { label: "Vi tappar bollen", rule: "Jaga i fem sekunder. Lyckas det inte: sprinta hem, ned och in." },
  ],
} as const;

export const FORSVARSPRINCIPER: Spelprincip[] = [
  {
    id: "kompakt",
    num: 1,
    title: "Kompakt block: skydda mitten, styr dem utåt",
    lead: "Motståndaren ska aldrig få spela genom mitten. Vi står nära varandra, visar bollen ut mot kanten och vinner den där.",
    steps: [
      "Vi står kompakt i 4-3-3 med korta avstånd mellan leden. Mitten öppnar vi aldrig.",
      "9:an styr uppspelet åt en bestämd sida, helst deras vänsterback. Han pressar aldrig ensam.",
      "Hela laget följer bollens sida. Bortre ytter och ytterback kliver in i den inre korridoren.",
      "Går bollen ut på kanten tätar vi inåt och tvingar dem mot kortlinjen.",
      "Första försvararen bryter inte, han styr. Andra försvararen bryter.",
    ],
    calls: ["Mitten!", "Styr!", "Ihop!", "Sidan!"],
    films: [
      film(
        "02-forsvar-kompakt",
        "Bollen går ut till deras vänsterback. Hela laget flyttar med, bortre yttern kliver in, högeryttern styr och högerbacken bryter."
      ),
    ],
    route: PHASE_CUES.forsvar.route,
  },
  {
    id: "press",
    num: 2,
    title: "Press på trigger, och jaga i fem sekunder",
    lead: "Vi pressar aldrig på gissning. Vi går när bollen visar oss att det är läge, och vi går alltid två tillsammans. Tappar vi bollen själva jagar vi i fem sekunder, sedan sprintar vi hem.",
    steps: [
      "Fyra triggers: bakåtpass till backlinjen, dålig touch eller tung mottagning, långsam sidledspass, pass in mot en pressad spelare med ryggen mot spelet.",
      "Närmaste spelare pressar bollen inom en sekund. De två närmaste stänger passningsvägarna.",
      "Fem sekunder utan bollvinst: sprinta hem innanför bollen. Backlinjen backar och stänger djupet först.",
      "Efter bollvinst går första passen framåt om det finns en spelbar linje. Yttrar och 9:an startar i djupled.",
    ],
    calls: ["Press nu!", "Se triggern!", "Gå tillsammans!", "Jaga i fem!", "Hem!"],
    films: [
      film(
        "03-press-trigger",
        "Dålig touch: närmaste spelare bryter, nästa stänger insidan. Den gula ytan är där vi vill vinna bollen."
      ),
      film("04-tappa-fem-sekunder", "Fem sekunder utan bollvinst: alla sprintar hem innanför bollen, ned och in."),
    ],
    route: PHASE_CUES["omstallning-forsvar"].route,
  },
  {
    id: "andraboll",
    num: 3,
    title: "Andrabollen vinner vi som lag",
    lead: "Den första bollen är en duell. Den andra bollen är en lagsak. Den som är närmast attackerar, alla andra tätar runtom, så att vi är fler än de där bollen landar.",
    steps: [
      "Lång boll mot oss: en mittback går upp och tar duellen. De andra tittar på var bollen landar.",
      "Närmaste spelare attackerar landningsytan. De andra tätar runtom.",
      "Vunnen andraboll är en omställning: yttrar och 9:an startar i djupled, första passen går framåt.",
      "I anfall hänger 6:an 18 meter utanför boxen för andrabollen vid varje inlägg.",
    ],
    calls: ["Andraboll!", "Runtom!", "Framåt!"],
    films: [
      film(
        "05-andraboll",
        "Nicken går bort. Landningsytan ringas in. 10:an är först på bollen, 6:an, 8:an, högeryttern och högerbacken tätar runtom."
      ),
    ],
    route: PHASE_CUES.forsvar.route,
  },
];

export const ANFALLSPRINCIPER: Spelprincip[] = [
  {
    id: "sakra",
    num: 1,
    title: "Säkra först: skydda mot kontring",
    lead: "Vi anfaller med balans. Innan vi går framåt ska vi ha kontroll bakom bollen och vara redo att försvara direkt om vi tappar den.",
    steps: [
      "6:an står kvar i central yta bakom 8:an och 10:an. Han går inte upp samtidigt som de.",
      "Mittbackarna håller avstånd till varandra, så att ingen kan vända med bollen i halvytan.",
      "Ena ytterbacken går med framåt. Den andra stannar och täcker.",
      "Aldrig fler än två av oss i samma offensiva zon samtidigt.",
    ],
    calls: ["Cover!", "6:an stå!", "Balans!"],
    films: [
      film(
        "06-anfall-sakra",
        "Högerbacken går upp. 6:an står kvar, vänsterbacken stannar och täcker, mittbackarna håller avstånd."
      ),
    ],
    route: PHASE_CUES.anfall.route,
  },
  {
    id: "in-ut",
    num: 2,
    title: "Spela in, spela ut: rättvänd spelare mellan leden",
    lead: "Vi söker en rättvänd medspelare mellan deras led. Blir det trångt spelar vi ut och vänder spelet till den tysta sidan, och sedan direkt in igen i den nya ytan.",
    steps: [
      "8:an och 10:an ställer sig mellan deras led och flyttar i sidled tills passningslinjen öppnar.",
      "Mottagaren öppnar kroppen mot mål, aldrig ryggen mot. Hellre tredje man som kommer rättvänd.",
      "Trångt centralt? 6:an eller 8:an vänder spelet via mittback eller direkt till motsatt ytter.",
      "Direkt efter vändningen söker vi in igen, i den nya öppna ytan.",
    ],
    calls: ["In!", "Mellan!", "Hitta 10!", "Ut!", "Vänd!", "Tysta sidan!"],
    films: [
      film(
        "07-anfall-in-ut",
        "Spela in: 10:an står mellan leden i halvytan. Spela ut: 6:an vänder till motsatt ytter på tysta sidan."
      ),
    ],
    route: PHASE_CUES.anfall.route,
  },
  {
    id: "framat-box",
    num: 3,
    title: "Ta med framåt, in i assistytan, fyll boxen",
    lead: "När vi har yta driver eller passar vi framåt med fart. Vi vill in i assistytan, och när bollen slås in ska vi vara minst fyra i och runt boxen.",
    steps: [
      "Öppen yta i minst fem meter framför en rättvänd spelare: driv, tre till fyra steg, sedan ny touch.",
      "Inga sidledsväxlar när det finns en passning eller löpning framåt som funkar.",
      "9:an attackerar straffpunkten, motsatt ytter bortre stolpen, 8:an första stolpen.",
      "10:an stänger cutback-ytan. 6:an hänger 18 meter utanför för andraboll och skott.",
    ],
    calls: ["Driv!", "Ta meter!", "Box!", "Fyll!", "4 in!"],
    films: [
      film(
        "08-anfall-framat-box",
        "Fem ytor fyllda: första stolpen (8), straffpunkten (9), bortre stolpen (motsatt ytter), cutback (10) och 18 meter (6)."
      ),
    ],
    route: PHASE_CUES.anfall.route,
  },
];

export type FastSituation = {
  id: string;
  title: string;
  steps: string[];
  calls: string[];
  film: PrincipFilm;
};

export const FASTA_SITUATIONER: FastSituation[] = [
  {
    id: "var-horna",
    title: "Vår hörna",
    steps: [
      "Fyra löpare startar samtidigt mot var sin yta: första stolpen, straffpunkten, zonen, bortre stolpen.",
      "Leveransen går mot gyllene zonen. Attackera bollen, inte platsen.",
      "10:an på 18 meter för andrabollen. 6:an och ytterbackarna står kvar som kontringsskydd.",
    ],
    calls: ["Din plats!", "Sälj den!", "Attackera!", "Andraboll!"],
    film: film("09-var-horna", "Fyra löpare utanför gyllene zonen, en kort variant, 10:an på 18 meter."),
  },
  {
    id: "deras-horna",
    title: "Deras hörna",
    steps: [
      "Zon i boxen: fem täcker ytorna framför mål. Målvakten äger boxen.",
      "Två mittbackar låser de två största lufthoten man mot man.",
      "Två står högre för andrabollen och kontringen. Rensa framåt, aldrig rakt upp.",
    ],
    calls: ["Zon!", "Min!", "Först boll!", "Rensa!", "Kontra!"],
    film: film("10-deras-horna", "Fem i zon framför mål, två mittbackar låser lufthoten, två står högre."),
  },
  {
    id: "var-frispark",
    title: "Vår frispark",
    steps: [
      "Startlinje på 18. Vi står på vår linje, aldrig framför deras.",
      "Löp på tillslaget: inte före, inte efter. Fyra löpare mot var sin yta.",
      "Räddning eller block: 8:an är först på andrabollen. Kontringsskyddet står kvar.",
    ],
    calls: ["Linjen!", "På tillslaget!", "Möt!", "Andraboll!"],
    film: film("11-var-frispark", "Fyra löpare på startlinjen vid 18 meter. 10:an utanför, 6:an och ytterbackarna bakom."),
  },
  {
    id: "deras-frispark",
    title: "Deras frispark",
    steps: [
      "Linjen håller högt, vid 18 meter. Ingen av oss står bakom den.",
      "Släpp på tillslaget, tillsammans. Hela linjen kliver upp i samma sekund.",
      "Möt bollen med fart och nicka bort, framåt eller ut mot sidan.",
    ],
    calls: ["Linjen!", "Upp!", "Möt!", "Andraboll!"],
    film: film("12-deras-frispark", "Hela linjen kliver upp i samma sekund som bollen slås."),
  },
];

export const FASTA_ROUTE = "/fasta";

export type NarGorRad = { nar: string; gor: string; skede: string };

/** "När det här händer, gör vi det här" — PDF:ens sida 11. */
export const NAR_GOR: NarGorRad[] = [
  { nar: "Motståndaren spelar bakåt till backlinjen", gor: "9:an pressar, hela laget flyttar upp 5 meter", skede: "Försvar" },
  { nar: "Tung mottagning eller dålig första touch", gor: "Närmaste spelare bryter direkt, nästa stänger insidan", skede: "Försvar" },
  { nar: "Boll till deras yttre korridor", gor: "Vi tätar inåt och tvingar dem mot kortlinjen", skede: "Försvar" },
  { nar: "Boll i vår gyllene zon", gor: "Närmaste två markerar man mot man, övriga blockerar skottlinjer", skede: "Försvar" },
  { nar: "Bollvinst på egen halva", gor: "Sök rättvänd spelare: djupledspass eller spelvändning", skede: "Vinner bollen" },
  { nar: "Bollvinst på mitten", gor: "Full fart, yttrar och 9:an löper i djupled", skede: "Vinner bollen" },
  { nar: "Bollvinst högt upp", gor: "Direkt avslut eller cutback till gyllene zonen", skede: "Vinner bollen" },
  { nar: "Ingen spelbar framåt", gor: "Säkra bollen, börja om från anfallsprincip 1", skede: "Vinner bollen" },
  { nar: "Vi har bollen och ska gå framåt", gor: "Kolla balansen: 6:an står kvar, mittbackarna håller avstånd", skede: "Anfall" },
  { nar: "Medspelare står rättvänd i halvytan", gor: "Spela in på första, tredje man bryter linjen", skede: "Anfall" },
  { nar: "Inre korridoren full av motståndare", gor: "Spela ut till motsatt ytter, sedan direkt in på nya sidan", skede: "Anfall" },
  { nar: "Yta öppen 5 meter framför rättvänd spelare", gor: "Driv eller djupledspass. Sidledsväxel = noll", skede: "Anfall" },
  { nar: "Inlägg på väg", gor: "9 straffpunkten, motsatt ytter bortre, 8 första, 10 cutback, 6 hänger 18 meter", skede: "Anfall" },
  { nar: "Vi tappar bollen", gor: "Närmaste spelare pressar bollen inom 1 sekund, två stänger vägarna", skede: "Tappar bollen" },
  { nar: "Pressen misslyckas inom 5 sekunder", gor: "Hela laget ned och in, 4-3-3 står igen", skede: "Tappar bollen" },
  { nar: "Motståndaren har rättvänd spelare framåt", gor: "Backlinjen backar, stäng djupet först", skede: "Tappar bollen" },
  { nar: "Vi vinner andrabollen", gor: "Direkt omställning framåt", skede: "Alla" },
  { nar: "Vår hörna eller inläggsfrispark", gor: "Fyra löpare mot gyllene zonen, en på 18 meter, 6:an och ytterbackarna bakom", skede: "Fasta" },
  { nar: "Deras hörna", gor: "Zon i boxen, två man på största hoten, först boll, rensa framåt", skede: "Fasta" },
  { nar: "Deras frispark", gor: "Linjen högt, släpp på tillslaget tillsammans, ingen bakom linjen", skede: "Fasta" },
];

export const OAVSETT_MATCHBILD = "Titta innan. Ta ytan. Säg något med passen. Vinn duellen. Ta andrabollen.";
