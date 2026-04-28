import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const SQUAD_URL = "https://www.svenskalag.se/gunnilseis-herr/truppen";

type Position = "GK" | "DEF" | "MID" | "FWD" | "STAFF";

interface ParsedMember {
  external_id: string;
  name: string;
  position: Position;
  is_staff: boolean;
  staff_role: string | null;
  sort_order: number;
}

function decode(s: string): string {
  return s
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

function classifyPosition(sectionHeader: string): Position | null {
  const h = sectionHeader.toLowerCase();
  if (h.includes("målvakt")) return "GK";
  if (h.includes("back")) return "DEF";
  if (h.includes("mittfält")) return "MID";
  if (h.includes("forward") || h.includes("anfallare")) return "FWD";
  if (h.includes("ledare") || h.includes("tränare") || h.includes("stab")) return "STAFF";
  return null;
}

/**
 * Best-effort parse av svenskalag.se truppen-sida.
 * Sidan grupperar medlemmar i sektioner per position. Vi letar efter
 * sektionsrubriker (h2/h3) och samlar namn-länkarna under varje rubrik.
 */
function parseSquad(html: string): ParsedMember[] {
  const members: ParsedMember[] = [];
  let sortOrder = 0;

  // Hitta alla sektionsrubriker och deras position i HTML
  const headerMatches = Array.from(html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi));
  type HeaderMatch = { index: number; text: string; position: Position | null };
  const headers: HeaderMatch[] = headerMatches.map((mm) => ({
    index: mm.index ?? 0,
    text: stripTags(mm[1]),
    position: classifyPosition(stripTags(mm[1])),
  }));

  const memberLinkPattern = /<a[^>]*href="([^"]*\/medlem\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const seen = new Set<string>();

  for (let i = 0; i < headers.length; i++) {
    const cur = headers[i];
    if (!cur.position) continue;
    const sectionStart = cur.index;
    const sectionEnd = headers[i + 1]?.index ?? html.length;
    const sectionHtml = html.slice(sectionStart, sectionEnd);

    const linkMatches = Array.from(sectionHtml.matchAll(memberLinkPattern));
    for (const lm of linkMatches) {
      const href = lm[1];
      const text = stripTags(lm[2]);
      if (!text) continue;
      let name = text;
      let role: string | null = null;
      if (cur.position === "STAFF") {
        const split = text.split(/\s*-\s*|\s*–\s*/);
        if (split.length >= 2) {
          name = split[0].trim();
          role = split.slice(1).join(" - ").trim();
        }
      }
      const externalId = href;
      if (seen.has(externalId)) continue;
      seen.add(externalId);
      members.push({
        external_id: externalId,
        name,
        position: cur.position,
        is_staff: cur.position === "STAFF",
        staff_role: role,
        sort_order: sortOrder++,
      });
    }
  }

  return members;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const res = await fetch(SQUAD_URL, {
      headers: { "User-Agent": "Mozilla/5.0 GunnilseTacticsBot" },
    });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: `Squad fetch failed: ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const html = await res.text();
    const parsed = parseSquad(html);

    if (parsed.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "No members parsed from page", parsed_count: 0 }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert alla medlemmar
    // @ts-expect-error - players-tabellen finns inte i Supabase-typer förrän migration körs
    const { error: upsertError } = await supabase.from("players").upsert(
      parsed.map((p) => ({
        external_id: p.external_id,
        name: p.name,
        position: p.position,
        is_staff: p.is_staff,
        staff_role: p.staff_role,
        sort_order: p.sort_order,
        source: "scraped",
      })),
      { onConflict: "external_id" }
    );

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
        players: parsed.filter((p) => !p.is_staff).length,
        staff: parsed.filter((p) => p.is_staff).length,
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
