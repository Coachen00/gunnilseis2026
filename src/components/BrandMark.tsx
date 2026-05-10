/**
 * Spelmodellens monogram-mark.
 *
 * En geometrisk 'S' uppbyggd av två böjda linjer som påminner om en
 * spelplans halvcirkel-zoner (centrerings + offside-bågar). Använder
 * design-token currentColor så monogrammet ärver färg från parent.
 *
 * 32×32 default, kan skalas via className.
 */

interface BrandMarkProps {
  className?: string;
  /** Tjocklek på linjerna i SVG-units. Default 5.5 (för 32px). */
  strokeWidth?: number;
}

const BrandMark = ({ className, strokeWidth = 5.5 }: BrandMarkProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Övre båge — öppnar mot höger */}
    <path d="M 23 8 A 7 7 0 0 0 9 13" />
    {/* Mellanstapel — den karakteristiska S-knytningen */}
    <line x1="9" y1="13" x2="23" y2="19" />
    {/* Nedre båge — öppnar mot vänster */}
    <path d="M 9 24 A 7 7 0 0 0 23 19" />
  </svg>
);

export default BrandMark;
