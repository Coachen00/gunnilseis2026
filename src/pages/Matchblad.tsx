import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useRef } from "react";

const FootballPitchSVG = ({ half = false }: { half?: boolean }) => {
  if (half) {
    return (
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
  }
  return (
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
};

const FootballPitchWithCorridors = () => (
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
    <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" strokeDasharray="1.5,1.5">
      <line x1="13.6" y1="0" x2="13.6" y2="105" />
      <line x1="27.2" y1="0" x2="27.2" y2="105" />
      <line x1="40.8" y1="0" x2="40.8" y2="105" />
      <line x1="54.4" y1="0" x2="54.4" y2="105" />
    </g>
  </svg>
);

const DiagramArea = ({ children, half = false, corridors = false }: { children?: React.ReactNode; half?: boolean; corridors?: boolean }) => {
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
        {corridors ? <FootballPitchWithCorridors /> : <FootballPitchSVG half={half} />}
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
    style={{ minHeight: minHeight || "70px" }}
  />
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FFD700] px-2 py-1 font-bold text-xs my-1 rounded">{children}</div>
);

const Matchblad = () => {
  const handlePrint = () => window.print();

  const headerBoxes = [
    {
      title: "Standards",
      items: ["• Fokusera på beteenden", "• Acceptera inte dåligt beteende", "• Positivt förstärk saker vi vill se"],
    },
    {
      title: "Ledarskap",
      items: ["1. Relation - påverkan - process", "2. Tydlighet - Följa upp - Återkoppling", "3. Forming - Performing"],
    },
    {
      title: "Principer i anfallsspel",
      items: ["• Överbelasta för att isolera 3vs2"],
      sub: { title: "Försvarsspel", items: ["• Högt med triggers", "• Principer är gällande"] },
    },
    {
      title: "Vår Identitet",
      items: ["• Andrabollsspel", "• Duellspel", "• Aldrig mellan två spelare", "• Felvända löpningar", "• Spring alltid i djupled"],
    },
  ];

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

      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#FFD700] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none text-[13px] text-[#333]">
        
        {/* Header top - yellow bar */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#FFD700] p-3">
          {headerBoxes.map((box, i) => (
            <div key={i} className="flex-1 text-center p-2 bg-white/20 rounded-lg min-h-[110px]">
              <h3 contentEditable suppressContentEditableWarning className="text-[15px] font-bold uppercase mb-1.5 text-[#1e3a8a] border-b-2 border-[#1e3a8a]/20 pb-1 outline-none">
                {box.title}
              </h3>
              <ul className="list-none text-xs text-left pl-1 leading-relaxed">
                {box.items.map((item, j) => (
                  <li key={j} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>
                ))}
              </ul>
              {box.sub && (
                <>
                  <h4 contentEditable suppressContentEditableWarning className="text-[13px] font-bold uppercase mt-2 mb-1 text-[#1e3a8a] outline-none">
                    {box.sub.title}
                  </h4>
                  <ul className="list-none text-xs text-left pl-1 leading-relaxed">
                    {box.sub.items.map((item, j) => (
                      <li key={j} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Session info - blue bar */}
        <div className="flex bg-[#1e3a8a] text-white p-3">
          <div className="grid grid-cols-4 gap-4 flex-1 text-xs">
            {[
              { label: "Lag", placeholder: "T.ex. Herr" },
              { label: "Tävling", placeholder: "T.ex. Serie/Cup" },
              { label: "Spelsystem", placeholder: "T.ex. 4-3-3" },
              { label: "Samling", placeholder: "13:00" },
              { label: "Datum", placeholder: "ÅÅÅÅ-MM-DD" },
              { label: "Matchstart", placeholder: "15:00" },
              { label: "Uppvärmning", placeholder: "14:15" },
              { label: "[Egen Rubrik]", editable: true },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <label className={`font-bold uppercase text-[11px] mb-1 text-[#FFD700] ${item.editable ? "border-b border-dashed border-[#FFD700]" : ""}`}
                  contentEditable={item.editable} suppressContentEditableWarning>
                  {item.label}
                </label>
                <div contentEditable suppressContentEditableWarning data-placeholder={item.placeholder}
                  className="bg-white/90 text-black px-2 py-1 rounded min-h-[26px] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#999] empty:before:italic" />
              </div>
            ))}
          </div>
        </div>

        {/* Frånvarande spelare */}
        <div className="flex items-center gap-4 bg-[#f8f9fa] border-b border-[#e5e5e5] px-4 py-2.5">
          <label className="font-bold text-[#1e3a8a] text-xs uppercase whitespace-nowrap w-[130px]">Frånvarande spelare</label>
          <div contentEditable suppressContentEditableWarning data-placeholder="Skriv vilka spelare som saknas här..."
            className="flex-1 bg-white border border-dashed border-[#ccc] rounded px-2.5 py-1.5 min-h-[30px] text-xs outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#999] empty:before:italic" />
        </div>

        {/* Dagens match */}
        <div className="flex items-center gap-4 bg-[#f8f9fa] border-b-2 border-[#e5e5e5] px-4 py-2.5">
          <label className="font-bold text-[#1e3a8a] text-xs uppercase whitespace-nowrap w-[130px]">Dagens Match</label>
          <div className="flex flex-1 gap-5">
            {[
              { label: "Motståndare:", placeholder: "Lagnamn..." },
              { label: "Arena/Plats:", placeholder: "Spelplats..." },
              { label: "Hemma/Borta:", placeholder: "H/B..." },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <span className="text-[11px] font-bold text-[#555] uppercase">{f.label}</span>
                <div contentEditable suppressContentEditableWarning data-placeholder={f.placeholder}
                  className="flex-1 bg-white border border-dashed border-[#ccc] rounded px-2.5 py-1.5 min-h-[30px] text-xs outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#999] empty:before:italic" />
              </div>
            ))}
          </div>
        </div>

        {/* Main content - page 1 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* 1. Fysisk aktivering */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              1. FYSISK AKTIVERING
            </div>
            <SectionTitle>Syfte & Fokus</SectionTitle>
            <EditableField minHeight="60px" />
            <SectionTitle>Instruktioner</SectionTitle>
            <EditableField />
            <DiagramArea />
          </div>

          {/* 2. Taktisk aktivering */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              2. TAKTISK AKTIVERING
            </div>
            <SectionTitle>Syfte & Fokus</SectionTitle>
            <EditableField minHeight="60px" />
            <SectionTitle>Instruktioner</SectionTitle>
            <EditableField />
            <DiagramArea />
          </div>
        </div>

        {/* Page break */}
        <div className="print:break-before-page print:mt-5" />

        {/* Main content - page 2 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* 3. Vårt anfallsspel */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              3. VÅRT ANFALLSSPEL
            </div>
            <SectionTitle>Speluppbyggnad / Målvaktsutkast</SectionTitle>
            <EditableField />
            <SectionTitle>Nycklar för att bryta linjer</SectionTitle>
            <EditableField />
            <DiagramArea half />
          </div>

          {/* 4. Vårt försvarsspel */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              4. VÅRT FÖRSVARSSPEL
            </div>
            <SectionTitle>Pressnivå & Triggers</SectionTitle>
            <EditableField />
            <SectionTitle>Överflyttning & Täckning</SectionTitle>
            <EditableField />
            <DiagramArea corridors />
          </div>
        </div>

        {/* Page break */}
        <div className="print:break-before-page print:mt-5" />

        {/* Main content - page 3 */}
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* 5. Motståndarnas försvarsspel */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              5. MOTSTÅNDARNAS FÖRSVARSSPEL
            </div>
            <SectionTitle>Pressbeteende / Formation</SectionTitle>
            <EditableField />
            <SectionTitle>Svagheter att utnyttja</SectionTitle>
            <EditableField />
            <DiagramArea />
          </div>

          {/* 6. Motståndarnas anfallsspel */}
          <div className="border-2 border-[#e5e5e5] rounded-lg p-3 min-h-[360px] flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#1e3a8a] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              6. MOTSTÅNDARNAS ANFALLSSPEL
            </div>
            <SectionTitle>Speluppbyggnad / Uppspelspunkter</SectionTitle>
            <EditableField />
            <SectionTitle>Hot i djupled & Omställningar</SectionTitle>
            <EditableField />
            <DiagramArea />
          </div>

          {/* Särskilda avvikelser - full width */}
          <div className="col-span-2 border-2 border-[#e5e5e5] rounded-lg p-3 flex flex-col">
            <div contentEditable suppressContentEditableWarning className="bg-[#ff8c00] text-white px-2.5 py-1.5 font-bold text-sm rounded text-center tracking-wider uppercase mb-3 outline-none">
              SÄRSKILDA AVVIKELSER HOS MOTSTÅNDAREN
            </div>
            <EditableField placeholder="Skriv ner viktiga avvikelser, speciella spelmönster, nyckelspelare eller fasta situationer som sticker ut..." minHeight="100px" />
          </div>
        </div>

        {/* Bottom panel - yellow */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#FFD700] p-3">
          {[
            { title: "Kunskap om Ytor", items: ["• Kunskap om korridorer", "• Spelytor", "• Assistytan och golden zone"] },
            { title: "Essensen", items: ["• Tid", "• Yta", "• Individuell skicklighet"] },
            { title: "Vad hindrar framgång", items: ["• Kunskap", "• Fatigue"] },
          ].map((box, i) => (
            <div key={i} className="flex-1 text-center p-2 bg-white/20 rounded-lg">
              <h3 contentEditable suppressContentEditableWarning className="text-[15px] font-bold uppercase mb-1.5 text-[#1e3a8a] border-b-2 border-[#1e3a8a]/20 pb-1 outline-none">
                {box.title}
              </h3>
              <ul className="list-none text-xs text-left pl-1 leading-relaxed">
                {box.items.map((item, j) => (
                  <li key={j} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#1e3a8a] text-white py-2.5 px-5 text-center text-[13px] italic">
          "Det är inte avvikelsen som ger nöjet det är följsamheten"
        </div>
      </div>
    </div>
  );
};

export default Matchblad;
