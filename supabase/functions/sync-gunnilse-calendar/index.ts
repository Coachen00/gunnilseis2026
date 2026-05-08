import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const MATCHES_URL = "https://www.svenskalag.se/gunnilseis-herr/matcher";
const SVENSKALAG_ORIGIN = "https://www.svenskalag.se";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

interface ParsedMatch {
  external_id: string;
  opponent: string;
  match_date: string;
  home_away: "home" | "away";
  competition: string | null;
  venue: string | null;
  our_score?: number;
  their_score?: number;
}

function decode(html: string): string {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

function stripTags(value: string): string {
  return decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function getCompetitionMap(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const filterRegex = /id="link-(\d+)"[^>]*class="sfilter[^>]*>[\s\S]*?<\/i>([^<]+)<\/a>/gi;
  for (const match of html.matchAll(filterRegex)) {
    map.set(match[1], stripTags(match[2]));
  }
  return map;
}

function swedishUtcOffset(year: number, month: number, day: number): "+01:00" | "+02:00" {
  if (month < 3 || month > 10) return "+01:00";
  if (month > 3 && month < 10) return "+02:00";

  const lastSunday = (monthIndex: number) => {
    const date = new Date(Date.UTC(year, monthIndex + 1, 0));
    return date.getUTCDate() - date.getUTCDay();
  };

  if (month === 3) return day >= lastSunday(2) ? "+02:00" : "+01:00";
  return day < lastSunday(9) ? "+02:00" : "+01:00";
}

function buildLocalIso(year: number, month: number, day: number, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const offset = swedishUtcOffset(year, month, day);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${offset}`;
}

function parseTeams(teams: string): { opponent: string; homeAway: "home" | "away" } | null {
  const parts = teams.split(/\s+[-–—]\s+/);
  if (parts.length < 2) return null;

  const home = parts[0].trim();
  const away = parts.slice(1).join(" - ").trim();
  const homeAway = /gunnilse is/i.test(home) ? "home" : "away";
  const opponent = (homeAway === "home" ? away : home)
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return opponent ? { opponent, homeAway } : null;
}

function parseScore(row: string, homeAway: "home" | "away"): { our_score?: number; their_score?: number } {
  const resultHtml = row.match(/<div class="schedule-result">([\s\S]*?)<\/div>/i)?.[1] ?? "";
  const result = stripTags(resultHtml);
  const score = result.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!score) return {};

  const left = Number(score[1]);
  const right = Number(score[2]);
  return homeAway === "home"
    ? { our_score: left, their_score: right }
    : { our_score: right, their_score: left };
}

function parseMatches(html: string): ParsedMatch[] {
  const competitions = getCompetitionMap(html);
  const parsed: ParsedMatch[] = [];
  const rowRegex = /<tr class="season month-item-(\d{4})(\d{1,2})" seasonId="(\d+)">([\s\S]*?)<\/tr>/gi;

  for (const rowMatch of html.matchAll(rowRegex)) {
    const year = Number(rowMatch[1]);
    const month = Number(rowMatch[2]);
    const seasonId = rowMatch[3];
    const row = rowMatch[4];
    const dateMatch = row.match(/<nobr>\s*[^<]*?\s+(\d{1,2})\s*<\/nobr>[\s\S]*?<span class="text-muted">(\d{1,2}:\d{2})<\/span>/i);
    const linkMatch = row.match(/<a href="([^"]+)" class="ListLink"[^>]*>([\s\S]*?)<\/a>/i);

    if (!dateMatch || !linkMatch) continue;

    const teams = stripTags(linkMatch[2]);
    const teamInfo = parseTeams(teams);
    if (!teamInfo) continue;

    const day = Number(dateMatch[1]);
    const match_date = buildLocalIso(year, month, day, dateMatch[2]);
    const venue = stripTags(row.match(/<span class="text-muted small">([\s\S]*?)<\/span>/i)?.[1] ?? "");
    const external_id = decode(linkMatch[1]);

    parsed.push({
      external_id,
      opponent: teamInfo.opponent,
      match_date,
      home_away: teamInfo.homeAway,
      competition: competitions.get(seasonId) ?? null,
      venue: venue || null,
      ...parseScore(row, teamInfo.homeAway),
    });
  }

  return parsed;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const res = await fetch(MATCHES_URL, {
      headers: { "User-Agent": "Mozilla/5.0 GunnilseTacticsBot" },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, error: `Matches fetch failed: ${res.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = parseMatches(await res.text());
    if (parsed.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: "No matches parsed", parsed_count: 0, source: MATCHES_URL }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existing } = await supabase
      .from("matches")
      .select("external_id, manual_override");

    const overridden = new Set(
      (existing ?? [])
        .filter((match: { manual_override?: boolean }) => match.manual_override)
        .map((match: { external_id?: string | null }) => match.external_id)
        .filter(Boolean) as string[]
    );

    const now = Date.now();
    const upserts = parsed
      .filter((match) => !overridden.has(match.external_id))
      .map((match) => ({
        ...match,
        status: new Date(match.match_date).getTime() < now ? "played" : "upcoming",
        source: "scraped",
        manual_override: false,
      }));

    const { error: upsertError, data: upserted } = await supabase
      .from("matches")
      .upsert(upserts, { onConflict: "external_id" })
      .select("id");

    if (upsertError) {
      return new Response(JSON.stringify({ ok: false, error: upsertError.message, parsed_count: parsed.length }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      source: MATCHES_URL,
      parsed_count: parsed.length,
      upserted_count: upserted?.length ?? 0,
      skipped_overrides: overridden.size,
      source_origin: SVENSKALAG_ORIGIN,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
