# Planindelning — teknisk specifikation

> Källgrund för korridorer, spelytor, assistytan och Golden zone så som de används i Gunnilse IS spelmodell 2026. Ligger till grund för taktiska planvyer, träningsmaterial, matchblad och allt visuellt språk i `/maj-2026` och underliggande principsidor.

## Källgrund

SvFF beskriver **korridorer** som pedagogiska hjälpmedel för spelbredd, **spelytor** för speldjup, **assistytor** som ytor för sista passningen före avslut, och **Gold zone** som ytan laget helst vill avsluta från och försvara bort avslut från.

FIFA använder motsvarande fem vertikala kanaler i sin analys av final-third entries: left channel, left inside channel, central channel, right inside channel, right channel. FIFA anger också **105 × 68 meter** som rekommenderad planstorlek.

---

## 1. Korridorer

**Definition:** Planen delas vertikalt, från mål till mål, i fem längsgående korridorer.

SvFF:s modell utgår från planens bredd, straffområdets bredd och målområdets bredd. Det ger inte fem lika stora delar, utan fem taktiskt förankrade korridorer.

På en **105 × 68 m**-plan blir en användbar teknisk modell:

| Korridor | Placering | Ungefärlig bredd | Funktion |
|---|---|---|---|
| **Yttre vänster** | sidlinje till straffområdets ytterkant | ca 13,84 m | Bredd, 1v1, inlägg, pressfälla |
| **Inre vänster** | straffområdets kant till målområdets kant | ca 11 m | Halvyta, diagonal passning, cutback-läge |
| **Central korridor** | målområdets bredd förlängd över planen | ca 18,32 m | Genombrott, centralt försvar, GZ-skydd |
| **Inre höger** | målområdets kant till straffområdets kant | ca 11 m | Halvyta, tredje spelare, instick |
| **Yttre höger** | straffområdets ytterkant till sidlinje | ca 13,84 m | Bredd, inlägg, isolering |

**Anfallsprincip:** vara spelbara i alla korridorer, men inte stå platt. En spelare kan hålla yttre bredd, en kan ligga i inre korridor, en kan hota centralt.

**Försvarsprincip:** skydda minst **tre av fem korridorer** nära bollen. Gestriklands FF/SvFF-material anger uttryckligen "3 av 5 korridorer bemannas" i försvarsspelet.

---

## 2. Spelytor

**Definition:** Spelytor är ytorna mellan motståndarnas lagdelar. De beskriver planens djup, inte bredd.

| Spelyta | Placering | Huvudfråga | Spelarens uppgift |
|---|---|---|---|
| **Utgångsyta** | framför motståndarnas första presslinje | Kan vi starta kontrollerat? | skapa passningsvinkel, locka press, hitta första progression |
| **Spelyta 1** | mellan motståndarnas forwards och mittfält | Kan vi spela förbi första linjen? | bli rättvänd eller halvrättvänd, spela vidare framåt |
| **Spelyta 2** | mellan motståndarnas mittfält och backlinje | Kan vi hota deras sista linje? | ta emot rättvänd, kombinera, vända upp, spela instick |
| **Spelyta 3** | bakom motståndarnas backlinje | Kan vi komma bakom? | löp i djupled, attackera ytan bakom, avsluta eller cutback |

SvFF/Gestriklands-materialet formulerar speluppbyggnad som passningar **"genom motståndarnas lagdelar – spelyta för spelyta"** och prioriterar **"rättvänd i spelyta 2"**.

**Beslutsregel:** genom om vi kan, utanför om vi behöver, vänd hem om vi måste.

---

## 3. Assistytan / Assist zone

**Definition:** Assistytan är ytan där laget vill ha kontroll för att slå sista passningen före avslut. I försvarsspel är det ytan laget måste hindra motståndaren från att kontrollera.

**Operativ placering:**

- **Primärt:** inre korridor i sista tredjedelen, ofta nära eller inne i straffområdet, bredvid Golden zone.
- **Sekundärt:** yttre korridor nära straffområdet vid inläggslägen.

**Typiska aktioner från assistytan:**

- Cutback snett inåt bakåt
- Instick bakom backlinjen
- Låg passning mellan målvakt och backlinje
- Väggspel in i Golden zone
- Inlägg från yttre korridor

Gestriklands FF/SvFF-materialet anger i **"komma till avslut och göra mål"**: nå Gold Zone för avslut, nå Assist-yta, utmana backlinje, samt använda skott, instick, väggspel, kant/inlägg och cutback.

---

## 4. Golden Zone / Gold zone

**Definition:** Golden zone är den centrala ytan där laget helst vill avsluta och där laget defensivt måste förhindra avslut. SvFF använder "Gold zone" i sin pedagogiska modell.

**Praktisk avgränsning:**

Det finns ingen fast meterdefinition i SvFF-materialet som säger exakt "från punkt A till punkt B". För träning bör den därför operationaliseras enligt planens markeringar:

| Nivå | Placering | Användning |
|---|---|---|
| **Extended GZ** | central korridor inne i straffområdet | alla centrala avslutslägen |
| **Core GZ** | central yta från ungefär straffpunkten till målområdet/mållinjen | högsta prioritet för avslut, returer och inspel |
| **Defensive GZ** | samma yta, men sett från försvarande lag | markering, block, andra-boll, skydda mål |

FIFA:s träningsmaterial använder också "golden zone" defensivt: när bollen går brett ska ytterbackar trycka ut, medan övriga spelare i backlinjen ockuperar Golden zone.

---

## 5. Samlad teknisk modell

| Begrepp | Resurs | Aktivitet | Mål | Effekt |
|---|---|---|---|---|
| **Korridorer** | fem vertikala vägar | fyll rätt korridor i rätt skede | skapa bredd, stäng bredd | tydligare spelbredd och försvarsförflyttning |
| **Spelytor** | ytor mellan lagdelar | spela förbi en linje i taget | rättvänd spelare i nästa yta | bättre progression |
| **Assistytan** | sista-passningsyta | ta bollen till AY före avslut | cutback, instick, inlägg | bättre chansskapande |
| **Golden zone** | central avslutsyta | avsluta där, försvara där | skapa/förhindra centrala avslut | högre chansvärde framåt, lägre risk bakåt |

---

## Användning i kod och visualer

Denna spec är källan när vi:

- Ritar taktiska SVG-planvyer i `src/pages/MajSpelmodell.tsx` och blockspecifika visualer (`ForsvarPitch`, `OvergangAnfallPitch`, `AnfallsspelPitch`, `OvergangForsvarPitch`).
- Bygger gemensamma plankomponenter (`src/components/KorridorerDiagram.tsx`, `SpelytorDiagram.tsx`, `GoldenZoneDiagram.tsx`).
- Skriver spelarinstruktioner, träningsplaner och matchblad.
- Beslutar färgkodning (gult = principer/nyckelaktioner, rött = press/duell/hot, blått = egna löpningar/passningsvägar, grönt = plan/ytor/balans, vitt = text).

Korridorbredderna ovan utgår från **105 × 68 m**. Om en träning körs på 9-mannaplan eller mindre — skala proportionellt mot den aktuella planens straff- och målområde, inte mot bredden, för att bevara den taktiska logiken.
