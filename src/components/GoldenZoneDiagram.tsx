import { cn } from "@/lib/utils";

interface GoldenZoneDiagramProps {
  className?: string;
}

const GoldenZoneDiagram = ({ className }: GoldenZoneDiagramProps) => {
  return (
    <div className={cn("relative", className)}>
      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        Gyllene zonen & assistytan
      </h4>

      <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border border-border">
        <svg viewBox="0 0 680 520" className="w-full h-auto" style={{ background: "#0d1526" }}>
          {/* Sidlinjer + mållinje */}
          <rect x="40" y="20" width="600" height="480" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />

          {/* Straffområde: 59,3% av 600 = 355.8, centrerad -> x = 40 + (600-355.8)/2 = 162.1, djup ~34% av 520 = 177 */}
          <rect x="162" y="20" width="356" height="177" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />
          {/* Målområde: 26,94% av 600 = 161.6, centrerad -> x = 40 + (600-161.6)/2 = 259.2 */}
          <rect x="259" y="20" width="162" height="62" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />
          {/* Straffpunkt */}
          <circle cx="340" cy="140" r="2.5" fill="#3a5570" opacity="0.8" />
          {/* Straffbåge: cirkel r=98 kring straffpunkten (340,140), skär boxlinjen y=197 vid x=260/420 */}
          <path d="M 260 197 A 98 98 0 0 0 420 197" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />
          {/* Mål */}
          <rect x="311" y="8" width="58" height="12" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />

          {/* GYLLENE ZONEN: central korridor, linjerar med målområdets kanter, från straffområdeslinjen till mållinjen — men når inte mållinjen (spec) */}
          <rect x="259" y="197" width="162" height="160" fill="#a3831a" fillOpacity="0.55" stroke="#d4af37" strokeWidth="1.5" />
          <text x="340" y="285" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill="#f2e2ab" letterSpacing="1">
            GYLLENE
          </text>
          <text x="340" y="302" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill="#f2e2ab" letterSpacing="1">
            ZONEN
          </text>

          {/* ASSISTYTAN: inre korridorerna, direkt bredvid gyllene zonen, strax utanför straffområdeslinjen ner mot mållinjen */}
          <rect x="162" y="197" width="97" height="220" fill="#8a6f1f" fillOpacity="0.4" stroke="#c9a227" strokeWidth="1.5" />
          <rect x="421" y="197" width="97" height="220" fill="#8a6f1f" fillOpacity="0.4" stroke="#c9a227" strokeWidth="1.5" />
          <text x="210" y="310" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#e8d8a0" letterSpacing="0.5">
            ASSISTYTAN
          </text>
          <text x="470" y="310" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#e8d8a0" letterSpacing="0.5">
            ASSISTYTAN
          </text>

          {/* Sekundära inläggslägen: yttre korridorer nära straffområdet, låg opacitet, oetiketterade */}
          <rect x="40" y="197" width="122" height="120" fill="#4a5a70" fillOpacity="0.18" />
          <rect x="518" y="197" width="122" height="120" fill="#4a5a70" fillOpacity="0.18" />

          {/* Mittcirkel + mittlinje för djup/kontext */}
          <line x1="40" y1="440" x2="640" y2="440" stroke="#3a5570" strokeWidth="1.5" opacity="0.7" />
          <circle cx="340" cy="440" r="55" fill="none" stroke="#3a5570" strokeWidth="1.5" opacity="0.5" />

          {/* Passningspilar i blått */}
          <defs>
            <marker id="gz-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#3a6fc6" />
            </marker>
          </defs>
          {/* Cutback från inre korridor (assistytan, vänster) in i gyllene zonen */}
          <path d="M 210 380 Q 270 350 330 300" fill="none" stroke="#3a6fc6" strokeWidth="2.5" markerEnd="url(#gz-arrow)" />
          {/* Inlägg från yttre fält (höger) mot gyllene zonen */}
          <path d="M 560 300 Q 500 260 400 235" fill="none" stroke="#3a6fc6" strokeWidth="2.5" markerEnd="url(#gz-arrow)" />
          {/* Instick i gyllene zonen */}
          <path d="M 340 420 L 340 300" fill="none" stroke="#3a6fc6" strokeWidth="2.5" markerEnd="url(#gz-arrow)" />

          {/* Egna spelare (gula cirklar) */}
          <circle cx="210" cy="390" r="14" fill="#d4af37" />
          <text x="210" y="395" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill="#0d1526">7</text>
          <circle cx="340" cy="430" r="14" fill="#d4af37" />
          <text x="340" y="435" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill="#0d1526">9</text>
          <circle cx="340" cy="290" r="14" fill="#d4af37" />
          <text x="340" y="295" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill="#0d1526">10</text>
          <circle cx="560" cy="310" r="14" fill="#d4af37" />
          <text x="560" y="315" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill="#0d1526">11</text>
        </svg>
      </div>

      {/* Legend below */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-500" />
          <span className="text-xs text-foreground font-medium">Gyllene zonen – central avslutsyta (avsluta här med övertal)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-muted border border-border" />
          <span className="text-xs text-muted-foreground">Assistytan – sista passningen: cutback, instick, väggspel, inlägg</span>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-accent font-medium text-center">
          <strong>Mål:</strong> Assistytan → cutback, instick eller inlägg in i gyllene zonen
        </p>
      </div>
    </div>
  );
};

export default GoldenZoneDiagram;
