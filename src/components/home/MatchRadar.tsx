import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  matchOutcome,
  SEASON_MATCHES,
  seasonRecord,
  type PlayedMatch,
} from "@/data/season";
import "./MatchRadar.css";

const SERIES = "Division 4A Herr";
const record = seasonRecord(SEASON_MATCHES.filter((m) => m.competition === SERIES));

const seriesThrough = record.played[0]
  ? new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(record.played[0].date),
    )
  : "";

/* Partilles 2–2-kvittering (8 aug) saknar minutangivelse i referatet — den föll
 * mellan deras 2–1 i 53:e och 3–2 i 65:e, och ligger här i 46–60. Får vi
 * exakt minut, flytta den till 61–75 om det visar sig vara efter minut 60.
 * Lerums tredje mål (15 aug) saknar också minut — det föll i andra halvlek
 * före vår reducering i 89:e och ligger här i 61–75. Flytta vid besked.
 * Karebys reducering (29 aug) står som "strax före paus" utan exakt minut —
 * 44 och 45 hamnar i samma hink, så den är entydig ändå.
 * Björkö 2–4 (5 sep) saknar referat och målskyttar helt på svenskalag.se —
 * de sex målen ligger i "Okänd" tills minuterna finns. Flytta dem då och
 * ta bort hinken. */
export const goalMinutes = [
  { bucket: "0–15", for: 8, against: 2 },
  { bucket: "16–30", for: 3, against: 1 },
  { bucket: "31–45+", for: 10, against: 6 },
  { bucket: "46–60", for: 5, against: 3 },
  { bucket: "61–75", for: 9, against: 4 },
  { bucket: "76–90+", for: 13, against: 7 },
  { bucket: "Okänd", for: 2, against: 4 },
];

const scorers = [
  { name: "Haris Avdiu", goals: 19, assists: 1 },
  { name: "Idris Abdi", goals: 8, assists: 0 },
  { name: "Leodon Johansson", goals: 8, assists: 1 },
  { name: "Yosef Ismail", goals: 6, assists: 3 },
  { name: "Kamal Mustafa", goals: 5, assists: 7 },
];

const OUTCOME_LETTER = { vinst: "V", oavgjord: "O", forlust: "F" } as const;

function FormRail({ matches }: { matches: PlayedMatch[] }) {
  const items = [...matches, ...matches];
  return (
    <div
      className="match-radar__rail"
      aria-label={`Spelade seriematcher ${SERIES} 2026, senaste först`}
    >
      <div className="match-radar__rail-track">
        {items.map((m, index) => {
          const outcome = matchOutcome(m);
          return (
            <div className="match-radar__match" key={`${m.id}-${index}`}>
              <span
                className={`match-radar__result match-radar__result--${outcome}`}
                aria-hidden="true"
              >
                {OUTCOME_LETTER[outcome]}
              </span>
              <span>{m.opponent}</span>
              <strong>
                {m.ourScore}–{m.theirScore}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MatchRadar() {
  const canMeasureChart = typeof ResizeObserver !== "undefined";

  return (
    <section className="match-radar" aria-labelledby="match-radar-title">
      <div className="match-radar__topline">
        <span className="match-radar__eyebrow">Matchradar · {SERIES} 2026</span>
        <span className="match-radar__source">
          {seriesThrough ? `Seriedata t.o.m. ${seriesThrough}` : "Seriedata"}
        </span>
      </div>
      <div className="match-radar__heading">
        <div>
          <h2 id="match-radar-title">Siffrorna som<br /><em>flyttar sig.</em></h2>
          <p>
            {record.played.length} spelade seriematcher 2026. Här syns när Gunnilse gör ont — och
            vem som gör det.
          </p>
        </div>
        <div
          className="match-radar__record"
          aria-label={`${record.wins} vinster, ${record.draws} oavgjorda, ${record.losses} förluster på ${record.played.length} spelade seriematcher`}
        >
          <strong>{record.wins}<span>–</span>{record.draws}<span>–</span>{record.losses}</strong>
          <small>V · O · F</small>
        </div>
      </div>

      <FormRail matches={record.played} />

      <div className="match-radar__grid">
        <div className="match-radar__chart-card">
          <div className="match-radar__card-heading">
            <div><span className="match-radar__mini-label">Målminuter</span><h3>När trycket landar</h3></div>
            <span className="match-radar__legend"><i /> Gjorda <i className="is-red" /> Insläppta</span>
          </div>
          <div className="match-radar__chart" role="img" aria-label="Stapeldiagram över målminuter i seriespelet: flest gjorda mål mellan minut 76 och 90 plus">
            {canMeasureChart ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalMinutes} margin={{ top: 8, right: 4, left: -26, bottom: 0 }} barGap={3}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,.1)" />
                  <XAxis dataKey="bucket" tick={{ fill: "#b7c5b8", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#7f9582", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,.05)" }} contentStyle={{ background: "#10231a", border: "1px solid #385b43", borderRadius: 0, color: "#fff" }} />
                  <Bar dataKey="for" name="Gjorda" fill="#c8f36a" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="against" name="Insläppta" fill="#ef6b5f" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="match-radar__fallback-chart">
                {goalMinutes.map((item) => (
                  <div className="match-radar__fallback-column" key={item.bucket}>
                    <div className="match-radar__fallback-bars">
                      <i style={{ height: `${item.for * 10}%` }} />
                      <i className="is-red" style={{ height: `${item.against * 10}%` }} />
                    </div>
                    <span>{item.bucket}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="match-radar__note">
            {record.goalsFor} gjorda och {record.goalsAgainst} insläppta mål på {record.played.length}{" "}
            seriematcher. 76–90+ är både lagets hetaste och mest sårbara fönster.
          </p>
        </div>

        <div className="match-radar__chart-card match-radar__chart-card--scorers">
          <div className="match-radar__card-heading">
            <div><span className="match-radar__mini-label">Offensiv hierarki · research</span><h3>De som lämnar avtryck</h3></div>
            <span className="match-radar__legend"><i /> Mål <i className="is-aqua" /> Assist</span>
          </div>
          <div className="match-radar__scorers">
            {scorers.map((player) => (
              <div className="match-radar__player" key={player.name}>
                <span>{player.name}</span>
                <div className="match-radar__player-bars" aria-label={`${player.name}: ${player.goals} mål, ${player.assists} assist`}>
                  <b style={{ "--bar": `${player.goals / 16 * 100}%` } as React.CSSProperties}>{player.goals}</b>
                  <b className="is-aqua" style={{ "--bar": `${player.assists / 6 * 100}%` } as React.CSSProperties}>{player.assists}</b>
                </div>
              </div>
            ))}
          </div>
          <p className="match-radar__note">
            Från spelarprofilsresearchen 27 juni 2026. Bredare underlag än seriematcherna ovan —
            målen summerar till mer än säsongens {record.goalsFor}. Inte komplett truppstatistik.
          </p>
        </div>
      </div>
    </section>
  );
}
