import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL =
  "https://raw.githubusercontent.com/Newbi00/matchplan-gunnilse/main/matchplan-standalone.html";
const BUCKET = "matchplan";
const OBJECT_PATH = "matchplan-lerum.html";

const htmlHeaders = {
  ...corsHeaders,
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
};

const fetchLatestHtml = async () => {
  const res = await fetch(`${SOURCE_URL}?t=${Date.now()}`, {
    headers: { "Cache-Control": "no-cache" },
  });

  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status}`);
  }

  return await res.text();
};

const loadStoredHtml = async (supabaseUrl: string, serviceKey: string) => {
  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin.storage.from(BUCKET).download(OBJECT_PATH);

  if (error || !data) {
    return null;
  }

  return await data.text();
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (req.method === "GET" || req.method === "HEAD") {
      const storedHtml = await loadStoredHtml(supabaseUrl, serviceKey);
      const html = storedHtml ?? await fetchLatestHtml();

      return new Response(req.method === "HEAD" ? null : html, {
        status: 200,
        headers: htmlHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const html = await fetchLatestHtml();
    const blob = new Blob([html], { type: "text/html; charset=utf-8" });

    // Upload to storage (service role bypasses RLS)
    const admin = createClient(supabaseUrl, serviceKey);

    // Remove existing object first — Supabase Storage locks the original content-type
    // on upsert, so we must delete and re-create to refresh it.
    await admin.storage.from(BUCKET).remove([OBJECT_PATH]);

    const { error: upErr } = await admin.storage.from(BUCKET).upload(OBJECT_PATH, blob, {
      contentType: "text/html; charset=utf-8",
      upsert: false,
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
        size: blob.size,
        url: pub.publicUrl,
        viewUrl: `${supabaseUrl}/functions/v1/sync-matchplan`,
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