import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SessionCard from "@/components/period/SessionCard";
import type { Week } from "@/data/period1";

const SessionAccordion = ({ week }: { week: Week }) => (
  <Accordion type="multiple" className="space-y-2">
    {week.sessions.map((session) => {
      const id = `v${week.weekNumber}-${session.day.toLowerCase()}`;
      return (
        <AccordionItem
          key={id}
          value={id}
          className="rounded-lg border border-border bg-card/30 px-4"
        >
          <AccordionTrigger className="py-3 text-left">
            <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 pr-3">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                {session.day} · {session.date}
              </span>
              <span className="text-sm font-black tracking-normal text-foreground md:text-base">
                {session.title.split(" – ").slice(-1)[0]}
              </span>
              <span className="ml-auto hidden text-[11px] font-semibold text-muted-foreground md:inline">
                KPI · {session.kpi}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-1">
            <SessionCard session={session} />
          </AccordionContent>
        </AccordionItem>
      );
    })}
  </Accordion>
);

export default SessionAccordion;
