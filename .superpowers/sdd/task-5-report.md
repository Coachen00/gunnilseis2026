# Task 5 report

## Textassertions

RED kördes mot de ursprungliga PDF:erna. Minst ett krav föll per dokument:

- `gymmet.pdf`: FAIL för 48-72 timmar, RPE 7-9, sprint före kondition och stopp vid kvalitetstapp.
- `kost-bransle.pdf`: FAIL för protein 1,6-2,2 g/kg/dag, kolhydrat 3-8 g/kg/dag, under 2 procent kroppsmassaförlust, natrium per liter och återhämtning utan absolut 30-minutersgräns.
- `kost-for-motorn.pdf`: FAIL för samma fem kostassertions.

GREEN kördes efter regenerering med `pypdf` och reguljära uttryck:

- `gymmet.pdf`: PASS (4/4).
- `kost-bransle.pdf`: PASS (5/5).
- `kost-for-motorn.pdf`: PASS (5/5).

## Rendering och sidantal

Alla sidor renderades till PNG vid 120 dpi med Poppler `pdftoppm` från Codex primary runtime. Montage skapades temporärt för visuell kontroll.

- `gymmet.pdf`: 5 sidor, A4 landscape.
- `kost-bransle.pdf`: 4 sidor, A4 landscape.
- `kost-for-motorn.pdf`: 5 sidor, A4 landscape.

## Visuell kontroll

Samtliga 14 renderade sidor granskades i tre montage. Kontrollen omfattade klippning, överlapp, kontrast, typografisk hierarki, tabelläsbarhet, sidfot/sidnummer och källsidor. Inga layoutfel hittades. Källnamn och fullständiga URL:er är läsbara på respektive källsida. Temporära generator-, assertion- och renderingsfiler togs bort efter kontrollen.
