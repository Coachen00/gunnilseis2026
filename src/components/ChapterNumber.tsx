interface ChapterNumberProps {
  number: string;
  className?: string;
}

const ChapterNumber = ({ number, className = "" }: ChapterNumberProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none select-none font-sans font-black leading-none tracking-[-0.05em] ${className}`}
    style={{
      fontSize: "clamp(8rem, 22vw, 22rem)",
      WebkitTextStroke: "1px hsl(var(--accent) / 0.35)",
      color: "transparent",
    }}
  >
    {number}
  </div>
);

export default ChapterNumber;