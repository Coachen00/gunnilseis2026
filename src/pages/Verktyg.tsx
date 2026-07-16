import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";

const tools = [
  {
    to: "/spelmodell-labb",
    label: "Spelmodell-labb",
    desc: "Fokus, matchbild och passupplägg.",
  },
  {
    to: "/coach/traningsplanering-host-2026",
    label: "Träningsplanering",
    desc: "Fyra moment per pass och länkar till Taktiktavlan.",
  },
  {
    to: "/traningsplan",
    label: "Träningsplan",
    desc: "A4 för passet.",
  },
  {
    to: "/matchblad",
    label: "Matchblad",
    desc: "Trupp och fokuspunkter.",
  },
  {
    to: "/motstandaranalys",
    label: "Motståndaranalys",
    desc: "Styrkor, svagheter och plan.",
  },
  {
    to: "/taktiktavla",
    label: "Taktiktavla",
    desc: "Flytta spelare och rita sekvenser.",
  },
];

const NAV_ITEMS = tools.map(({ to, label, desc }, index) => ({
  num: String(index + 1).padStart(2, "0"),
  title: label,
  sub: desc,
  href: to,
}));

const Verktyg = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Coach"
      title="Coachmaterial"
      lead="Välj det du behöver inför träning eller match."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>
  </div>
);

export default Verktyg;
