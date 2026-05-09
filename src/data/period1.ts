/* Period 1 (11/5–1/7 2026): "Diagonalt spel från korridor till korridor".
 *
 * 6 aktiva träningsveckor (11/5–18/6) + 22/6–1/7 uppföljnings-/repetitionsfönster.
 * 3 pass/vecka (mån/ons/tor) = 18 pass totalt.
 *
 * Källa: tränarens spec 2026-05-09. Inspirerat av principer från Bodø/Glimt
 * (4-3-3, deep full-backs, No6, 3v2 i uppbyggnad), Manchester City
 * (3-2-5-liknande former, halvytor, tredje man, restförsvar) och
 * GAIS (kontinuitet, kollektiv identitet).
 */

export type SessionDay = "Måndag" | "Onsdag" | "Torsdag";

export type GraphicType =
  | "diagonal-pattern"
  | "corridor-map"
  | "attract-fix-release"
  | "third-man"
  | "final-third"
  | "rest-defense"
  | "pitch";

export interface Session {
  day: SessionDay;
  date: string; // "DD/M"
  title: string;
  purpose: string;
  principle: string;
  activation: string;
  exercise1: string;
  exercise2: string;
  game: string;
  coachingCues: string[];
  positiveReinforcement: string[];
  commonErrors: string[];
  progression: string;
  matchConnection: string;
  kpi: string;
  graphic: GraphicType;
}

export interface Week {
  weekNumber: number;
  dateRange: string;
  theme: string;
  learningGoal: string;
  sessions: Session[];
  kpi: string;
  graphic: GraphicType;
}

export interface EffectLogicBlock {
  label: "Resurser" | "Aktiviteter" | "Mål" | "Effekt";
  items: string[];
}

export interface Period {
  id: "period-1";
  title: string;
  dateRange: string;
  objective: string;
  effectLogic: EffectLogicBlock[];
  weeks: Week[];
  followUp: { dateRange: string; title: string; bullets: string[]; selfRating: string[] };
  detailRoute: string;
}

const cuesShared = [
  "Öppna kroppen.",
  "Spela på bortre fot.",
  "Se innan du får.",
  "Locka först.",
  "Spela när pressen kommer.",
  "Kom ur skuggan.",
  "Ta inte emot felvänd i onödan.",
  "Sök tredje man.",
  "Håll bredd.",
  "Starta när OM blir rättvänd.",
  "Fyll boxen.",
  "Säkra under.",
  "Återerövra direkt.",
];

export const PERIOD_1: Period = {
  id: "period-1",
  title: "Period 1 – Diagonalt spel från korridor till korridor",
  dateRange: "11/5–1/7",
  objective:
    "Vi bygger ett anfallsspel där bollen flyttas diagonalt från målvakt, via ytterback och mittfält, till offensiv spelare och vidare ut mot ytter. Målet är att locka press, hitta rättvänd spelare, byta korridor och attackera yttre korridor, assistyta och box med fart.",
  effectLogic: [
    {
      label: "Resurser",
      items: [
        "Målvakt med passningsfot.",
        "Ytterback med öppen kropp.",
        "Mittfältare som kan hitta vinkel.",
        "Offensiv mittfältare som kan ta emot rättvänd.",
        "Ytter som håller bredd och hotar bakom.",
        "Sexa/mittbackar som säkrar restförsvar.",
      ],
    },
    {
      label: "Aktiviteter",
      items: [
        "Diagonala passningsmönster.",
        "Scanning före mottagning.",
        "Kroppsvinkel.",
        "Tredje man-löpningar.",
        "Attrahera press.",
        "Spelvändning.",
        "Attackera assistyta.",
        "Boxfyllnad.",
        "Återerövring efter tapp.",
      ],
    },
    {
      label: "Mål",
      items: [
        "Fler rättvända mottagningar.",
        "Fler lyckade diagonalpass bakom presslinje.",
        "Fler korridorbyten.",
        "Fler isoleringar i yttre korridor.",
        "Fler attacker in i assistyta.",
        "Bättre restförsvar vid progressivt spel.",
      ],
    },
    {
      label: "Effekt",
      items: [
        "Motståndaren flyttas.",
        "Pressen bryts.",
        "Vi skapar tid och yta.",
        "Vi attackerar innan motståndaren hinner organisera sig.",
        "Vi blir mer direkta utan att bli slarviga.",
        "Vi får en tydligare gemensam spelmodell.",
      ],
    },
  ],
  detailRoute: "/period/1",
  weeks: [
    {
      weekNumber: 1,
      dateRange: "11/5, 13/5, 14/5",
      theme: "Grundvinklar",
      learningGoal:
        "Spelarna ska förstå diagonalt spel, fem korridorer, öppen kropp och första passningsmönstret MV → YB → MF.",
      kpi: "Minst 10 lyckade diagonala passningar in bakom första presslinjen per spelmoment.",
      graphic: "corridor-map",
      sessions: [
        {
          day: "Måndag",
          date: "11/5",
          title: "Vecka 1 – Måndag – Grundvinklar",
          purpose: "Etablera scanning, kroppsvinkel och första diagonala mönstret.",
          principle: "Spela ut bollen.",
          activation: "Scanning + kroppsvinkel i par/trianglar.",
          exercise1: "Oemotsagt mönster MV → YB → MF.",
          exercise2: "5v3 uppbyggnad från sidokorridor till central korridor.",
          game: "7v7 + målvakter där mål endast räknas efter diagonal passning från yttre korridor in centralt.",
          coachingCues: ["Öppna kroppen.", "Se innan du får.", "Spela på bortre fot."],
          positiveReinforcement: ["Bra scanning före mottagning.", "Bra kroppsvinkel."],
          commonErrors: ["Mottagare står i passningsskugga.", "Ytterback tar emot stängd mot linjen."],
          progression: "Lägg till passiv markering, sedan halvaktiv press på MF-mottagningen.",
          matchConnection: "Detta är hur vi öppnar mot lågt försvarande lag som väntar i två linjer.",
          kpi: "10+ lyckade diagonalpass bakom första presslinjen.",
          graphic: "corridor-map",
        },
        {
          day: "Onsdag",
          date: "13/5",
          title: "Vecka 1 – Onsdag – Vinkel under press",
          purpose: "Hitta öppen kropp under press, hitta central spelare när YB lockar.",
          principle: "Spela ut bollen.",
          activation: "Rondo 4v2 med krav på öppen kropp.",
          exercise1: "YB → MF på bortre fot, MF vänder upp.",
          exercise2: "6v4: locka press på ytterback och hitta central spelare.",
          game: "8v8 med fem korridorer. Poäng för mottagning rättvänd i central/inre korridor.",
          coachingCues: ["Öppna kroppen.", "Locka först.", "Kom ur skuggan."],
          positiveReinforcement: ["Rätt att vänta in pressen.", "Bra kroppsvinkel."],
          commonErrors: ["Passningen går för löst.", "MF tar emot felvänd utan stöd."],
          progression: "Höj passningsfart, lägg till motpress på vändningen.",
          matchConnection: "Mot mediumhögt pressande lag — vi behöver hitta central rättvänd.",
          kpi: "Andel rättvända mottagningar i inre/central korridor.",
          graphic: "diagonal-pattern",
        },
        {
          day: "Torsdag",
          date: "14/5",
          title: "Vecka 1 – Torsdag – Mönstret matchlikt",
          purpose: "Sätta hela mönstret med scanning och passningsfot under matchpress.",
          principle: "Spela ut bollen.",
          activation: "Passningsdiamant med scanning före mottagning.",
          exercise1: "MV → YB → 6/8 → tillbaka ut.",
          exercise2: "7v5 uppbyggnad med pressande front.",
          game: "9v9 matchlikt, tränarstopp på kroppsvinkel och passningsfot.",
          coachingCues: ["Se innan du får.", "Spela på bortre fot.", "Öppna kroppen."],
          positiveReinforcement: ["Perfekt vinkel.", "Bra scanning."],
          commonErrors: ["Felvänd mottagning utan stöd.", "Passning på fel fot."],
          progression: "Lägg till en inhoppare i pressande front för att höja tempot.",
          matchConnection: "Hur vi spelar oss ut i de första 15 sekunderna efter målvaktsbesittning.",
          kpi: "Minst 10 diagonaler in bakom första presslinjen.",
          graphic: "diagonal-pattern",
        },
      ],
    },
    {
      weekNumber: 2,
      dateRange: "18/5, 20/5, 21/5",
      theme: "Attrahera press",
      learningGoal: "Vi spelar inte diagonalt direkt varje gång. Vi lockar press först.",
      kpi: "Minst 6 situationer per spel där laget först lockar press och sedan spelar ur den.",
      graphic: "attract-fix-release",
      sessions: [
        {
          day: "Måndag",
          date: "18/5",
          title: "Vecka 2 – Måndag – Locka pressen",
          purpose: "Förstå när vi spelar in till 6/8 efter att YB lockat.",
          principle: "Spela ut bollen.",
          activation: "Rondo med press-trigger.",
          exercise1: "YB lockar press, spelar in till 6/8.",
          exercise2: "6v5 från målvakt: spela ut, locka, spela in.",
          game: "8v8 där laget måste använda minst en sidokorridor innan central progression.",
          coachingCues: ["Locka först.", "Spela när pressen kommer.", "Spela på bortre fot."],
          positiveReinforcement: ["Rätt att vänta in pressen.", "Bra timing på inspel."],
          commonErrors: ["Spelar diagonalen för tidigt.", "Tappar tålamod under press."],
          progression: "Två pressare på YB istället för en.",
          matchConnection: "Mot lag som hoppar på YB direkt — vi använder dem.",
          kpi: "Antal sekvenser där vi lockar och spelar ur.",
          graphic: "attract-fix-release",
        },
        {
          day: "Onsdag",
          date: "20/5",
          title: "Vecka 2 – Onsdag – Bryt riktning under press",
          purpose: "Använd första touch bort från press, byt riktning till 6.",
          principle: "Spela ut bollen.",
          activation: "Kroppsvinkel + första touch bort från press.",
          exercise1: "MV → MB → YB → 6.",
          exercise2: "7v6: motståndare styr utåt, anfallande lag spelar ur.",
          game: "9v9 med bonus för att bryta press genom diagonal passning.",
          coachingCues: ["Kom ur skuggan.", "Locka först.", "Öppna kroppen."],
          positiveReinforcement: ["Bra första touch bort från press.", "Bra att du orkade vänta."],
          commonErrors: ["Första touch in i press.", "Spelar tillbaka istället för diagonal."],
          progression: "Markering på 6 — kräver tredje man.",
          matchConnection: "Hur vi bryter när motståndaren stänger ena sidan.",
          kpi: "Bryts presslinjen via diagonal?",
          graphic: "attract-fix-release",
        },
        {
          day: "Torsdag",
          date: "21/5",
          title: "Vecka 2 – Torsdag – Hitta 8 i halvyta",
          purpose: "Locka, fixera, frigöra 8 i halvyta.",
          principle: "Spela ut bollen.",
          activation: "Passning + riktningsförändring.",
          exercise1: "YB till 8 i halvyta.",
          exercise2: "8v6: attrahera på ena sidan, hitta fri 6/8.",
          game: "10v10 med krav: bollen ska flyttas från korridor 5 till 3 eller 1 innan avslut.",
          coachingCues: ["Locka först.", "Sök tredje man.", "Spela på bortre fot."],
          positiveReinforcement: ["Bra timing att frigöra.", "Bra kroppsvinkel hos 8."],
          commonErrors: ["Spelar utan att fixera först.", "Halvyta lämnas tom."],
          progression: "Snabbare press-trigger från motståndaren.",
          matchConnection: "Mot lag som markerar 6 — vi går via halvyta.",
          kpi: "Antal mottagningar fri 8 i halvyta.",
          graphic: "attract-fix-release",
        },
      ],
    },
    {
      weekNumber: 3,
      dateRange: "25/5, 27/5, 28/5",
      theme: "Tredje man",
      learningGoal:
        "Tredje man används när direkt passning är stängd. Vi vill inte ta emot felvänd i onödan.",
      kpi: "Minst 5 tredje man-aktioner som leder till rättvänd spelare eller spelvändning.",
      graphic: "third-man",
      sessions: [
        {
          day: "Måndag",
          date: "25/5",
          title: "Vecka 3 – Måndag – Tredje man i trianglar",
          purpose: "Lära mönstret A→B→C där C kommer rättvänd.",
          principle: "Spela ut bollen.",
          activation: "Tredje man i trianglar.",
          exercise1: "A → B → C där C kommer rättvänd.",
          exercise2: "6v4 med tredje man genom mittfält.",
          game: "7v7 + 3 jokrar. Mål räknas dubbelt efter tredje man-kombination.",
          coachingCues: ["Sök tredje man.", "Ta inte emot felvänd i onödan.", "Spela på bortre fot."],
          positiveReinforcement: ["Bra timing på släppen.", "Bra C-löpning."],
          commonErrors: ["B vänder upp istället för att släppa.", "C kommer för sent."],
          progression: "Markering på B — kräver ett tillslag.",
          matchConnection: "Hur vi går genom kompakt mittfält.",
          kpi: "Antal lyckade tredje man-kombinationer.",
          graphic: "third-man",
        },
        {
          day: "Onsdag",
          date: "27/5",
          title: "Vecka 3 – Onsdag – OM i ficka",
          purpose: "OM tar emot rättvänd i ficka via tredje man.",
          principle: "Ta med den framåt.",
          activation: "Ett tillslag + vinkelbyte.",
          exercise1: "YB → MF → OM i ficka.",
          exercise2:
            "8v6: OM får bara ta emot om han är halvrättvänd eller kan spela på ett tillslag.",
          game: "9v9 med poäng för rättvänd mottagning i mellanrum.",
          coachingCues: ["Sök tredje man.", "Kom ur skuggan.", "Öppna kroppen."],
          positiveReinforcement: ["Bra OM-timing.", "Bra ett-tillslag."],
          commonErrors: ["OM tar emot felvänd utan stöd.", "MF spelar för sent."],
          progression: "OM markeras hårt — kräver YB/8 som tredje man.",
          matchConnection: "Hur vi bryter ut genom 10:an mot vår fyrabacks.",
          kpi: "Rättvända mottagningar i mellanrum.",
          graphic: "third-man",
        },
        {
          day: "Torsdag",
          date: "28/5",
          title: "Vecka 3 – Torsdag – Tredje man bakom mittfältet",
          purpose: "Hitta tredje man bakom pressande mittfält.",
          principle: "Ta med den framåt.",
          activation: "Scanning innan passning.",
          exercise1: "MV → YB → 6 → OM.",
          exercise2: "8v7: hitta tredje man bakom pressande mittfält.",
          game:
            "10v10 där varje anfall ska försöka hitta en rättvänd spelare centralt innan kantattack.",
          coachingCues: ["Se innan du får.", "Sök tredje man.", "Locka först."],
          positiveReinforcement: ["Bra att du sökte rättvänd först.", "Bra tålamod."],
          commonErrors: ["Spelar kant innan rättvänd central söks.", "C-spelare läser inte spelet."],
          progression: "Tidsbegränsa: 8 sek till central rättvänd eller börja om.",
          matchConnection: "Hur vi prioriterar centrum över kant när vi har tid.",
          kpi: "Tredje man-aktioner som ger rättvänd eller vändning.",
          graphic: "third-man",
        },
      ],
    },
    {
      weekNumber: 4,
      dateRange: "1/6, 3/6, 4/6",
      theme: "Spelvändning",
      learningGoal: "Flytta bollen från en korridor till en annan med kontroll och timing.",
      kpi: "Minst 4 spelvändningar som leder till 1v1, 2v1 eller 2v2 på kanten.",
      graphic: "corridor-map",
      sessions: [
        {
          day: "Måndag",
          date: "1/6",
          title: "Vecka 4 – Måndag – Korridorbyte",
          purpose: "Flytta press, vänd till motsatt sida.",
          principle: "Ta med den framåt.",
          activation: "Fem korridorer, passning mellan zoner.",
          exercise1: "MV → YB → 6 → motsatt MB/YB.",
          exercise2: "8v6: attrahera höger, vänd vänster.",
          game: "8v8 där mål räknas dubbelt efter korridorbyte.",
          coachingCues: ["Locka först.", "Håll bredd.", "Spela på bortre fot."],
          positiveReinforcement: ["Bra korridorbyte.", "Bra att du höll bredd."],
          commonErrors: ["Vänder för tidigt.", "Motsatt YB inte tillgänglig."],
          progression: "Snabbare omställning från motståndaren.",
          matchConnection: "Mot lag som komprimerar — vi vänder.",
          kpi: "Antal korridorbyten under spel.",
          graphic: "corridor-map",
        },
        {
          day: "Onsdag",
          date: "3/6",
          title: "Vecka 4 – Onsdag – Vänd genom OM",
          purpose: "OM som vändningspunkt till motsatt ytter.",
          principle: "Ta med den framåt.",
          activation: "Diagonal lång + kort understöd.",
          exercise1: "OM hittar motsatt ytter.",
          exercise2: "9v7: spela från ena yttre korridoren till motsatt yttre korridor.",
          game: "10v10 med zonpoäng: start i korridor 5, avslut i korridor 1.",
          coachingCues: ["Se innan du får.", "Spela på bortre fot.", "Håll bredd."],
          positiveReinforcement: ["Perfekt vändning.", "Bra OM-vinkel."],
          commonErrors: ["OM lyfter blicken för sent.", "Ytter för smal."],
          progression: "OM markeras — kräver tredje man + vändning.",
          matchConnection: "Hur vi byter korridor när inre vägar är stängda.",
          kpi: "Antal vändningar via OM.",
          graphic: "corridor-map",
        },
        {
          day: "Torsdag",
          date: "4/6",
          title: "Vecka 4 – Torsdag – Kantskillnad efter vändning",
          purpose: "Skapa 2v1/2v2 på utsidan efter vändningen.",
          principle: "Ta med den framåt.",
          activation: "Touch framåt efter spelvändning.",
          exercise1: "Motsatt ytter tar emot brett och attackerar 1v1.",
          exercise2: "8v8 + kantzoner: skapa 2v1/2v2 på utsidan.",
          game: "10v10 matchlikt med fokus på timing i spelvändning.",
          coachingCues: ["Håll bredd.", "Starta när OM blir rättvänd.", "Spela på bortre fot."],
          positiveReinforcement: ["Bra timing från YB underlöpning.", "Bra duell på kanten."],
          commonErrors: ["Ytter startar för tidigt.", "YB underlöper för sent."],
          progression: "Lägg till mer central trafik som tvingar fler vändningar.",
          matchConnection: "Hur vi får ytterspelaren i 1v1 mot trött back.",
          kpi: "Antal kantisoleringar.",
          graphic: "final-third",
        },
      ],
    },
    {
      weekNumber: 5,
      dateRange: "8/6, 10/6, 11/6",
      theme: "Sista tredjedelen",
      learningGoal: "Vad händer efter att vi frigjort yttern? Assistyta + boxfyllnad.",
      kpi: "Minst 6 attacker in i assistyta efter diagonal progression.",
      graphic: "final-third",
      sessions: [
        {
          day: "Måndag",
          date: "8/6",
          title: "Vecka 5 – Måndag – Isolera ytter",
          purpose: "Få YF i 1v1 in i assistyta.",
          principle: "Fyll på i/runt box.",
          activation: "Inspel och löpning mot ytor.",
          exercise1: "YF isolerad 1v1 → in i assistyta.",
          exercise2: "OM + YF + YB/8 kombinerar på kanten.",
          game: "7v7 + kantzoner, mål efter cutback räknas dubbelt.",
          coachingCues: ["Håll bredd.", "Fyll boxen.", "Starta när OM blir rättvänd."],
          positiveReinforcement: ["Bra att du höll bredd.", "Bra cutback-vinkel."],
          commonErrors: ["YF går inåt för tidigt.", "Ingen fyller boxen."],
          progression: "Lägg till en extra back i markering.",
          matchConnection: "Hur vi får mål via cutback från höger ytter.",
          kpi: "Antal attacker i assistyta.",
          graphic: "final-third",
        },
        {
          day: "Onsdag",
          date: "10/6",
          title: "Vecka 5 – Onsdag – Boxfyllnad",
          purpose: "Tre+ spelare i box vid inspel.",
          principle: "Fyll på i/runt box.",
          activation: "Boxfyllnad utan boll.",
          exercise1: "Ytter → assistyta → inspel.",
          exercise2: "8v6 sista tredjedelen: 9, bortre ytter och 8 fyller box.",
          game: "9v9 sista 2/3-plan med krav på minst tre spelare i box vid inspel.",
          coachingCues: ["Fyll boxen.", "Starta när OM blir rättvänd.", "Säkra under."],
          positiveReinforcement: ["Bra timing in i box.", "Bra bortre stolpe-löpning."],
          commonErrors: ["Bortre ytter fyller inte box.", "9 startar för tidigt."],
          progression: "Begränsa inspelstid — kräver snabbare boxfyllnad.",
          matchConnection: "Vår standardstruktur för centerpasningar.",
          kpi: "Snitt antal spelare i box vid inspel.",
          graphic: "final-third",
        },
        {
          day: "Torsdag",
          date: "11/6",
          title: "Vecka 5 – Torsdag – Snabbt avslut",
          purpose: "Avsluta inom få sekunder efter korridorbyte.",
          principle: "Fyll på i/runt box.",
          activation: "Snabbt avslut efter korridorbyte.",
          exercise1: "OM → YF → cutback.",
          exercise2: "10v8: från uppbyggnad till final-third-inspel.",
          game:
            "10v10 matchlikt: mål efter diagonal spelvändning + assistyta ger extra poäng.",
          coachingCues: ["Starta när OM blir rättvänd.", "Fyll boxen.", "Säkra under."],
          positiveReinforcement: ["Bra avslut första touch.", "Bra bortre löpning."],
          commonErrors: ["För många touchar.", "Boxen tom när cutback slås."],
          progression: "Begränsa antal touchar i sista zonen.",
          matchConnection: "Hur vi straffar lågt försvar efter snabb vändning.",
          kpi: "Mål efter diagonal vändning + assistyta.",
          graphic: "final-third",
        },
      ],
    },
    {
      weekNumber: 6,
      dateRange: "15/6, 17/6, 18/6",
      theme: "Helhet + restförsvar",
      learningGoal:
        "Spela hela mönstret matchlikt. Förstå säkerheten bakom bollen och återerövring.",
      kpi: "Återerövra inom 6 sekunder efter bolltapp eller stoppa kontring genom restförsvar.",
      graphic: "rest-defense",
      sessions: [
        {
          day: "Måndag",
          date: "15/6",
          title: "Vecka 6 – Måndag – Restförsvar i position",
          purpose: "Restförsvar är på plats innan diagonalen spelas.",
          principle: "Skydda mot kontring.",
          activation: "Direkt återerövring 5 sekunder.",
          exercise1: "MV → YB → MF → OM → YF utan motstånd, med restförsvar positionerat.",
          exercise2: "8v8 + 3 restförsvarsspelare: bolltapp ger direkt omställning.",
          game: "10v10 där tränaren stoppar och markerar restförsvarets placering.",
          coachingCues: ["Säkra under.", "Återerövra direkt.", "Håll bredd."],
          positiveReinforcement: ["Bra position som 6:a.", "Bra läsning av djup."],
          commonErrors: ["6:an lämnar restförsvaret för tidigt.", "Bortre MB skyddar inte djup."],
          progression: "Kontringsstart från sex motståndare.",
          matchConnection: "Hur vi inte blir kontrade mot snabba ettor.",
          kpi: "Antal stoppade kontringar.",
          graphic: "rest-defense",
        },
        {
          day: "Onsdag",
          date: "17/6",
          title: "Vecka 6 – Onsdag – Counterpress",
          purpose: "Närmaste spelare counterpressar inom 6 sek.",
          principle: "Skydda mot kontring.",
          activation: "Duel + andraboll efter tapp.",
          exercise1: "Diagonal progression med försvarande omställningshot.",
          exercise2: "9v9: om anfallande lag tappar boll får försvarande lag kontra på småmål.",
          game: "11v11-liknande matchform där restförsvar och återerövring mäts.",
          coachingCues: ["Återerövra direkt.", "Säkra under.", "Sök tredje man."],
          positiveReinforcement: ["Bra första press.", "Bra omedelbar reaktion."],
          commonErrors: ["Försenad press.", "Steg bakåt istället för framåt vid tapp."],
          progression: "Förkorta tidsbudget: 4 sek till återerövring.",
          matchConnection: "Hur vi vinner andra bollar i offensiv tredjedel.",
          kpi: "Återerövringar inom 6 sek.",
          graphic: "rest-defense",
        },
        {
          day: "Torsdag",
          date: "18/6",
          title: "Vecka 6 – Torsdag – Helhet och matchplan",
          purpose: "Spela hela mönstret matchlikt mot olika presstyper.",
          principle: "Skydda mot kontring.",
          activation: "Låg volym, hög kvalitet, scanning och passningsfart.",
          exercise1: "Repetition av huvudmönstret.",
          exercise2: "Matchplan: hur vi använder diagonalen mot olika press.",
          game: "Matchlik helhet. Alla principer aktiva.",
          coachingCues: cuesShared.slice(0, 6),
          positiveReinforcement: ["Bra helhet.", "Bra kommunikation under press."],
          commonErrors: ["Kvalitet faller när tempot höjs.", "Bredd försvinner vid trötthet."],
          progression: "Variera motståndarens presstyp under spelet.",
          matchConnection: "Den fulla planen vi tar in i match.",
          kpi: "Helhet: alla KPI:er från vecka 1-5 aktiva.",
          graphic: "diagonal-pattern",
        },
      ],
    },
  ],
  followUp: {
    dateRange: "22/6–1/7",
    title: "Repetition, video och uppföljning",
    bullets: [
      "Videoklipp: 3 bra diagonaler.",
      "Videoklipp: 3 situationer där vi missar kroppsvinkel/timing.",
      "Lagets bästa korridorbyte.",
      "Lagets bästa återerövring efter tapp.",
      "Nästa periods fokus.",
    ],
    selfRating: [
      "Jag förstår när vi ska spela diagonalt.",
      "Jag vet hur jag ska stå med kroppen.",
      "Jag vet när jag ska hålla bredd.",
      "Jag vet hur vi fyller boxen.",
      "Jag vet min roll i restförsvaret.",
    ],
  },
};

export const PERIOD_1_TIMELINE = [
  { week: 1, label: "Grundvinklar" },
  { week: 2, label: "Attrahera press" },
  { week: 3, label: "Tredje man" },
  { week: 4, label: "Spelvändning" },
  { week: 5, label: "Sista tredjedelen" },
  { week: 6, label: "Helhet + restförsvar" },
] as const;

export const PERIOD_1_COACH_LANGUAGE = [
  "Öppna kroppen.",
  "Se bortre korridor.",
  "Locka först.",
  "Spela genom.",
  "Växla nu.",
  "Håll bredd.",
  "Säkra under.",
  "Återerövra direkt.",
] as const;

export function totalSessions(period: Period): number {
  return period.weeks.reduce((sum, w) => sum + w.sessions.length, 0);
}

export interface Principle {
  slug: string;
  title: string;
  childFriendly: string; // En mening en spelare förstår direkt.
  detail: string; // Tränarnivå.
  graphic: GraphicType;
}

export const PERIOD_1_PRINCIPLES: Principle[] = [
  {
    slug: "diagonalt-spel",
    title: "Diagonalt spel",
    childFriendly: "Vi flyttar bollen snett över planen för att hitta en fri spelare.",
    detail:
      "Bollen flyttas i diagonal från MV via YB och MF till OM och vidare ut mot YF. Diagonalen bryter försvarets linjer eftersom passningen kommer från en oväntad vinkel.",
    graphic: "diagonal-pattern",
  },
  {
    slug: "korridorer",
    title: "Fem korridorer",
    childFriendly: "Vi delar upp planen i fem banor — det gör det lättare att hitta varandra.",
    detail:
      "Yttre vänster, inre vänster, central, inre höger, yttre höger. Vi söker spelbarhet i inre korridorer och växlar till yttre när motståndaren komprimerar.",
    graphic: "corridor-map",
  },
  {
    slug: "attrahera-press",
    title: "Attrahera press",
    childFriendly: "Vi lockar motståndaren till en sida — sedan spelar vi någon annanstans.",
    detail:
      "YB lockar press, fixerar pressaren, frigör 6/8 i halvyta, exploaterar den lediga ytan. Vi spelar inte diagonalen direkt — vi använder den när pressen är på väg.",
    graphic: "attract-fix-release",
  },
  {
    slug: "rattvand",
    title: "Rättvänd spelare",
    childFriendly: "Vi vill stå med bollen och se planen framåt — inte med ryggen mot mål.",
    detail:
      "Vi tar inte emot felvänd i onödan. Hellre tredje man som kommer rättvänd än att vända under press. Kroppsvinkel + scanning före mottagning.",
    graphic: "third-man",
  },
  {
    slug: "tredje-man",
    title: "Tredje man",
    childFriendly: "Du spelar till en kompis — som släpper bollen vidare till en tredje.",
    detail:
      "A → B → C där C kommer rättvänd. B spelar på ett tillslag. C läser spelet och startar i rätt ögonblick. Används när direkt passning är stängd.",
    graphic: "third-man",
  },
  {
    slug: "spelvandning",
    title: "Spelvändning",
    childFriendly: "När motståndaren stängt ena sidan — flytta bollen till andra sidan snabbt.",
    detail:
      "Vi flyttar bollen från korridor 5 till 1 (eller tvärtom) med kontroll och timing. OM blir vändningspunkt. Mål: 1v1/2v1/2v2 på motsatt kant.",
    graphic: "corridor-map",
  },
  {
    slug: "assistyta",
    title: "Assistyta",
    childFriendly: "Området precis utanför straffområdet — där vi vill slå inspel ifrån.",
    detail:
      "YF isolerad i 1v1 in i assistyta + cutback till 9, bortre YF och 8 som fyller box. Inspel ska kombineras med boxfyllnad — annars är arbetet bortkastat.",
    graphic: "final-third",
  },
  {
    slug: "boxfyllnad",
    title: "Boxfyllnad",
    childFriendly: "När någon ska slå in bollen — minst tre av oss ska vara framme i boxen.",
    detail:
      "Vid inspel: 9 främre stolpe, bortre YF bortre stolpe, 8 cutback-zonen. Timing matters — för tidigt = offside-risk, för sent = ingen i boxen.",
    graphic: "final-third",
  },
  {
    slug: "restforsvar",
    title: "Restförsvar",
    childFriendly: "När vi anfaller måste några stå kvar bakåt — så vi inte blir kontrade.",
    detail:
      "6:a under bollen, två/tre spelare bakom. Bortre MB skyddar djup. Restförsvaret är på plats INNAN diagonalen spelas, inte efter.",
    graphic: "rest-defense",
  },
  {
    slug: "atererövring",
    title: "Återerövring",
    childFriendly: "Tappar vi bollen — vinn tillbaka den direkt eller stoppa kontringen.",
    detail:
      "Counterpress inom 6 sekunder från närmaste spelare. Misslyckas det → restförsvaret bromsar kontringen tills vi är organiserade.",
    graphic: "rest-defense",
  },
];

export interface Reference {
  team: string;
  tag: string;
  bullets: string[];
}

export const PERIOD_1_REFERENCES: Reference[] = [
  {
    team: "Bodø/Glimt",
    tag: "Tålamod + 3v2",
    bullets: [
      "4-3-3 med deep full-backs.",
      "No6 (Patrick Berg-roll) som dirigerar tempo.",
      "3v2 i uppbyggnad lockar press.",
      "Tålmodig korridorbyte tills rättvänd hittas.",
    ],
  },
  {
    team: "Manchester City",
    tag: "Halvytor + tredje man",
    bullets: [
      "3-2-5-liknande in-possession-form.",
      "Tre spelare bakom bollen som restförsvar.",
      "Breda yttrar håller motståndaren utdragen.",
      "Halvytor bemannas av 8:or och OM.",
    ],
  },
  {
    team: "GAIS",
    tag: "Identitet + kontinuitet",
    bullets: [
      "Tydlig spelidé som hela laget kan.",
      "Strukturerad uppbyggnad utan slarv.",
      "Kollektiv identitet före individuella val.",
      "Konsekvent över tid — inte ett quick fix.",
    ],
  },
];

export function aggregateCues(period: Period): string[] {
  const all = new Set<string>();
  for (const week of period.weeks) {
    for (const session of week.sessions) {
      for (const cue of session.coachingCues) all.add(cue);
    }
  }
  return Array.from(all).sort((a, b) => a.localeCompare(b, "sv"));
}

export function aggregateCommonErrors(period: Period): string[] {
  const all = new Set<string>();
  for (const week of period.weeks) {
    for (const session of week.sessions) {
      for (const e of session.commonErrors) all.add(e);
    }
  }
  return Array.from(all).sort((a, b) => a.localeCompare(b, "sv"));
}

export function aggregateKpis(period: Period): { week: number; kpi: string }[] {
  return period.weeks.map((w) => ({ week: w.weekNumber, kpi: w.kpi }));
}
