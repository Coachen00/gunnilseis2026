import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Team = "home" | "away" | "ball";

interface Piece {
  id: string;
  team: Team;
  label: string;
  x: number; // %
  y: number; // %
  name?: string;
}

type FormationKey = "4-3-3" | "3-4-3" | "4-2-1-3";

const FORMATION_META: Record<FormationKey, { label: string }> = {
  "4-3-3": { label: "Grundformation" },
  "3-4-3": { label: "Variant · hög press" },
  "4-2-1-3": { label: "Variant · matchgenomgång" },
};

// Positions are (x%, y%) where home attacks upward (y decreases)
// y=92 = own goal line area, y=8 = opponent goal line
const FORMATIONS: Record<FormationKey, { x: number; y: number; label: string }[]> = {
  "4-3-3": [
    { x: 50, y: 92, label: "MV" },
    { x: 18, y: 75, label: "VB" }, { x: 38, y: 78, label: "MIB" }, { x: 62, y: 78, label: "YIB" }, { x: 82, y: 75, label: "HB" },
    { x: 30, y: 55, label: "VM" }, { x: 50, y: 58, label: "CM" }, { x: 70, y: 55, label: "HM" },
    { x: 20, y: 30, label: "VY" }, { x: 50, y: 25, label: "CF" }, { x: 80, y: 30, label: "HY" },
  ],
  "3-4-3": [
    { x: 50, y: 92, label: "MV" },
    { x: 28, y: 78, label: "VIB" }, { x: 50, y: 80, label: "MIB" }, { x: 72, y: 78, label: "HIB" },
    { x: 12, y: 55, label: "VM" }, { x: 38, y: 58, label: "CM1" }, { x: 62, y: 58, label: "CM2" }, { x: 88, y: 55, label: "HM" },
    { x: 20, y: 30, label: "VY" }, { x: 50, y: 25, label: "CF" }, { x: 80, y: 30, label: "HY" },
  ],
  "4-2-1-3": [
    { x: 50, y: 92, label: "MV" },
    { x: 18, y: 75, label: "VB" }, { x: 38, y: 78, label: "MIB" }, { x: 62, y: 78, label: "YIB" }, { x: 82, y: 75, label: "HB" },
    { x: 38, y: 60, label: "DM1" }, { x: 62, y: 60, label: "DM2" },
    { x: 50, y: 42, label: "10" },
    { x: 20, y: 30, label: "VY" }, { x: 50, y: 25, label: "CF" }, { x: 80, y: 30, label: "HY" },
  ],
};

const buildPieces = (formation: FormationKey, withAway: boolean): Piece[] => {
  const home: Piece[] = FORMATIONS[formation].map((p, i) => ({
    id: `h-${i}`,
    team: "home",
    label: String(i + 1),
    x: p.x,
    y: p.y,
    name: p.label,
  }));
  // Mirror formation for opponents (4-3-3 default)
  const away: Piece[] = withAway
    ? FORMATIONS["4-3-3"].map((p, i) => ({
        id: `a-${i}`,
        team: "away",
        label: String(i + 1),
        x: p.x,
        y: 100 - p.y,
      }))
    : [];
  const ball: Piece = { id: "ball", team: "ball", label: "", x: 50, y: 50 };
  return [...home, ...away, ball];
};

const SimpleTacticsBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formation, setFormation] = useState<FormationKey>("4-3-3");
  const [showAway, setShowAway] = useState(true);
  const [showCorridors, setShowCorridors] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>(() => buildPieces("4-3-3", true));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const reset = useCallback(() => {
    setPieces(buildPieces(formation, showAway));
    setEditingId(null);
  }, [formation, showAway]);

  const changeFormation = (f: FormationKey) => {
    setFormation(f);
    setPieces(buildPieces(f, showAway));
  };

  const toggleAway = () => {
    const next = !showAway;
    setShowAway(next);
    setPieces(buildPieces(formation, next));
  };

  const clearNames = () => {
    setPieces((prev) => prev.map((p) => ({ ...p, name: undefined })));
  };

  const handleDrag = useCallback((id: string, info: { point: { x: number; y: number } }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    const cx = Math.max(2, Math.min(98, x));
    const cy = Math.max(2, Math.min(98, y));
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, x: cx, y: cy } : p)));
  }, []);

  const startRename = (p: Piece) => {
    if (p.team === "ball") return;
    setEditingId(p.id);
    setDraftName(p.name ?? "");
  };

  const commitRename = () => {
    if (!editingId) return;
    setPieces((prev) => prev.map((p) => (p.id === editingId ? { ...p, name: draftName.trim() || undefined } : p)));
    setEditingId(null);
    setDraftName("");
  };

  const visiblePieces = pieces.filter((p) => p.team !== "away" || showAway);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground mr-1">Formation</span>
        {(Object.keys(FORMATIONS) as FormationKey[]).map((f) => (
          <button
            key={f}
            onClick={() => changeFormation(f)}
            className={cn(
              "flex flex-col items-center px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all border",
              formation === f
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
            )}
          >
            <span>{f}</span>
            <span className="text-[9px] font-normal normal-case tracking-normal opacity-80">
              {FORMATION_META[f].label}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleAway} className="font-mono text-xs">
            {showAway ? <EyeOff className="w-3 h-3 mr-1.5" /> : <Eye className="w-3 h-3 mr-1.5" />}
            Motståndare
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCorridors((v) => !v)} className="font-mono text-xs">
            Korridorer
          </Button>
          <Button variant="outline" size="sm" onClick={clearNames} className="font-mono text-xs">
            Rensa namn
          </Button>
          <Button variant="outline" size="sm" onClick={reset} className="font-mono text-xs">
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Återställ
          </Button>
        </div>
      </div>

      {/* Pitch */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border touch-none select-none"
        style={{ background: "hsl(215 30% 6%)" }}
      >
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
          {/* Outer */}
          <rect x="3" y="3" width="94" height="127" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          {/* Center line */}
          <line x1="3" y1="66.5" x2="97" y2="66.5" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          {/* Center circle */}
          <circle cx="50" cy="66.5" r="10" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          <circle cx="50" cy="66.5" r="0.6" fill="hsl(217 22% 35%)" />
          {/* Top box (away goal): 59,3% bredd centrerad -> x=20.35 w=59.3, linjerar med korridorgräns */}
          <rect x="20.35" y="3" width="59.3" height="18" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          <rect x="36.53" y="3" width="26.94" height="7" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          {/* Bottom box (home goal) */}
          <rect x="20.35" y="112" width="59.3" height="18" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />
          <rect x="36.53" y="123" width="26.94" height="7" fill="none" stroke="hsl(217 22% 25%)" strokeWidth="0.3" />

          {/* Corridors: x = 20.35/36.53/63.47/79.65, linjerar med straffområdes-/målområdeskanter */}
          {showCorridors && (
            <g stroke="hsl(47 78% 56%)" strokeWidth="0.2" strokeDasharray="1 1" opacity="0.5">
              <line x1="20.35" y1="3" x2="20.35" y2="130" />
              <line x1="36.53" y1="3" x2="36.53" y2="130" />
              <line x1="63.47" y1="3" x2="63.47" y2="130" />
              <line x1="79.65" y1="3" x2="79.65" y2="130" />
            </g>
          )}
        </svg>

        {/* Pieces */}
        {visiblePieces.map((p) => {
          const isBall = p.team === "ball";
          const isHome = p.team === "home";
          return (
            <motion.div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              drag
              dragMomentum={false}
              dragElastic={0}
              onDrag={(_, info) => handleDrag(p.id, info)}
              whileDrag={{ scale: 1.2, zIndex: 50 }}
              whileHover={{ scale: 1.08 }}
              onDoubleClick={() => startRename(p)}
            >
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center font-mono font-black border shadow-md",
                    isBall
                      ? "w-4 h-4 bg-white border-white/50"
                      : isHome
                      ? "w-8 h-8 text-[10px] bg-accent text-accent-foreground border-accent/60"
                      : "w-8 h-8 text-[10px] bg-primary text-primary-foreground border-primary/60"
                  )}
                >
                  {!isBall && p.label}
                </div>
                {p.name && !isBall && (
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-background/80 text-foreground px-1 py-0.5 rounded whitespace-nowrap">
                    {p.name}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rename modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setEditingId(null)}>
          <div
            className="bg-card border border-border rounded-lg p-4 w-72 space-y-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Döp spelaren</p>
            <input
              autoFocus
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setEditingId(null);
              }}
              placeholder="Namn (lämna tomt för bara nummer)"
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-accent"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Avbryt</Button>
              <Button size="sm" onClick={commitRename}>Spara</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTacticsBoard;
