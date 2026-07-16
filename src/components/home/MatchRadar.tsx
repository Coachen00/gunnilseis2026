import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./MatchRadar.css";

const goalMinutes = [
  { bucket: "0–15", for: 6, against: 2 },
  { bucket: "16–30", for: 3, against: 0 },
  { bucket: "31–45+", for: 9, against: 2 },
  { bucket: "46–60", for: 4, against: 1 },
  { bucket: "61–75", for: 7, against: 1 },
  { bucket: "76–90+", for: 10, against: 5 },
];

const scorers = [
  { name: "Haris Avdiu", goals: 16, assists: 1 },
  { name: "Idris Abdi", goals: 8, assists: 0 },
  { name: "Leodon Johansson", goals: 7, assists: 1 },
  { name: "Yosef Ismail", goals: 6, assists: 3 },
  { name: "Kamal Mustafa", goals: 5, assists: 6 },
];

const form = [
  ["Göteborgs FF", "3–2", "vinst"],
  ["Surte IS FK", "9–0", "vinst"],
  ["Romelanda UF", "2–1", "vinst"],
  ["Qviding FIF", "1–3", "förlust"],
  ["Skärhamns IK", "3–1", "vinst"],
  ["Skepplanda BTK", "1–2", "förlust"],
  ["Högsäters GF", "5–1", "vinst"],
  ["Hässleholmen BK", "5–1", "vinst"],
] as const;

function FormRail() {
  const items = [...form, ...form];
  return (
    <div className="match-radar__rail" aria-label="Verifierade matchresultat från researchen">
      <div className="match-radar__rail-track">
        {items.map(([opponent, score, outcome], index) => (
          <div className="match-radar__match" key={`${opponent}-${index}`}>
            <span className={`match-radar__result match-radar__result--${outcome}`} aria-hidden="true">
              {outcome === "vinst" ? "V" : "F"}
            </span>
            <span>{opponent}</span>
            <strong>{score}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchRadar() {
  const canMeasureChart = typeof ResizeObserver !== "undefined";

  return (
    <section className="match-radar" aria-labelledby="match-radar-title">
      <div className="match-radar__topline">
        <span className="match-radar__eyebrow">Matchradar · läget i vår</span>
        <span className="match-radar__source">Research uppdaterad 27 juni 2026</span>
      </div>
      <div className="match-radar__heading">
        <div>
          <h2 id="match-radar-title">Siffrorna som<br /><em>flyttar sig.</em></h2>
          <p>23 matcher rekonstruerade. Här syns när Gunnilse gör ont — och vem som gör det.</p>
        </div>
        <div className="match-radar__record" aria-label="16 vinster, 4 oavgjorda, 3 förluster">
          <strong>16<span>–</span>4<span>–</span>3</strong>
          <small>V · O · F</small>
        </div>
      </div>

      <FormRail />

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
          <p className="match-radar__note">39 gjorda och 11 insläppta seriemål. 76–90+ är både lagets hetaste och mest sårbara fönster.</p>
        </div>

        <div className="match-radar__chart-card match-radar__chart-card--scorers">
          <div className="match-radar__card-heading">
            <div><span className="match-radar__mini-label">Offensiv hierarki</span><h3>De som lämnar avtryck</h3></div>
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
          <p className="match-radar__note">Verifierad toppbild från spelarprofiler — inte en komplett truppstatistik.</p>
        </div>
      </div>
    </section>
  );
}
