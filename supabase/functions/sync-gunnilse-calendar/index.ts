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
  // Best-effort parse: svenskalag.se renders match rows that contain "Match" / opponent / date.
  // We extract anchor text patterns of form "Gunnilse IS - <opponent>" or "<opponent> - Gunnilse IS"
  const matches: ParsedMatch[] = [];
  const rowRegex = /<a[^>]*href="([^"]*\/aktivitet\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = rowRegex.exec(html)) !== null) {
    const href = m[1];
    const text = stripTags(m[2]);
    if (!text || seen.has(href)) continue;
    if (!/gunnilse/i.test(text) && !/match/i.test(text)) continue;
    seen.add(href);
    // Try to extract opponent
    let opponent = text.replace(/Gunnilse IS( Herr)?/i, "").replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
    if (!opponent) opponent = text.trim();
    // Try to extract date near the link
    const around = html.slice(Math.max(0, m.index - 600), m.index + 600);
    const dateMatch = around.match(/(\d{1,2})\s*(jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*\.?\s*(\d{4})?/i);
    let isoDate: string | null = null;
    if (dateMatch) {
      const monthMap: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11 };
      const day = parseInt(dateMatch[1], 10);
      const monthKey = dateMatch[2].toLowerCase().slice(0, 3) as keyof typeof monthMap;
      const month = monthMap[monthKey] ?? 0;
      const year = dateMatch[3] ? parseInt(dateMatch[3], 10) : new Date().getFullYear();
      const d = new Date(Date.UTC(year, month, day, 13, 0, 0));
      isoDate = d.toISOString();
    }
    matches.push({
      external_id: href,
      opponent: opponent || "Okänd motståndare",
      match_date: isoDate,
      home_away: /hemma/i.test(around) ? "home" : /borta/i.test(around) ? "away" : null,
      competition: null,
      venue: null,
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

    const res = await fetch(CALENDAR_URL, { headers: { "User-Agent": "Mozilla/5.0 GunnilseTacticsBot" } });
    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, error: `Calendar fetch failed: ${res.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const html = await res.text();
    const parsed = parseMatches(html);

    const now = Date.now();
    let upcomingFound: ParsedMatch | null = null;
    let lastPlayed: ParsedMatch | null = null;
    for (const p of parsed) {
      if (!p.match_date) continue;
      const t = new Date(p.match_date).getTime();
      if (t >= now && (!upcomingFound || t < new Date(upcomingFound.match_date!).getTime())) upcomingFound = p;
      if (t < now && (!lastPlayed || t > new Date(lastPlayed.match_date!).getTime())) lastPlayed = p;
    }

    const results: Record<string, unknown> = { parsed_count: parsed.length };

    async function upsert(p: ParsedMatch, status: "upcoming" | "played") {
      // Skip if a manual_override match with the same status exists
      const { data: existing } = await supabase
        .from("matches")
        .select("id, manual_override, external_id")
        .eq("status", status)
        .order("updated_at", { ascending: false })
        .limit(1);
      const current = existing?.[0];
      if (current?.manual_override && current.external_id !== p.external_id) {
        return { skipped: "manual_override", id: current.id };
      }
      const { data, error } = await supabase
        .from("matches")
        .upsert(
          {
            external_id: p.external_id,
            opponent: p.opponent,
            match_date: p.match_date,
            home_away: p.home_away,
            competition: p.competition,
            venue: p.venue,
            status,
            source: "scraped",
            manual_override: false,
          },
          { onConflict: "external_id" }
        )
        .select()
        .single();
      if (error) return { error: error.message };
      return { id: data.id };
    }

    if (upcomingFound) results.upcoming = await upsert(upcomingFound, "upcoming");
    if (lastPlayed) results.played = await upsert(lastPlayed, "played");

    return new Response(JSON.stringify({ ok: true, results }), {
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