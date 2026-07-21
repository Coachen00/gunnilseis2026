import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Plus, Trash2, RotateCcw, BookOpen, ImagePlus, ExternalLink } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { getLatestTacticsImage, getTacticsImage, removeTacticsImage } from "@/lib/tacticsBoardStorage";

const STORAGE_KEY = "gunnilse:traningsplan:v1";

type PlanData = {
  id: string;
  fields: Record<string, string>;
  activities: string[];
};

const DEFAULT_ACTIVITIES = ["aktivering", "spelovning1", "spelovning2", "spel"];
const DEFAULT_FIELDS: Record<string, string> = {
  "aktivering:namn": "Aktivering",
  "spelovning1:namn": "Spelövning 1",
  "spelovning2:namn": "Spelövning 2",
  "spel:namn": "Spel",
};

function createPlanId() {
  return typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `plan-${Date.now()}`;
}

function loadPlan(): PlanData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        id: p.id ?? createPlanId(),
        fields: { ...DEFAULT_FIELDS, ...(p.fields ?? {}) },
        activities: Array.isArray(p.activities) && p.activities.length ? p.activities : [...DEFAULT_ACTIVITIES],
      };
    }
  } catch {
    /* ignore malformed storage */
  }
  return { id: createPlanId(), fields: { ...DEFAULT_FIELDS }, activities: [...DEFAULT_ACTIVITIES] };
}

function getTrainingLabel(fields: Record<string, string>) {
  const date = fields.datum;
  if (!date) return "Träningspass";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Träningspass";
  return `${new Intl.DateTimeFormat("sv-SE", { weekday: "long", day: "numeric", month: "numeric" }).format(parsed)} träning`;
}

const labelCls = "block text-[11px] font-bold uppercase tracking-wide text-[#1e3a8a] mb-1";
const inputCls =
  "w-full bg-white border border-gray-300 rounded px-2.5 py-2 text-xs text-black placeholder:text-gray-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 print:border-gray-300";
const areaCls = inputCls + " resize-none leading-relaxed min-h-[44px] overflow-hidden";

const AutoTextarea = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
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
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className={areaCls}
    />
  );
};

/* Collapsed-by-default section that auto-expands when printing */
const Collapsible = ({
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

const PitchSVG = ({ half = false }: { half?: boolean }) => (
  <svg viewBox={half ? "0 0 68 52.5" : "0 0 68 105"} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="white" strokeWidth="0.5" fill="none">
      <rect x="0" y="0" width="68" height={half ? 52.5 : 105} />
      {!half && <line x1="0" y1="52.5" x2="68" y2="52.5" />}
      <circle cx="34" cy="52.5" r="9.15" />
      <circle cx="34" cy="52.5" r="0.5" fill="white" />
      <rect x="13.84" y="0" width="40.32" height="16.5" />
      <rect x="24.84" y="0" width="18.32" height="5.5" />
      <circle cx="34" cy="11" r="0.5" fill="white" />
      <path d="M 26.68 16.5 A 9.15 9.15 0 0 0 41.32 16.5" />
      {!half && (
        <>
          <rect x="13.84" y="88.5" width="40.32" height="16.5" />
          <rect x="24.84" y="99.5" width="18.32" height="5.5" />
          <circle cx="34" cy="94" r="0.5" fill="white" />
          <path d="M 26.68 88.5 A 9.15 9.15 0 0 1 41.32 88.5" />
        </>
      )}
    </g>
  </svg>
);

/* Static play-model reminders — reference only, never an input surface */
const REMINDERS: { title: string; items: string[] }[] = [
  { title: "Standards", items: ["Fokusera på beteenden", "Acceptera inte dåligt beteende", "Positivt förstärk det vi vill se"] },
  { title: "Ledarskap", items: ["Relation → påverkan → process", "Tydlighet → följa upp → återkoppling", "Forming → performing"] },
  { title: "Principer anfall", items: ["Skydda mot kontring", "Spela in bollen", "Spela ut bollen", "Ta med den framåt", "Fyll på i/runt box"] },
  { title: "Försvar", items: ["Högt med triggers", "Principer är gällande"] },
  { title: "Vår identitet", items: ["Scanning", "Yta", "Prata med passningen", "Duellspel", "Andrabollsspel"] },
  { title: "Ytor", items: ["Korridorer", "Spelytor", "Assistytan & gyllene zonen"] },
  { title: "Essensen", items: ["Tid", "Yta", "Individuell skicklighet"] },
  { title: "Hindrar framgång", items: ["Bristande kunskap", "Fatigue"] },
];

const TrainingPlan = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanData>(loadPlan);
  const [armed, setArmed] = useState(false);
  const [imageStatus, setImageStatus] = useState("Spara en tavla i Taktiktavlan först.");
  const [latestBoardImage, setLatestBoardImage] = useState(() => {
    try {
      const image = getLatestTacticsImage();
      return image ? { image, savedAt: new Date().toISOString() } : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      /* storage full / unavailable — keep working in-memory */
    }
  }, [plan]);

  // Expand every collapsible while printing, then restore.
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

  const get = (k: string) => plan.fields[k] ?? "";
  const set = (k: string, v: string) => setPlan((p) => ({ ...p, fields: { ...p.fields, [k]: v } }));

  const importLatestBoard = () => {
    try {
      const image = getLatestTacticsImage();
      if (!image) {
        setImageStatus("Ingen sparad tavla hittades. Öppna Taktiktavlan och tryck Spara tavlan.");
        return;
      }
      const board = { image, savedAt: new Date().toISOString() };
      setLatestBoardImage(board);
      set("taktikbild", board.image);
      set("taktikbild_datum", board.savedAt);
      setImageStatus("Importerad till träningsplaneringen.");
    } catch {
      setLatestBoardImage(null);
      setImageStatus("Den sparade bilden kunde inte läsas. Spara tavlan igen.");
    }
  };

  const addActivity = () => setPlan((p) => ({ ...p, activities: [...p.activities, "a" + Date.now()] }));
  const removeActivity = (id: string) =>
    setPlan((p) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(p.fields)) if (!k.startsWith(id + ":")) next[k] = v;
      removeTacticsImage(`${p.id}:${id}`);
      return { fields: next, activities: p.activities.filter((x) => x !== id) };
    });

  const clearAll = () => {
    if (!armed) {
      setArmed(true);
      window.setTimeout(() => setArmed(false), 2500);
      return;
    }
    setPlan({ fields: { ...DEFAULT_FIELDS }, activities: [...DEFAULT_ACTIVITIES] });
    setArmed(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 print:bg-white print:p-0">
      {/* Toolbar — hidden in print */}
      <div className="max-w-[1050px] mx-auto mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till Coach
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className={
              "flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold transition-colors " +
              (armed ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50")
            }
          >
            <RotateCcw className="w-4 h-4" />
            {armed ? "Bekräfta?" : "Rensa pass"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Skriv ut
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#FFD700] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none">
        {/* Title */}
        <div className="bg-[#1e3a8a] text-white px-5 py-3 flex items-baseline justify-between">
          <h1 className="text-lg font-bold uppercase tracking-wide">Träningsplanering</h1>
          <span className="text-[#FFD700] text-xs font-semibold print:hidden">Sparas automatiskt</span>
        </div>

        {/* Matchlärdom och grov plan */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-4 rounded-xl border-2 border-[#1e3a8a]/15 bg-[#1e3a8a]/5 p-3">
            <p className={labelCls}>1 · Vad tar vi med oss från matchen?</p>
            <AutoTextarea value={get("match_larande")} onChange={(v) => set("match_larande", v)} placeholder="Vad såg vi? Vad behöver vi behålla, förstå eller förbättra till nästa match?" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Datum</label>
              <input type="date" value={get("datum")} onChange={(e) => set("datum", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Lag</label>
              <input value={get("lag")} onChange={(e) => set("lag", e.target.value)} placeholder="T.ex. U17" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tema</label>
              <input
                value={get("fokus")}
                onChange={(e) => set("fokus", e.target.value)}
                placeholder="T.ex. speluppbyggnad"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Passlängd</label>
              <input value={get("langd")} onChange={(e) => set("langd", e.target.value)} placeholder="90 min" className={inputCls} />
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className={labelCls}>2 · Grov översikt</p>
            <AutoTextarea value={get("oversikt")} onChange={(v) => set("oversikt", v)} placeholder="Vad ska träningen handla om? Vilket beteende ska synas i spel?" />
          </div>
          <div className="mt-3">
            <label className={labelCls}>Frånvarande spelare</label>
            <input
              value={get("franvaro")}
              onChange={(e) => set("franvaro", e.target.value)}
              placeholder="Vilka saknas idag…"
              className={inputCls}
            />
          </div>

          <Collapsible title="Mer — utrustning, nästa match, belastning">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
              {[
                ["utrustning", "Utrustning", "Bollar, västar…"],
                ["yta", "Total yta", "T.ex. 60×40 m"],
                ["belastning", "Belastning", "Låg / medel / hög"],
                ["uppvarmning", "Uppvärmning", "Kort notis…"],
                ["match_mot", "Nästa match — motståndare", "Lagnamn…"],
                ["match_tid", "Nästa match — tid", "Dag & tid…"],
                ["match_hb", "Hemma / borta", "H / B"],
              ].map(([k, lab, ph]) => (
                <div key={k}>
                  <label className={labelCls}>{lab}</label>
                  <input value={get(k)} onChange={(e) => set(k, e.target.value)} placeholder={ph} className={inputCls} />
                </div>
              ))}
            </div>
          </Collapsible>
        </div>

        <div className="border-b border-gray-200 bg-[#fffdf0] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className={labelCls}>Bild från Taktiktavlan</p><p className="text-xs text-gray-600">Spara en tavla där och importera den sedan direkt till den här planen.</p><p className="mt-1 text-xs font-semibold text-[#1e3a8a]">{imageStatus}</p></div>
            <div className="flex flex-wrap gap-2 print:hidden"><Link to="/taktiktavla" className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-xs font-bold text-[#1e3a8a]"><ExternalLink className="h-4 w-4" />Öppna Taktiktavlan</Link><button type="button" onClick={importLatestBoard} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1e3a8a] px-3 text-xs font-bold text-white"><ImagePlus className="h-4 w-4" />Importera senaste bild</button></div>
          </div>
          {(get("taktikbild") || latestBoardImage?.image) && <img src={get("taktikbild") || latestBoardImage?.image} alt="Importerad bild från Taktiktavlan" className="mt-3 max-h-[420px] w-full rounded-lg border border-gray-200 object-contain" />}
        </div>

        {/* Activities */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1e3a8a]">
              3 · Detaljplan <span className="text-gray-400 font-normal">({plan.activities.length} moment)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {plan.activities.map((id, i) => (
              <div key={id} className="border-2 border-gray-200 rounded-lg p-3 print:break-inside-avoid">
                {/* Card header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded bg-[#1e3a8a] text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <input
                    value={get(id + ":namn")}
                    onChange={(e) => set(id + ":namn", e.target.value)}
                    placeholder="Aktivitetens namn…"
                    className="flex-1 bg-transparent border-0 border-b border-gray-200 px-1 py-1 text-sm font-bold text-[#1e3a8a] focus:outline-none focus:border-[#1e3a8a]"
                  />
                  <input
                    value={get(id + ":tid")}
                    onChange={(e) => set(id + ":tid", e.target.value)}
                    placeholder="15 min"
                    className="w-20 text-center bg-[#FFD700]/30 border border-[#FFD700] rounded px-1 py-1 text-xs font-bold text-[#1e3a8a] placeholder:text-[#1e3a8a]/50 focus:outline-none"
                  />
                  <button
                    onClick={() => removeActivity(id)}
                    aria-label={`Ta bort aktivitet ${i + 1}`}
                    className="flex items-center justify-center w-8 h-8 shrink-0 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors print:hidden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body: description + pitch */}
                <div className="grid md:grid-cols-[1fr_150px] gap-3">
                  <div>
                    <label className={labelCls}>Beskrivning</label>
                    <AutoTextarea
                      value={get(id + ":beskrivning")}
                      onChange={(v) => set(id + ":beskrivning", v)}
                      placeholder="Vad gör spelarna? Yta, regler, mål med övningen…"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const contextId = `${plan.id}:${id}`;
                      const query = new URLSearchParams({ context: contextId, label: `${getTrainingLabel(plan.fields)} · ${get(id + ":namn") || `Moment ${i + 1}`}` });
                      navigate(`/taktiktavla?${query.toString()}`);
                    }}
                    className="group relative self-start overflow-hidden rounded border border-[#1e3a8a]/20 bg-[#4CAF50] text-left focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 print:pointer-events-none"
                    style={{ aspectRatio: "68/52.5" }}
                    aria-label={`Öppna taktiktavla för aktivitet ${i + 1}`}
                  >
                    {getTacticsImage(`${plan.id}:${id}`) ? (
                      <img src={getTacticsImage(`${plan.id}:${id}`) ?? undefined} alt="Senast sparade taktiktavla" className="h-full w-full object-cover" />
                    ) : (
                      <PitchSVG half />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-[#102b68]/90 px-2 py-1 text-center text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 print:hidden">
                      Öppna taktiktavla
                    </span>
                  </button>
                </div>

                {/* Collapsible load + coaching detail */}
                <Collapsible title="Belastning & coachning">
                  <div className="px-2 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        ["set", "Set / rep"],
                        ["arbete", "Arbete"],
                        ["vila", "Vila"],
                        ["intensitet", "Intensitet"],
                      ].map(([k, lab]) => (
                        <div key={k}>
                          <label className={labelCls}>{lab}</label>
                          <input value={get(id + ":" + k)} onChange={(e) => set(id + ":" + k, e.target.value)} className={inputCls} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={labelCls}>Tränarpunkter</label>
                      <AutoTextarea
                        value={get(id + ":coaching")}
                        onChange={(v) => set(id + ":coaching", v)}
                        placeholder="Vad coachar du på? Nyckelord…"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Progression</label>
                      <AutoTextarea
                        value={get(id + ":progression")}
                        onChange={(v) => set(id + ":progression", v)}
                        placeholder="Hur gör du övningen svårare / lättare?"
                      />
                    </div>
                  </div>
                </Collapsible>
              </div>
            ))}
          </div>

          <button
            onClick={addActivity}
            className="mt-4 flex items-center gap-2 px-4 h-11 rounded-lg border-2 border-dashed border-[#1e3a8a]/30 text-[#1e3a8a] text-sm font-bold hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]/50 transition-colors w-full justify-center print:hidden"
          >
            <Plus className="w-4 h-4" />
            Lägg till aktivitet
          </button>
        </div>

        {/* Play-model reminders — static reference */}
        <div className="border-t border-gray-200">
          <Collapsible title="Spelmodell-påminnelser" icon={<BookOpen className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2 pb-2">
              {REMINDERS.map((box) => (
                <div key={box.title} className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                  <h3 className="text-[11px] font-bold uppercase text-[#1e3a8a] border-b border-[#1e3a8a]/15 pb-1 mb-1.5">
                    {box.title}
                  </h3>
                  <ul className="text-[11px] text-gray-600 leading-relaxed list-disc pl-3.5 space-y-0.5">
                    {box.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Collapsible>
        </div>

        <div className="bg-[#1e3a8a] text-white p-2.5 text-center text-sm italic">
          "Det är inte avvikelsen som ger nöjet, det är följsamheten"
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan;
