import { COHERENCE, FOCUS, MATCH_META } from "@/data/matchplan";
import EditableText from "./EditableText";
import { useMatch } from "@/hooks/useMatch";
import MediaSlot from "./MediaSlot";

/**
 * Matchplan — inbäddad version av veckans matchplan.
 * Ersätter den externa CTA-länken i MatchKommande. Sektioner sparar text
 * per matchId via EditableText (Supabase).
 */
export default function Matchplan() {
  const { match } = useMatch("upcoming");

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent">
            Matchplan
          </p>
          <h2 className="text-2xl font-black tracking-tight">
            Så spelar vi mot {MATCH_META.opponent}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          Autospar på
        </span>
      </div>

      {COHERENCE.map((sec) => (
        <div
          key={sec.id}
          id={sec.id}
          className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-5 scroll-mt-24"
        >
          <span className="absolute bottom-6 left-0 top-6 w-[3px] rounded-r bg-accent" />
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[11px] font-bold tracking-wider text-accent">
              {sec.num}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                {sec.eyebrow}
              </div>
              <h3 className="text-xl font-black tracking-tight">{sec.title}</h3>
            </div>
          </div>

          {sec.principles && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sec.principles.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          {sec.bullets && (
            <ul className="mt-3 space-y-1.5">
              {sec.bullets.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {sec.roles && (
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
              {sec.roles.map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                    {k}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
          )}

          {sec.note && (
            <p className="mt-3 text-xs italic text-muted-foreground">{sec.note}</p>
          )}

          <div className="mt-4 border-t border-border pt-3">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Bilder & filmer
              </label>
              <span className="text-[10px] text-muted-foreground">PNG, JPG, JPEG, WebP, GIF, MP4, MOV, WebM...</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {(sec.principles && sec.principles.length > 0 ? sec.principles : ["Bild/film"]).map((area, i) => (
                <MediaSlot
                  key={`${sec.id}-${area}`}
                  matchId={match?.id}
                  slotKey={`plan:${sec.id}:media:${i}`}
                  title={area}
                  description={`${sec.title} - ${area}`}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Tränarens kommentar per sektion — sparas i Supabase */}
          <div className="mt-4 border-t border-border pt-3">
            <label className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Kommentar inför matchen
            </label>
            <EditableText
              matchId={match?.id}
              sectionKey={`plan:${sec.id}`}
              fieldKey="kommentar"
              placeholder="Justeringar inför denna match…"
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export { FOCUS };
