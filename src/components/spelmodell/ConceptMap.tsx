import { cn } from "@/lib/utils";

export interface ConceptMapNode {
  id: string;
  label: string;
  kind: "level" | "concept" | "phase" | "special";
  detail: string;
}

export interface ConceptMapEdge {
  from: string;
  to: string;
  label?: string;
}

interface ConceptMapProps {
  title: string;
  nodes: readonly ConceptMapNode[];
  edges: readonly ConceptMapEdge[];
  fallbackTitle?: string;
  className?: string;
}

export default function ConceptMap({
  title,
  nodes,
  edges,
  fallbackTitle = "Textversion",
  className,
}: ConceptMapProps) {
  const nodeLookup = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="concept-map-title">
      <div>
        <h3 id="concept-map-title" className="text-lg font-black tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          En enkel karta över nivåer, begrepp och hur de hänger ihop.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2" aria-label={title}>
        {nodes.map((node) => (
          <article
            key={node.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
            data-kind={node.kind}
          >
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              {node.kind}
            </p>
            <h4 className="mt-2 text-base font-black tracking-tight text-foreground">{node.label}</h4>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">{node.detail}</p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
        <h4 className="text-base font-black tracking-tight text-foreground">{fallbackTitle}</h4>
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          {nodes.map((node) => (
            <li key={`${node.id}-fallback`}>
              <span className="font-semibold text-foreground">{node.label}</span>
              <span className="text-muted-foreground"> — {node.detail}</span>
            </li>
          ))}
        </ul>

        {edges.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-foreground/80">
            {edges.map((edge) => {
              const fromNode = nodeLookup.get(edge.from);
              const toNode = nodeLookup.get(edge.to);
              const relation = edge.label ? ` · ${edge.label}` : "";

              return (
                <li key={`${edge.from}-${edge.to}-${edge.label ?? "edge"}`}>
                  {fromNode?.label ?? edge.from} → {toNode?.label ?? edge.to}
                  {relation}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
