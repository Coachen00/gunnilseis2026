import { useState } from "react";
import { Loader2, MessageSquarePlus, Trash2, AlertCircle, Wifi } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import SectionReveal from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReflections, type Reflection } from "@/hooks/useReflections";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Samlade tankar — sista perioden.
 *
 * Tidigare statisk placeholder-sida. Nu:
 *   - Hämtar reflektioner från content_blocks (key = "match-reflections").
 *   - Realtime-uppdaterad: när tränaren skriver något syns det live för alla.
 *   - Optimistic UI vid spara/ta bort, rollback vid fel + toast.
 *   - Loading/error/empty-states tydligt synliga.
 *
 * Endast inloggade godkända användare ser editor-läget.
 */
const MatchReflektioner = () => {
  const { entries, isLoading, isError, addReflection, removeReflection } = useReflections();
  const { data: session } = useSession();
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const canEdit = Boolean(session) && profile?.approved === true;

  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (input: Omit<Reflection, "id" | "createdAt">) => {
    try {
      await addReflection.mutateAsync(input);
      toast({ title: "Reflektion sparad", description: input.title });
      setShowForm(false);
    } catch (err) {
      toast({
        title: "Kunde inte spara",
        description: err instanceof Error ? err.message : "Okänt fel",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string, title: string) => {
    try {
      await removeReflection.mutateAsync(id);
      toast({ title: "Borttagen", description: title });
    } catch (err) {
      toast({
        title: "Kunde inte ta bort",
        description: err instanceof Error ? err.message : "Okänt fel",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Match · Reflektion"
        title="Samlade tankar — sista perioden"
        description="Mönster, trender och insikter över flera matcher i rad. Skrivs av tränaren — synkas live till alla."
      />
      <div className="container pb-section space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Wifi className="h-3.5 w-3.5 text-zone-attack" aria-hidden="true" />
            <span>Live · uppdateras automatiskt när någon skriver</span>
          </div>
          {canEdit && (
            <Button
              type="button"
              size="sm"
              variant={showForm ? "outline" : "default"}
              onClick={() => setShowForm((v) => !v)}
              aria-expanded={showForm}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" aria-hidden="true" />
              {showForm ? "Avbryt" : "Ny reflektion"}
            </Button>
          )}
        </div>

        {showForm && canEdit && (
          <SectionReveal as="section" aria-label="Lägg till reflektion">
            <ReflectionForm onSubmit={handleAdd} pending={addReflection.isPending} />
          </SectionReveal>
        )}

        {isLoading && (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground inline-flex items-center gap-2" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Hämtar reflektioner…
          </div>
        )}

        {isError && !isLoading && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive inline-flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            Kunde inte ladda reflektioner. Försök igen senare.
          </div>
        )}

        {!isLoading && !isError && entries.length === 0 && (
          <SectionReveal as="section">
            <SectionHeader badge="Tomt" title="Inga reflektioner ännu" subtitle="Tränaren samlar reflektioner här när de finns att samla." />
            <div className="bg-card rounded-lg p-6 border border-dashed border-border text-sm text-muted-foreground">
              När minst en match är spelad och tränaren börjar notera mönster, dyker de upp här.
              {canEdit && " Tryck på \"Ny reflektion\" för att skriva den första."}
            </div>
          </SectionReveal>
        )}

        {!isLoading && entries.length > 0 && (
          <ul className="space-y-6">
            {entries.map((r) => (
              <li key={r.id}>
                <ReflectionCard reflection={r} canEdit={canEdit} onRemove={() => handleRemove(r.id, r.title)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

interface ReflectionFormProps {
  onSubmit: (input: Omit<Reflection, "id" | "createdAt">) => void;
  pending: boolean;
}

const BADGES = ["Mönster", "Trend", "Nästa steg", "Lärdom"] as const;

const ReflectionForm = ({ onSubmit, pending }: ReflectionFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [badge, setBadge] = useState<(typeof BADGES)[number]>("Mönster");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({
      matchId: "",
      badge,
      title: title.trim(),
      body: body.trim(),
    });
    setTitle("");
    setBody("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-5 space-y-4"
    >
      <fieldset className="space-y-2">
        <legend className="sr-only">Kategori</legend>
        <Label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Kategori
        </Label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kategori">
          {BADGES.map((b) => (
            <label
              key={b}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold transition focus-within:ring-2 focus-within:ring-ring",
                badge === b
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/50"
              )}
            >
              <input
                type="radio"
                name="badge"
                value={b}
                checked={badge === b}
                onChange={() => setBadge(b)}
                className="sr-only"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="reflection-title">Rubrik</Label>
        <Input
          id="reflection-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Vad upprepar sig?"
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reflection-body">Innehåll</Label>
        <Textarea
          id="reflection-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Bullet-points eller en kort text. Vad ska vi göra åt det?"
          rows={4}
          required
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          Spara
        </Button>
      </div>
    </form>
  );
};

interface ReflectionCardProps {
  reflection: Reflection;
  canEdit: boolean;
  onRemove: () => void;
}

const ReflectionCard = ({ reflection, canEdit, onRemove }: ReflectionCardProps) => {
  const optimistic = reflection.id.startsWith("optimistic-");
  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-5 transition",
        optimistic ? "border-accent/40 opacity-80" : "border-border"
      )}
      aria-busy={optimistic}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent">
            {reflection.badge}
          </span>
          <h3 className="mt-1 text-xl font-bold leading-tight text-foreground">
            {reflection.title}
          </h3>
        </div>
        {canEdit && !optimistic && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Ta bort reflektion: ${reflection.title}`}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {reflection.body}
      </p>
      <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {new Date(reflection.createdAt).toLocaleString("sv-SE")}
        {optimistic && " · sparar…"}
      </p>
    </article>
  );
};

export default MatchReflektioner;
