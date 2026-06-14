import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, BookOpen } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { usePrintForm, Field, Area, Collapsible, PrintToolbarActions, labelCls, type PrintForm } from "@/lib/printForm";

const STORAGE_KEY = "gunnilse:matchblad:v1";

const FullPitch = ({ corridors = false }: { corridors?: boolean }) => (
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
    {corridors && (
      <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeDasharray="1.5,1.5">
        <line x1="13.6" y1="0" x2="13.6" y2="105" />
        <line x1="27.2" y1="0" x2="27.2" y2="105" />
        <line x1="40.8" y1="0" x2="40.8" y2="105" />
        <line x1="54.4" y1="0" x2="54.4" y2="105" />
      </g>
    )}
  </svg>
);

const HalfPitch = () => (
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

const DiagramArea = ({ variant = "full" }: { variant?: "full" | "half" | "corridors" }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const half = variant === "half";

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
        {variant === "half" ? <HalfPitch /> : <FullPitch corridors={variant === "corridors"} />}
      </div>
      <label className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-[#1e3a8a] text-white px-2.5 py-1.5 rounded text-[11px] font-bold cursor-pointer opacity-50 hover:opacity-100 transition-opacity print:hidden">
        <ImageIcon className="w-3.5 h-3.5" />
        Bild
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  );
};

type Section = {
  id: string;
  title: string;
  fields: [string, string, string][]; // key, label, placeholder
  diagram?: "full" | "half" | "corridors";
  accent?: string;
};

const SECTIONS: Section[] = [
  { id: "s1", title: "1. Fysisk aktivering", diagram: "full", fields: [["syfte", "Syfte & fokus", ""], ["instr", "Instruktioner", ""]] },
  { id: "s2", title: "2. Taktisk aktivering", diagram: "full", fields: [["syfte", "Syfte & fokus", ""], ["instr", "Instruktioner", ""]] },
  { id: "s3", title: "3. Vårt anfallsspel", diagram: "half", fields: [["a", "Speluppbyggnad / målvaktsutkast", ""], ["b", "Nycklar för att bryta linjer", ""]] },
  { id: "s4", title: "4. Vårt försvarsspel", diagram: "corridors", fields: [["a", "Pressnivå & triggers", ""], ["b", "Överflyttning & täckning", ""]] },
  { id: "s5", title: "5. Motståndarnas försvarsspel", diagram: "full", fields: [["a", "Pressbeteende / formation", ""], ["b", "Svagheter att utnyttja", ""]] },
  { id: "s6", title: "6. Motståndarnas anfallsspel", diagram: "full", fields: [["a", "Speluppbyggnad / uppspelspunkter", ""], ["b", "Hot i djupled & omställningar", ""]] },
];

const REMINDERS: { title: string; items: string[] }[] = [
  { title: "Standards", items: ["Fokusera på beteenden", "Acceptera inte dåligt beteende", "Positivt förstärk det vi vill se"] },
  { title: "Ledarskap", items: ["Relation → påverkan → process", "Tydlighet → följa upp → återkoppling", "Forming → performing"] },
  { title: "Principer anfall", items: ["Skydda mot kontring", "Spela in bollen", "Spela ut bollen", "Ta med den framåt", "Fyll på i/runt box"] },
  { title: "Försvar", items: ["Högt med triggers", "Principer är gällande"] },
  { title: "Vår identitet", items: ["Andrabollsspel", "Duellspel", "Aldrig mellan två spelare", "Felvända löpningar", "Spring alltid i djupled"] },
  { title: "Ytor", items: ["Korridorer", "Spelytor", "Assistytan & gyllene zonen"] },
  { title: "Essensen", items: ["Tid", "Yta", "Individuell skicklighet"] },
  { title: "Hindrar framgång", items: ["Bristande kunskap", "Fatigue"] },
];

const SectionCard = ({ form, section }: { form: PrintForm; section: Section }) => (
  <div className="border-2 border-gray-200 rounded-lg p-3 flex flex-col print:break-inside-avoid">
    <div className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wide uppercase mb-3">
      {section.title}
    </div>
    {section.fields.map(([k, lab, ph]) => (
      <div key={k} className="mb-2">
        <label className={labelCls}>{lab}</label>
        <Area form={form} k={`${section.id}:${k}`} placeholder={ph} />
      </div>
    ))}
    {section.diagram && <DiagramArea variant={section.diagram} />}
  </div>
);

const Matchblad = () => {
  const form = usePrintForm(STORAGE_KEY);

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 print:bg-white print:p-0">
      <div className="max-w-[1050px] mx-auto mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>
        <div className="flex items-center gap-2">
          <PrintToolbarActions form={form} clearLabel="Rensa blad" />
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#FFD700] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none">
        {/* Title */}
        <div className="bg-[#1e3a8a] text-white px-5 py-3 flex items-baseline justify-between">
          <h1 className="text-lg font-bold uppercase tracking-wide">Matchblad</h1>
          <span className="text-[#FFD700] text-xs font-semibold print:hidden">Sparas automatiskt</span>
        </div>

        {/* Essentials */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Datum</label>
              <Field form={form} k="datum" type="date" />
            </div>
            <div>
              <label className={labelCls}>Lag</label>
              <Field form={form} k="lag" placeholder="T.ex. Herr" />
            </div>
            <div>
              <label className={labelCls}>Motståndare</label>
              <Field form={form} k="motstandare" placeholder="Lagnamn…" />
            </div>
            <div>
              <label className={labelCls}>Avspark</label>
              <Field form={form} k="avspark" placeholder="15:00" />
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Frånvarande spelare</label>
            <Field form={form} k="franvaro" placeholder="Vilka saknas idag…" />
          </div>

          <Collapsible title="Mer — tävling, tider, arena">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
              {[
                ["tavling", "Tävling", "Serie / cup"],
                ["spelsystem", "Spelsystem", "T.ex. 4-3-3"],
                ["samling", "Samling", "13:00"],
                ["uppvarmning", "Uppvärmning", "14:15"],
                ["arena", "Arena / plats", "Spelplats…"],
                ["hb", "Hemma / borta", "H / B"],
              ].map(([k, lab, ph]) => (
                <div key={k}>
                  <label className={labelCls}>{lab}</label>
                  <Field form={form} k={k} placeholder={ph} />
                </div>
              ))}
            </div>
          </Collapsible>
        </div>

        {/* Sections — paginated 2 per print page */}
        <div className="p-4 grid md:grid-cols-2 gap-4">
          <SectionCard form={form} section={SECTIONS[0]} />
          <SectionCard form={form} section={SECTIONS[1]} />
        </div>
        <div className="print:break-before-page" />
        <div className="p-4 pt-0 print:pt-4 grid md:grid-cols-2 gap-4">
          <SectionCard form={form} section={SECTIONS[2]} />
          <SectionCard form={form} section={SECTIONS[3]} />
        </div>
        <div className="print:break-before-page" />
        <div className="p-4 pt-0 print:pt-4 grid md:grid-cols-2 gap-4">
          <SectionCard form={form} section={SECTIONS[4]} />
          <SectionCard form={form} section={SECTIONS[5]} />
          <div className="md:col-span-2 border-2 border-gray-200 rounded-lg p-3 print:break-inside-avoid">
            <div className="bg-[#ff8c00] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wide uppercase mb-3">
              Särskilda avvikelser hos motståndaren
            </div>
            <Area
              form={form}
              k="avvikelser"
              placeholder="Speciella spelmönster, nyckelspelare eller fasta situationer som sticker ut…"
            />
          </div>
        </div>

        {/* Static play-model reminders */}
        <div className="border-t border-gray-200">
          <Collapsible title="Spelmodell-påminnelser" icon={<BookOpen className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2 pb-2">
              {REMINDERS.map((box) => (
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

        <div className="bg-[#1e3a8a] text-white p-2.5 text-center text-sm italic">
          "Det är inte avvikelsen som ger nöjet, det är följsamheten"
        </div>
      </div>
    </div>
  );
};

export default Matchblad;
