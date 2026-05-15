# Mediabibliotek

Centralt arkiv där tränare laddar upp filmer (eller länkar från YouTube/Vimeo)
och taggar dem med kategori, datum och synlighet för spelare. Klippen visas
automatiskt på respektive spelmodell-sida.

## Användarflöde

1. Tränare loggar in (måste vara godkänd via `profiles.approved = true`).
2. Går till **Verktyg → Mediabibliotek** eller direkt **/media-bibliotek**.
3. Klickar **Nytt klipp**:
   - Skriver titel + kort beskrivning
   - Väljer kategori: Anfall · Försvar · Övergång till anfall · Övergång till försvar · Identitet · Fasta situationer
   - Väljer datum för händelsen och eventuellt match/träning-etikett
   - Väljer mediatyp (film/bild) och källa (extern länk eller filuppladdning)
   - Växlar **Synlig för spelare** för att exponera klippet på spelmodell-sidan
4. Sparar — klippet dyker upp i listan och, om synligheten är på, även på rätt sida.

Spelare som loggat in ser bara klipp där `visible_to_players = true`. Admins/godkända
tränare ser allt (inklusive utkast).

## Var i appen visas det?

| Kategori | Sida |
|---|---|
| `anfall` | `/anfall` (sektion längst ned) + `/spelide` via identitet-länk |
| `forsvar` | `/forsvar` (sektion längst ned) |
| `omstallning-anfall` | `/omstallning-anfall` (sektion längst ned) |
| `omstallning-forsvar` | `/omstallning-forsvar` (sektion längst ned) |
| `identitet` | `/identitet` + `/spelide` |
| `fasta` | `/fasta` (sektion längst ned) |
| _Alla_ | `/media-bibliotek` (manager) + `/admin` (snabbpanel) |

## Datamodell

Tabellen `public.media_library` (migration `20260515093328_media_library.sql`):

| Kolumn | Typ | Notes |
|---|---|---|
| `id` | uuid PK | |
| `title` | text NOT NULL | Max ~120 tecken i UI |
| `description` | text | Max ~800 tecken i UI |
| `category` | text NOT NULL | Check-lista — se ovan |
| `media_type` | text NOT NULL | `video` \| `image` |
| `source_kind` | text NOT NULL | `url` \| `upload` |
| `url` | text | Krävs om `source_kind='url'` |
| `storage_path` | text | Krävs om `source_kind='upload'` |
| `principle_id` | text | Frivillig djup-koppling till en princip |
| `block_id` | text | Frivillig djup-koppling till ett block |
| `match_id` | uuid → `matches.id` | Frivillig koppling till befintlig match |
| `training_label` | text | Frihandstext: "Tisdag 14 maj — 1 mot 1" |
| `event_date` | date | Datum för händelsen klippet visar |
| `visible_to_players` | boolean | Default false. Spelare ser bara om true |
| `created_by` / `updated_by` | uuid → `auth.users.id` | Auto via trigger |
| `created_at` / `updated_at` | timestamptz | Auto |

CHECK: en rad måste ha **antingen** `url` (när `source_kind='url'`) **eller** `storage_path` (när `source_kind='upload'`).

## RLS

- **SELECT** — alla auth-anv med `is_approved_user() = true` ser allt.
  Övriga authentication-användare ser bara `visible_to_players = true`.
- **INSERT/UPDATE/DELETE** — bara `is_approved_user()`.

## Storage

Återanvänder bucketen **`match-media`** (privat). Filer läggs i
prefixet `library/<category>/<timestamp>-<safe-namn>.<ext>` så befintliga
RLS-policys för bucketen täcker dem automatiskt.

Klient hämtar visnings-URL via `supabase.storage.from('match-media').createSignedUrl(path, 3600)`
i `MediaPreview`. Inga publika filer.

## Driftsättning mot live-Supabase

Migrationen körs av Supabase CLI eller via deras dashboard.

```bash
# Lokalt (i repots root)
supabase db push

# Eller från dashboard: SQL-editor → kör innehållet i
# supabase/migrations/20260515093328_media_library.sql
```

### Förkrav på live-Supabase som redan ska finnas

1. **`public.is_approved_user()`** — skapad av tidigare migrationer (kontrollera med `select public.is_approved_user();`).
2. **`public.touch_updated_at()`** — redan skapad av `principle_media`-migrationen.
3. **Storage-bucketen `match-media`** — redan finns. Privat med RLS som tillåter approved users.
4. **Tabellen `matches`** — redan finns.

Om migrationen inte är körd visar appen ett tydligt felmeddelande:
> "Tabellen media_library finns inte. Migrationen `supabase/migrations/20260515093328_media_library.sql` måste köras mot live-Supabase."

### Inga TypeScript-typer än

`src/integrations/supabase/types.ts` är auto-genererad och inkluderar inte
`media_library` än. Hooken `useMediaLibrary` använder `@ts-expect-error` på
alla `supabase.from('media_library')`-anrop tills typerna regenereras.

För att regenerera typerna:

```bash
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

(eller via Lovable-pipelinen).

## Filtyper och storlek

| Typ | Format |
|---|---|
| Video | MP4, MOV (QuickTime), WebM, MKV (Matroska), MPEG |
| Bild | PNG, JPG/JPEG, WebP, GIF, HEIC/HEIF |

Klientsidan cappar uppladdningar till **300 MB**. Justera `MEDIA_MAX_FILE_SIZE`
i `src/data/mediaLibrary.ts` om Supabase-bucketen har annan gräns.

## Felmeddelanden

`describeSupabaseError` översätter vanliga Postgres/Supabase-fel till svenska:
saknad tabell, RLS-block, payload too large, ogiltig JWT, bucket saknas. Visas
inline i formulär + som toast vid spara/upload.

## Vad är klart, vad återstår?

**Klart:**
- Migration + RLS + indexes + trigger
- Hook (`useMediaLibrary`) med CRUD + signed URLs + felöversättning
- UI: form, preview, manager-lista, spelar-grid
- Route `/media-bibliotek` + länk i Verktyg + sektion i Admin
- Integration på Anfall, Forsvar, Spelide, Identitet, Fasta, OmstallningAnfall, OmstallningForsvar

**Återstår för full deploy (måste göras mot live-Supabase):**
1. Kör migrationen `supabase/migrations/20260515093328_media_library.sql` mot live.
2. Regenerera `src/integrations/supabase/types.ts` så `@ts-expect-error` kan tas bort.
3. Verifiera att bucketen `match-media` finns och har skrivpolicy för approved users (redan på plats per tidigare migrationer).

Det är allt. Ingen ny bucket, inga nya RLS-funktioner, ingen ny edge function.
