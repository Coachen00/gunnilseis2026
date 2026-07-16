/**
 * Spelarvard — "Ta hand om dig själv" som egen sida (/spelarvard).
 *
 * Materialet är grupperat i OMRÅDEN (kost, sömn, gym, sommar) som väljs i en
 * rullgardin högst upp. Sidan visar ett område i taget — minsta möjliga val
 * för den minst tekniske spelaren. Varje avsnitt har ett dokumentgalleri som
 * blandar inbyggt material (följer med bygget) med det tränarstaben (admin)
 * laddar upp. Spelaren klickar ett kort och öppnar materialet.
 *
 * Områden/copy: src/data/spelarvard.ts. Doc-data: src/hooks/useSpelarvardDocs.ts.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import KedjaHero from "@/components/kedja/KedjaHero";
import SectionReveal from "@/components/SectionReveal";
import SpelarvardDocs from "@/components/spelarvard/SpelarvardDocs";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSpelarvardDocs, type SpelarvardDoc } from "@/hooks/useSpelarvardDocs";
import {
  SPELARVARD_AREAS,
  SPELARVARD_INTRO,
  SPELARVARD_SECTIONS,
  SPELARVARD_SOURCE_NOTE,
  SPELARVARD_TITLE,
  type BuiltinDoc,
} from "@/data/spelarvard";

/** Inbyggt material → samma form som ett dokument från Supabase. */
function builtinToDoc(sectionId: string, b: BuiltinDoc, order: number): SpelarvardDoc {
  return {
    id: `builtin-${b.id}`,
    section_id: sectionId,
    title: b.title,
    doc_kind: b.kind,
    source_kind: "url",
    url: b.url,
    storage_path: null,
    caption: b.caption ?? null,
    sort_order: order,
    builtin: true,
  };
}

const Spelarvard = () => {
  const { isAdmin } = useIsAdmin();
  const { bySection, uploadDoc, addLink, deleteDoc } = useSpelarvardDocs();
  const [areaId, setAreaId] = useState<string>(SPELARVARD_AREAS[0]?.id ?? "");

  const sectionById = useMemo(
    () => new Map(SPELARVARD_SECTIONS.map((s) => [s.id, s])),
    [],
  );

  const area = SPELARVARD_AREAS.find((a) => a.id === areaId) ?? SPELARVARD_AREAS[0];
  const sections = area.sectionIds
    .map((id) => sectionById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="bg-kedja-paper">
      <KedjaHero eyebrow="Spelare · Vård" title={SPELARVARD_TITLE} lead={SPELARVARD_INTRO} />

      <div className="container space-y-6 pb-section md:space-y-8">
        {isAdmin && (
          <SectionReveal>
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-50/60 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={2.2} />
              <p className="text-sm font-semibold leading-relaxed text-amber-900">
                Adminläge — du kan ladda upp PDF, PowerPoint, HTML eller länkar i varje avsnitt nedan.
                Materialet syns direkt för spelarna. Inbyggt material går inte att ta bort här.
              </p>
            </div>
          </SectionReveal>
        )}

        {/* Rullgardin: välj område */}
        <SectionReveal>
          <div className="rounded-2xl border border-kedja-border bg-white p-4 md:p-5">
            <label
              htmlFor="spelarvard-omrade"
              className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-kedja-deep/70"
            >
              Välj område
            </label>
            <div className="relative mt-2">
              <select
                id="spelarvard-omrade"
                value={area.id}
                onChange={(e) => setAreaId(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-kedja-border bg-white pl-4 pr-10 text-base font-black tracking-tight text-kedja-ink outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
              >
                {SPELARVARD_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.emoji}  {a.label}
                  </option>
                ))}
              </select>
              <ArrowRight
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-amber-600"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-kedja-deep/70">{area.blurb}</p>
          </div>
        </SectionReveal>

        {sections.map((section, i) => {
          const builtins = (section.builtinDocs ?? []).map((b, bi) =>
            builtinToDoc(section.id, b, bi),
          );
          const docs = [...builtins, ...(bySection.get(section.id) ?? [])];

          return (
            <SectionReveal key={section.id}>
              <article id={section.id} className="scroll-mt-24 rounded-2xl border border-kedja-border bg-white p-5 md:p-7">
                <header className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 font-mono text-[12px] font-black text-amber-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black tracking-tight text-kedja-ink md:text-2xl">{section.title}</h2>
                      {section.proposal && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-amber-800">
                          Förslag
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-kedja-deep/70">{section.question}</p>
                  </div>
                </header>

                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((b, bi) => (
                    <li key={bi} className="grid grid-cols-[22px_1fr] items-baseline gap-2">
                      <span className="font-mono text-[10px] font-black text-amber-700">{String(bi + 1).padStart(2, "0")}</span>
                      <span className="text-sm leading-relaxed text-kedja-ink/90">{b}</span>
                    </li>
                  ))}
                </ul>

                <SpelarvardDocs
                  sectionId={section.id}
                  docs={docs}
                  isAdmin={isAdmin}
                  onUpload={uploadDoc}
                  onAddLink={addLink}
                  onDelete={deleteDoc}
                />
              </article>
            </SectionReveal>
          );
        })}

        <SectionReveal>
          <p className="text-xs text-kedja-deep/70">{SPELARVARD_SOURCE_NOTE}</p>
        </SectionReveal>

        <SectionReveal>
          <Link
            to="/match/kommande"
            className="inline-flex items-center gap-1.5 rounded-md border border-kedja-border bg-white px-3.5 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-kedja-ink transition hover:border-amber-500/60"
          >
            Till veckans match
            <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
          </Link>
        </SectionReveal>
      </div>
    </div>
  );
};

export default Spelarvard;
