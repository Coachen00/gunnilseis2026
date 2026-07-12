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

import type { IdentityItem } from "@/data/identity";

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
  /** 1–3 ord man ropar från sidlinjen — ska räcka som påminnelse. */
  coachrop: string[];
  /**
   * 1–2 identitetsord som denna princip aktiverar (slug i identity.ts).
   * Visas som "Aktiverar"-chip på principkortet — kopplar 5-principen
   * till de 5 identitetsorden vi tränar varje match.
   */
  aktiverarIdentitet?: IdentityItem["slug"][];
}

export const ATTACKING_PRINCIPLES: AttackingPrinciple[] = [
  {
    slug: "skydda-mot-kontring",
    order: 1,
    headline: "Skydda mot kontring",
    oneLiner:
      "Vi anfaller med balans. Innan vi går framåt ska vi ha kontroll bakom bollen och vara redo att försvara direkt om vi tappar den.",
    forklaring:
      "Den dyraste tappningen sker när vi själva är utdragna och felställda. Vinner vi inte tillbaka direkt ska vi minst stoppa att de kommer igenom mitten.",
    tittaEfter: [
      "Hur många motståndare står framför oss om vi tappar nu?",
      "Har vi minst lika många bakom bollen som de har framför?",
      "Var är deras snabbaste spelare — täcker vi den ytan?",
    ],
    goraDetta: [
      "6:an står kvar i central yta bakom 8 och 10 — går inte upp samtidigt som dem.",
      "Mittbackarna håller avstånd till varandra så ingen kan vända med bollen i halvytan.",
      "Aldrig mer än 2 av oss i samma offensiva zon samtidigt.",
      "Ena ytterbacken går med framåt — den andra stannar och täcker.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "Frågor till klippanalysen: Hur många farliga kontringar gav vi bort? Var stod 6:an när vi anfallsväxlade? Målbild: 0 farliga kontringar bortgivna och 6:an alltid på rätt sida om bollen.",
    },
    ovning: {
      rubrik: "Cover-zone 8v8",
      beskrivning:
        "Spel 8v8 med två markerade cover-zoner bakom bollen. Saknas en spelare i någon zon vid bollförlust = poäng till motståndaren oavsett vad som händer sen.",
    },
    coachrop: ["Cover!", "6:an stå!", "Balans!"],
    aktiverarIdentitet: ["scanning", "yta"],
  },
  {
    slug: "spela-in",
    order: 2,
    headline: "Spela in bollen",
    oneLiner:
      "Vi söker möjligheten att spela in bollen centralt eller mellan motståndarens led när läget finns. Syftet är att hota, vända upp eller skapa nästa passning.",
    forklaring:
      "Att spela in är inte målet i sig — det är triggern för nästa pass. Mottagaren behöver inte vända själv; det räcker att vi flyttar in bollen och tvingar deras led ur balans.",
    tittaEfter: [
      "Står en medspelare mellan deras led — i halvyta eller centralt?",
      "Är hen rättvänd, eller kan hen öppna kroppen mot motståndarmål utan press?",
      "Är passningslinjen fri, eller bryts den av en av deras innermittfältare?",
    ],
    goraDetta: [
      "8 och 10 ställer sig mellan deras led och flyttar i sidled tills passningslinjen öppnar sig.",
      "Mottagaren öppnar kroppen mot motståndarmål — aldrig ryggen mot.",
      "Närmaste spelare stöttar upp direkt — för en rebound eller för att vinna tillbaka vid bryt.",
      "Backlinjen flyttar upp 5 m när bollen går in — vi krymper deras yta.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "Frågor till klippanalysen: Hur många in-pass slog vi bakom deras första press i 1:a halvlek? Vilken som ledde till 1–0:an? Räkna även in-pass där mottagaren sköt rätt vidare på första touch.",
    },
    ovning: {
      rubrik: "Tredje man bryter linjen",
      beskrivning:
        "Rondo 6v3 med två motståndarled. Bonuspoäng när passningen går till en spelare som står mellan led och hen kan slå pass vidare på första touch.",
    },
    coachrop: ["In!", "Mellan!", "Hitta 10!"],
    aktiverarIdentitet: ["prata-med-passningen"],
  },
  {
    slug: "spela-ut",
    order: 3,
    headline: "Spela ut bollen",
    oneLiner:
      "Om det är trångt centralt spelar vi ut bollen för att flytta motståndaren, hitta yta och skapa bättre lägen att komma framåt.",
    forklaring:
      "Vi vänder spelet via 6:an, en mittback eller direkt till motsatt ytter — och accepterar 1 sekund extra på bollen för att tvinga blocket att flytta sig. När motståndaren har flyttat sig är ny central korridor öppen — det är den vi attackerar.",
    tittaEfter: [
      "Är centralt fullt av motståndare?",
      "Är motsatt kant friställd — står deras sidoback för centralt?",
      "Har deras led tappat avstånd till varandra när bollen rör sig?",
    ],
    goraDetta: [
      "6:an eller 8:an vänder spelet via mittback eller direkt till motsatt ytter.",
      "Yttern på den 'tysta' sidan står brett och redo redan innan bollen kommer.",
      "Vi accepterar 1 sek mer på bollen för att tvinga blocket att flytta — bollen bakåt är ok.",
      "Direkt efter spelvändningen söker vi tillbaka in (princip 2) i den nya öppna ytan.",
    ],
    matchExempel: {
      motstandare: "Velebit (2 maj, 1–0)",
      situation:
        "Frågor till klippanalysen: I trånga centrala lägen — hur ofta valde vi spelvändning vs dribbling? Hur många gånger kom vi tillbaka in centralt på den nya sidan efter en spelvändning?",
    },
    ovning: {
      rubrik: "Position-spel 8v6 med tysta zoner",
      beskrivning:
        "Två 'tysta zoner' på var sin kant. Bollen MÅSTE passera båda tysta zoner innan ett mål kan göras. Tränar tålamodet att flytta blocket istället för att forcera centralt.",
    },
    coachrop: ["Ut!", "Vänd!", "Tysta sidan!"],
    aktiverarIdentitet: ["prata-med-passningen"],
  },
  {
    slug: "ta-med-framat",
    order: 4,
    headline: "Ta med den framåt",
    oneLiner:
      "När vi har yta ska vi driva eller passa framåt med fart och mod. Vi ska inte bara flytta bollen, utan vinna meter och sätta press på motståndaren.",
    forklaring:
      "Drivet eller djupledspasset tvingar deras backlinje att backa, vilket öppnar centrala korridoren igen (princip 2) och boxytan (princip 5). Sidledsväxlar nu = bortkastat tempo.",
    tittaEfter: [
      "Är ytan framför mig öppen i minst 5 meter?",
      "Springer en medspelare i djupled — kan jag slå hen?",
      "Är försvararen tung, felställd eller bakvänd?",
    ],
    goraDetta: [
      "Driv med innersidan av foten, 3–4 steg, sen ny touch.",
      "Yttrar och 9 startar löpning i djupled så fort 6 eller 8 har bollen rättvänd.",
      "Inga sidledsväxlar när det finns en passning eller löpning framåt som funkar.",
      "Är du felvänd? Spela till rättvänd medspelare och stötta uppåt — driv inte förbi din egen led.",
    ],
    matchExempel: {
      motstandare: "Stenkullen (10 apr, 4–2 borta) + Velebit",
      situation:
        "Frågor till klippanalysen: I varje sekvens där en av oss hade 5+ m yta framför sig — drev vi/passade framåt eller växlade vi i sidled? Räkna båda matcherna och jämför.",
    },
    ovning: {
      rubrik: "4-mål-spel: framåt-regel",
      beskrivning:
        "Spel 7v7 med fyra mål (2 i varje kortlinje). Mål kan bara erkännas om sista passningen eller löpningen vunnit minst 10 m framåt. Sidledsväxel = noll.",
    },
    coachrop: ["Driv!", "Framåt!", "Ta meter!"],
    aktiverarIdentitet: ["yta", "duellspel"],
  },
  {
    slug: "fyll-pa-box",
    order: 5,
    headline: "Fyll på spelare i och runt box",
    oneLiner:
      "När vi kommer till sista tredjedelen ska vi fylla på med spelare i boxen och runt boxen — för att göra mål, vinna andrabollar eller återerövra bollen snabbt efter tapp.",
    forklaring:
      "Vi gör inte mål med en man i boxen. 9, motsatt ytter och en av 8/10 attackerar fyra zoner: första stolpen, straffpunkten, bortre stolpen och cutback-ytan. En till hänger 18 m utanför för andraboll och skott. Tappar vi i hög zon ligger vi rätt för direkt motpress.",
    tittaEfter: [
      "Är vi minst fyra i och runt boxen när inlägget kommer?",
      "Är första stolpen, straffpunkten och bortre stolpen täckta?",
      "Står någon på andraboll-positionen 18 m utanför boxen?",
    ],
    goraDetta: [
      "9 attackerar straffpunkten — alltid.",
      "Motsatt ytter attackerar bortre stolpen.",
      "Central mittfältare (8) attackerar första stolpen — ofta från en sen löpning.",
      "Den andra 8 eller 10 hänger 18 m utanför för andraboll och skott.",
      "10 stänger cutback-ytan (assistytan) — redo för in-passningen.",
    ],
    matchExempel: {
      motstandare: "Partille (18 apr, 3–2) + Velebit (1–0)",
      situation:
        "Frågor till klippanalysen: Räkna spelare i/runt boxen vid varje inlägg och cutback. Mål: minst 4 i/runt, helst 5. Hur många inlägg per match nådde tröskeln? Jämför Partille (3 mål) med Velebit (1 mål).",
    },
    ovning: {
      rubrik: "Inläggsövning 4v3 + 1",
      beskrivning:
        "3v3 inne i boxen + 1 bonusspelare 18 m. Cutback eller inlägg från kant. Byt sida varje gång. Räkna hur ofta vi får 4 in i boxen — under 70% är inte godkänt.",
    },
    coachrop: ["Box!", "Fyll!", "4 in!"],
    aktiverarIdentitet: ["andrabollsspel", "duellspel"],
  },
];

export function findAttackingPrinciple(slug: string) {
  return ATTACKING_PRINCIPLES.find((p) => p.slug === slug);
}
