import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const CALENDAR_URL = "https://www.svenskalag.se/gunnilseis-herr/kalender";

interface ParsedMatch {
  external_id: string;
  opponent: string;
  match_date: string | null;
  home_away: "home" | "away" | null;
  competition: string | null;
  venue: string | null;
}

function decode(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseMatches(html: string): ParsedMatch[] {
  const matches: ParsedMatch[] = [];
  const rowMatches = Array.from(html.matchAll(/<a[^>]*href="([^"]*\/aktivitet\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi));
  const seen = new Set<string>();

  for (const m of rowMatches) {
    const href = m[1];
    const text = stripTags(m[2]);
    const matchIndex = m.index ?? 0;
    if (!text || seen.has(href)) continue;
    if (!/gunnilse/i.test(text) && !/match/i.test(text)) continue;
    seen.add(href);

    let opponent = text
      .replace(/Gunnilse IS( Herr)?/i, "")
      .replace(/[-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!opponent) opponent = text.trim();

    const around = html.slice(Math.max(0, matchIndex - 600), matchIndex + 600);
    const dateMatch = around.match(
      /(\d{1,2})\s*(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*\.?\s*(\d{4})?/i
    );
    let isoDate: string | null = null;
    let timeMatch: RegExpMatchArray | null = null;
    timeMatch = around.match(/(\d{1,2}):(\d{2})/);
    if (dateMatch) {
      const monthMap: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
      };
      const day = parseInt(dateMatch[1], 10);
      const monthKey = dateMatch[2].toLowerCase().slice(0, 3) as keyof typeof monthMap;
      const month = monthMap[monthKey] ?? 0;
      const year = dateMatch[3] ? parseInt(dateMatch[3], 10) : new Date().getFullYear();
      const hours = timeMatch ? parseInt(timeMatch[1], 10) : 13;
      const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
      const d = new Date(Date.UTC(year, month, day, hours - 2, minutes, 0));
      isoDate = d.toISOString();
    }

    // Hämta tävling och plats om de finns i närheten
    const compMatch = around.match(/Division\s+\d+[A-Z]?(?:\s+\w+)?/i);
    const venueMatch = around.match(/(?:Hjällbo|Stenkullen|Rydsbergsplan|Gunnilseplan|Partille|Ytterby)[^<\n]*/i);

    matches.push({
      external_id: href,
      opponent: opponent || "Okänd motståndare",
      match_date: isoDate,
      home_away: /hemma/i.test(around) ? "home" : /borta/i.test(around) ? "away" : null,
      competition: compMatch ? compMatch[0].trim() : null,
      venue: venueMatch ? venueMatch[0].trim() : null,
    });
  }
  return matches;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const res = await fetch(CALENDAR_URL, {
      headers: { "User-Agent": "Mozilla/5.0 GunnilseTacticsBot" },
    });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: `Calendar fetch failed: ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const html = await res.text();
    const parsed = parseMatches(html);

    if (parsed.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "No matches parsed", parsed_count: 0 }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hämta befintliga matcher för att respektera manual_override
    const { data: existing } = await supabase
      .from("matches")
      .select("id, external_id, manual_override");
    const overridden = new Set(
      (existing ?? [])
        .filter((m: { manual_override?: boolean }) => m.manual_override)
        .map((m: { external_id?: string | null }) => m.external_id)
        .filter(Boolean) as string[]
    );

    // Räkna ut status (upcoming/played) per match från datum
    const now = Date.now();
    const upserts = parsed
      .filter((p) => !overridden.has(p.external_id))
      .map((p) => {
        const t = p.match_date ? new Date(p.match_date).getTime() : null;
        const status: "upcoming" | "played" = t !== null && t < now ? "played" : "upcoming";
        return {
          external_id: p.external_id,
          opponent: p.opponent,
          match_date: p.match_date,
          home_away: p.home_away,
          competition: p.competition,
          venue: p.venue,
          status,
          source: "scraped",
          manual_override: false,
        };
      });

    const { error: upsertError, data: upserted } = await supabase
      .from("matches")
      .upsert(upserts, { onConflict: "external_id" })
      .select("id");

    if (upsertError) {
      return new Response(
        JSON.stringify({ ok: false, error: upsertError.message, parsed_count: parsed.length }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        parsed_count: parsed.length,
        upserted_count: upserted?.length ?? 0,
        skipped_overrides: overridden.size,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
