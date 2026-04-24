import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL =
  "https://raw.githubusercontent.com/Newbi00/matchplan-gunnilse/main/matchplan-standalone.html";
const BUCKET = "matchplan";
const OBJECT_PATH = "matchplan-lerum.html";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is an approved user
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: approved } = await userClient.rpc("is_approved_user");
    if (!approved) {
      return new Response(JSON.stringify({ error: "Not approved" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch latest from GitHub (cache-bust)
    const res = await fetch(`${SOURCE_URL}?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `GitHub fetch failed: ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const html = await res.text();
    const bytes = new TextEncoder().encode(html);

    // Upload to storage (service role bypasses RLS)
    const admin = createClient(supabaseUrl, serviceKey);
    const { error: upErr } = await admin.storage.from(BUCKET).upload(OBJECT_PATH, bytes, {
      contentType: "text/html; charset=utf-8",
      upsert: true,
      cacheControl: "60",
    });
    if (upErr) {
      return new Response(JSON.stringify({ error: upErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(OBJECT_PATH);
    return new Response(
      JSON.stringify({
        ok: true,
        size: bytes.length,
        url: pub.publicUrl,
        syncedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});