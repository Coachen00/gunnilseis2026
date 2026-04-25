import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  MATCH_SECTION_RELOAD_EVENT,
  type MatchSectionReloadDetail,
} from "./EditableText";
import type { MatchRow } from "@/hooks/useMatch";

type SectionRow = {
  section_key: string;
  field_key: string;
  content: string | null;
};

interface Props {
  match: MatchRow | null;
}

/**
 * Hämta-från-förra-matchen-knapp för MatchKommande. Letar upp den senaste
 * tidigare matchen (inte den aktuella) och fyller i tomma fält i nuvarande
 * matchplan med innehållet därifrån. Skriver aldrig över redan ifylld text.
 */
export default function LoadFromPreviousButton({ match }: Props) {
  const [busy, setBusy] = useState(false);

  async function findPreviousMatch(): Promise<MatchRow | null> {
    if (!match) return null;

    if (match.match_date) {
      const before = await supabase
        .from("matches")
        .select("*")
        .neq("id", match.id)
        .lt("match_date", match.match_date)
        .order("match_date", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      if (before.data) return before.data as MatchRow;
    }

    const fallback = await supabase
      .from("matches")
      .select("*")
      .neq("id", match.id)
      .order("match_date", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    return (fallback.data as MatchRow | null) ?? null;
  }

  async function handleClick() {
    if (!match || busy) return;
    setBusy(true);
    try {
      const source = await findPreviousMatch();
      if (!source) {
        toast({
          title: "Hittade ingen tidigare match",
          description: "Lägg till en match i historiken först.",
        });
        return;
      }

      const [{ data: sourceRows }, { data: targetRows }] = await Promise.all([
        supabase
          .from("match_sections")
          .select("section_key, field_key, content")
          .eq("match_id", source.id),
        supabase
          .from("match_sections")
          .select("section_key, field_key, content")
          .eq("match_id", match.id),
      ]);

      const filledKeys = new Set(
        ((targetRows as SectionRow[] | null) ?? [])
          .filter((r) => (r.content ?? "").trim().length > 0)
          .map((r) => `${r.section_key}::${r.field_key}`)
      );

      const candidates = ((sourceRows as SectionRow[] | null) ?? []).filter(
        (r) => (r.content ?? "").trim().length > 0
      );

      const toUpsert = candidates.filter(
        (r) => !filledKeys.has(`${r.section_key}::${r.field_key}`)
      );

      if (toUpsert.length === 0) {
        toast({
          title: "Inget att förfylla",
          description: filledKeys.size > 0
            ? "Alla sektioner är redan ifyllda."
            : `Förra matchen (${source.opponent}) har inga sparade kommentarer.`,
        });
        return;
      }

      const { error } = await supabase.from("match_sections").upsert(
        toUpsert.map((r) => ({
          match_id: match.id,
          section_key: r.section_key,
          field_key: r.field_key,
          content: r.content,
        })),
        { onConflict: "match_id,section_key,field_key" }
      );

      if (error) {
        toast({
          title: "Kunde inte hämta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      window.dispatchEvent(
        new CustomEvent<MatchSectionReloadDetail>(MATCH_SECTION_RELOAD_EVENT, {
          detail: { matchId: match.id },
        })
      );

      toast({
        title: `Förfyllde ${toUpsert.length} ${toUpsert.length === 1 ? "sektion" : "sektioner"}`,
        description: `Hämtade från ${source.opponent}. Befintlig text rördes inte.`,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!match || busy}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground hover:border-accent/40 hover:bg-accent/5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      title="Förfyll tomma sektioner med innehåll från förra matchen"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
      Hämta från förra matchen
    </button>
  );
}
