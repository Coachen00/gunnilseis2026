import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useRef, useState, useCallback, useEffect } from "react";

interface PieceData {
  id: string;
  type: "home" | "away" | "ball" | "cone";
  num: number | string;
  x: number;
  y: number;
  name: string;
}

interface LinkData {
  id1: string;
  id2: string;
}

type DrawMode = "free" | "line" | "dashed" | "wave" | "rect" | "triangle";
type ZoomMode = "full" | "left" | "right";

const PITCH_W = 1100;
const PITCH_H = 700;

const formations: Record<string, { x: number; y: number }[]> = {
  "4-4-2": [
    { x: 50, y: 350 }, { x: 220, y: 80 }, { x: 200, y: 250 }, { x: 200, y: 450 }, { x: 220, y: 620 },
    { x: 450, y: 80 }, { x: 420, y: 250 }, { x: 420, y: 450 }, { x: 450, y: 620 },
    { x: 650, y: 280 }, { x: 650, y: 420 },
  ],
  "4-3-3": [
    { x: 50, y: 350 }, { x: 220, y: 80 }, { x: 200, y: 250 }, { x: 200, y: 450 }, { x: 220, y: 620 },
    { x: 400, y: 350 }, { x: 450, y: 180 }, { x: 450, y: 520 },
    { x: 750, y: 350 }, { x: 700, y: 100 }, { x: 700, y: 600 },
  ],
};

const initialPieces = (): PieceData[] => {
  const ps: PieceData[] = [];
  for (let i = 0; i < 11; i++) ps.push({ id: `home-${i}`, type: "home", num: i + 1, x: 50 + i * 40, y: -80, name: "Namn" });
  for (let i = 0; i < 11; i++) ps.push({ id: `away-${i}`, type: "away", num: i + 1, x: 50 + i * 40, y: 760, name: "Namn" });
  ps.push({ id: "ball-0", type: "ball", num: "⚽", x: 540, y: -80, name: "" });
  return ps;
};

const Taktiktavla = () => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);

  const [pieces, setPieces] = useState<PieceData[]>(initialPieces);
  const [playerLinks, setPlayerLinks] = useState<LinkData[]>([]);
  const [coneCount, setConeCount] = useState(0);

  // Drawing state
  const [drawingActive, setDrawingActive] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>("free");
  const [drawColor, setDrawColor] = useState("#ffeb3b");
  const [drawArrow, setDrawArrow] = useState(false);
  const [fillShape, setFillShape] = useState(false);

  // Link mode
  const [linkMode, setLinkMode] = useState(false);
  const linkStartRef = useRef<string | null>(null);

  // Zoom
  const [zoom, setZoom] = useState<ZoomMode>("full");
  const currentScaleRef = useRef(1);

  // Layers
  const [layers, setLayers] = useState({ korridorer: true, golden: false, spelytor: false, assistv: false });

  // Timeline
  const totalFrames = 10;
  const [frames, setFrames] = useState<(PieceData[] | null)[]>(new Array(totalFrames).fill(null));
  const [activeFrame, setActiveFrame] = useState(-1);

  // Drag state
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Drawing refs
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const getScale = () => {
    if (zoom === "full") return 1;
    return 1.6;
  };

  const getTransform = () => {
    if (zoom === "full") return "scale(1) translateX(0)";
    if (zoom === "left") return "scale(1.6) translateX(200px)";
    return "scale(1.6) translateX(-200px)";
  };

  // Piece drag handlers
  const handlePieceMouseDown = useCallback((e: React.MouseEvent, pieceId: string) => {
    if (drawingActive) return;

    if (linkMode) {
      if (!linkStartRef.current) {
        linkStartRef.current = pieceId;
      } else {
        if (linkStartRef.current !== pieceId) {
          setPlayerLinks(prev => [...prev, { id1: linkStartRef.current!, id2: pieceId }]);
        }
        linkStartRef.current = null;
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id: pieceId, offsetX: 0, offsetY: 0 };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current || !pitchRef.current) return;
      const rect = pitchRef.current.getBoundingClientRect();
      const scale = getScale();
      const x = (ev.clientX - rect.left) / scale - 17;
      const y = (ev.clientY - rect.top) / scale - 17;
      setPieces(prev => prev.map(p => p.id === dragRef.current!.id ? { ...p, x, y } : p));
    };

    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [drawingActive, linkMode, zoom]);

  // Formation
  const applyFormation = (team: "home" | "away", type: string) => {
    const coords = formations[type];
    if (!coords) return;
    setPieces(prev => {
      const updated = [...prev];
      const ball = updated.find(p => p.id === "ball-0");
      if (ball && ball.y < 0) { ball.x = 530; ball.y = 330; }
      let idx = 0;
      for (const p of updated) {
        if (p.type === team && idx < coords.length) {
          if (team === "home") {
            p.x = coords[idx].x;
            p.y = coords[idx].y - 17;
          } else {
            p.x = PITCH_W - coords[idx].x - 34;
            p.y = PITCH_H - coords[idx].y - 17;
          }
          idx++;
        }
      }
      return updated;
    });
  };

  const clearPlayers = () => {
    setPieces(prev => prev.map(p => {
      if (p.type === "home") {
        const i = parseInt(p.id.split("-")[1]);
        return { ...p, x: 50 + i * 40, y: -80 };
      }
      if (p.type === "away") {
        const i = parseInt(p.id.split("-")[1]);
        return { ...p, x: 50 + i * 40, y: 760 };
      }
      if (p.type === "ball") return { ...p, x: 540, y: -80 };
      return p;
    }));
  };

  const addCone = () => {
    const id = `cone-${coneCount}`;
    setConeCount(c => c + 1);
    setPieces(prev => [...prev, { id, type: "cone", num: "", x: 450 + Math.random() * 200, y: 20, name: "" }]);
  };

  // Drawing on canvas
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const drawShape = useCallback((context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, mode: DrawMode, color: string, fill: boolean, arrow: boolean) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.setLineDash(mode === "dashed" ? [12, 10] : []);

    if (mode === "line" || mode === "dashed") {
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    } else if (mode === "wave") {
      context.setLineDash([]);
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      context.save();
      context.translate(x1, y1);
      context.rotate(angle);
      context.moveTo(0, 0);
      for (let i = 0; i < len; i += 10) {
        const amp = (Math.floor(i / 10) % 2 === 0) ? 6 : -6;
        context.quadraticCurveTo(i + 5, amp * 2, i + 10, 0);
      }
      context.stroke();
      context.restore();
    } else if (mode === "rect") {
      context.rect(x1, y1, x2 - x1, y2 - y1);
    } else if (mode === "triangle") {
      context.moveTo(x1, y2);
      context.lineTo(x1 + (x2 - x1) / 2, y1);
      context.lineTo(x2, y2);
      context.closePath();
    }

    if (fill && (mode === "rect" || mode === "triangle")) {
      context.fillStyle = hexToRgba(color, 0.4);
      context.fill();
    }
    if (mode !== "wave") context.stroke();

    if (arrow && (mode === "line" || mode === "dashed" || mode === "wave")) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      context.save();
      context.fillStyle = color;
      context.translate(x2, y2);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-15, 7);
      context.lineTo(-15, -7);
      context.closePath();
      context.fill();
      context.restore();
    }
  }, []);

  const handlePitchMouseDown = useCallback((e: React.MouseEvent) => {
    if (!drawingActive) return;
    const target = e.target as HTMLElement;
    if (target.closest(".piece")) return;

    const rect = pitchRef.current!.getBoundingClientRect();
    const scale = getScale();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    isDrawingRef.current = true;
    startPosRef.current = { x, y };

    if (drawMode === "free") {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); }
    }
  }, [drawingActive, drawMode, zoom]);

  const handlePitchMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const rect = pitchRef.current!.getBoundingClientRect();
    const scale = getScale();
    const curX = (e.clientX - rect.left) / scale;
    const curY = (e.clientY - rect.top) / scale;

    if (drawMode === "free") {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.stroke();
      }
    } else {
      const tCtx = tempCanvasRef.current?.getContext("2d");
      if (tCtx) {
        tCtx.clearRect(0, 0, PITCH_W, PITCH_H);
        drawShape(tCtx, startPosRef.current.x, startPosRef.current.y, curX, curY, drawMode, drawColor, fillShape, drawArrow);
      }
    }
  }, [drawMode, drawColor, fillShape, drawArrow, drawShape, zoom]);

  const handlePitchMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const rect = pitchRef.current!.getBoundingClientRect();
    const scale = getScale();
    const endX = (e.clientX - rect.left) / scale;
    const endY = (e.clientY - rect.top) / scale;

    const ctx = canvasRef.current?.getContext("2d");
    if (drawMode === "free") {
      if (fillShape && ctx) {
        ctx.closePath();
        ctx.fillStyle = hexToRgba(drawColor, 0.4);
        ctx.fill();
      }
    } else {
      if (ctx) drawShape(ctx, startPosRef.current.x, startPosRef.current.y, endX, endY, drawMode, drawColor, fillShape, drawArrow);
      const tCtx = tempCanvasRef.current?.getContext("2d");
      if (tCtx) tCtx.clearRect(0, 0, PITCH_W, PITCH_H);
    }
  }, [drawMode, drawColor, fillShape, drawArrow, drawShape, zoom]);

  const clearCanvas = () => {
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, PITCH_W, PITCH_H);
    tempCanvasRef.current?.getContext("2d")?.clearRect(0, 0, PITCH_W, PITCH_H);
  };

  // Timeline
  const handleFrameClick = (idx: number) => {
    if (!frames[idx]) {
      // Save
      const state = pieces.map(p => ({ ...p }));
      setFrames(prev => { const n = [...prev]; n[idx] = state; return n; });
    } else {
      // Load
      setPieces(frames[idx]!.map(p => ({ ...p })));
    }
    setActiveFrame(idx);
  };

  const playMovie = async () => {
    for (let i = 0; i < totalFrames; i++) {
      if (frames[i]) {
        setPieces(frames[i]!.map(p => ({ ...p })));
        setActiveFrame(i);
        await new Promise(r => setTimeout(r, 1500));
      }
    }
    setActiveFrame(-1);
  };

  // Rename
  const handleRename = (id: string) => {
    const piece = pieces.find(p => p.id === id);
    const n = prompt("Ange nytt namn:", piece?.name || "");
    if (n !== null) setPieces(prev => prev.map(p => p.id === id ? { ...p, name: n } : p));
  };

  const toggleLayer = (key: keyof typeof layers) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const pieceClass = (type: string) => {
    if (type === "home") return "bg-red-600 text-white border-2 border-black";
    if (type === "away") return "bg-blue-600 text-white border-2 border-black";
    if (type === "ball") return "bg-white text-black border-2 border-black w-5 h-5";
    if (type === "cone") return "bg-orange-500 border-none w-5 h-5";
    return "";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center select-none overflow-x-hidden">
      {/* Top nav */}
      <div className="w-full bg-[#1a1a1a] border-b border-[#333] p-2 flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#FFD700] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till spelkarta
        </Link>
        <LogoutButton />
      </div>

      {/* Menu rows */}
      <div className="w-full bg-[#1a1a1a] border-b-2 border-[#333] flex flex-col items-center">
        {/* Row 1: Formations & view */}
        <div className="flex justify-center gap-2 flex-wrap p-2 border-b border-[#2a2a2a] w-full">
          <div className="flex items-center gap-1 border-r border-[#444] pr-3">
            <span className="text-[11px] font-bold text-red-500">RÖTT:</span>
            <button onClick={() => applyFormation("home", "4-4-2")} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">4-4-2</button>
            <button onClick={() => applyFormation("home", "4-3-3")} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">4-3-3</button>
          </div>
          <div className="flex items-center gap-1 border-r border-[#444] pr-3">
            <span className="text-[11px] font-bold text-blue-400">BLÅTT:</span>
            <button onClick={() => applyFormation("away", "4-4-2")} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">4-4-2</button>
            <button onClick={() => applyFormation("away", "4-3-3")} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">4-3-3</button>
          </div>
          <div className="flex items-center gap-1 border-r border-[#444] pr-3">
            <button onClick={clearPlayers} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">Bänka alla</button>
            <button onClick={addCone} className="px-2 py-1 bg-orange-500 text-black font-bold border border-[#555] rounded text-xs hover:bg-orange-400">+ Kon</button>
          </div>
          <div className="flex items-center gap-1 border-r border-[#444] pr-3">
            <select value={zoom} onChange={e => setZoom(e.target.value as ZoomMode)} className="bg-[#1e3a8a] text-white font-bold px-2 py-1 border border-[#555] rounded text-xs">
              <option value="full">Vy: Helplan</option>
              <option value="left">Vy: Sista tredjedel (V)</option>
              <option value="right">Vy: Sista tredjedel (H)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative group">
              <button className="bg-[#1e3a8a] font-bold px-2 py-1 border border-[#555] rounded text-xs">Planens Innehåll ▼</button>
              <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-[#2a2a2a] border border-[#555] rounded-md p-2 z-[300] min-w-[200px] shadow-xl">
                {([["korridorer", "Korridorer"], ["golden", "Golden Zone & Assistyta"], ["spelytor", "Spelytor (Zon 1-6)"], ["assistv", "Creation / Assist-V"]] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 py-1 text-xs cursor-pointer">
                    <input type="checkbox" checked={layers[key]} onChange={() => toggleLayer(key)} className="cursor-pointer" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Draw tools & links */}
        <div className="flex justify-center gap-2 flex-wrap p-2 border-b border-[#2a2a2a] w-full">
          <div className="flex items-center gap-1 border-r border-[#444] pr-3">
            <select value={drawMode} onChange={e => setDrawMode(e.target.value as DrawMode)} className="bg-[#333] text-white px-2 py-1 border border-[#555] rounded text-xs">
              <option value="free">Frihand</option>
              <option value="line">Rak Linje</option>
              <option value="dashed">Streckad Linje</option>
              <option value="wave">Vågig Linje</option>
              <option value="rect">Box / Rektangel</option>
              <option value="triangle">Triangel</option>
            </select>
            <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} className="w-7 h-7 border border-[#555] rounded cursor-pointer" />
            <label className="flex items-center gap-1 bg-[#333] px-2 py-1 border border-[#555] rounded text-xs">
              <input type="checkbox" checked={drawArrow} onChange={e => setDrawArrow(e.target.checked)} /> Pil
            </label>
            <label className="flex items-center gap-1 bg-[#333] px-2 py-1 border border-[#555] rounded text-xs">
              <input type="checkbox" checked={fillShape} onChange={e => setFillShape(e.target.checked)} /> Fyll
            </label>
            <button onClick={() => setDrawingActive(d => !d)} className={`px-2 py-1 border border-[#555] rounded text-xs font-bold ${drawingActive ? "bg-red-600 border-red-400" : "bg-[#333]"}`}>
              {drawingActive ? "Ritverktyg PÅ" : "Aktivera Ritverktyg"}
            </button>
            <button onClick={clearCanvas} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">Rensa Ritning</button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { setLinkMode(l => !l); linkStartRef.current = null; }} className={`px-2 py-1 border border-[#555] rounded text-xs font-bold ${linkMode ? "bg-red-600 border-red-400" : "bg-purple-700"}`}>
              Länka Spelare PÅ/AV
            </button>
            <button onClick={() => setPlayerLinks([])} className="px-2 py-1 bg-[#333] border border-[#555] rounded text-xs hover:bg-[#444]">Rensa Länkar</button>
          </div>
        </div>

        {/* Row 3: Timeline */}
        <div className="flex items-center gap-2 p-2 bg-[#111] w-full justify-center flex-wrap">
          <span className="text-xs font-bold text-gray-400">TIDSLINJE:</span>
          {Array.from({ length: totalFrames }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleFrameClick(i)}
              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                activeFrame === i ? "bg-orange-500 border-orange-300 text-black" :
                frames[i] ? "bg-green-700 border-green-500" :
                "bg-[#333] border-[#555]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={playMovie} className="bg-green-600 font-bold px-3 py-1 border border-[#555] rounded text-xs ml-2 hover:bg-green-500">▶ Spela Upp</button>
        </div>
      </div>

      {/* Pitch */}
      <div className="w-full overflow-hidden flex justify-center items-start pt-5 min-h-[800px]">
        <div style={{ transform: getTransform(), transition: "transform 0.6s ease-in-out", transformOrigin: "center center" }}>
          <div
            ref={pitchRef}
            className="relative"
            style={{
              width: PITCH_W,
              height: PITCH_H,
              background: `repeating-linear-gradient(to right, #4caf50, #4caf50 110px, #43a047 110px, #43a047 220px)`,
              border: "4px solid white",
              cursor: drawingActive ? "crosshair" : "default",
              overflow: "visible",
            }}
            onMouseDown={handlePitchMouseDown}
            onMouseMove={handlePitchMouseMove}
            onMouseUp={handlePitchMouseUp}
          >
            {/* Canvas layers */}
            <canvas ref={canvasRef} width={PITCH_W} height={PITCH_H} className="absolute top-0 left-0 z-[50] pointer-events-none" />
            <canvas ref={tempCanvasRef} width={PITCH_W} height={PITCH_H} className="absolute top-0 left-0 z-[51] pointer-events-none" />

            {/* SVG links */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[90]">
              {playerLinks.map((link, i) => {
                const p1 = pieces.find(p => p.id === link.id1);
                const p2 = pieces.find(p => p.id === link.id2);
                if (!p1 || !p2) return null;
                return <line key={i} x1={p1.x + 17} y1={p1.y + 17} x2={p2.x + 17} y2={p2.y + 17} stroke="white" strokeWidth={3} strokeDasharray="5,5" />;
              })}
            </svg>

            {/* Goals */}
            <div className="absolute border-[3px] border-white rounded-l-lg" style={{ width: 32, height: 120, left: -35, top: 290, background: "rgba(255,255,255,0.15)" }} />
            <div className="absolute border-[3px] border-white rounded-r-lg" style={{ width: 32, height: 120, right: -35, top: 290, background: "rgba(255,255,255,0.15)" }} />

            {/* Pitch lines */}
            <div className="absolute border-l-2 border-white/85 h-full" style={{ left: "50%" }} />
            <div className="absolute border-2 border-white/85 rounded-full" style={{ width: 180, height: 180, left: 460, top: 260 }} />
            <div className="absolute bg-white rounded-full" style={{ width: 6, height: 6, left: 547, top: 347 }} />
            <div className="absolute border-2 border-white/85" style={{ width: 165, height: 400, left: 0, top: 150, borderLeft: "none" }} />
            <div className="absolute border-2 border-white/85" style={{ width: 165, height: 400, right: 0, top: 150, borderRight: "none" }} />
            <div className="absolute border-2 border-white/85" style={{ width: 55, height: 180, left: 0, top: 260, borderLeft: "none" }} />
            <div className="absolute border-2 border-white/85" style={{ width: 55, height: 180, right: 0, top: 260, borderRight: "none" }} />

            {/* Korridorer layer */}
            {layers.korridorer && (
              <div className="absolute inset-0 pointer-events-none z-[5]">
                {[150, 260, 440, 550].map(top => (
                  <div key={top} className="absolute w-full border-t-2 border-dashed border-white/40" style={{ top }} />
                ))}
                {[{ top: 60, text: "Ytterkorridor" }, { top: 190, text: "Innerkorridor" }, { top: 335, text: "Central korridor" }, { top: 480, text: "Innerkorridor" }, { top: 600, text: "Ytterkorridor" }].map(c => (
                  <div key={c.top} className="absolute w-full text-center text-white/30 font-bold text-2xl pointer-events-none" style={{ top: c.top }}>{c.text}</div>
                ))}
              </div>
            )}

            {/* Spelytor layer */}
            {layers.spelytor && (
              <div className="absolute inset-0 pointer-events-none z-[2]">
                <div className="absolute flex items-center justify-center font-bold text-2xl text-white" style={{ background: "rgba(255,0,0,0.45)", left: 0, top: 150, width: 165, height: 400 }}>1</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(255,182,193,0.5)", left: 0, top: 0, width: 165, height: 150 }}>2</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(255,182,193,0.5)", left: 0, top: 550, width: 165, height: 150 }}>2</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-white" style={{ background: "rgba(30,144,255,0.45)", left: 165, top: 150, width: 385, height: 400 }}>3</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(173,216,230,0.5)", left: 165, top: 0, width: 385, height: 150 }}>4</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(173,216,230,0.5)", left: 165, top: 550, width: 385, height: 150 }}>4</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(50,205,50,0.45)", left: 550, top: 150, width: 385, height: 400 }}>5</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(144,238,144,0.5)", left: 550, top: 0, width: 385, height: 150 }}>6</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(144,238,144,0.5)", left: 550, top: 550, width: 385, height: 150 }}>6</div>
                <div className="absolute flex items-center justify-center font-bold text-2xl text-black" style={{ background: "rgba(144,238,144,0.5)", left: 935, top: 150, width: 165, height: 400 }}>6</div>
              </div>
            )}

            {/* Assist-V layer */}
            {layers.assistv && (
              <div className="absolute inset-0 pointer-events-none z-[3]">
                <svg width={PITCH_W} height={PITCH_H}>
                  <polygon points="550,0 935,150 935,550 550,700" fill="rgba(144,238,144,0.25)" stroke="#adff2f" strokeWidth={2} />
                  <text x={730} y={350} fill="rgba(255,255,255,0.8)" fontSize={28} fontWeight="bold" textAnchor="middle">CREATION (ASSISTS V)</text>
                </svg>
              </div>
            )}

            {/* Golden Zone layer */}
            {layers.golden && (
              <div className="absolute inset-0 pointer-events-none z-[4]">
                <div className="absolute border-2 border-dashed border-yellow-400 flex items-center justify-center text-yellow-400 font-bold text-sm text-center" style={{ left: 0, top: 260, width: 165, height: 180, background: "rgba(255,215,0,0.25)" }}>Golden<br />Zone</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ left: 0, top: 150, width: 165, height: 110, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ left: 0, top: 440, width: 165, height: 110, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ left: 165, top: 150, width: 85, height: 400, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
                <div className="absolute border-2 border-dashed border-yellow-400 flex items-center justify-center text-yellow-400 font-bold text-sm text-center" style={{ right: 0, top: 260, width: 165, height: 180, background: "rgba(255,215,0,0.25)" }}>Golden<br />Zone</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ right: 0, top: 150, width: 165, height: 110, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ right: 0, top: 440, width: 165, height: 110, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
                <div className="absolute border-2 border-dashed border-white/60 flex items-center justify-center text-white/70 font-bold text-sm" style={{ right: 165, top: 150, width: 85, height: 400, background: "rgba(255,255,255,0.15)" }}>Assistyta</div>
              </div>
            )}

            {/* Pieces */}
            {pieces.map(p => (
              <div
                key={p.id}
                className={`piece absolute rounded-full flex items-center justify-center font-bold cursor-grab z-[100] shadow-md text-xs ${pieceClass(p.type)} ${linkMode && linkStartRef.current === p.id ? "ring-2 ring-yellow-400 shadow-yellow-400/50" : ""}`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.type === "ball" || p.type === "cone" ? 20 : 34,
                  height: p.type === "ball" || p.type === "cone" ? 20 : 34,
                  clipPath: p.type === "cone" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                  borderRadius: p.type === "cone" ? 0 : undefined,
                  transition: dragRef.current?.id === p.id ? "none" : "left 0.8s cubic-bezier(0.25,1,0.5,1), top 0.8s cubic-bezier(0.25,1,0.5,1)",
                }}
                onMouseDown={e => handlePieceMouseDown(e, p.id)}
              >
                {p.type !== "cone" && <span className="pointer-events-none">{p.num}</span>}
                {p.type !== "cone" && p.type !== "ball" && (
                  <span
                    className="absolute -bottom-[18px] text-[11px] bg-black px-1 rounded whitespace-nowrap cursor-text"
                    onClick={e => { e.stopPropagation(); handleRename(p.id); }}
                  >
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taktiktavla;
