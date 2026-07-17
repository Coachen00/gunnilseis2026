import KedjaHero from "@/components/kedja/KedjaHero";
import KedjaNav from "@/components/kedja/KedjaNav";
import KedjaSection from "@/components/kedja/KedjaSection";

const NAV_ITEMS = [
  { num: "01", title: "Hörnor", sub: "Inswing/outswing, andrabollszon", href: "#hornor" },
  { num: "02", title: "Frisparkar", sub: "Slagvariant, löpningar, andraboll", href: "#frisparkar" },
  { num: "03", title: "Inkast", sub: "Snabba inkast, långa inkast", href: "#inkast" },
  { num: "04", title: "Avspark", sub: "Mönster för uppspel", href: "#avspark" },
];

const FastaAnfall = () => (
  <div className="bg-kedja-paper">
    <KedjaHero
      eyebrow="Spelmodell · Fasta · Anfall"
      title={
        <>
          Anfall från
          <br />
          <span className="mark-lime">fasta situationer</span>.
        </>
      }
      lead="Hörnor, inläggsfrisparkar, inkast och avspark — offensivt. Tydliga roller, tydliga signaler."
      instruction="Läs uppifrån och ner. Fyra lägen, samma tydlighet."
    >
      <KedjaNav items={NAV_ITEMS} />
    </KedjaHero>

    <KedjaSection
      id="hornor"
      tone="paper"
      eyebrow="Anfall 01"
      title="Offensiva hörnor"
      definition="Inswing/outswing, korta varianter, andrabollszon."
      highlight="andrabollszon"
    >
      <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Fyll på med offensiva hörnvarianter.
      </div>
    </KedjaSection>

    <KedjaSection
      id="frisparkar"
      tone="white"
      eyebrow="Anfall 02"
      title="Inläggsfrisparkar"
      definition="Slagvariant, löpningar, andraboll."
      highlight="andraboll"
    >
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Fyll på med offensiva frisparkar.
      </div>
    </KedjaSection>

    <KedjaSection
      id="inkast"
      tone="paper"
      eyebrow="Anfall 03"
      title="Offensiva inkast"
      definition="Snabba inkast, långa inkast, mönster."
      highlight="mönster"
    >
      <div className="rounded-2xl border border-kedja-border bg-white p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Kasta snabbt framåt när motståndaren sover. Annars längs linjen eller tillbaka-in — kastaren får direkt
        tillbaka och vänder spelet. Aldrig inkast rakt in i trängsel utan andrabollsstöd: närmaste två står för
        andrabollen.
      </div>
    </KedjaSection>

    <KedjaSection
      id="avspark"
      tone="white"
      eyebrow="Anfall 04"
      title="Vår avspark"
      definition="Mönster för uppspel direkt från avspark."
      highlight="uppspel"
    >
      <div className="rounded-2xl border border-kedja-border bg-kedja-paper p-6 text-left text-[15px] leading-[1.55] text-kedja-deep">
        Lång boll mot vänster yttre korridor. Närmaste två attackerar nedslaget — vi äger andrabollen.{" "}
        <span className="font-bold text-kedja-ink">Standard, satt 2026-07.</span>
      </div>
    </KedjaSection>
  </div>
);

export default FastaAnfall;
