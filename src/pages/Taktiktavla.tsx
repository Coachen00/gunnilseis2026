import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import SimpleTacticsBoard from "@/components/SimpleTacticsBoard";

const Taktiktavla = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/verktyg"
            className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">Verktyg</p>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Taktiktavla</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            En enkel pluppmatta för snabb taktiksnack. Dra spelarna med musen eller fingret. Dubbelklicka en spelare för att döpa den. Byt formation, dölj motståndare eller visa korridorer.
          </p>
        </div>

        <SimpleTacticsBoard />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-border bg-card/40">
            <p className="font-mono uppercase tracking-wider text-accent mb-1">Hemma</p>
            <p className="text-muted-foreground">Guldpluppar med positionsbokstav (MV, VB, CM…).</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card/40">
            <p className="font-mono uppercase tracking-wider text-primary mb-1">Motståndare</p>
            <p className="text-muted-foreground">Marinblåa pluppar med nummer 1–11. Kan döljas.</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card/40">
            <p className="font-mono uppercase tracking-wider text-foreground mb-1">Boll</p>
            <p className="text-muted-foreground">Vit plupp i mitten — flytta dit du vill.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taktiktavla;
