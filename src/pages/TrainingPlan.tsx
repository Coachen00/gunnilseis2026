import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const TrainingPlan = () => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 print:bg-white print:p-0">
      {/* Top bar - hidden in print */}
      <div className="max-w-[1050px] mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Skriv ut
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Training plan container */}
      <div className="max-w-[1050px] mx-auto bg-white rounded-2xl border-[3px] border-[#FFD700] overflow-hidden shadow-lg print:border-none print:shadow-none print:rounded-none">
        
        {/* Header top - yellow bar */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#FFD700] p-3">
          {[
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
          ].map((box) => (
            <div key={box.title} className="flex-1 text-center p-2 bg-white/20 rounded-lg min-h-[110px]">
              <h3 className="text-[15px] font-bold uppercase text-[#1e3a8a] border-b-2 border-[#1e3a8a]/20 pb-1 mb-1.5">
                {box.title}
              </h3>
              <ul className="text-xs text-left pl-1 leading-relaxed">
                {box.items.map((item, i) => (
                  <li key={i} contentEditable suppressContentEditableWarning>{item}</li>
                ))}
              </ul>
              {box.sub && (
                <>
                  <h4 className="text-[13px] font-bold uppercase text-[#1e3a8a] mt-2 mb-1">{box.sub.title}</h4>
                  <ul className="text-xs text-left pl-1 leading-relaxed">
                    {box.sub.items.map((item, i) => (
                      <li key={i} contentEditable suppressContentEditableWarning>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Session info - blue bar */}
        <div className="bg-[#1e3a8a] text-white p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {[
              { label: "Lag", placeholder: "T.ex. U17" },
              { label: "Utrustning", placeholder: "Bollar, västar..." },
              { label: "Fokus/Tema", placeholder: "T.ex. Speluppbyggnad" },
              { label: "Tid", placeholder: "18:00" },
              { label: "Datum", placeholder: "ÅÅÅÅ-MM-DD" },
              { label: "Passets Tid", placeholder: "90 min" },
              { label: "Uppvärmning", placeholder: "" },
              { label: "[Egen Rubrik]", placeholder: "" },
              { label: "Total Yta", placeholder: "" },
              { label: "Belastning", placeholder: "" },
              { label: "Passets Längd", placeholder: "" },
              { label: "[Egen Rubrik]", placeholder: "" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <label className="font-bold uppercase text-[11px] mb-1 text-[#FFD700]">{item.label}</label>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder={item.placeholder}
                  className="bg-white/90 text-black px-2 py-1.5 rounded min-h-[26px] text-xs empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="flex items-center gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <label className="font-bold text-[#1e3a8a] text-xs uppercase whitespace-nowrap w-[130px]">Frånvarande spelare</label>
          <div
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Skriv vilka spelare som saknas här..."
            className="flex-1 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1.5 min-h-[30px] text-xs empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic focus:outline-none focus:bg-blue-50/30"
          />
        </div>

        {/* Next match */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-4 py-2.5 bg-gray-50 border-b-2 border-gray-200">
          <label className="font-bold text-[#1e3a8a] text-xs uppercase whitespace-nowrap w-[130px]">Nästa Match</label>
          <div className="flex flex-1 gap-5 flex-wrap">
            {[
              { label: "Motståndare:", placeholder: "Lagnamn..." },
              { label: "Tid:", placeholder: "Dag & tid..." },
              { label: "Hemma/Borta:", placeholder: "H/B..." },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 flex-1 min-w-[150px]">
                <span className="text-[11px] font-bold text-gray-500 uppercase">{f.label}</span>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder={f.placeholder}
                  className="flex-1 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1.5 min-h-[30px] text-xs empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic focus:outline-none focus:bg-blue-50/30"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Activities grid */}
        {[
          { activities: [1, 2] },
          { activities: [3, 4], pageBreak: true },
        ].map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.pageBreak && <div className="print:break-before-page" />}
            <div className="grid md:grid-cols-2 gap-4 p-4">
              {row.activities.map((num) => (
                <ActivityBox key={num} number={num} isFirst={num === 1} />
              ))}
            </div>
          </div>
        ))}

        {/* Bottom panel - yellow */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#FFD700] p-3">
          {[
            { title: "Kunskap om Ytor", items: ["• Kunskap om korridorer", "• Spelytor", "• Assistytan och gyllene zonen"] },
            { title: "Essensen", items: ["• Tid", "• Yta", "• Individuell skicklighet"] },
            { title: "Vad hindrar framgång", items: ["• Kunskap", "• Fatigue"] },
          ].map((box) => (
            <div key={box.title} className="flex-1 text-center p-2 bg-white/20 rounded-lg">
              <h3 className="text-[15px] font-bold uppercase text-[#1e3a8a] border-b-2 border-[#1e3a8a]/20 pb-1 mb-1.5">
                {box.title}
              </h3>
              <ul className="text-xs text-left pl-1 leading-relaxed">
                {box.items.map((item, i) => (
                  <li key={i} contentEditable suppressContentEditableWarning>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#1e3a8a] text-white p-2.5 text-center text-sm italic">
          "Det är inte avvikelsen som ger nöjet det är följsamheten"
        </div>
      </div>
    </div>
  );
};

/* Football pitch SVG for activity diagram areas */
const PitchSVG = ({ half = false }: { half?: boolean }) => (
  <svg viewBox={half ? "0 0 68 52.5" : "0 0 68 105"} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="white" strokeWidth="0.5" fill="none">
      <rect x="0" y="0" width="68" height={half ? 52.5 : 105} />
      {!half && <line x1="0" y1="52.5" x2="68" y2="52.5" />}
      <circle cx="34" cy={half ? 52.5 : 52.5} r="9.15" />
      <circle cx="34" cy={half ? 52.5 : 52.5} r="0.5" fill="white" />
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

const ActivityBox = ({ number, isFirst }: { number: number; isFirst?: boolean }) => (
  <div className="border-2 border-gray-200 rounded-lg p-3 min-h-[360px] bg-white">
    <div className="bg-[#1e3a8a] text-white py-1.5 px-2.5 font-bold text-sm rounded text-center tracking-wide mb-3" contentEditable suppressContentEditableWarning>
      AKTIVITET {number}
    </div>

    {isFirst ? (
      /* Activity 1 has a special two-column layout */
      <>
        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <div>
            <div className="bg-[#FFD700] px-2 py-1 font-bold text-xs rounded mb-1" contentEditable suppressContentEditableWarning>Fysisk Aktivering</div>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-2 min-h-[50px] text-xs" contentEditable suppressContentEditableWarning />
          </div>
          <div>
            <div className="bg-[#FFD700] px-2 py-1 font-bold text-xs rounded mb-1" contentEditable suppressContentEditableWarning>Uppvärmning med boll</div>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-2 min-h-[50px] text-xs" contentEditable suppressContentEditableWarning />
          </div>
        </div>
        <div className="bg-orange-500 text-white px-2 py-1 font-bold text-xs rounded text-center mb-1" contentEditable suppressContentEditableWarning>RST: 1x20m 0:30s</div>
        <div className="bg-[#FFD700] px-2 py-1 font-bold text-xs rounded text-center mb-2" contentEditable suppressContentEditableWarning>Kort-kort-lång</div>
      </>
    ) : (
      /* Activities 2-4 have tables */
      <>
        <table className="w-full border-collapse mb-2 text-xs">
          <thead><tr><th className="border border-gray-300 bg-gray-50 text-[#1e3a8a] font-bold p-1.5">Yta</th><th className="border border-gray-300 bg-gray-50 text-[#1e3a8a] font-bold p-1.5">Varaktighet</th></tr></thead>
          <tbody><tr><td className="border border-gray-300 p-1.5 h-[25px]" contentEditable suppressContentEditableWarning /><td className="border border-gray-300 p-1.5 h-[25px]" contentEditable suppressContentEditableWarning /></tr></tbody>
        </table>
        <table className="w-full border-collapse mb-2 text-xs">
          <thead><tr>{["Totalt", "Set/Rep", "Arbete", "Vila"].map(h => <th key={h} className="border border-gray-300 bg-gray-50 text-[#1e3a8a] font-bold p-1.5">{h}</th>)}</tr></thead>
          <tbody><tr>{[1,2,3,4].map(i => <td key={i} className="border border-gray-300 p-1.5 h-[25px]" contentEditable suppressContentEditableWarning />)}</tr></tbody>
        </table>
        {["Beskrivning", "Tränarpunkter", "Progression"].map((sec) => (
          <div key={sec}>
            <div className="bg-[#FFD700] px-2 py-1 font-bold text-xs rounded my-1">{sec}</div>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-2 min-h-[40px] text-xs mb-2 leading-relaxed" contentEditable suppressContentEditableWarning />
          </div>
        ))}
      </>
    )}

    {/* Diagram area with pitch */}
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md min-h-[180px] flex items-center justify-center mt-2 p-2.5">
      <div className="bg-[#4CAF50] rounded" style={{ width: number === 3 ? 200 : 140, height: number === 3 ? 154 : 216, overflow: "hidden", resize: "both" }}>
        <PitchSVG half={number === 3} />
      </div>
    </div>
  </div>
);

export default TrainingPlan;
