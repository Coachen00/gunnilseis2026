/**
 * Identitetsord — fem beteenden vi visar i varje match.
 * Läses som en kedja på /identitet, ett beteende i taget.
 */

export interface IdentityStep {
  label: string;
  headline: string;
  support: string;
}

export interface IdentityItem {
  slug: "scanning" | "yta" | "prata-med-passningen" | "duellspel" | "andrabollsspel";
  title: string;
  /** Sammanfattande mening — nyckelfrasen (highlight) gulmarkeras. */
  definition: string;
  highlight: string;
  steps: [IdentityStep, IdentityStep, IdentityStep];
  /** Klimax-ropet som visas i KedjaClimax. */
  rop: string;
  /** Kort underrad i hero-navigationen. */
  navShort: string;
}

export const IDENTITY: IdentityItem[] = [
  {
    slug: "scanning",
    title: "Scanning",
    definition:
      "Vet vad som finns runt dig innan bollen kommer — då har du redan bestämt dig när den landar.",
    highlight: "innan bollen kommer",
    steps: [
      {
        label: "NÄR",
        headline: "Innan bollen kommer till dig.",
        support: "Varje gång bollen flyttas — ny bild. Och alltid innan du själv passar.",
      },
      {
        label: "VAD",
        headline: "Motståndare, yta, medspelare.",
        support: "Var kommer pressen ifrån? Var finns fri yta? Vem är spelbar — och var är målet?",
      },
      {
        label: "HUR",
        headline: "Korta blickar över axeln.",
        support: "En halv sekund räcker. Titta — bestäm — agera. Scanna igen om bilden hunnit ändras.",
      },
    ],
    rop: "TITTA INNAN",
    navShort: "TITTA INNAN",
  },
  {
    slug: "yta",
    title: "Yta",
    definition: "Fotboll handlar om yta. Den som förstår den, tar den och skyddar den styr matchen.",
    highlight: "förstår den, tar den och skyddar den",
    steps: [
      {
        label: "FÖRSTÅ DEN",
        headline: "Ytan finns mellan lagdelarna, bakom backlinjen och ute vid sidan.",
        support: "Den flyttar sig när bollen flyttar sig. Scanningen visar dig var den är.",
      },
      {
        label: "TA DEN",
        headline: "Löp in i rätt tempo — första touchen in i ytan.",
        support: "Inte tillbaka mot pressen. Ta ytan även utan boll — du öppnar för en lagkamrat.",
      },
      {
        label: "SKYDDA DEN",
        headline: "Kroppen mellan boll och motståndare.",
        support: "Arm ute, låg tyngdpunkt, kort steg. Behåll ytan tills laget har ett bättre alternativ.",
      },
    ],
    rop: "YTA",
    navShort: "FÖRSTÅ · TA · SKYDDA",
  },
  {
    slug: "prata-med-passningen",
    title: "Prata med passningen",
    definition:
      "Varje passning är ett meddelande — farten, foten och riktningen berättar vad din lagkamrat ska göra.",
    highlight: "ett meddelande",
    steps: [
      {
        label: "PASSEN SÄGER NÅGOT",
        headline: "Hård i fötterna = press bakom dig.",
        support: "Mjuk framför dig = vänd upp och driv. I löpriktningen = fortsätt framåt i fart.",
      },
      {
        label: "NÄR DU PASSAR",
        headline: "Bestäm vad du vill säga innan du slår.",
        support: "Rätt fot — bort från pressen. Rätt fart — spelbar för mottagaren, inte bekväm för dig.",
      },
      {
        label: "EFTER PASSEN",
        headline: "Rör dig direkt — visa en ny yta.",
        support: "Passen är inte klar förrän mottagaren lyckats med sin första touch.",
      },
    ],
    rop: "SÄG NÅGOT MED PASSEN",
    navShort: "SÄG NÅGOT MED PASSEN",
  },
  {
    slug: "duellspel",
    title: "Duellspel",
    definition: "Varje gång du och en motståndare vill ha samma boll — du tar den. I värsta fall får ingen den.",
    highlight: "du tar den",
    steps: [
      {
        label: "FÖRE DUELLEN",
        headline: "Scanna: boll, motståndare, yta.",
        support: "Kom rättvänd om det går. Bestäm dig: driva, skydda, tackla eller styra.",
      },
      {
        label: "I DUELLEN",
        headline: "Med boll: skydda med kropp och arm.",
        support: "Första touch bort från press. Utan boll: bromsa tidigt, sidställd och låg, styr mot svag sida — tajma tacklingen.",
      },
      {
        label: "EFTER DUELLEN",
        headline: "Var beredd på studs och retur.",
        support: "Duellen är inte över förrän laget har kontroll på bollen.",
      },
    ],
    rop: "VINN DUELLEN",
    navShort: "VINN DUELLEN",
  },
  {
    slug: "andrabollsspel",
    title: "Andrabollsspel",
    definition: "Bollen som studsar fritt och ingen äger — den tar vi. Alltid.",
    highlight: "den tar vi. Alltid.",
    steps: [
      {
        label: "LÄS",
        headline: "Läs duellen innan den händer.",
        support: "Ställ dig där bollen kommer studsa. Efter lång boll eller hörna — ingen står stilla.",
      },
      {
        label: "ATTACKERA",
        headline: "Närmaste spelare attackerar bollen.",
        support: "Näst närmaste tätar runtom. Först på bollen — kort steg, låg tyngdpunkt.",
      },
      {
        label: "ANVÄND VINSTEN",
        headline: "Vinsten är starten på vår omställning.",
        support: "Första passen framåt om det går. Har vi press — behåll och spela enkelt.",
      },
    ],
    rop: "ANDRABOLL",
    navShort: "BOLLEN HOS OSS",
  },
];

export const findIdentity = (slug: string) => IDENTITY.find((i) => i.slug === slug);
