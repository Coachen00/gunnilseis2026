interface MissingInputPlaceholderProps {
  needed: string;
  formatNeeded: string;
  source: string;
  owner: string;
  deadline?: string;
}

const MissingInputPlaceholder = ({ needed, formatNeeded, source, owner, deadline = "[datum]" }: MissingInputPlaceholderProps) => {
  return (
    <div className="p-5 rounded-xl bg-accent/10 border-2 border-dashed border-accent/40">
      <p className="text-sm font-bold text-accent-foreground mb-3">[SAKNAS — klistra in innehåll här]</p>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li><strong className="text-foreground">Behövs:</strong> {needed}</li>
        <li><strong className="text-foreground">Format:</strong> {formatNeeded}</li>
        <li><strong className="text-foreground">Källa:</strong> {source}</li>
        <li><strong className="text-foreground">Ansvarig:</strong> {owner}</li>
        <li><strong className="text-foreground">Deadline:</strong> {deadline}</li>
      </ul>
    </div>
  );
};

export default MissingInputPlaceholder;
