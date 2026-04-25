import { FORMATION } from "@/data/matchplan";

interface Props {
  height?: number;
}

export default function Formation({ height = 360 }: Props) {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-lg border-2 border-white/50"
      style={{
        aspectRatio: "68 / 105",
        height,
        width: (height * 68) / 105,
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0 10%, hsl(0 0% 100% / 0.03) 10% 20%), linear-gradient(to bottom, hsl(142 35% 20%), hsl(142 35% 16%))",
      }}
    >
      {/* Linjer */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/50" />
      <div className="absolute left-1/2 top-1/2 aspect-square w-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50" />
      <div className="absolute left-[22%] right-[22%] top-0 h-[14%] border-2 border-t-0 border-white/50" />
      <div className="absolute bottom-0 left-[22%] right-[22%] h-[14%] border-2 border-b-0 border-white/50" />
      {/* Gyllene zonen */}
      <div
        className="absolute left-[28%] right-[28%] top-0 h-[22%] border border-dashed"
        style={{ background: "hsl(47 78% 56% / 0.12)", borderColor: "hsl(47 78% 56% / 0.4)" }}
      />
      {/* Spelare */}
      {FORMATION.map((p) => (
        <div
          key={p.id}
          className="group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${p.x}%`, top: `${100 - p.y}%` }}
        >
          {/* Tooltip — visas vid hover */}
          <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {p.label}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
          </div>

          <div
            className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full border-2 text-[13px] font-black shadow-md transition-transform group-hover:scale-110"
            style={{
              background: "hsl(47 78% 56%)",
              color: "hsl(215 30% 6%)",
              borderColor: "hsl(48 100% 72%)",
            }}
          >
            {p.n}
          </div>
          <div
            className="absolute top-[38px] whitespace-nowrap rounded bg-black/60 px-1 py-px text-[9px] font-semibold text-foreground"
          >
            {p.name}
          </div>
        </div>
      ))}
    </div>
  );
}
