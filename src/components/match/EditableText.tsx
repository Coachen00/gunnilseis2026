import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Loader2, Pencil } from "lucide-react";

interface Props {
  matchId: string | undefined;
  sectionKey: string;
  fieldKey: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "search" | "tel" | "url";
}

type Status = "idle" | "typing" | "saving" | "saved" | "error";

export const MATCH_SECTION_SAVED_EVENT = "match-section:saved";

export type MatchSectionSavedDetail = {
  matchId: string;
  at: string;
};

export default function EditableText({
  matchId,
  sectionKey,
  fieldKey,
  placeholder,
  multiline = true,
  className,
  inputMode,
}: Props) {
  const [value, setValue] = useState("");
  const [savedValue, setSavedValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const debounceTimer = useRef<number | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!matchId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("match_sections")
        .select("content")
        .eq("match_id", matchId)
        .eq("section_key", sectionKey)
        .eq("field_key", fieldKey)
        .maybeSingle();
      if (cancelled) return;
      const content = data?.content ?? "";
      setValue(content);
      setSavedValue(content);
      setStatus("idle");
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, sectionKey, fieldKey]);

  const persist = useCallback(
    async (next: string) => {
      if (!matchId) return;
      setStatus("saving");
      const { error } = await supabase
        .from("match_sections")
        .upsert(
          { match_id: matchId, section_key: sectionKey, field_key: fieldKey, content: next },
          { onConflict: "match_id,section_key,field_key" }
        );
      if (error) {
        setStatus("error");
        return;
      }
      setSavedValue(next);
      setStatus("saved");
      window.dispatchEvent(
        new CustomEvent<MatchSectionSavedDetail>(MATCH_SECTION_SAVED_EVENT, {
          detail: { matchId, at: new Date().toISOString() },
        })
      );
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
      fadeTimer.current = window.setTimeout(() => {
        setStatus((s) => (s === "saved" ? "idle" : s));
      }, 1800);
    },
    [matchId, sectionKey, fieldKey]
  );

  useEffect(() => {
    if (!matchId) return;
    if (value === savedValue) return;
    setStatus("typing");
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      void persist(value);
    }, 600);
    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [value, savedValue, matchId, persist]);

  // Auto-retry när nätet kommer tillbaka
  useEffect(() => {
    if (status !== "error") return;
    function onOnline() {
      void persist(value);
    }
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [status, value, persist]);

  function handleFocus() {
    // På mobil: skrolla fältet i viewport ovanför sticky TopNav efter att tangentbordet kommit upp.
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    window.setTimeout(() => {
      fieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  }

  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
    onFocus: handleFocus,
    placeholder,
    disabled: !matchId,
    inputMode,
    className: cn(
      // Mobile-first: text-base (16px) hindrar iOS från att zoom-in vid focus.
      "w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-base md:text-sm",
      "placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      multiline ? "min-h-[88px]" : "min-h-[44px]",
      className
    ),
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          ref={(el) => {
            fieldRef.current = el;
          }}
          rows={3}
          {...sharedProps}
        />
      ) : (
        <input
          ref={(el) => {
            fieldRef.current = el;
          }}
          type="text"
          {...sharedProps}
        />
      )}
      <StatusIndicator status={status} onRetry={() => void persist(value)} />
    </div>
  );
}

function StatusIndicator({ status, onRetry }: { status: Status; onRetry: () => void }) {
  if (status === "idle") return null;
  return (
    <div
      className="mt-1 flex min-h-[16px] items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
      aria-live="polite"
    >
      {status === "typing" && (
        <>
          <Pencil className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Skriver…</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Sparar…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-3 w-3 text-primary" />
          <span className="text-primary">Sparat</span>
        </>
      )}
      {status === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded text-destructive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
        >
          <AlertCircle className="h-3 w-3" />
          Kunde inte spara — försök igen
        </button>
      )}
    </div>
  );
}
