/**
 * Spelarvard — "Ta hand om dig själv" som egen sida (/spelarvard).
 *
 * Tidigare låg sektionen längst ner inne på Veckans match. Nu är den en egen
 * sida med egen menypost: varje avsnitt (kost, sömn, gym, sommar …) är uppöppnat
 * och har ett eget dokumentgalleri där tränarstaben (admin) laddar upp PDF,
 * PowerPoint, HTML eller länkar. Spelaren klickar ett kort och öppnar materialet.
 *
 * Copy/avsnitt: src/data/spelarvard.ts. Filer: src/hooks/useSpelarvardDocs.ts.
 */

import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionReveal from "@/components/SectionReveal";
import SpelarvardDocs from "@/components/spelarvard/SpelarvardDocs";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSpelarvardDocs } from "@/hooks/useSpelarvardDocs";
import {
  SPELARVARD_INTRO,
  SPELARVARD_SECTIONS,
  SPELARVARD_SOURCE_NOTE,
  SPELARVARD_TITLE,
} from "@/data/spelarvard";

const Spelarvard = () => {
  const { isAdmin } = useIsAdmin();
  const { bySection, uploadDoc, addLink, deleteDoc } = useSpelarvardDocs();

  return (
    <>
      <PageHero eyebrow="Spelare · Vård" title={SPELARVARD_TITLE} description={SPELARVARD_INTRO} />

      <div className="container space-y-6 pb-section md:space-y-8">
        {isAdmin && (
          <SectionReveal>
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-50/60 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={2.2} />
              <p className="text-sm font-semibold leading-relaxed text-amber-900">
                Adminläge — du kan ladda upp PDF, PowerPoint, HTML eller länkar i varje avsnitt nedan.
                Materialet syns direkt för spelarna.
              </p>
            </div>
          </SectionReveal>
        )}

        {SPELARVARD_SECTIONS.map((section, i) => (
          <SectionReveal key={section.id}>
            <article id={section.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 md:p-7">
              <header className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 font-mono text-[12px] font-black text-amber-800">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black tracking-tight text-foreground md:text-2xl">{section.title}</h2>
                    {section.proposal && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-amber-800">
                        Förslag
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-muted-foreground">{section.question}</p>
                </div>
              </header>

              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((b, bi) => (
                  <li key={bi} className="grid grid-cols-[22px_1fr] items-baseline gap-2">
                    <span className="font-mono text-[10px] font-black text-amber-700">{String(bi + 1).padStart(2, "0")}</span>
                    <span className="text-sm leading-relaxed text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>

              <SpelarvardDocs
                sectionId={section.id}
                docs={bySection.get(section.id) ?? []}
                isAdmin={isAdmin}
                onUpload={uploadDoc}
                onAddLink={addLink}
                onDelete={deleteDoc}
              />
            </article>
          </SectionReveal>
        ))}

        <SectionReveal>
          <p className="text-xs text-muted-foreground">{SPELARVARD_SOURCE_NOTE}</p>
        </SectionReveal>

        <SectionReveal>
          <Link
            to="/match/kommande"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-foreground transition hover:border-amber-500/60"
          >
            Till veckans match
            <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
          </Link>
        </SectionReveal>
      </div>
    </>
  );
};

export default Spelarvard;
