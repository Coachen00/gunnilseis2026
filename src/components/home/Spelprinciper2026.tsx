import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import {
  ANFALLSPRINCIPER,
  FASTA_ROUTE,
  FASTA_SITUATIONER,
  FORMATION,
  FORSVARSPRINCIPER,
  NAR_GOR,
  OAVSETT_MATCHBILD,
  SPELPRINCIPER_PDF,
  type PrincipFilm,
  type Spelprincip,
} from "@/data/spelprinciper2026";

/* Spelprinciperna 2026 på startsidan, direkt under förutsättningarna inför
 * veckans match. Allt innehåll kommer från `data/spelprinciper2026.ts`. */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* Filmen laddas först när kortet närmar sig skärmen — tolv filmer på en sida
 * ska inte dras ner på mobilnät innan någon scrollat dit. */
function LoopFilm({ film }: { film: PrincipFilm }) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: "300px 0px" });
  const reduced = useReducedMotion();
  return (
    <figure ref={ref} className="overflow-hidden rounded-2xl border-[1.5px] border-kedja-border bg-kedja-ink">
      {inView ? (
        <video
          src={film.src}
          poster={film.poster}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          controls={reduced}
          preload={reduced ? "none" : "auto"}
          aria-label={film.caption}
          className="aspect-video w-full"
        />
      ) : (
        <img src={film.poster} alt={film.caption} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
      )}
      <figcaption className="bg-white px-4 py-3 text-left text-[13px] leading-[1.5] text-kedja-deep">{film.caption}</figcaption>
    </figure>
  );
}

function Calls({ calls }: { calls: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">Så ropar vi</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {calls.map((c) => (
          <li key={c} className="rounded-full bg-kedja-ink px-3 py-1 text-[13px] font-black text-kedja-lime">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {steps.map((s) => (
        <li key={s} className="flex gap-3 text-[15px] leading-[1.5] text-kedja-ink">
          <span className="mt-[9px] block h-1.5 w-1.5 shrink-0 rounded-full bg-kedja-green" aria-hidden="true" />
          {s}
        </li>
      ))}
    </ul>
  );
}

function PrincipKort({ p, skede }: { p: Spelprincip; skede: string }) {
  return (
    <li className="grid gap-6 rounded-3xl border-[1.5px] border-kedja-border bg-white p-4 text-left sm:p-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
      <div className="space-y-4">
        {p.films.map((f) => (
          <LoopFilm key={f.src} film={f} />
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-kedja-lime text-[17px] font-black text-kedja-ink ring-2 ring-kedja-ink">
            {p.num}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">
            {skede} · princip {p.num}
          </span>
        </div>
        <h4 className="mt-4 text-[clamp(1.4rem,2.6vw,1.9rem)] font-black leading-tight tracking-[-0.02em] text-kedja-ink">{p.title}</h4>
        <p className="mt-3 text-[16px] leading-[1.55] text-kedja-deep">{p.lead}</p>
        <Steps steps={p.steps} />
        <Calls calls={p.calls} />
        <Link
          to={p.route}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-kedja-green transition-colors hover:text-kedja-ink"
        >
          Mer om {skede.toLowerCase()}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

function Grupp({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">{eyebrow}</p>
        <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-black tracking-[-0.03em] text-kedja-ink">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NarGor() {
  return (
    <details className="group rounded-2xl border-[1.5px] border-kedja-border bg-white text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:px-8">
        <span>
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">Arbetssätt</span>
          <span className="mt-1 block text-[20px] font-black text-kedja-ink">När det här händer, gör vi det här</span>
        </span>
        <span className="text-2xl font-black text-kedja-green transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <ul className="border-t border-kedja-border">
        {NAR_GOR.map((r) => (
          <li key={r.nar} className="grid gap-1 border-b border-kedja-border px-6 py-3 last:border-b-0 sm:grid-cols-[2fr_3fr_1fr] sm:gap-4 sm:px-8">
            <span className="text-[15px] font-bold text-kedja-ink">{r.nar}</span>
            <span className="text-[15px] text-kedja-deep">{r.gor}</span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-kedja-green sm:text-right">{r.skede}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

const Spelprinciper2026 = () => {
  return (
    <section id="spelprinciper" className="scroll-mt-20 bg-kedja-paper">
      <div className="mx-auto max-w-[1200px] space-y-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-kedja-green">Spelprinciper 2026</span>
            <span className="block h-px w-10 bg-kedja-green/50" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.4rem,5vw,3.8rem)] font-black tracking-[-0.03em] text-kedja-ink">Så spelar vi.</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[19px] leading-[1.55] text-kedja-deep">
            Tre principer i försvar. Tre i anfall. Och de fasta. De vi använt mest under 2026.
          </p>
          <a
            href={SPELPRINCIPER_PDF}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-kedja-ink px-6 py-3 text-[15px] font-black text-kedja-lime transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            Ladda ner som PDF
          </a>
        </div>

        <div className="grid gap-6 rounded-3xl bg-kedja-ink p-4 text-left sm:p-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
          <LoopFilm film={FORMATION.film} />
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-lime">Grunden</p>
            <h3 className="mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] font-black leading-tight tracking-[-0.02em] text-white">
              {FORMATION.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.55] text-kedja-mint">{FORMATION.lead}</p>
            <ol className="mt-5 space-y-3">
              {FORMATION.phases.map((ph, i) => (
                <li key={ph.label} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-kedja-lime text-[13px] font-black text-kedja-ink">
                    {i + 1}
                  </span>
                  <p className="text-[15px] leading-[1.5] text-white">
                    <span className="font-black">{ph.label}.</span> <span className="text-kedja-mint">{ph.rule}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Grupp eyebrow="Utan boll" title="Tre principer i försvar">
          <ol className="space-y-6">
            {FORSVARSPRINCIPER.map((p) => (
              <PrincipKort key={p.id} p={p} skede="Försvar" />
            ))}
          </ol>
        </Grupp>

        <Grupp eyebrow="Med boll" title="Tre principer i anfall">
          <ol className="space-y-6">
            {ANFALLSPRINCIPER.map((p) => (
              <PrincipKort key={p.id} p={p} skede="Anfall" />
            ))}
          </ol>
        </Grupp>

        <Grupp eyebrow="Död boll" title="Fasta situationer">
          <ul className="grid gap-6 md:grid-cols-2">
            {FASTA_SITUATIONER.map((f) => (
              <li key={f.id} className="flex flex-col rounded-3xl border-[1.5px] border-kedja-border bg-white p-4 text-left sm:p-6">
                <LoopFilm film={f.film} />
                <h4 className="mt-5 text-[22px] font-black tracking-[-0.02em] text-kedja-ink">{f.title}</h4>
                <Steps steps={f.steps} />
                <Calls calls={f.calls} />
              </li>
            ))}
          </ul>
          <div className="text-center">
            <Link
              to={FASTA_ROUTE}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-kedja-green transition-colors hover:text-kedja-ink"
            >
              Mer om fasta situationer
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </Grupp>

        <div className="space-y-6">
          <NarGor />
          <p className="rounded-2xl bg-kedja-lime px-6 py-5 text-center text-[17px] font-black leading-snug text-kedja-ink">
            Oavsett matchbild: {OAVSETT_MATCHBILD}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Spelprinciper2026;
