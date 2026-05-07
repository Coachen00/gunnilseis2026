import { MATCH_META } from "@/data/matchplan";

const StaticMatchHeader = () => (
  <div className="bg-card/85 rounded-lg p-6 border border-border">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1">
          Veckans match
        </p>
        <h2 className="text-2xl md:text-3xl font-black">
          {MATCH_META.opponent}
        </h2>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Avspark
        </div>
        <div className="font-semibold">{MATCH_META.kickoff}</div>
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Plats
        </div>
        <div className="font-semibold">
          {MATCH_META.home ? "Hemma" : "Borta"} · {MATCH_META.venue}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Tävling
        </div>
        <div className="font-semibold">{MATCH_META.competition}</div>
      </div>
      {MATCH_META.absent.length > 0 && (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Saknas
          </div>
          <div className="font-semibold">{MATCH_META.absent.join(", ")}</div>
        </div>
      )}
    </div>
  </div>
);

export default StaticMatchHeader;
