# Period 2 – Vinna bollen och slå till – designspecifikation

Datum: 2026-07-21. Författare: Joel + Claude (Fable planerar, Sonnet bygger).

## Mål

Period 2 är höstens spelarresa och den naturliga fortsättningen på Period 1
("Diagonalt spel från korridor till korridor", 11/5–1/7). Period 1 byggde
anfallsspelet. Period 2 bygger de tre återstående levande skedena ur
spelmodellens fyrdelning: försvarsspel, omställning till anfall och
omställning till försvar — med Period 1:s restförsvar/återerövring (vecka 6)
som brygga.

Tema: **press, återerövring och omställning**. Vi vinner bollen på våra
villkor och slår till innan motståndaren är organiserad.

## Ramar

- Samma datastruktur som Period 1: `Period`, `Week`, `Session` från
  `src/data/period1.ts`. Inga nya typer utom att `Period.id` breddas till
  `"period-1" | "period-2"`.
- Samma träningsrytm som höstens tränarplan (`coachTrainingAutumn2026.ts`):
  måndag/onsdag/torsdag, veckostarter 3/8–7/9.
- Endast befintliga `GraphicType`-värden. Inga nya grafikkomponenter.
- Kanon-vokabulär från spelmodellen gäller: "gyllene zonen", "assistytan",
  skedena benämns exakt som i nivåtrappan (försvarsspel, omställning till
  anfall – när vi vinner bollen, anfallsspel, omställning till försvar – när
  vi tappar bollen).

## Periodens ram

- id: `period-2`
- title: `Period 2 – Vinna bollen och slå till`
- dateRange: `3/8–30/9`
- detailRoute: `/period/2`
- objective: Vi bygger ett försvars- och omställningsspel där vi pressar på
  tydliga utlösare, återerövrar bollen direkt efter tapp och spelar framåt i
  de första passningarna efter bollvinst. Målet är att vinna bollen högt,
  slå till innan motståndaren är organiserad och säkra ytan bakom bollen när
  vi själva tappar den.

## Veckorna (6 aktiva veckor, 3 pass/vecka = 18 pass)

Datum följer mönstret mån/ons/tor från höstplanens veckostarter.

### Vecka 1 — Presstruktur (3/8, 5/8, 6/8)
- learningGoal: Spelaren känner igen våra press-utlösare och vet när laget
  går i press tillsammans — inte en och en.
- Utlösare: felvänd mottagare, dålig touch, långsam sidledspassning,
  passning in mot pressad spelare.
- kpi: `Antal gemensamma press-starter på rätt utlösare per spelperiod.`
- graphic: `pitch`

### Vecka 2 — Återerövra direkt (10/8, 12/8, 13/8)
- learningGoal: Direkt återerövring i fem sekunder efter tapp — närmaste
  spelare pressar bollen, nästa två stänger passningsvägarna.
- kpi: `Antal återerövringar inom 5 sekunder efter tapp.`
- graphic: `rest-defense`

### Vecka 3 — Omställning till anfall (17/8, 19/8, 20/8)
- learningGoal: Första passningen efter bollvinst går framåt när det är
  möjligt — spelaren scannar redan före bollvinsten.
- kpi: `Antal omställningar med spel framåt inom de 2 första passningarna.`
- graphic: `diagonal-pattern`

### Vecka 4 — Omställning till försvar (24/8, 26/8, 27/8)
- learningGoal: Vid tapp vet alla sin roll: närmast pressar, resten sprintar
  hem innanför boll-linjen. Restförsvaret från Period 1 blir på riktigt.
- kpi: `Antal kontringar emot som stoppas innan vår box.`
- graphic: `rest-defense`

### Vecka 5 — Kompakt försvarsspel (31/8, 2/9, 3/9)
- learningGoal: Laget flyttar i sidled som en enhet, håller korta avstånd
  mellan lagdelarna och säkrar under bollen.
- kpi: `Antal spelperioder utan genombrottspass genom vårt mittblock.`
- graphic: `corridor-map`

### Vecka 6 — Helhet: vinna, slå till, säkra (7/9, 9/9, 10/9)
- learningGoal: Hela kedjan i spel: press på utlösare → bollvinst → spel
  framåt → och när vi tappar: återerövring eller sprint hem.
- kpi: `Helhet: alla KPI:er från vecka 1–5 aktiva.`
- graphic: `pitch`

## Uppföljning (followUp)

- dateRange: `14/9–30/9`
- title: `Repetition, video och uppföljning`
- bullets: video på 3 bra gemensamma press-starter; 3 återerövringar inom 5
  sekunder; lagets bästa omställning till anfall; en sekvens där sprint hem
  räddar en kontring; nästa periods fokus.
- selfRating (jag-form, speglar veckorna): förstår när vi pressar; vet min
  roll vid tapp; vet första passningen efter bollvinst; vet när jag sprintar
  hem; vet hur vi står kompakt.

## Coach language (PERIOD_2_COACH_LANGUAGE)

"Press nu.", "Jaga i fem.", "Återerövra direkt.", "Säkra under.",
"Spela framåt först.", "Sprinta hem.", "Sidled ihop.", "Slå till."

("Återerövra direkt." och "Säkra under." återanvänds medvetet från Period 1.)

## Principer (PERIOD_2_PRINCIPLES, 8 st)

| slug | title | childFriendly |
|---|---|---|
| press-utlosare | Press på utlösare | Vi pressar när bollen visar oss att det är läge — inte när vi är trötta på att vänta. |
| jaga-i-fem | Jaga i fem sekunder | När vi tappar bollen jagar alla nära i fem sekunder. |
| stang-vagarna | Stäng passningsvägarna | En pressar bollen, resten tar bort nästa pass. |
| framat-forst | Framåt först | Första passningen efter bollvinst letar alltid framåt. |
| fart-i-tre-steg | Fart i tre steg | Tre snabba aktioner efter bollvinst innan motståndaren hinner hem. |
| sprinta-hem | Sprinta hem | Kan vi inte ta bollen direkt sprintar vi innanför boll-linjen. |
| kompakt-block | Kompakt block | Korta avstånd mellan lagdelarna gör oss svåra att spela igenom. |
| sakra-under | Säkra under | Det finns alltid någon bakom bollen som städar. |

Detail-texten (tränarnivå) skrivs i samma ton som Period 1:s principer.

## Referenser (PERIOD_2_REFERENCES)

- **Liverpool (Klopp-eran)** — tag "Counterpress": gegenpressing som
  playmaker, jaga direkt vid tapp, vinna bollen högt.
- **Atalanta** — tag "Man-mot-man-press + fart": aggressiv press över hela
  planen, direkta omställningar.
- **GAIS** — tag "Identitet + kontinuitet": behålls från Period 1 —
  samma kollektiva identitet, nu på försvarssidan.

## Sidan /period/2

- Kopia av Period1.tsx-mönstret med Period 2-data och Period 2-copy
  (medvetet vald duplicering — parametrisera först vid period 3).
- Samma fem flikar: Kartan, Principen, Resan, Passen, Fördjupning.
- Hero-copy och flikintros skrivs om till press/omställningstemat.
- Korslänkar: Period 1:s uppföljningssektion länkar till `/period/2`
  ("Nästa period"); Period 2:s karta länkar tillbaka till `/period/1`.

## Åtkomst

Samma som Period 1: `Protected`-route med delad inloggning. Ingen ägargrind.

## Verifieringskriterier

- Datainvarianter: 6 veckor, 18 pass, veckonummer 1–6 unika, alla datum
  följer mån/ons/tor-mönstret ovan, KPI ej tom, id `period-2`,
  detailRoute `/period/2`.
- Period1-sidans tester fortsatt gröna (komponentändringar bakåtkompatibla).
- `bun run test && bun x tsc --noEmit && bun x vite build` exit 0.
