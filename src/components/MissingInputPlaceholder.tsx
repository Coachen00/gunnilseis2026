interface MissingInputPlaceholderProps {
  needed: string;
  formatNeeded: string;
  source: string;
  owner: string;
  deadline?: string;
}

const MissingInputPlaceholder = ({
  needed,
  formatNeeded,
  source,
  owner,
  deadline = "[datum]",
}: MissingInputPlaceholderProps) => {
  return (
    <div className="rounded-md border border-border bg-card/45 p-4">
      <p className="text-sm font-bold text-foreground">Saknas: {needed}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {formatNeeded}. Källa: {source}. Ansvarig: {owner}. Deadline: {deadline}.
      </p>
    </div>
  );
};

export default MissingInputPlaceholder;
