import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useRef } from "react";

const FootballPitchSVG = () => (
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wrapperRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (wrapperRef.current && ev.target?.result) {
        wrapperRef.current.innerHTML = "";
        const img = document.createElement("img");
        img.src = ev.target.result as string;
        img.className = "w-full h-full object-contain";
        wrapperRef.current.style.background = "transparent";
        wrapperRef.current.appendChild(img);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#f9fafb] border-2 border-dashed border-[#cbd5e1] min-h-[180px] flex flex-col items-center justify-center mt-auto rounded-md relative p-2.5">
      <div
        ref={wrapperRef}
        className="bg-[#4CAF50] overflow-hidden resize"
        style={{ width: half ? 200 : 140, height: half ? 154 : 216 }}
      >
        {half ? <HalfPitchWithCorridors /> : <FootballPitchSVG />}
      </div>
      <label className="absolute bottom-1.5 right-1.5 bg-[#1e3a8a] text-white px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer opacity-40 hover:opacity-100 transition-opacity print:hidden">
        📷 Välj bild
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  );
};

const EditableField = ({ placeholder, className = "", minHeight }: { placeholder?: string; className?: string; minHeight?: string }) => (
  <div
    contentEditable
    suppressContentEditableWarning
    data-placeholder={placeholder}
    className={`bg-[#fdfdfd] border border-dashed border-[#ccc] rounded p-2 text-xs leading-relaxed mb-2 outline-none focus:bg-[#f0f4ff] focus:border-[#1e3a8a] focus:shadow-[inset_0_0_5px_rgba(30,58,138,0.1)] empty:before:content-[attr(data-placeholder)] empty:before:text-[#999] empty:before:italic flex-grow ${className}`}
    style={{ minHeight: minHeight || "60px" }}
  />
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#f0f0f0] text-[#1e3a8a] px-2 py-1 font-bold text-xs my-1 rounded border-l-[3px] border-[#1e3a8a]">{children}</div>
);

const Motstandaranalys = () => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 print:bg-white print:p-0">
      {/* Top bar */}
      <div className="max-w-[1050px] mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            <Printer className="w-4 h-4" />
            Skriv ut
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#1e3a8a] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none text-[13px] text-[#333]">
        
        {/* Header top - dark blue */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#1e3a8a] p-3">
          {[
            { title: "Kontext", items: ["Bygg helhetsbild före detaljer", "Observera utan att skriva (10 min)", "Identifiera matchbild & energi"] },
            { title: "Struktur", items: ["Startformation & utgångsyta", "Struktur i anfall/försvar", "Formationers övergångar"] },
            { title: "Mönster", items: ["Upprepning är instruktion, ej slump", "Identifiera nav & överbelastningar", "Undvik tidig låsning (bias)"] },
            { title: "Konsekvens", items: ["Orsak → Handling → Mönster → Resultat", "Förstå halvleksjusteringar", "Dra slutsats & skapa lösning"] },
          ].map((box, i) => (
            <div key={i} className="flex-1 text-center p-2 bg-white/10 rounded-lg min-h-[100px] text-white">
              <h3 contentEditable suppressContentEditableWarning className="text-[15px] font-bold uppercase mb-1.5 text-[#FFD700] border-b-2 border-[#FFD700]/30 pb-1 outline-none">
                {box.title}
              </h3>
              <ul className="list-none text-xs text-left pl-1 leading-relaxed text-[#f8f9fa]">
                {box.items.map((item, j) => (
                  <li key={j} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Session info */}
        <div className="flex bg-[#f8f9fa] border-b-2 border-[#e5e5e5] p-3">
          <div className="grid grid-cols-4 gap-4 flex-1 text-xs">
            {[
              { label: "Motståndare", placeholder: "Lagnamn..." },
              { label: "Datum / Omgång", placeholder: "ÅÅÅÅ-MM-DD" },
              { label: "Vårt Lag", placeholder: "T.ex. U17 / Herr" },
              { label: "Analytiker", placeholder: "Ditt namn..." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <label className="font-bold uppercase text-[11px] mb-1 text-[#1e3a8a]">{item.label}</label>
                <div contentEditable suppressContentEditableWarning data-placeholder={item.placeholder}
                  className="bg-white text-black px-2 py-1 rounded min-h-[26px] border border-dashed border-[#ccc] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#999] empty:before:italic" />
              </div>
            ))}
          </div>
        </div>

        {/* Main content - page 1 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Steg 1 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#FFD700] text-[#1e3a8a] px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 1: Observera innan du analyserar</span>
              <span className="text-[11px] font-normal italic">Första 10 min. Skriv inget då.</span>
            </div>
            <SectionTitle>Matchbild, Tempo & Energi</SectionTitle>
            <EditableField placeholder="Vem styr? Är spelet direkt eller uppbyggande? Intentioner?" />
            <SectionTitle>Tydliga anfallsvägar</SectionTitle>
            <EditableField placeholder="Anfaller de via specifik sida? Centralt?" />
            <SectionTitle>Bollinnehav vs Omställning</SectionTitle>
            <EditableField placeholder="Vill motståndaren dominera bollen eller spelet utan boll?" />
          </div>

          {/* Steg 2 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#FFD700] text-[#1e3a8a] px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 2: Identifiera Struktur</span>
              <span className="text-[11px] font-normal italic">Formationer i rörelse.</span>
            </div>
            <SectionTitle>Startformation & Övergångar</SectionTitle>
            <EditableField placeholder="T.ex. 3-4-3 försvar -> 3-2-5 anfall." />
            <DiagramArea />
          </div>

          {/* Steg 3 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#FFD700] text-[#1e3a8a] px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 3: Spelets 3 Faser</span>
              <span className="text-[11px] font-normal italic">Hur tar de sig framåt?</span>
            </div>
            <SectionTitle>1. Uppbyggnadsfas</SectionTitle>
            <EditableField placeholder="Kort eller långt från målvakt? Struktur vid speluppbyggnad?" />
            <SectionTitle>2. Mellanfas</SectionTitle>
            <EditableField placeholder="Mittfältets rotationer? Hur skapar de bredd/djup? Vilka ytor attackeras?" />
            <SectionTitle>3. Slutfas</SectionTitle>
            <EditableField placeholder="Typ av löpningar (överlapp, diagonal)? Hur går de in i box (cross, cutback)?" />
          </div>

          {/* Steg 4 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#FFD700] text-[#1e3a8a] px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 4: Identifiera Mönster</span>
              <span className="text-[11px] font-normal italic">Vad upprepas?</span>
            </div>
            <SectionTitle>Nyckelspelare (Nav) & Överbelastning</SectionTitle>
            <EditableField placeholder="Vilka spelare går spelet genom? Vilka ytor överbelastas?" />
            <DiagramArea half />
          </div>
        </div>

        {/* Page break */}
        <div className="print:break-before-page print:mt-5" />

        {/* Main content - page 2 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Steg 5 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#eab308] text-black px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 5: Förstå Justeringar</span>
              <span className="text-[11px] font-normal italic">Andra halvlek (Problem → Justering)</span>
            </div>
            <SectionTitle>Förändrad Press/Försvar</SectionTitle>
            <EditableField placeholder="Står de högre/lägre? Ny formation?" />
            <SectionTitle>Förändrad Uppbyggnad/Anfall</SectionTitle>
            <EditableField placeholder="Började de slå längre? Byten som ändrade matchbild?" />
            <SectionTitle>Varför skedde förändringen?</SectionTitle>
            <EditableField placeholder="Vilket problem försökte de lösa? Vilken effekt fick det?" />
          </div>

          {/* Steg 6 */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[380px] flex flex-col">
            <div className="bg-[#22c55e] text-white px-2.5 py-1.5 font-bold text-sm rounded mb-3 tracking-wider uppercase flex justify-between">
              <span contentEditable suppressContentEditableWarning className="outline-none">STEG 6: Dra Slutsatser</span>
              <span className="text-[11px] font-normal italic">Analys blir beslutsunderlag</span>
            </div>
            <SectionTitle>Största Styrka</SectionTitle>
            <EditableField placeholder="Vad är motståndaren bäst på? Hur hotar de oss mest?" />
            <SectionTitle>Tydligaste Svaghet</SectionTitle>
            <EditableField placeholder="Var finns ytorna att såra dem? (Ex. i omställning, bakom ytterback)." />
            <SectionTitle>Våra Åtgärder / Gameplan</SectionTitle>
            <EditableField placeholder="Hur justerar vi nästa gång vi möts?" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FFD700] text-[#1e3a8a] py-2.5 px-5 text-center text-[13px] font-bold">
          Analysens grund: Observera helheten → Bryt ner mönster → Skapa handlingsalternativ.
        </div>
      </div>
    </div>
  );
};

export default Motstandaranalys;
