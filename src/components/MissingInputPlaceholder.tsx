interface MissingInputPlaceholderProps {
  needed: string;
  formatNeeded: string;
  source: string;
  owner: string;
  deadline?: string;
}

const MissingInputPlaceholder = ({ needed, formatNeeded, source, owner, deadline = "[date]" }: MissingInputPlaceholderProps) => {
  return (
    <div className="p-5 rounded-xl bg-accent/10 border-2 border-dashed border-accent/40">
      <p className="text-sm font-bold text-accent-foreground mb-3">[MISSING INPUT — paste exactly what you want here]</p>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li><strong className="text-foreground">Needed:</strong> {needed}</li>
        <li><strong className="text-foreground">Format needed:</strong> {formatNeeded}</li>
        <li><strong className="text-foreground">Source:</strong> {source}</li>
        <li><strong className="text-foreground">Owner:</strong> {owner}</li>
        <li><strong className="text-foreground">Deadline:</strong> {deadline}</li>
      </ul>
    </div>
  );
};

export default MissingInputPlaceholder;
