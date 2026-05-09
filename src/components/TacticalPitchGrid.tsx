/**
 * Subtle tactical pitch grid overlay for the hero.
 * Pure SVG, aria-hidden, pointer-events-none. Uses pitch-lines token
 * via stroke="currentColor" + Tailwind text utility.
 */
const TacticalPitchGrid = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full text-pitch-lines/40 animate-pitch-pulse"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    {/* Outer touchline */}
    <rect x="80" y="80" width="1440" height="740" />
    {/* Halfway line */}
    <line x1="800" y1="80" x2="800" y2="820" />
    {/* Centre circle */}
    <circle cx="800" cy="450" r="92" />
    <circle cx="800" cy="450" r="3" fill="currentColor" />

    {/* Penalty boxes (left + right) */}
    <rect x="80" y="240" width="200" height="420" />
    <rect x="1320" y="240" width="200" height="420" />
    {/* Six-yard boxes */}
    <rect x="80" y="340" width="80" height="220" />
    <rect x="1440" y="340" width="80" height="220" />
    {/* Penalty spots */}
    <circle cx="220" cy="450" r="3" fill="currentColor" />
    <circle cx="1380" cy="450" r="3" fill="currentColor" />
    {/* Penalty arcs */}
    <path d="M 280 388 A 92 92 0 0 1 280 512" />
    <path d="M 1320 388 A 92 92 0 0 0 1320 512" />

    {/* Vertical channel grid (bredd-zoner) */}
    <g className="opacity-60">
      <line x1="368" y1="80" x2="368" y2="820" strokeDasharray="4 8" />
      <line x1="656" y1="80" x2="656" y2="820" strokeDasharray="4 8" />
      <line x1="944" y1="80" x2="944" y2="820" strokeDasharray="4 8" />
      <line x1="1232" y1="80" x2="1232" y2="820" strokeDasharray="4 8" />
    </g>

    {/* Horizontal third lines (djup-zoner) */}
    <g className="opacity-50">
      <line x1="80" y1="327" x2="1520" y2="327" strokeDasharray="4 8" />
      <line x1="80" y1="573" x2="1520" y2="573" strokeDasharray="4 8" />
    </g>
  </svg>
);

export default TacticalPitchGrid;
