import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, BookOpen } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { usePrintForm, Field, Area, Collapsible, PrintToolbarActions, labelCls, type PrintForm } from "@/lib/printForm";
import CoachTacticsAnimation from "@/components/coach/CoachTacticsAnimation";

const STORAGE_KEY = "gunnilse:motstandaranalys:v1";

const FullPitch = () => (
  <svg viewBox="0 0 68 105" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="white" strokeWidth="0.5" fill="none">
      <rect x="0" y="0" width="68" height="105" />
      <line x1="0" y1="52.5" x2="68" y2="52.5" />
      <circle cx="34" cy="52.5" r="9.15" />
      <circle cx="34" cy="52.5" r="0.5" fill="white" />
      <rect x="13.84" y="0" width="40.32" height="16.5" />
      <rect x="24.84" y="0" width="18.32" height="5.5" />
      <circle cx="34" cy="11" r="0.5" fill="white" />
      <path d="M 26.68 16.5 A 9.15 9.15 0 0 0 41.32 16.5" />
      <rect x="13.84" y="88.5" width="40.32" height="16.5" />
      <rect x="24.84" y="99.5" width="18.32" height="5.5" />
      <circle cx="34" cy="94" r="0.5" fill="white" />
      <path d="M 26.68 88.5 A 9.15 9.15 0 0 1 41.32 88.5" />
    </g>
  </svg>
);

const HalfPitchWithCorridors = () => (
  <svg viewBox="0 0 68 52.5" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="white" strokeWidth="0.5" fill="none">
      <rect x="0" y="0" width="68" height="52.5" />
      <circle cx="34" cy="52.5" r="9.15" />
      <circle cx="34" cy="52.5" r="0.5" fill="white" />
      <rect x="13.84" y="0" width="40.32" height="16.5" />
      <rect x="24.84" y="0" width="18.32" height="5.5" />
      <circle cx="34" cy="11" r="0.5" fill="white" />
      <path d="M 26.68 16.5 A 9.15 9.15 0 0 0 41.32 16.5" />
    </g>
    <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeDasharray="1.5,1.5">
      <line x1="13.6" y1="0" x2="13.6" y2="52.5" />
      <line x1="27.2" y1="0" x2="27.2" y2="52.5" />
      <line x1="40.8" y1="0" x2="40.8" y2="52.5" />
      <line x1="54.4" y1="0" x2="54.4" y2="52.5" />
    </g>
  </svg>
);

const DiagramArea = ({ half = false }: { half?: boolean }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wrapperRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (wrapperRef.current && ev.target?.result) {
        const img = document.createElement("img");
        img.src = ev.target.result as string;
        img.className = "w-full h-full object-contain";
        wrapperRef.current.style.background = "transparent";
        wrapperRef.current.replaceChildren(img);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#f9fafb] border-2 border-dashed border-[#cbd5e1] min-h-[160px] flex flex-col items-center justify-center mt-2 rounded-md relative p-2.5">
      <div ref={wrapperRef} className="bg-[#4CAF50] overflow-hidden resize" style={{ width: half ? 200 : 140, height: half ? 154 : 200 }}>
        {half ? <HalfPitchWithCorridors /> : <FullPitch />}
      </div>
      <label className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-[#1e3a8a] text-white px-2.5 py-1.5 rounded text-[11px] font-bold cursor-pointer opacity-50 hover:opacity-100 transition-opacity print:hidden">
        <ImageIcon className="w-3.5 h-3.5" />
        Bild
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  );
};

type Step = {
  id: string;
  title: string;
  note: string;
  bg: string;
  fg: string;
  fields: [string, string, string][];
  diagram?: "full" | "half";
};

const STEPS: Step[] = [
  {
    id: "steg1", title: "Steg 1 · Observera innan du analyserar", note: "Första 10 min – skriv inget då", bg: "#FFD700", fg: "#1e3a8a",
    fields: [
      ["a", "Matchbild, tempo & energi", "Vem styr? Direkt eller uppbyggande?"],
      ["b", "Tydliga anfallsvägar", "Via specifik sida? Centralt?"],
      ["c", "Bollinnehav vs omställning", "Vill de dominera bollen eller spelet utan boll?"],
    ],
  },
  {
    id: "steg2", title: "Steg 2 · Identifiera struktur", note: "Formationer i rörelse", bg: "#FFD700", fg: "#1e3a8a", diagram: "full",
    fields: [["a", "Startformation & övergångar", "T.ex. 3-4-3 försvar → 3-2-5 anfall"]],
  },
  {
    id: "steg3", title: "Steg 3 · Motståndarens anfallsfaser", note: "Hur tar de sig framåt?", bg: "#FFD700", fg: "#1e3a8a",
    fields: [
      ["a", "1. Uppbyggnadsfas", "Kort/långt från målvakt?"],
      ["b", "2. Mellanfas", "Mittfältsrotationer? Bredd/djup? Vilka ytor?"],
      ["c", "3. Slutfas", "Löpningstyp? Hur in i box (cross, cutback)?"],
    ],
  },
  {
    id: "steg4", title: "Steg 4 · Identifiera mönster", note: "Vad upprepas?", bg: "#FFD700", fg: "#1e3a8a", diagram: "half",
    fields: [["a", "Nyckelspelare (nav) & överbelastning", "Vilka går spelet genom? Vilka ytor överbelastas?"]],
  },
  {
    id: "steg5", title: "Steg 5 · Förstå justeringar", note: "Andra halvlek (problem → justering)", bg: "#eab308", fg: "#000000",
    fields: [
      ["a", "Förändrad press/försvar", "Högre/lägre? Ny formation?"],
      ["b", "Förändrad uppbyggnad/anfall", "Längre bollar? Avgörande byten?"],
      ["c", "Varför skedde förändringen?", "Vilket problem löstes? Vilken effekt?"],
    ],
  },
  {
    id: "steg6", title: "Steg 6 · Dra slutsatser", note: "Analys blir beslutsunderlag", bg: "#22c55e", fg: "#ffffff",
    fields: [
      ["a", "Största styrka", "Vad är de bäst på? Hur hotar de oss?"],
      ["b", "Tydligaste svaghet", "Var finns ytorna? (omställning, bakom ytterback)"],
      ["c", "Våra åtgärder / gameplan", "Hur justerar vi nästa möte?"],
    ],
  },
];

const PRINCIPLES: { title: string; items: string[] }[] = [
  { title: "Kontext", items: ["Bygg helhetsbild före detaljer", "Observera utan att skriva (10 min)", "Identifiera matchbild & energi"] },
  { title: "Struktur", items: ["Startformation & utgångsyta", "Struktur i anfall/försvar", "Formationers övergångar"] },
  { title: "Mönster", items: ["Upprepning är instruktion, ej slump", "Identifiera nav & överbelastningar", "Undvik tidig låsning (bias)"] },
  { title: "Konsekvens", items: ["Orsak → handling → mönster → resultat", "Förstå halvleksjusteringar", "Dra slutsats & skapa lösning"] },
];

const StepCard = ({ form, step }: { form: PrintForm; step: Step }) => (
  <div className="border-2 border-[#1e3a8a]/20 rounded-lg p-3 flex flex-col print:break-inside-avoid">
    <div className="px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wide uppercase flex justify-between items-center gap-2" style={{ background: step.bg, color: step.fg }}>
      <span>{step.title}</span>
      <span className="text-[11px] font-normal italic opacity-80 normal-case">{step.note}</span>
    </div>
    {step.fields.map(([k, lab, ph]) => (
      <div key={k} className="mb-2">
        <label className={labelCls}>{lab}</label>
        <Area form={form} k={`${step.id}:${k}`} placeholder={ph} />
      </div>
    ))}
    {step.diagram && <DiagramArea half={step.diagram === "half"} />}
  </div>
);

const Motstandaranalys = () => {
  const form = usePrintForm(STORAGE_KEY);

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 print:bg-white print:p-0">
      <div className="max-w-[1050px] mx-auto mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>
        <div className="flex items-center gap-2">
          <PrintToolbarActions form={form} clearLabel="Rensa analys" />
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto print:hidden">
        <CoachTacticsAnimation variant="motstandaranalys" />
      </div>

      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#1e3a8a] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none">
        {/* Title */}
        <div className="bg-[#1e3a8a] text-white px-5 py-3 flex items-baseline justify-between">
          <h1 className="text-lg font-bold uppercase tracking-wide">Motståndaranalys</h1>
          <span className="text-[#FFD700] text-xs font-semibold print:hidden">Sparas automatiskt</span>
        </div>

        {/* Essentials */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Motståndare</label>
              <Field form={form} k="motstandare" placeholder="Lagnamn…" />
            </div>
            <div>
              <label className={labelCls}>Datum / omgång</label>
              <Field form={form} k="datum" placeholder="ÅÅÅÅ-MM-DD" />
            </div>
            <div>
              <label className={labelCls}>Vårt lag</label>
              <Field form={form} k="lag" placeholder="T.ex. U17 / Herr" />
            </div>
            <div>
              <label className={labelCls}>Analytiker</label>
              <Field form={form} k="analytiker" placeholder="Ditt namn…" />
            </div>
          </div>
        </div>

        {/* Steps 1–4 */}
        <div className="p-4 grid md:grid-cols-2 gap-4">
          {STEPS.slice(0, 4).map((s) => (
            <StepCard key={s.id} form={form} step={s} />
          ))}
        </div>
        <div className="print:break-before-page" />
        {/* Steps 5–6 */}
        <div className="p-4 pt-0 print:pt-4 grid md:grid-cols-2 gap-4">
          {STEPS.slice(4).map((s) => (
            <StepCard key={s.id} form={form} step={s} />
          ))}
        </div>

        {/* Static analysis principles */}
        <div className="border-t border-gray-200">
          <Collapsible title="Analysprinciper" icon={<BookOpen className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2 pb-2">
              {PRINCIPLES.map((box) => (
                <div key={box.title} className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                  <h3 className="text-[11px] font-bold uppercase text-[#1e3a8a] border-b border-[#1e3a8a]/15 pb-1 mb-1.5">{box.title}</h3>
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

        <div className="bg-[#FFD700] text-[#1e3a8a] py-2.5 px-5 text-center text-[13px] font-bold">
          Analysens grund: observera helheten → bryt ner mönster → skapa handlingsalternativ
        </div>
      </div>
    </div>
  );
};

export default Motstandaranalys;
