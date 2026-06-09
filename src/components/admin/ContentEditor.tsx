import { useEffect, useState } from "react";
import { Loader2, Save, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useContent, saveContent } from "@/hooks/useContent";
import { useToast } from "@/hooks/use-toast";

interface ContentEditorProps<T> {
  contentKey: string;
  label: string;
  description?: string;
  fallback: T;
}

/**
 * JSON-redigerare för en content_blocks-rad. Iteration 1 — textarea med
 * validering. Strukturerade formulär per innehållstyp kommer i nästa steg.
 */
export default function ContentEditor<T>({
  contentKey,
  label,
  description,
  fallback,
}: ContentEditorProps<T>) {
  const { data, source, loading, reload } = useContent<T>(contentKey, fallback);
  const [text, setText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      setText(JSON.stringify(data, null, 2));
    }
  }, [data, loading]);

  const handleChange = (value: string) => {
    setText(value);
    try {
      JSON.parse(value);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Ogiltig JSON");
    }
  };

  const handleSave = async () => {
    if (parseError) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(text);
      await saveContent(contentKey, parsed);
      toast({ title: "Sparat", description: `${label} uppdaterat.` });
      await reload();
    } catch (e) {
      toast({
        title: "Kunde inte spara",
        description: e instanceof Error ? e.message : "Okänt fel",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setText(JSON.stringify(data, null, 2));
    setParseError(null);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg text-foreground">{label}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <span
          className={
            source === "remote"
              ? "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700"
              : "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700"
          }
          title={
            source === "remote"
              ? "Innehåll laddat från Supabase"
              : "Migrationen content_blocks är inte applicerad — visar fallback från koden"
          }
        >
          {source === "remote" ? (
            <>
              <CheckCircle2 className="w-3 h-3" /> Live
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3" /> Fallback
            </>
          )}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Laddar…
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            spellCheck={false}
            aria-label={`JSON för ${label}`}
            className="w-full h-80 font-mono text-xs bg-background border border-border rounded-md p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          />
          {parseError && (
            <p className="text-xs text-destructive mt-2 font-mono">{parseError}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              disabled={!!parseError || saving || source === "fallback"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={source === "fallback" ? "Kör migrationen content_blocks i Supabase först" : undefined}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Spara
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Återställ
            </button>
          </div>
          {source === "fallback" && (
            <p className="text-xs text-amber-700/90 mt-3 leading-relaxed">
              Tabellen <code className="font-mono bg-muted px-1 rounded">content_blocks</code>{" "}
              hittas inte. Kör migrationen{" "}
              <code className="font-mono bg-muted px-1 rounded">
                supabase/migrations/20260425113804_content_blocks.sql
              </code>{" "}
              i Supabase Studio för att aktivera redigering.
            </p>
          )}
        </>
      )}
    </div>
  );
}
