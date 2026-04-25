import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";

interface Props {
  status: "upcoming" | "played";
  currentMatchId?: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Inget datum";
  try {
    return new Date(iso).toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function MatchPicker({ status, currentMatchId }: Props) {
  const { matches, loading, create } = useMatches(status);
  const [, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newOpponent, setNewOpponent] = useState("");
  const [creating, setCreating] = useState(false);

  const current = matches.find((m) => m.id === currentMatchId);
  const label = status === "upcoming" ? "Veckans match" : "Förra matchen";

  function pick(id: string | null) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id) next.set("match", id);
        else next.delete("match");
        return next;
      },
      { replace: true }
    );
    setOpen(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newOpponent.trim() || creating) return;
    setCreating(true);
    const m = await create(newOpponent.trim());
    setCreating(false);
    if (m) {
      pick(m.id);
      setNewOpponent("");
      setShowNewForm(false);
    }
  }

  if (loading) {
    return <div className="h-10 animate-pulse rounded-lg bg-muted/40" />;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm font-semibold hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
            {label}
          </span>
          <span className="font-black">
            {current
              ? `${current.opponent}${current.match_date ? " · " + formatDate(current.match_date) : ""}`
              : matches.length > 0
              ? "Välj match —"
              : "Ingen match ännu"}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[420px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {matches.length === 0 && !showNewForm && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                Ingen match i listan ännu.
              </p>
            )}

            {matches.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => pick(m.id)}
                className="flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/40"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{m.opponent || "— okänd motståndare —"}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(m.match_date)}
                    {m.competition ? ` · ${m.competition}` : ""}
                    {m.home_away ? ` · ${m.home_away === "home" ? "Hemma" : "Borta"}` : ""}
                  </span>
                </span>
                {m.id === currentMatchId && <Check className="h-4 w-4 flex-shrink-0 text-primary" />}
              </button>
            ))}

            {showNewForm ? (
              <form
                onSubmit={handleCreate}
                className="flex gap-2 border-t border-border bg-muted/30 p-2"
              >
                <input
                  type="text"
                  value={newOpponent}
                  onChange={(e) => setNewOpponent(e.target.value)}
                  placeholder="Motståndare"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={creating || !newOpponent.trim()}
                  className="rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground disabled:opacity-50"
                >
                  {creating ? "Skapar…" : "Skapa"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewForm(false);
                    setNewOpponent("");
                  }}
                  className="rounded border border-border px-2 py-1 text-xs"
                >
                  Avbryt
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="flex w-full items-center gap-2 border-t border-border bg-muted/30 px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-muted/50"
              >
                <Plus className="h-4 w-4" />
                Lägg till ny match
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
