import { useMatch } from "@/hooks/useMatch";
import { useLastSaved } from "@/hooks/useLastSaved";
import EditableText from "./EditableText";
import { RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  status: "upcoming" | "played";
}

function formatLastSaved(d: Date, now: Date): string {
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (diffMin < 1) return "just nu";
  if (diffMin < 60) return `för ${diffMin} ${diffMin === 1 ? "minut" : "minuter"} sedan`;
  const time = d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  if (dayDiff === 0) return `idag kl ${time}`;
  if (dayDiff === 1) return `igår kl ${time}`;
  return `${d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })} kl ${time}`;
}

export default function MatchHeader({ status }: Props) {
  const { match, loading, update, reload } = useMatch(status);
  const lastSaved = useLastSaved(match?.id);
  const [syncing, setSyncing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Tick var 30:e sekund så att relativ tid stannar fräsch.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  async function syncCalendar() {
    setSyncing(true);
    try {
      await supabase.functions.invoke("sync-gunnilse-calendar");
      await reload();
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return <div className="bg-card/85 rounded-lg p-6 border border-border h-32 animate-pulse" />;
  }

  return (
    <div className="bg-card/85 rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1">
            {status === "upcoming" ? "Veckans match" : "Förra matchen"}
          </p>
          <input
            type="text"
            value={match?.opponent ?? ""}
            onChange={(e) => update({ opponent: e.target.value })}
            placeholder="Motståndare"
            className="text-2xl md:text-3xl font-black bg-transparent border-0 border-b border-transparent hover:border-border focus:border-primary focus:outline-none w-full"
          />
        </div>
        <button
          type="button"
          onClick={syncCalendar}
          className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted/50 text-muted-foreground"
          title="Synka från Gunnilse-kalendern"
        >
          {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Synka kalender
        </button>
      </div>

      <div className="-mt-2 mb-3 text-xs text-muted-foreground" aria-live="polite">
        {lastSaved
          ? `Senast uppdaterad ${formatLastSaved(lastSaved, now)}`
          : "Inget sparat ännu"}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Datum</span>
          <input
            type="date"
            value={match?.match_date ? match.match_date.slice(0, 10) : ""}
            onChange={(e) => update({ match_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="bg-muted/40 border border-border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Hemma/Borta</span>
          <select
            value={match?.home_away ?? ""}
            onChange={(e) => update({ home_away: (e.target.value || null) as "home" | "away" | null })}
            className="bg-muted/40 border border-border rounded px-2 py-1"
          >
            <option value="">—</option>
            <option value="home">Hemma</option>
            <option value="away">Borta</option>
          </select>
        </label>
        {status === "played" ? (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Vi</span>
              <input
                type="number"
                value={match?.our_score ?? ""}
                onChange={(e) => update({ our_score: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="bg-muted/40 border border-border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Dom</span>
              <input
                type="number"
                value={match?.their_score ?? ""}
                onChange={(e) => update({ their_score: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="bg-muted/40 border border-border rounded px-2 py-1"
              />
            </label>
          </>
        ) : (
          <label className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Tävling/Plats</span>
            <input
              type="text"
              value={match?.competition ?? ""}
              onChange={(e) => update({ competition: e.target.value })}
              placeholder="t.ex. Div 4"
              className="bg-muted/40 border border-border rounded px-2 py-1"
            />
          </label>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Snabb summering</p>
        <EditableText
          matchId={match?.id}
          sectionKey="header"
          fieldKey="summary"
          placeholder={status === "upcoming" ? "Kort om motståndaren och vad vi vill göra…" : "Kort om hur det gick…"}
        />
      </div>
    </div>
  );
}