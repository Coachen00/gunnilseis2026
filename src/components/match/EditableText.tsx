import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

interface Props {
  matchId: string | undefined;
  sectionKey: string;
  fieldKey: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export default function EditableText({ matchId, sectionKey, fieldKey, placeholder, multiline = true, className }: Props) {
  const [value, setValue] = useState("");
  const [savedValue, setSavedValue] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<number | null>(null);

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
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, sectionKey, fieldKey]);

  useEffect(() => {
    if (!matchId) return;
    if (value === savedValue) return;
    if (timer.current) window.clearTimeout(timer.current);
    setStatus("saving");
    timer.current = window.setTimeout(async () => {
      const { error } = await supabase
        .from("match_sections")
        .upsert(
          { match_id: matchId, section_key: sectionKey, field_key: fieldKey, content: value },
          { onConflict: "match_id,section_key,field_key" }
        );
      if (!error) {
        setSavedValue(value);
        setStatus("saved");
        window.setTimeout(() => setStatus("idle"), 1200);
      } else {
        setStatus("idle");
      }
    }, 600);
  }, [value, savedValue, matchId, sectionKey, fieldKey]);

  const Tag = multiline ? "textarea" : "input";

  return (
    <div className="relative">
      <Tag
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement | HTMLTextAreaElement).value)}
        placeholder={placeholder}
        disabled={!matchId}
        rows={multiline ? 3 : undefined}
        className={cn(
          "w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30",
          className
        )}
      />
      <div className="absolute top-2 right-2 text-muted-foreground">
        {status === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
        {status === "saved" && <Check className="w-3 h-3 text-primary" />}
      </div>
    </div>
  );
}