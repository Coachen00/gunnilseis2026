import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export interface Player {
  id: string;
  x: number;
  y: number;
  role: string;
  color?: "primary" | "accent" | "secondary";
}

export interface Formation {
  name: string;
  players: Player[];
}

interface InteractiveFootballPitchProps {
  formations: Formation[];
  title: string;
  subtitle?: string;
  showZones?: boolean;
  className?: string;
  onFormationChange?: (players: Player[]) => void;
}

const InteractiveFootballPitch = ({ 
  formations, 
  title, 
  subtitle, 
  showZones = false, 
  className,
  onFormationChange 
}: InteractiveFootballPitchProps) => {
  const [activeFormationIndex, setActiveFormationIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>(formations[0]?.players || []);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFormationChange = useCallback((index: number) => {
    setActiveFormationIndex(index);
    setPlayers(formations[index].players);
    setSelectedPlayer(null);
    onFormationChange?.(formations[index].players);
  }, [formations, onFormationChange]);

  const handleReset = useCallback(() => {
    setPlayers(formations[activeFormationIndex].players);
    setSelectedPlayer(null);
    onFormationChange?.(formations[activeFormationIndex].players);
  }, [formations, activeFormationIndex, onFormationChange]);

  const handlePlayerDrag = useCallback((playerId: string, info: { point: { x: number; y: number } }, containerRect: DOMRect) => {
    const relativeX = ((info.point.x - containerRect.left) / containerRect.width) * 100;
    const relativeY = ((info.point.y - containerRect.top) / containerRect.height) * 100;
    
    const clampedX = Math.max(5, Math.min(95, relativeX));
    const clampedY = Math.max(5, Math.min(95, relativeY));

    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, x: clampedX, y: clampedY } : p
    ));
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onFormationChange?.(players);
  }, [players, onFormationChange]);

  return (
    <div className={cn("relative", className)}>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          {formations.map((formation, index) => (
            <button
              key={formation.name}
              onClick={() => handleFormationChange(index)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeFormationIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {formation.name}
            </button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="ml-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Återställ
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Tryck och dra spelarna för att justera positioner
      </p>
      
      <div 
        ref={containerRef}
        className="relative aspect-[3/4] w-full max-w-md mx-auto pitch-gradient rounded-xl overflow-hidden border border-pitch-lines/30 touch-none"
      >
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="xMidYMid meet">
          <rect x="2" y="2" width="96" height="129" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <line x1="2" y1="66.5" x2="98" y2="66.5" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="66.5" r="12" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="66.5" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          <rect x="20" y="2" width="60" height="22" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="32" y="2" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="16" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          <rect x="20" y="109" width="60" height="22" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <rect x="32" y="123" width="36" height="8" fill="none" stroke="hsl(var(--pitch-lines))" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="117" r="1" fill="hsl(var(--pitch-lines))" opacity="0.6" />
          
          {showZones && (
            <>
              <text x="50" y="10" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 3</text>
              <text x="50" y="40" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 2</text>
              <text x="50" y="90" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Spelyta 1</text>
              <text x="50" y="125" textAnchor="middle" fontSize="4" fill="hsl(var(--foreground))" opacity="0.4">Utgångsyta</text>
            </>
          )}
        </svg>
        
        {/* Players - larger touch targets */}
        {players.map((player) => (
          <motion.div
            key={player.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing z-10",
              selectedPlayer === player.id && "z-20"
            )}
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {
              setIsDragging(true);
              setSelectedPlayer(player.id);
            }}
            onDrag={(_, info) => {
              const container = containerRef.current;
              if (container) {
                handlePlayerDrag(player.id, info, container.getBoundingClientRect());
              }
            }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.3, zIndex: 50 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => setSelectedPlayer(player.id === selectedPlayer ? null : player.id)}
          >
            {/* Invisible larger touch area */}
            <div className="absolute -inset-3 rounded-full" />
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-lg transition-all border-2 border-white/40",
                player.color === "accent" 
                  ? "bg-accent text-accent-foreground" 
                  : player.color === "secondary"
                  ? "bg-secondary text-secondary-foreground border-muted-foreground/30"
                  : "bg-primary text-primary-foreground",
                selectedPlayer === player.id && "ring-2 ring-white ring-offset-2 ring-offset-transparent"
              )}
              animate={{
                boxShadow: selectedPlayer === player.id 
                  ? "0 0 20px rgba(var(--primary), 0.5)" 
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              {player.id}
            </motion.div>
            <span className={cn(
              "text-[9px] font-bold bg-background/90 px-1.5 py-0.5 rounded whitespace-nowrap transition-all shadow-sm",
              selectedPlayer === player.id 
                ? "text-primary font-black" 
                : "text-foreground/80"
            )}>
              {player.role}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Selected player info */}
      {selectedPlayer && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-muted/50 border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">
                Spelare {selectedPlayer}
              </p>
              <p className="text-xs text-muted-foreground">
                {players.find(p => p.id === selectedPlayer)?.role}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Position: ({Math.round(players.find(p => p.id === selectedPlayer)?.x || 0)}%, {Math.round(players.find(p => p.id === selectedPlayer)?.y || 0)}%)
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveFootballPitch;
