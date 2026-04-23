

## Mål
Skapa en **delad inloggning** för matchen mot Lerum så att så många som möjligt (spelare/föräldrar/ledare) kan komma in utan individuella konton eller manuellt godkännande.

## Rekommenderad lösning: Delat konto via "fejk"-mejl

Eftersom Supabase kräver e-post som identifierare, mappar vi användarnamnet till en e-postadress internt. Användaren skriver fortfarande `Lerum20260424` i fältet — vi lägger till `@gunnilse.local` bakom kulisserna innan vi skickar till Supabase.

**Inloggningsuppgifter (det användaren skriver):**
- Användarnamn: `Lerum20260424`
- Lösenord: `vikommeralltidförberedda`

**Vad sker bakom kulisserna:**
- E-post i Supabase: `lerum20260424@gunnilse.local`
- Kontot skapas en gång, förgodkänns (`approved = true`) direkt i databasen
- Alla som har uppgifterna kan logga in samtidigt på samma konto

## Steg

### 1. Skapa det delade kontot i backend
Migration som:
- Skapar användaren `lerum20260424@gunnilse.local` med lösenordet `vikommeralltidförberedda` direkt i `auth.users` (e-postverifierad, ingen bekräftelselänk behövs)
- Sätter `profiles.approved = true` för det kontot så det slipper admin-godkännande

### 2. Uppdatera `src/pages/Login.tsx`
- Byt etikett "E-post" → "Användarnamn"
- Ändra `<Input type="email">` → `<Input type="text">`
- Före `signInWithPassword`: om värdet inte innehåller `@`, lägg till `@gunnilse.local`
- Samma transform för signup-flödet (eller dölj signup-knappen helt — se fråga nedan)
- Uppdatera placeholder och hjälptexter till svenska användarnamnstermer

### 3. Inget behöver ändras i `AuthGuard` eller RLS
Det delade kontot är en vanlig godkänd användare — alla befintliga policys fungerar.

## Säkerhetsnotering (viktig att förmedla)
- Alla som loggar in på det delade kontot ser **samma data** och kan **redigera samma matchanteckningar** (eftersom RLS bygger på "godkänd användare", inte per person).
- Lösenordet sprids okontrollerat så fort det delas — vem som helst med uppgifterna kommer åt allt fram tills du byter lösenord eller raderar kontot.
- Eftersom kontot är förgodkänt syns det inte i admin-panelens "väntar"-lista, men det dyker upp i "godkända".

## Frågor innan jag bygger

1. **Signup-knappen "Ingen tillgång? Begär åtkomst"** på loginsidan — ska den vara kvar (för framtida personliga konton) eller döljas så det bara blir en ren delad inloggning?
2. **Giltighetstid** — ska kontot leva för evigt, eller vill du att jag ska göra det enkelt att inaktivera (t.ex. byta lösen) efter Lerum-matchen?

Säg till så kör jag — eller svara bara "kör som det är" så antar jag: signup kvar, kontot lever tills du själv tar bort det.

