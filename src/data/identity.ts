/**
 * Identitetsord — fem beteenden vi visar i varje match.
 * Varje punkt har en undersida på /identitet/<slug>.
 */

export interface IdentityItem {
  slug: "dueller" | "andrabollsspel" | "djupled" | "felvant" | "kommunicera";
  title: string;
  short: string;
  /** En enda mening som sammanfattar — ett barn ska förstå. */
  oneLiner: string;
  /** Konkreta situationer/handlingar — punktlista. */
  practice: string[];
  /** Vad som räknas som G (godkänt) respektive IG (inte godkänt). */
  gVillkor: string;
  igVillkor: string;
}

export const IDENTITY: IdentityItem[] = [
  {
    slug: "dueller",
    title: "Dueller",
    short: "Vi förlorar aldrig en kamp om bollen. I värsta fall blir det oavgjort.",
    oneLiner: "Varje gång du och en motståndare båda vill ha bollen — du tar den, eller åtminstone ser till att hen inte heller får den.",
    practice: [
      "Gå in med 100 % i varje närkamp — kropp först, boll sen.",
      "Vinn första duellen och var redo för andrabollen direkt.",
      "I värsta fall: oavgjort — bollen ut, eller fast spel — aldrig en lätt vinst för motståndaren.",
      "Stå rätt: kort steg, låg tyngdpunkt, sida mot motståndaren.",
    ],
    gVillkor: "Vinner ≥ 50 % av sina dueller, går aldrig undan.",
    igVillkor: "Backar undan, släpper kropp eller tappar boll utan kamp.",
  },
  {
    slug: "andrabollsspel",
    title: "Andrabollsspel",
    short: "Bollen som studsar fritt och ingen äger — den tar vi. Alltid.",
    oneLiner: "När en duell, ett huvudspel eller en räddning gör bollen ‘herrelös’ — var snabbast på den.",
    practice: [
      "Läs duellen innan den händer — ställ dig där bollen kommer studsa.",
      "Närmaste spelare attackerar, näst närmaste tätar runtom.",
      "Efter en lång boll eller hörnsituation: alla läser andrabollen — ingen står stilla.",
      "Vinst på andrabollen är start på vår omställning till anfall.",
    ],
    gVillkor: "Är först på minst hälften av andrabollarna i sitt område.",
    igVillkor: "Står stilla, tittar på, eller springer åt fel håll.",
  },
  {
    slug: "djupled",
    title: "Springa i djupled",
    short: "Vi springer mot motståndarens mål så ofta vi kan — det skapar utrymme för alla.",
    oneLiner: "En löpning bakom motståndarens backlinje är aldrig bortkastad — antingen får du bollen, eller så öppnar du en yta för en lagkamrat.",
    practice: [
      "Yttrar och 9:a löper i djupled vid varje bollvinst.",
      "8:a och 7:a löper genom inre korridor när rättvänd spelare har bollen.",
      "Timing: starta löpningen samtidigt som passaren tittar upp — inte efter.",
      "Också om du inte får bollen — du har dragit en försvarare med dig och öppnat assistytan.",
    ],
    gVillkor: "Minst en djupledslöpning per anfallssekvens.",
    igVillkor: "Stannar vid bollen och väntar — eller löper bara mot bollen.",
  },
  {
    slug: "felvant",
    title: "Springa felvänt",
    short: "När vi tappar bollen vänder vi direkt och jagar tillbaka — alla samtidigt.",
    oneLiner: "Bollen är borta — du har två val: ge upp, eller spurta tillbaka och hjälpa till. Vi väljer alltid det andra.",
    practice: [
      "Sekunden bollen tappas: vänd, sprinta, hitta din position igen.",
      "Närmaste spelare pressar boll, du återtar din zon i 4-3-3-formen.",
      "Forwarden är första försvarare — hen jagar bakåt om bollen går framåt.",
      "Den här löpningen är jobbigast i fotbollen — men avgör matcher.",
    ],
    gVillkor: "Sprintar tillbaka i full fart inom 1 sekund efter bollförlust.",
    igVillkor: "Går tillbaka, klagar på passningen, eller stannar i offensiv position.",
  },
  {
    slug: "kommunicera",
    title: "Kommunicera förstärkande",
    short: "Vi peppar varandra. Korta, tydliga rop som hjälper laget — aldrig kritik.",
    oneLiner: "Det du säger till en lagkamrat under matchen ska antingen ge information (‘bakom dig!’) eller höja energin (‘bra jobbat, kör vidare!’) — aldrig sänka.",
    practice: [
      "Korta rop: ‘ensam’, ‘bakom dig’, ‘tid’, ‘press’, ‘byt sida’.",
      "Pep efter misstag — ‘kom igen, nästa gång’ — aldrig himla med ögonen.",
      "Kapten sätter tonen, alla följer.",
      "Säg namnet på den du pratar med — det går snabbare och tydligare.",
    ],
    gVillkor: "Hörs på planen, peppar lagkamrater, ger riktig information.",
    igVillkor: "Tyst, kritisk eller frustrerad mot lagkamrater.",
  },
];

export const findIdentity = (slug: string) => IDENTITY.find((i) => i.slug === slug);