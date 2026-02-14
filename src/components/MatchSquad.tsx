import { useState } from "react";
import { cn } from "@/lib/utils";
import { Users, Shield, Target, Flag, CornerDownRight } from "lucide-react";

interface PlayerEntry {
  number: string;
  name: string;
}

interface Roles {
  captain: string;
  penaltyTaker: string;
  directFreeKick: string;
  crossingFreeKick: string;
  cornerTaker: string;
}

const defaultPlayers: PlayerEntry[] = Array.from({ length: 16 }, (_, i) => ({
  number: "",
  name: "",
}));

const MatchSquad = () => {
  const [players, setPlayers] = useState<PlayerEntry[]>(defaultPlayers);
  const [roles, setRoles] = useState<Roles>({
    captain: "",
    penaltyTaker: "",
    directFreeKick: "",
    crossingFreeKick: "",
    cornerTaker: "",
  });

  const updatePlayer = (index: number, field: "number" | "name", value: string) => {
    setPlayers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const updateRole = (key: keyof Roles, value: string) => {
    setRoles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Squad list */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-primary/10 border-b border-border flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Dagens matchtrupp</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {players.map((player, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-5 text-right">{i + 1}.</span>
                <input
                  type="text"
                  placeholder="Nr"
                  value={player.number}
                  onChange={e => updatePlayer(i, "number", e.target.value)}
                  className="w-12 h-8 rounded-md border border-input bg-background px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder="Spelarnamn"
                  value={player.name}
                  onChange={e => updatePlayer(i, "name", e.target.value)}
                  className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role assignments */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-accent/10 border-b border-border flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent-foreground">Ansvarsområden</h4>
        </div>
        <div className="p-4 space-y-3">
          {[
            { key: "captain" as const, label: "Lagkapten", icon: Shield, iconColor: "text-primary" },
            { key: "penaltyTaker" as const, label: "Straffskytt", icon: Target, iconColor: "text-zone-defense" },
            { key: "directFreeKick" as const, label: "Frisparksskytt (direkt)", icon: Target, iconColor: "text-zone-midfield" },
            { key: "crossingFreeKick" as const, label: "Frisparksskytt (inlägg)", icon: Flag, iconColor: "text-zone-midfield" },
            { key: "cornerTaker" as const, label: "Hörnläggare", icon: CornerDownRight, iconColor: "text-accent" },
          ].map(({ key, label, icon: Icon, iconColor }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className={cn("w-4 h-4 flex-shrink-0", iconColor)} />
              <span className="text-sm font-medium text-foreground min-w-[180px]">{label}</span>
              <input
                type="text"
                placeholder="Spelarnamn / nummer"
                value={roles[key]}
                onChange={e => updateRole(key, e.target.value)}
                className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchSquad;
