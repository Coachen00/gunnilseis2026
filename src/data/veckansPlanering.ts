/**
 * Veckans planering på /spelmodell — vad vi tränar på + nästa match.
 *
 * Editera detta för att uppdatera "Veckans planering"-sektionen.
 * Renderas av <VeckansPlanering /> i src/components/maj2026/VeckansPlanering.tsx.
 */

export type WeekDay = "Måndag" | "Tisdag" | "Onsdag" | "Torsdag" | "Fredag" | "Lördag" | "Söndag";
export type SessionKind = "trening" | "match" | "vila";

export interface SessionItem {
  day: WeekDay;
  date?: string;
  kind: SessionKind;
  /** Kort rubrik på passet/matchen — visas stort. */
  headline: string;
  /** En mening om vad passet/matchen handlar om. */
  oneLiner: string;
  /** 2–4 punkter om innehåll/syfte. */
  bullets: string[];
}

export interface TacticalFocus {
  number: "01" | "02" | "03";
  /** Kort etikett ovanför rubriken — t.ex. "Försvarsspel" eller "Träningsstrategi". */
  category: string;
  title: string;
  /** Lead-mening — det stora "varför". */
  lead: string;
  /** Konkret hur — 3–6 punkter. */
  how: string[];
  /** Vad spelaren ska tänka på — kort kommando. */
  playerCue: string;
  /** Vilken färg-accent: yellow=princip, red=press, blue=passningsväg, green=plan/yta. */
  accent: "yellow" | "red" | "blue" | "green";
}

export const VECKANS_PLANERING = {
  weekLabel: "Vecka 20 · 11–17 maj 2026",
  goal: {
    eyebrow: "Veckans målsättning",
    title: "Att spela i diagonalerna",
    subtitle:
      "Passa från en spelyta till nästa diagonalt. Inte rakt fram, inte sidled — diagonalt. Det är så vi bryter motståndarens linjer och dyker upp rättvända i nästa yta.",
    why: [
      "Diagonalpasset attackerar två linjer samtidigt — djup och bredd i samma touch.",
      "Mottagaren får en naturlig vinkel att öppna kroppen mot — rättvänd direkt, ser planen framåt.",
      "Motståndaren är ställd för att försvara raka linjer. Diagonalen flyttar deras stöd för sent.",
      "Vägen in i Spelyta 2 går nästan alltid via en diagonal — antingen från utgångsytan eller från ytterkorridoren in i halvytan.",
    ],
  },
  focus: [
    {
      number: "01",
      category: "Försvarsspel",
      title: "Hårdare styra mot ytterback",
      lead:
        "Ingen boll genom mitten. Vi tvingar motståndaren att bygga via deras ytterbackar — sedan stänger vi.",
      how: [
        "Anfallarna pressar med kroppsvinkel som blockerar mittpasset. Bollen ska aldrig gå rakt fram.",
        "När mittback rullar bollen sidled — det är trigger för att tända pressen mot ytterback.",
        "På bollsida bildar vi försvarstriangel: 8a + ytterback + en mittback. Tre spelare täcker tre passningslinjer i samma korridor.",
        "8an på bortre sidan håller centrum tätt — hindrar diagonal vändning ut till motsatt ytterback.",
        "Mittbacken på bollsida steget upp om ytterbacken pressar. Skydd bakom = övriga två mittbackarna i kedjan.",
        "Formation 3-4-3 i grunden — när vi pressar högt blir det 3-4-3 → 3-2-5 (8orna skjuts upp).",
      ],
      playerCue: "Blockera mitten. Tända pressen när bollen rullar sidled. Triangeln stänger.",
      accent: "red",
    },
    {
      number: "02",
      category: "Träningsstrategi",
      title: "Större ytor — närma matchens tempo",
      lead:
        "Ta matchen till träningen för att ta träningen till matchen. Övning på 20×15 ger teknik. Match är 105×68. Mellantingen vinner matcher.",
      how: [
        "Spelövningar körs på minst 50×40 (halv plan), helst större. Sluten yta dödar matchtempo.",
        "Färre touchbegränsningar i veckans pass — vi vill ha valet, inte tvånget.",
        "Lägg in övergångsfasen: bollvinst → 6 sekunder framåtspel → ny start. Matchens rytm.",
        "Tempo före perfektion: bättre att fela framåt med rätt idé än att spela säkert sidled.",
        "Slutmoment alltid avslut. Inget pass utan att kedjan slutar i Golden zone eller Assistytan.",
      ],
      playerCue: "Stor yta. Hög rytm. Felet framåt är bättre än säker boll sidled.",
      accent: "yellow",
    },
  ] as TacticalFocus[],
  sessions: [
    {
      day: "Måndag",
      date: "11 maj",
      kind: "trening",
      headline: "Tema 01 · Pressfälla mot ytterback",
      oneLiner:
        "Vi bygger 3-4-3:ans försvarstrianglar och tränar trigger — när vrider vi på pressen?",
      bullets: [
        "Uppvärmning: 4v2 rondo i halvyta med rättvänd-mottagning som regel.",
        "Huvuddel A: 7v7 på halvplan — angriparen får bara spela in centralt om vi tappar pressriktningen. Coach-cue: 'blockera mitten'.",
        "Huvuddel B: 9v9 med fokus på trigger-presset från forwards när motståndaren rullar bollen sidled.",
        "Avslut: spelövning med fri formation — försvarstriangeln måste stänga ytterbacken på 2 sekunder.",
      ],
    },
    {
      day: "Onsdag",
      date: "13 maj",
      kind: "trening",
      headline: "Tema 02 · Diagonalpass mellan spelytor",
      oneLiner:
        "Vi bryter linjer. Bollen reser diagonalt från utgångsytan → Spelyta 1 → Spelyta 2 → Assistytan.",
      bullets: [
        "Uppvärmning: passningskvadrater där alla pass ska gå diagonalt (inte rakt). Två touch.",
        "Huvuddel A: positionsspel 4v4+3 på 40×30 — bonuspoäng för diagonalpass som bryter linje.",
        "Huvuddel B: 8v8 på 60×50 med markerade spelytor på planen — passa medvetet ner spelyta för spelyta.",
        "Avslut: matchstor yta, fritt spel. Krav: senaste passningen före avslut ska komma från diagonal in i Assistytan.",
      ],
    },
    {
      day: "Torsdag",
      date: "14 maj",
      kind: "trening",
      headline: "Match-prep · Allt tillsammans, full storlek",
      oneLiner:
        "Försvarstriangeln + diagonalpasset i matchkontext. Sista finliret innan Vardar.",
      bullets: [
        "Uppvärmning: kort, högintensiv — koppla på matchpuls direkt.",
        "Huvuddel: 11v11 på hel plan, två halvlekar à 20 min. Genomspelning av 3-4-3 med fokus på de två temana.",
        "Standardsituationer: 15 min — vår offensiva hörna + defensiv mot Vardars typiska upplägg.",
        "Klart 90 min före, kort genomgång + matchblad-uppgifter individuellt.",
      ],
    },
    {
      day: "Fredag",
      date: "15 maj",
      kind: "match",
      headline: "MATCH · Gunnilse IS – IF Vardar/Makedonija",
      oneLiner:
        "Veckans mål blir matchplan: blockera mitten, tända press på ytterback, attackera assistytan via diagonalen.",
      bullets: [
        "Förstart: matchblad + uppvärmning enligt vår rutin.",
        "Halvlek: snabb återkoppling på trianglarna + tempo, inga monologer.",
        "Efter slutsignal: kort lagsamling — vad såg vi av temana? Kollektiv reflektion innan individuell.",
        "Klipp filmas — används till nästa veckas reflektion på /spelmodell.",
      ],
    },
  ] as SessionItem[],
} as const;
