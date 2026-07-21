import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";

const NAV_ITEMS = [
  { num: "01", title: "Trupp", sub: "Spelare", href: "/truppen" },
  { num: "02", title: "Spelarvård", sub: "Hälsa", href: "/spelarvard" },
  { num: "03", title: "Personliga träningsscheman", sub: "Semester 2026", href: "/semestern-2026" },
  { num: "04", title: "Tävlingar", sub: "Säsong", href: "/tavlingar" },
];

const Laget = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Laget"
      title="Laget"
      lead="Allt runt truppen — vilka vi är, hur vi håller oss i form och vad vi spelar."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>
  </div>
);

export default Laget;
