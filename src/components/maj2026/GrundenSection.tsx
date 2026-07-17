/**
 * GrundenSection — sajtens nivå 0 + 1, först på huvudsidan.
 *
 * "Det minsta och enklaste men viktigaste först": fyra ord (mantran) och
 * sex fas-rader. Allt nedanför detta på sidan är nivå 2–3 (principer och
 * fördjupning). Innehållet lyfts ur befintlig data (grunden.ts härleder ur
 * MAJ_2026_BLOCKS) — sektionen skapar hierarki, inte nytt material.
 */

import { ArrowDown } from "lucide-react";
import LevelBadge from "@/components/LevelBadge";
import { FAS_RADER, GRUNDEN_MENING, MANTRAN, SPECIAL_RADER } from "@/data/grunden";

export default function GrundenSection() {
  return (
    <section id="grunden" className="scroll-mt-24 border-b border-border bg-background py-16 md:py-20" aria-labelledby="grunden-rubrik">
      <div className="container">
        {/* ── Nivå 0: fyra ord ── */}
        <div className="mb-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <LevelBadge level={0} className="mb-4" />
            <h2 id="grunden-rubrik" className="text-3xl font-black uppercase tracking-tight text-foreground md:text-5xl">
              Kan du fyra ord kan du spelmodellen
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-foreground/65">
            Allt på den här sidan är en fördjupning av de här fyra orden. Börja här —
            resten kommer i stegrande ordning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MANTRAN.map((m, i) => (
            <a
              key={m.word}
              href={m.to.includes("#") ? `#${m.to.split("#")[1]}` : m.to}
              className="group border border-border bg-card p-5 transition-colors hover:border-amber-500/60"
            >
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                {String(i + 1)} / 4
              </span>
              <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
                {m.word}
              </h3>
              <p className="mt-1.5 text-sm leading-snug text-foreground/70">{m.line}</p>
            </a>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-balance text-base font-bold leading-relaxed text-foreground/85 md:text-lg">
          {GRUNDEN_MENING}
        </p>

        {/* Storyn: taket over modellen */}
        <div className="mt-12 border border-amber-500/50 bg-amber-50 p-6">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Storyn · taket</p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">Var förberedd</h3>
          <p className="mt-2 max-w-3xl text-base font-semibold leading-relaxed text-foreground/75">
            Standards, ledarskap och träningskultur gör oss redo att känna igen matchtillståndet,
            välja prioritering och agera tillsammans.
          </p>
        </div>

        {/* Niva 1: fyra levande skeden */}
        <div className="mt-12 border-t border-border pt-8">
          <LevelBadge level={1} className="mb-4" />
          <h3 className="mb-5 text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
            Fyra levande skeden — en rad var
          </h3>
          <ul className="divide-y divide-border border border-border bg-card">
            {FAS_RADER.map((fas) => (
              <li key={fas.id}>
                <a
                  href={`#${fas.id}`}
                  className="group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <span className="flex shrink-0 items-baseline gap-3 sm:w-64">
                    <span className="font-mono text-[10px] font-black text-amber-700">{fas.num}</span>
                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-foreground">
                      {fas.title}
                    </span>
                  </span>
                  <span className="text-sm text-foreground/70 group-hover:text-foreground">
                    {fas.remember}
                  </span>
                  <ArrowDown className="ml-auto hidden h-3.5 w-3.5 shrink-0 self-center text-muted-foreground transition-colors group-hover:text-amber-600 sm:block" strokeWidth={2.4} />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Klicka på en fas för principerna (nivå 2) och fördjupningen (nivå 3) längre ner på sidan.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55">Särskilda kategorier</p>
          <ul className="divide-y divide-border border border-border bg-card">
            {SPECIAL_RADER.map((fas) => (
              <li key={fas.id}>
                <a href={`#${fas.id}`} className="group flex flex-col gap-1 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-baseline sm:gap-4 sm:p-5">
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-foreground/55 sm:w-24">
                    {fas.id === "identitet" ? "Tvärgående" : "Död boll"}
                  </span>
                  <span className="font-mono text-[11px] font-black uppercase tracking-[0.14em] text-foreground sm:w-48">{fas.title}</span>
                  <span className="text-sm text-foreground/70 group-hover:text-foreground">{fas.remember}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
