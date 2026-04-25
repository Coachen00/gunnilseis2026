-- content_blocks: generisk innehållstabell för icke-tekniska redaktörer.
-- Varje rad är en JSON-blob identifierad av en stabil text-nyckel
-- (t.ex. "identity", "principles"). Hämtas av frontend via useContent-hook
-- med fallback till hårdkodad data i src/data/* om raden saknas.

create table if not exists public.content_blocks (
  key         text primary key,
  data        jsonb not null,
  description text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

-- Touch updated_at on update.
create or replace function public.touch_content_blocks_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists touch_content_blocks_updated_at on public.content_blocks;
create trigger touch_content_blocks_updated_at
  before update on public.content_blocks
  for each row execute function public.touch_content_blocks_updated_at();

-- RLS: alla får läsa (förbereder framtida publik delning), endast godkända
-- användare får skriva.
alter table public.content_blocks enable row level security;

drop policy if exists "Public read content_blocks" on public.content_blocks;
create policy "Public read content_blocks"
  on public.content_blocks for select
  to anon, authenticated
  using (true);

drop policy if exists "Approved users write content_blocks" on public.content_blocks;
create policy "Approved users write content_blocks"
  on public.content_blocks for all
  to authenticated
  using (public.is_approved_user())
  with check (public.is_approved_user());

-- Seed: identitetsorden från src/data/identity.ts. Frontend faller tillbaka
-- till samma data om denna rad saknas, så det är säkert att seed:a eller låta bli.
insert into public.content_blocks (key, data, description) values (
  'identity',
  '[
    {
      "slug": "dueller",
      "title": "Dueller",
      "short": "Vi förlorar aldrig en kamp om bollen. I värsta fall blir det oavgjort.",
      "oneLiner": "Varje gång du och en motståndare båda vill ha bollen — du tar den, eller åtminstone ser till att hen inte heller får den.",
      "practice": [
        "Gå in med 100 % i varje närkamp — kropp först, boll sen.",
        "Vinn första duellen och var redo för andrabollen direkt.",
        "I värsta fall: oavgjort — bollen ut, eller fast spel — aldrig en lätt vinst för motståndaren.",
        "Stå rätt: kort steg, låg tyngdpunkt, sida mot motståndaren."
      ],
      "gVillkor": "Vinner ≥ 50 % av sina dueller, går aldrig undan.",
      "igVillkor": "Backar undan, släpper kropp eller tappar boll utan kamp."
    },
    {
      "slug": "andrabollsspel",
      "title": "Andrabollsspel",
      "short": "Bollen som studsar fritt och ingen äger — den tar vi. Alltid.",
      "oneLiner": "När en duell, ett huvudspel eller en räddning gör bollen ''herrelös'' — var snabbast på den.",
      "practice": [
        "Läs duellen innan den händer — ställ dig där bollen kommer studsa.",
        "Närmaste spelare attackerar, näst närmaste tätar runtom.",
        "Efter en lång boll eller hörnsituation: alla läser andrabollen — ingen står stilla.",
        "Vinst på andrabollen är start på vår omställning till anfall."
      ],
      "gVillkor": "Är först på minst hälften av andrabollarna i sitt område.",
      "igVillkor": "Står stilla, tittar på, eller springer åt fel håll."
    },
    {
      "slug": "djupled",
      "title": "Springa i djupled",
      "short": "Vi springer mot motståndarens mål så ofta vi kan — det skapar utrymme för alla.",
      "oneLiner": "En löpning bakom motståndarens backlinje är aldrig bortkastad — antingen får du bollen, eller så öppnar du en yta för en lagkamrat.",
      "practice": [
        "Yttrar och 9:a löper i djupled vid varje bollvinst.",
        "8:a och 7:a löper genom inre korridor när rättvänd spelare har bollen.",
        "Timing: starta löpningen samtidigt som passaren tittar upp — inte efter.",
        "Också om du inte får bollen — du har dragit en försvarare med dig och öppnat assistytan."
      ],
      "gVillkor": "Minst en djupledslöpning per anfallssekvens.",
      "igVillkor": "Stannar vid bollen och väntar — eller löper bara mot bollen."
    },
    {
      "slug": "felvant",
      "title": "Springa felvänt",
      "short": "När vi tappar bollen vänder vi direkt och jagar tillbaka — alla samtidigt.",
      "oneLiner": "Bollen är borta — du har två val: ge upp, eller spurta tillbaka och hjälpa till. Vi väljer alltid det andra.",
      "practice": [
        "Sekunden bollen tappas: vänd, sprinta, hitta din position igen.",
        "Närmaste spelare pressar boll, du återtar din zon i 4-3-3-formen.",
        "Forwarden är första försvarare — hen jagar bakåt om bollen går framåt.",
        "Den här löpningen är jobbigast i fotbollen — men avgör matcher."
      ],
      "gVillkor": "Sprintar tillbaka i full fart inom 1 sekund efter bollförlust.",
      "igVillkor": "Går tillbaka, klagar på passningen, eller stannar i offensiv position."
    },
    {
      "slug": "kommunicera",
      "title": "Kommunicera förstärkande",
      "short": "Vi peppar varandra. Korta, tydliga rop som hjälper laget — aldrig kritik.",
      "oneLiner": "Det du säger till en lagkamrat under matchen ska antingen ge information (''bakom dig!'') eller höja energin (''bra jobbat, kör vidare!'') — aldrig sänka.",
      "practice": [
        "Korta rop: ''ensam'', ''bakom dig'', ''tid'', ''press'', ''byt sida''.",
        "Pep efter misstag — ''kom igen, nästa gång'' — aldrig himla med ögonen.",
        "Kapten sätter tonen, alla följer.",
        "Säg namnet på den du pratar med — det går snabbare och tydligare."
      ],
      "gVillkor": "Hörs på planen, peppar lagkamrater, ger riktig information.",
      "igVillkor": "Tyst, kritisk eller frustrerad mot lagkamrater."
    }
  ]'::jsonb,
  'Identitetsord — fem beteenden i varje match. Visas på Hem och /identitet/<slug>.'
)
on conflict (key) do nothing;
