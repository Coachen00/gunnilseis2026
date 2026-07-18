import { Link } from "react-router-dom";
import OwnerOnly from "@/components/OwnerOnly";

const PRIVATE_LAYERS = [
  ["Det jag vill göra", "Bygga en spelmodell som gör nästa beslut tydligare och gör laget bättre förberett."],
  ["Det jag förstår", "Standards, ledarskap, träningskultur och matchobservationer behöver hänga ihop i samma kedja."],
  ["Det jag missar", "Fler ord och principer hjälper inte om spelaren inte vet vad den ska se och göra härnäst."],
  ["Idéer under utveckling", "Här samlar jag hypoteser, frågor och formuleringar innan de blir spelarens material."],
  ["Frågor jag återkommer till", "Vad behöver bli enklare? Vad behöver tränas? Vad såg vi faktiskt i matchen?"],
  ["Från standards till matchobservation", "Jag följer om vardagens standarder syns i ledarskap, träning, matchbeteende och lärande."],
] as const;

export default function Storyn() {
  return (
    <OwnerOnly>
      <main className="min-h-screen bg-amber-50 text-kedja-ink">
        <section className="border-b border-amber-500/30 py-16 md:py-24" aria-labelledby="storyn-title">
          <div className="container">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Kategori 00 · privat</p>
            <h1 id="storyn-title" className="mt-3 text-5xl font-black uppercase tracking-tight md:text-7xl">Storyn</h1>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Var förberedd</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-kedja-deep md:text-xl">
              Min berättelse bakom modellen: vad jag vill bygga, vad jag förstår, vad jag riskerar att missa och hur allt hänger ihop.
            </p>
          </div>
        </section>

        <section className="border-b border-amber-500/30 py-12 md:py-16" aria-labelledby="storyn-layers-title">
          <div className="container">
            <h2 id="storyn-layers-title" className="sr-only">Privata arbetsområden</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {PRIVATE_LAYERS.map(([title, text]) => (
                <article key={title} className="border border-amber-500/30 bg-white p-6">
                  <h3 className="text-xl font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-kedja-deep/80">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16" aria-labelledby="storyn-chain-title">
          <div className="container">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Berättelsens kedja</p>
            <h2 id="storyn-chain-title" className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Från vardag till match och tillbaka till lärande</h2>
            <p className="mt-5 max-w-4xl text-base font-bold leading-relaxed md:text-lg">
              Standards → ledarskap → träningskultur → spelprincip → matchtillstånd → prioritering → beteende → observation → lärande.
            </p>
            <Link to="/spelmodell" className="mt-8 inline-flex min-h-11 items-center border border-kedja-border bg-white px-5 py-3 font-mono text-[11px] font-black uppercase tracking-[0.2em]">
              Till spelmodellen
            </Link>
          </div>
        </section>
      </main>
    </OwnerOnly>
  );
}
