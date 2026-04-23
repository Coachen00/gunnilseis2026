/**
 * Match-cues per spelskede — korta, tydliga regler tränare/spelare läser inför match.
 * Använd kanonisk vokabulär från src/data/principles.ts.
 */

export interface PhaseCue {
  trigger: string;
  action: string;
}

export interface PhaseCueSet {
  /** Route till sidan, utan ankare */
  route: string;
  label: string;
  oneLiner: string;
  rules: string[];
  cues: PhaseCue[];
}

export const PHASE_CUES: Record<"forsvar" | "omstallning-anfall" | "anfall" | "omstallning-forsvar", PhaseCueSet> = {
  forsvar: {
    route: "/forsvar",
    label: "Försvar",
    oneLiner: "Förhindra avslut i gyllene zonen — kompakt, styr utåt, vinn andrabollen.",
    rules: [
      "Vi står kompakt i 4-3-3 — aldrig öppna mitten.",
      "Vi styr alltid pressen åt en sida (helst deras vänsterback).",
      "Första försvarare bryter inte — hen styr. Andra försvarare bryter.",
      "Andrabollar vinner vi som lag — närmaste spelare attackerar, övriga tätar runtom.",
    ],
    cues: [
      { trigger: "Motståndaren spelar bakåt till backlinjen", action: "9:an pressar — hela laget flyttar upp 5 m" },
      { trigger: "Tung mottagning eller dålig första touch", action: "Närmaste spelare bryter direkt" },
      { trigger: "Boll till deras yttre korridor", action: "Vi tätar inåt — tvingar dem mot kortlinjen" },
      { trigger: "Boll i gyllene zonen hos motståndaren", action: "Närmaste två spelare markerar man-mot-man, övriga blockerar skottlinjer" },
    ],
  },
  "omstallning-anfall": {
    route: "/omstallning-anfall",
    label: "Omställning till anfall",
    oneLiner: "Bollvinst → utnyttja obalansen direkt. Rättvänd → spelvändning eller djupledspass.",
    rules: [
      "Första passningen efter bollvinst går framåt om det finns en spelbar linje.",
      "Yttrar och 9:a startar löpning i djupled vid bollvinst — alltid.",
      "Om kontring inte är möjlig: säkra bollen och starta uppbyggnad.",
      "Vi har max 5–8 sekunder att utnyttja obalansen innan motståndaren återorganiserar.",
    ],
    cues: [
      { trigger: "Bollvinst i egen halva", action: "Sök rättvänd spelare → djupledspass eller spelvändning" },
      { trigger: "Bollvinst i mitten", action: "Full fart — yttrar och 9:a löper i djupled" },
      { trigger: "Bollvinst högt upp", action: "Direkt avslut eller cutback till gyllene zonen" },
      { trigger: "Ingen spelbar framåt", action: "Säkra bollen — starta uppbyggnad enligt anfallsprinciperna" },
    ],
  },
  anfall: {
    route: "/anfall",
    label: "Anfall",
    oneLiner: "Spelbarhet, spelavstånd, spelbredd, speldjup → rättvänd → spelvändning → avslut i gyllene zonen.",
    rules: [
      "Vi spelar 3-2-2-3: tre backar, bas (6:a + inverterad YB), 8:a + 7:a, två yttrar + 9:a.",
      "Inre korridor är förstaval — yttre är sista utväg.",
      "Vi söker alltid rättvänd spelare innan vi spelar framåt.",
      "Avslut sker i gyllene zonen, helst med övertal via assistytan.",
    ],
    cues: [
      { trigger: "Rättvänd spelare i progression", action: "Spelvändning → full fart i ny korridor" },
      { trigger: "Inre korridor låst", action: "Spelvänd via 6:a + inverterad YB → öppna motsatt sida" },
      { trigger: "Boll i yttre korridor på sista tredjedelen", action: "Överlapp/underlapp → cutback till gyllene zonen" },
      { trigger: "Övertal i gyllene zonen", action: "Avsluta — annars cutback till assistytan" },
    ],
  },
  "omstallning-forsvar": {
    route: "/omstallning-forsvar",
    label: "Omställning till försvar",
    oneLiner: "Bollförlust → motpress i 5 sekunder. Annars: ned, in, kompakt block.",
    rules: [
      "Närmaste spelare pressar boll direkt — ingen tvekan.",
      "Övriga stänger passningsvägar i samma riktning.",
      "Forwarden är vår första försvarare — hen pressar bakåt om bollen rör sig framåt.",
      "Efter ~5 sekunder utan återerövring: hela laget faller ned och centrerar.",
    ],
    cues: [
      { trigger: "Vi tappar bollen", action: "Närmaste spelare pressar boll inom 1 sekund" },
      { trigger: "Press misslyckas inom 5s", action: "Hela laget ned och in — återetablera 4-3-3-block" },
      { trigger: "Motståndaren har rättvänd spelare framåt", action: "Backlinjen backar — stäng djupet först" },
      { trigger: "Vi vinner andrabollen", action: "Direkt offensiv omställning — se cues för 'till anfall'" },
    ],
  },
};