const METRICS = [
  { value: "6", label: "veckor" },
  { value: "18", label: "pass" },
  { value: "5", label: "korridorer" },
  { value: "4", label: "steg" },
  { value: "6 sek", label: "till återerövring" },
] as const;

const MetricStrip = () => (
  <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {METRICS.map((m) => (
      <li
        key={m.label}
        className="rounded-lg border border-border bg-card/40 p-4 text-center"
      >
        <p className="text-3xl font-black tracking-tight text-accent md:text-4xl">{m.value}</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {m.label}
        </p>
      </li>
    ))}
  </ol>
);

export default MetricStrip;
