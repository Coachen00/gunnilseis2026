import { useState, useEffect, useRef } from "react";

/**
 * Shared infrastructure for the print-tool pages (matchblad, motståndaranalys,
 * träningsplan): one localStorage-backed field bag + collapsibles that expand
 * for printing. Keeps every print form auto-saving and tightenable the same way.
 */

type FormData = Record<string, string>;

export type PrintForm = {
  get: (k: string) => string;
  set: (k: string, v: string) => void;
  clearAll: () => void;
  armed: boolean;
};

/** Expand every `.tp-collapsible` while printing, then restore prior state. */
export function usePrintExpand() {
  useEffect(() => {
    const all = () => Array.from(document.querySelectorAll<HTMLDetailsElement>("details.tp-collapsible"));
    const before = () => all().forEach((d) => ((d.dataset.prev = d.open ? "1" : "0"), (d.open = true)));
    const after = () => all().forEach((d) => (d.open = d.dataset.prev === "1"));
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
}

export function usePrintForm(storageKey: string): PrintForm {
  const [data, setData] = useState<FormData>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as FormData;
    } catch {
      /* ignore malformed storage */
    }
    return {};
  });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      /* storage full / unavailable — keep working in-memory */
    }
  }, [data, storageKey]);

  usePrintExpand();

  const get = (k: string) => data[k] ?? "";
  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const clearAll = () => {
    if (!armed) {
      setArmed(true);
      window.setTimeout(() => setArmed(false), 2500);
      return;
    }
    setData({});
    setArmed(false);
  };

  return { get, set, clearAll, armed };
}

export const labelCls = "block text-[11px] font-bold uppercase tracking-wide text-[#1e3a8a] mb-1";
const inputBase =
  "w-full bg-white border border-gray-300 rounded px-2.5 py-2 text-xs text-black placeholder:text-gray-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40";

export const Field = ({
  form,
  k,
  placeholder,
  type = "text",
}: {
  form: PrintForm;
  k: string;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={form.get(k)}
    onChange={(e) => form.set(k, e.target.value)}
    placeholder={placeholder}
    className={inputBase}
  />
);

export const Area = ({ form, k, placeholder }: { form: PrintForm; k: string; placeholder?: string }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const value = form.get(k);
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => form.set(k, e.target.value)}
      placeholder={placeholder}
      rows={2}
      className={inputBase + " resize-none leading-relaxed min-h-[44px] overflow-hidden"}
    />
  );
};

export const Collapsible = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => (
  <details className="tp-collapsible group" open={defaultOpen}>
    <summary className="flex items-center gap-2 cursor-pointer list-none select-none px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-[#1e3a8a] hover:bg-[#1e3a8a]/5 rounded-lg print:hidden">
      <span className="text-[#1e3a8a]/70 transition-transform group-open:rotate-90">▶</span>
      {icon}
      {title}
    </summary>
    <div className="px-1 pb-2 pt-1">{children}</div>
  </details>
);

/** Toolbar buttons shared by the print tools: "Rensa" (two-step) + "Skriv ut". */
export const PrintToolbarActions = ({ form, clearLabel = "Rensa" }: { form: PrintForm; clearLabel?: string }) => (
  <>
    <button
      onClick={form.clearAll}
      className={
        "flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold transition-colors " +
        (form.armed ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50")
      }
    >
      {form.armed ? "Bekräfta?" : clearLabel}
    </button>
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
    >
      Skriv ut
    </button>
  </>
);
