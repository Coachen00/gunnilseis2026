import { remainingMatches, SEASON_MATCHES } from "@/data/season";
import { remainingTrainings, TRAINING_SCHEDULE } from "@/data/teamCalendar";

function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long" }).format(d);
}

/* Träningsrytm + räknare för hur mycket som är kvar av säsongen. Visas på
 * startsidan både utloggad (App.tsx HomeRoute) och inloggad (Hem.tsx). */
export default function SeasonCountdownCard({ now = new Date() }: { now?: Date }) {
  const trainings = remainingTrainings(now);
  const matches = remainingMatches(SEASON_MATCHES, now);
  const finale = matches[matches.length - 1];
  const finaleLabel = finale ? formatMatchDate(finale.date) : "";

  return (
    <div className="grid w-full max-w-2xl gap-4 rounded-2xl border-[1.5px] border-kedja-border bg-white px-7 py-6 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-kedja-green">
          Vi tränar
        </p>
        <p className="text-xl font-black tracking-tight text-kedja-ink sm:text-2xl">
          {TRAINING_SCHEDULE.days.join(" · ")}
        </p>
        <p className="mt-1 text-[15px] text-kedja-deep">
          {TRAINING_SCHEDULE.time} · {TRAINING_SCHEDULE.venue}
        </p>
      </div>
      <div className="flex gap-6 sm:border-l sm:border-kedja-border sm:pl-6">
        <div>
          <p className="text-3xl font-black tabular-nums text-kedja-ink">{trainings.length}</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-kedja-deep">träningar kvar</p>
        </div>
        <div>
          <p className="text-3xl font-black tabular-nums text-kedja-ink">{matches.length}</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-kedja-deep">matcher kvar</p>
        </div>
      </div>
      {finaleLabel && (
        <p className="text-sm text-kedja-deep sm:col-span-2">
          Säsongen avslutas {finaleLabel} · {finale.opponent}{" "}
          {finale.homeAway === "home" ? "hemma" : "borta"}.
        </p>
      )}
    </div>
  );
}
