/**
 * Anfallsspel — fem principer i ordning.
 *
 * Logiken: vi anfaller alltid i den här sekvensen. Princip 1 är förutsättning
 * för alla andra (utan balans = ingen offensiv). Sedan flödar bollen: in → ut →
 * framåt → in i box. Tas en princip bort kollapsar resten.
 *
 * Källa: klubbens samtal vecka 19 (Joel) — bygger vidare på den fas-baserade
 * principstrukturen i `principles.ts` men ramar in den i 5 punkter spelarna
 * faktiskt minns under match.
 */

export type AttackingPrincipleSlug =
  | "skydda-mot-kontring"
  | "spela-in"
  | "spela-ut"
  | "ta-med-framat"
  | "fyll-pa-box";

export interface AttackingPrinciple {
  slug: AttackingPrincipleSlug;
  /** 1–5 i sekvensen. */
  order: number;
  /** Kort headline — det vi säger till spelarna. */
  headline: string;
  /** En enda mening med själva principen. */
  oneLiner: string;
  /** Tre meningar max — så att spelaren förstår VARFÖR. */
  forklaring: string;
  /** Vad spelarna ska titta efter på planen — frågor de ställer i 1 sek. */
  tittaEfter: string[];
  /** Vad spelarna ska göra — konkreta beteenden. */
  goraDetta: string[];
  /** Exempel från en spelad match denna säsong. */
  matchExempel: { motstandare: string; situation: string };
  /** En övning eller coachningspunkt som tränar principen. */
  ovning: { rubrik: string; beskrivning: string };
}

export const ATTACKING_PRINCIPLES: AttackingPrinciple[] = [
  {
    slug: "skydda-mot-kontring",
    order: 1,
    headline: "Skydda mot kontring",
    oneLiner:
      "Vi anfaller med balans — kontroll bakom bollen, redo att försvara direkt.",
    forklaring:
      "Innan vi går framåt ska vi ha kontroll bakom bollen. Den dyraste tappningen är den som sker när vi själva är obalanserade. Vinner vi inte tillbaka inom 5 sekunder ska vi minst stoppa att de kommer igenom mitten.",
    tittaEfter: [
      "Hur många motståndare står framför oss om vi tappar nu?",
      "Har vi minst lika många bakom bollen som de har framför?",
      "Var är deras snabbaste spelare — täcker vi den ytan?",
    ],
    goraDetta: [
      "6:an säkrar central yta bakom 8:a/10 — flyttar inte upp samtidigt som dem.",
      "Mittbackarna håller halvbacksavstånd så ingen kan vända i halvyta.",
      "Aldrig mer än 2 spelare i samma framåtzon — vi sprider vikten.",
      "Ena ytterbacken stannar — den andra får gå med.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "Mot Velebit höll vi 0 farliga kontringschanser bortgivna trots att vi anfallsväxlade ofta — det är detta beteendet som gjorde det möjligt.",
    },
    ovning: {
      rubrik: "Cover-zone 8v8",
      beskrivning:
        "Spel 8v8 med två markerade cover-zoner bakom bollen. Saknas en spelare i någon zon vid bollförlust = poäng till motståndaren oavsett vad som händer sen.",
    },
  },
  {
    slug: "spela-in",
    order: 2,
    headline: "Spela in bollen",
    oneLiner:
      "Vi söker passningen mellan motståndarens lagdelar — för att hota, vända upp eller starta nästa.",
    forklaring:
      "När vi har bollen i låg eller mellanhög zon letar vi efter en spelare i halvyta eller mellan deras 4 och 3. Att spela in är inte målet i sig — det är trigger för nästa pass. Mottagaren behöver inte vända; det räcker att vi flyttar in bollen och tvingar deras lagdelar att reagera.",
    tittaEfter: [
      "Står en medspelare i halvyta eller mellan deras led?",
      "Är hen rättvänd — eller kan hen vända upp utan press?",
      "Är passningslinjen fri eller bryts den av en av deras 6:or?",
    ],
    goraDetta: [
      "8:a och 10 erbjuder sig mellan deras lagdelar, sidoförflyttar tills passningslinjen öppnas.",
      "Mottagaren öppnar kroppen mot motståndarmål — aldrig ryggen mot.",
      "Närmaste spelare följer upp för rebound eller direkt återerövring vid bryt.",
      "Backlinjen flyttar upp 5 m när bollen går in — vi krymper deras yta.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "Mot Velebit hittade vi flera in-pass i halvytan i 1:a halvlek — det skapade både 1–0-målet och fler chanser som inte gick i mål.",
    },
    ovning: {
      rubrik: "Tredje man bryter linjen",
      beskrivning:
        "Rondo 6v3 med två motståndarled. Bonuspoäng när passningen går till en spelare som står mellan led och hen kan slå pass vidare på första touch.",
    },
  },
  {
    slug: "spela-ut",
    order: 3,
    headline: "Spela ut bollen",
    oneLiner:
      "När det är trångt centralt flyttar vi blocket — spelvändning öppnar nästa väg framåt.",
    forklaring:
      "Är inre korridor stängd ska vi inte forcera. Vi vänder spelet via 6:a, mittback eller direkt till motsatt ytter, accepterar 1 sekund extra på bollen och låter blocket flytta sig. När motståndaren rört sig är ny inre korridor öppen — det är den vi attackerar.",
    tittaEfter: [
      "Är inre korridor full av motståndare?",
      "Är kontralateral kant friställd — står deras sidoback för centralt?",
      "Har deras lagdelar tappat avstånd när bollen rör sig?",
    ],
    goraDetta: [
      "6:a/8 vänder spelet via mittback eller direkt till motsatt ytter.",
      "Yttern på den 'tysta' sidan står brett och redo, redan innan bollen kommer.",
      "Vi accepterar 1 sek mer på bollen för att tvinga blockflytt — bollen bakåt är ok.",
      "Direkt efter spelvändningen söker vi tillbaka in (princip 2) i nya öppna ytan.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "I 2:a halvlek mot Velebit fastnade vi flera gånger centralt — när vi vände till motsatt sida via 6:an öppnade nya inre korridor och vi fick chans.",
    },
    ovning: {
      rubrik: "Position-spel 8v6 med tysta zoner",
      beskrivning:
        "Två 'tysta zoner' på var sin kant. Bollen MÅSTE passera båda tysta zoner innan ett mål kan göras. Tränar tålamodet att flytta blocket istället för att forcera centralt.",
    },
  },
  {
    slug: "ta-med-framat",
    order: 4,
    headline: "Ta med den framåt",
    oneLiner:
      "Har vi yta — driv eller passa framåt med fart. Vi vinner meter, inte bara boll.",
    forklaring:
      "När motståndaren har flyttat sig öppnas yta. Då ska vi inte växla sidled — vi ska ta meter. Drivet eller djupledspasset tvingar deras backlinje att backa, vilket öppnar inre korridor (princip 2 igen) och boxytan (princip 5).",
    tittaEfter: [
      "Är ytan framför mig öppen i 5+ meter?",
      "Springer en medspelare i djupled — kan jag slå hen?",
      "Är försvararen tung, felställd eller bakvänd?",
    ],
    goraDetta: [
      "Driv med innersidan, 3–4 steg, sen ny touch.",
      "Yttrar och 9:a startar djupledslöpning när 6/8 har bollen rättvänd.",
      "Inga sidledsväxlar när det finns en framåtspelad option.",
      "Felvänd? Spela till rättvänd och stötta uppåt — driv inte förbi din egen led.",
    ],
    matchExempel: {
      motstandare: "Stenkullen (10 apr, 4–2 borta)",
      situation:
        "Bortavinsten i Stenkullen kom till stor del genom att vi vågade driva och passa framåt direkt vid bollvinst — vi tvingade deras backlinje att backa flera gånger.",
    },
    ovning: {
      rubrik: "4-mål-spel: framåt-regel",
      beskrivning:
        "Spel 7v7 med fyra mål (2 i varje kortlinje). Mål kan bara erkännas om sista passningen eller löpningen vunnit minst 10 m framåt. Sidledsväxel = noll.",
    },
  },
  {
    slug: "fyll-pa-box",
    order: 5,
    headline: "Fyll på spelare i och runt box",
    oneLiner:
      "Sista tredjedelen — minst fyra i/runt boxen. Mål, andraboll eller direkt återerövring.",
    forklaring:
      "Vi gör inte mål med en man i boxen. När bollen är på sista tredjedelen ska 9, motsatt ytter och en av 8/10 attackera fyra zoner: första, straffpunkt, bortre, cutback. En till hänger 18 m för andraboll/skott. Tappar vi i hög zon ligger vi rätt för direkt motpress.",
    tittaEfter: [
      "Är vi minst fyra i/runt boxen vid inlägg?",
      "Är straffpunkt + bortre stolpe + första stolpe täckta?",
      "Står någon på 'andraboll-positionen' 18 m utanför box?",
    ],
    goraDetta: [
      "9:an attackerar straffpunkten — alltid.",
      "Motsatt ytter attackerar bortre stolpen.",
      "Central mittfältare (8) attackerar första — ofta från sen löpning.",
      "Den andra 8/10 hänger 18 m för andraboll och skott.",
      "10 stänger cutbacken (assistytan) — redo för in-passning.",
    ],
    matchExempel: {
      motstandare: "Partille (18 apr, 3–2 hemma)",
      situation:
        "Tre mål mot Partille — alla kom när vi var minst fyra i/runt boxen i avslutsögonblicket. Mot Velebit (1–0) syntes detta i färre tillfällen och vi missade flera lägen för 2–0.",
    },
    ovning: {
      rubrik: "Inläggsövning 4v3 + 1",
      beskrivning:
        "3v3 inne i boxen + 1 bonusspelare 18 m. Cutback eller inlägg från kant. Byt sida varje gång. Räkna hur ofta vi får 4 in i boxen — under 70% är inte godkänt.",
    },
  },
];

export function findAttackingPrinciple(slug: string) {
  return ATTACKING_PRINCIPLES.find((p) => p.slug === slug);
}
