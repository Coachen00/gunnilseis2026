/**
 * HomeWorlds — andra delen av startsidan, under NextActionsStrip.
 *
 * Mål: efter "nästa handling" (match) ska spelaren snabbt nå resten av sin
 * vardag — veckans träning, spelmodellens skeden och laget. Coach/Prisma ligger
 * diskret sist (främst för ledare/Joel).
 *
 * Auth: endast inloggade. Match-/taktik-/truppinfo får aldrig läcka.
 */

import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarClock, Compass, Users } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Label } from "@/components/WorldBadge";
import { cn } from "@/lib/utils";

type Entry = { label: string; to: string };

const spelmodell: Entry[] = [
  { label: "Anfall", to: "/anfall" },
  { label: "Försvar", to: "/forsvar" },
  { label: "Omställning anfall", to: "/omstallning-anfall" },
  { label: "Omställning försvar", to: "/omstallning-forsvar" },
  { label: "Fasta situationer", to: "/fasta" },
];

const laget: Entry[] = [
  { label: "Trupp", to: "/truppen" },
  { label: "Spelarvård", to: "/spelarvard" },
  { label: "Personliga träningsscheman - Semester 2026", to: "/semestern-2026" },
  { label: "Tävlingar", to: "/tavlingar" },
];

const traning: Entry[] = [
  { label: "Sommaruppstart — vägen till 8/8", to: "/maj-2026/uppstart" },
  { label: "Träningsplan (A4)", to: "/traningsplan" },
  { label: "Alla verktyg", to: "/verktyg" },
];

function EntryList({ entries, accentRing }: { entries: Entry[]; accentRing: string }) {
  return (
    <ul className="divide-y divide-border/70 border-y border-border/70">
      {entries.map((e) => (
        <li key={e.to}>
          <Link
            to={e.to}
            className={cn(
              "group flex min-h-[44px] items-center justify-between gap-3 px-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground",
              accentRing
            )}
          >
            {e.label}
            <ArrowUpRight
              className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HomeWorlds() {
  const { isAuthed, loading } = useAuthSession();
  if (loading || !isAuthed) return null;

  return (
    <section aria-label="Hitta rätt snabbt" className="border-t border-border bg-background py-12 md:py-16">
      <div className="container">
        <div className="mb-8">
          <Label>Hitta rätt snabbt</Label>
          <h2 className="mt-2 text-xl font-black tracking-tight text-foreground md:text-2xl">Din vecka</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Veckans träning */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <CalendarClock className="h-4 w-4 text-amber-700" strokeWidth={2.2} aria-hidden="true" />
              <Label world="spelmodell">Veckans träning</Label>
            </div>
            <EntryList entries={traning} accentRing="hover:pl-2" />
          </div>

          {/* Spelmodell */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Compass className="h-4 w-4 text-amber-700" strokeWidth={2.2} aria-hidden="true" />
              <Label world="spelmodell">Spelmodell</Label>
            </div>
            <EntryList entries={spelmodell} accentRing="hover:pl-2" />
            <Link
              to="/spelmodell"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
            >
              Hela spelmodellen
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>

          {/* Laget */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Users className="h-4 w-4 text-stone-600" strokeWidth={2.2} aria-hidden="true" />
              <Label world="laget">Laget</Label>
            </div>
            <EntryList entries={laget} accentRing="hover:pl-2" />
            <Link
              to="/laget"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:underline"
            >
              Till laget
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Coach — diskret, för ledare */}
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6">
          <Label world="coach">För ledare</Label>
          <Link to="/coach" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Coach: Prisma 2026 · 5⁵ · hur systemet hänger ihop →
          </Link>
        </div>
      </div>
    </section>
  );
}
