/**
 * Kanonisk principdata — single source of truth.
 * Kategoriserad enligt PDF: "Fotbollsprinciper per spelskede – Sammanställning".
 * All principformulering härleds direkt från citerade källtexter
 * (Smålands FF, Södermanlands FF, Medelpad FF — SvenskFotboll).
 *
 * Importera överallt där principer visas så att språket är 100% koherent.
 */

export type Phase =
  | "uppbyggnad"
  | "progression"
  | "avslut"
  | "forsvar"
  | "omstallning-forsvar"
  | "omstallning-anfall"
  | "malvakt"
  | "fasta";

export interface Principle {
  /** Kort, vass principformulering (det vi säger till spelarna) */
  headline: string;
  /** Förklarande mening — hur vi gör det */
  detail: string;
  /** Subprinciper — namngivna byggstenar */
  sub: string[];
  /** Källcitat ordagrant ur dokumentet */
  source: string;
}

export interface PhaseSpec {
  id: Phase;
  /** Visningsnamn på sidan */
  label: string;
  /** En enda mening som sammanfattar skedet */
  oneLiner: string;
  /** 1–N principer i prioriterad ordning */
  principles: Principle[];
}

/* ─────────────────────────────────────────────────────────────
 * GEMENSAM VOKABULÄR
 * Använd dessa exakta termer på alla sidor.
 * ───────────────────────────────────────────────────────────── */
export const VOCAB = {
  goldZone: "gyllene zonen",
  goldZoneEn: "gold zone",
  assistZone: "assistytan",
  rightFacing: "rättvänd",
  firstDefender: "första försvarare",
  fundamentals: ["spelbarhet", "spelavstånd", "spelbredd", "speldjup"] as const,
  pressTechnique: "press- och brytteknik",
} as const;

/* ─────────────────────────────────────────────────────────────
 * PRINCIPER PER SKEDE
 * ───────────────────────────────────────────────────────────── */
export const PHASES: Record<Phase, PhaseSpec> = {
  uppbyggnad: {
    id: "uppbyggnad",
    label: "Uppbyggnadsspel",
    oneLiner:
      "Vi behåller bollen genom spelbarhet, spelavstånd, spelbredd och speldjup.",
    principles: [
      {
        headline: "Maximera de fyra grundförutsättningarna.",
        detail:
          "Spelbarhet, spelavstånd, spelbredd och speldjup är ramverket. Saknas en — så stannar uppbyggnaden.",
        sub: ["Spelbarhet", "Spelavstånd", "Spelbredd", "Speldjup"],
        source:
          "Speluppbyggnad: Grundförutsättningarna i anfall (spelbarhet, spelavstånd, speldjup, spelbredd). — Övningsbank 9v9, Södermanlands FF",
      },
      {
        headline: "Målvakten är en uppbyggnadsspelare.",
        detail:
          "Målvakten erbjuder sig spelbar, passar till rättvänd medspelare och håller rättvända spelare i spel.",
        sub: ["Spelbarhet", "Passa till rättvänd", "Håll rättvänd i spel"],
        source:
          "Målvakter: Spelbarhet – passa till rättvända och håll rättvända spelare. — Övningsbank 9v9, Södermanlands FF",
      },
    ],
  },

  progression: {
    id: "progression",
    label: "Progression — framspel",
    oneLiner:
      "Vi för bollen framåt med spelvändningar och löpningar i djupled för att bryta motståndarlinjer.",
    principles: [
      {
        headline: "Sök rättvänd spelare framåt — vänd vid första chans.",
        detail:
          "Snabba spelvändningar och löpningar i djupled bryter linjer. Rättvänd spelare i spelyta 2 är trigger för progression.",
        sub: ["Rättvänd spelare", "Spelvändning", "Djupledslöpning"],
        source:
          "Rekommendation baserad på övergripande analys i sammanställningen (s. 4).",
      },
    ],
  },

  avslut: {
    id: "avslut",
    label: "Avslut — gör mål",
    oneLiner:
      "Vi söker avslut i gyllene zonen med numerärt överläge — via assistytorna.",
    principles: [
      {
        headline: "Avslut i gyllene zonen — alltid med övertal.",
        detail:
          "Nå avslut i det centrala guldområdet med numerärt överläge. Rättvänd spelare i spelyta 2–3 löper i djupled och hittar assistytan.",
        sub: [
          "Rättvänd spelare i spelyta 2–3",
          "Höghastighetslöpning i djupled",
          "Hitta assistytan → passa in i gyllene zonen",
          "Övertalighet i gyllene zonen och assistzon",
        ],
        source:
          "Komma till avslut i gold zone; Övertalighet i gold zone och assistzon. Subprinciper: Vid rättvänd spelare i spelyta 2 eller 3, höghastighetslöpning i djupled framåt; Hitta assistytorna för att därifrån passa in i gold zone. — Lagbesök Teori, Smålands FF",
      },
    ],
  },

  forsvar: {
    id: "forsvar",
    label: "Försvarsspel",
    oneLiner:
      "Vi förhindrar avslut i gyllene zonen genom positionering, press och markering.",
    principles: [
      {
        headline: "Förhindra avslut i gyllene zonen.",
        detail:
          "Korrekt positionering, tät press och markering. Vi blockerar avslutsytor och räddar farliga skott.",
        sub: ["Positionering", "Press", "Markering", "Förhindra avslut", "Rädda avslut"],
        source:
          "Förhindra att motståndarna kommer till avslut i golden zone; Rädda avslut i golden zone. Subprincip: Positionering; Press; Markering; Förhindra avslut; Rädda avslut. — Lagbesök Teori, Smålands FF",
      },
      {
        headline: "Styr pressen åt en sida — håll laget kompakt.",
        detail:
          "Vi förhindrar speluppbyggnad genom att styra pressen åt ett håll och hålla kompakt form via överflyttning, centrering, uppflyttning och nedflyttning.",
        sub: [
          "Styr press åt en sida",
          "Överflyttning",
          "Centrering",
          "Upp-/nedflyttning",
        ],
        source:
          "Förhindra speluppbyggnad: Styr pressen åt ett håll. Håll laget kompakt genom överflyttning, centrering, uppflyttning och nedflyttning. — Övningsbank 9v9, Södermanlands FF",
      },
    ],
  },

  "omstallning-forsvar": {
    id: "omstallning-forsvar",
    label: "Omställning till försvar",
    oneLiner:
      "Vid bollförlust: vinn tillbaka bollen, hindra spel framåt, förhindra kontring.",
    principles: [
      {
        headline: "Vinn tillbaka bollen — hindra spel framåt.",
        detail:
          "Lagets mål vid bollförlust: vinn tillbaka bollen, hindra spel framåt vid bollförlust i centrala korridorer, behåll spel i samma korridor, hindra kontring.",
        sub: [
          "Vinn tillbaka bollen",
          "Hindra spel framåt",
          "Behåll spel i samma korridor",
          "Hindra kontring",
        ],
        source:
          "Lagets mål: Vinn tillbaka bollen; Hindra spel framåt vid bollförlust i centrala korridorer; Behåll spel i samma korridor; Hindra kontring. — Lagbesök Teori, Smålands FF",
      },
      {
        headline: "Tydlig roll och position — även i anfallsspelet.",
        detail:
          "Medvetenhet om roll och position för återerövring redan när vi anfaller. Förhindra enkla utgångar, minska motståndarens tid och ytor. Flytta ned, centrera och jaga om mittfältet är förbispelat. Pressa med central spelare.",
        sub: [
          "Roll & position innan bollförlust",
          "Minska motståndarens tid/ytor",
          "Flytta ned · centrera · jaga",
          "Press med central spelare",
        ],
        source:
          "Principer: Medvetenhet om roll och position för återerövring även i anfallsspelet; Förhindra enkla utgångar, minska motståndarnas tid och ytor; Flytta ned, centrera, jaga om mittfältet är förbispelat; Pressa med central spelare. — Lagbesök Teori, Smålands FF",
      },
      {
        headline: "Forwarden är vår första försvarare.",
        detail:
          "Vid motståndarens uppbyggnad är forwarden första försvararen. Genom press och understöd i samverkan med medspelare styr vi motståndaren bort från farliga zoner och vinner tillbaka bollen.",
        sub: ["Press", "Understöd", "Samverkan", "Styra motståndaren"],
        source:
          "Forwarden är i försvarsspelet vid motståndarnas speluppbyggnad vår första försvarsspelare. Genom press och understöd i samverkan med medspelare styra motståndaren för att kunna återerövra bollen. — Spelsystem, Medelpad FF",
      },
      {
        headline: "Press- och brytteknik avgör.",
        detail:
          "Spelare måste behärska press- och brytteknik för att säkert vinna boll och snabbt omvandla en defensiv brytning till ett offensivt anfall.",
        sub: ["Pressteknik", "Brytteknik", "Snabb omställning ut"],
        source:
          "För att lyckas krävs att: Press- och brytteknik för att återerövra bollen och skapa offensiva omställningar. — Spelsystem, Medelpad FF",
      },
    ],
  },

  "omstallning-anfall": {
    id: "omstallning-anfall",
    label: "Omställning till anfall",
    oneLiner:
      "Efter återerövring: snabba omställningspass eller spelvändningar — utnyttja motståndarens obalans.",
    principles: [
      {
        headline: "Slå snabba omställningspass — utnyttja obalansen.",
        detail:
          "Direkt efter återerövring söker vi spelvändning eller djupledspass medan motståndaren är ostrukturerad. Press- och brytteknik skapar offensiva omställningar.",
        sub: ["Spelvändning", "Djupledspass", "Snabbt mot gyllene zonen"],
        source:
          "Press- och brytteknik för att återerövra bollen och skapa offensiva omställningar. — Spelsystem, Medelpad FF (utvecklad i sammanställningen s. 4).",
      },
    ],
  },

  malvakt: {
    id: "malvakt",
    label: "Målvakten",
    oneLiner:
      "Spelbar i uppbyggnad, kommunicerande sista försvarare i försvarsspel.",
    principles: [
      {
        headline: "Spelbar — passa till rättvänd.",
        detail:
          "Erbjud dig som spelbar passningsmottagare, särskilt till mittbackarna. Passa till rättvänd medspelare och håll rättvända spelare i spel.",
        sub: ["Spelbarhet", "Passa till rättvänd", "Håll rättvänd i spel"],
        source:
          "Målvakter: Spelbarhet – passa till rättvända och håll rättvända spelare. — Övningsbank 9v9, Södermanlands FF",
      },
      {
        headline: "Kommunicera med lagdelen framför.",
        detail:
          "I försvarsspel är målvakten sista försvararen — tydlig kommunikation med försvarslinjen och rätt positionering för att stoppa avslut.",
        sub: ["Kommunikation", "Positionering", "Stoppa avslut"],
        source:
          "Kommunicera med lagdelen framför i försvarsspelet. — Övningsbank 9v9, Södermanlands FF",
      },
    ],
  },

  fasta: {
    id: "fasta",
    label: "Fasta situationer",
    oneLiner:
      "Hörnor och frisparkar — defensivt med hybrid (zon + två man), offensivt mot gyllene zonen.",
    principles: [
      {
        headline: "Defensivt: hybrid — zon i boxen + två strikta man-markeringar.",
        detail:
          "Vi täcker farliga ytor med zon och låser de två största lufthoten man-mot-man. Inget överlämnas åt slumpen.",
        sub: ["Zonbas i boxen", "Två man på största hot", "Andraboll vinner vi tillsammans"],
        source:
          "Klubbintern princip — kompletterar PDF:ens defensiva kapitel.",
      },
      {
        headline: "Offensivt: leverera till gyllene zonen — sök assistytan.",
        detail:
          "Vi söker inlägg eller cutback in i gyllene zonen. Övertalighet i gyllene zonen och assistytan är målet — samma princip som i öppet spel.",
        sub: ["Inlägg mot gyllene zonen", "Cutback från assistytan", "Övertal i boxen"],
        source:
          "Komma till avslut i gold zone; Övertalighet i gold zone och assistzon. — Lagbesök Teori, Smålands FF (samma logik som öppet spel).",
      },
    ],
  },
};

/** Convenience-export i flödesordning för översiktssidor */
export const PHASE_FLOW: Phase[] = [
  "uppbyggnad",
  "progression",
  "avslut",
  "omstallning-forsvar",
  "forsvar",
  "omstallning-anfall",
];
