import PageHero from "@/components/PageHero";
import MatchHeader from "@/components/match/MatchHeader";
import PhaseBlock from "@/components/match/PhaseBlock";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FALLBACK_URL = "/matchplan-lerum.html";
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-matchplan`;

const MatchKommande = () => {
  const [matchplanUrl, setMatchplanUrl] = useState<string>(FALLBACK_URL);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    fetch(FUNCTION_URL, { method: "HEAD" })
      .then((r) => {
        if (r.ok) setMatchplanUrl(`${FUNCTION_URL}?t=${Date.now()}`);
      })
      .catch(() => {
        setMatchplanUrl(FALLBACK_URL);
      });
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-matchplan");
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error ?? "Okänt fel");
      setMatchplanUrl(`${data.viewUrl ?? FUNCTION_URL}?t=${Date.now()}`);
      setLastSynced(new Date().toLocaleTimeString("sv-SE"));
      toast({ title: "Matchplan uppdaterad", description: "Senaste versionen från GitHub är nu live." });
    } catch (e) {
      toast({
        title: "Synk misslyckades",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
   <>
    <PageHero
      eyebrow="Match · Veckans"
      title="Veckans match"
      description="Motståndare, plan, fokus — allt på ett ställe inför avspark. Texter och media sparas automatiskt."
    />
    <div className="container pb-24 space-y-12">
      <MatchHeader status="upcoming" />

      <div className="rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 to-accent/10 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1">
              Interaktiv matchplan
            </p>
            <h3 className="text-lg md:text-xl font-black text-foreground truncate">
              Matchplan — Gunnilse IS vs Lerum IS
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Öppnas i ny flik. Synkas från GitHub — alltid senaste versionen.
              {lastSynced && <span className="ml-1">Senast synkad {lastSynced}.</span>}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary/40 bg-background text-foreground font-bold text-sm hover:border-primary disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Synkar…" : "Synka från GitHub"}
            </button>
            <a
              href={matchplanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:gap-3 transition-all"
            >
              Öppna matchplan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <PhaseBlock
        status="upcoming"
        badge="Motståndare"
        title="Motståndaranalys"
        subtitle="Formation, styrkor, svagheter och triggers."
        sectionKey="motstandare"
        fields={[
          { key: "formation", label: "Formation", placeholder: "t.ex. 4-4-2" },
          { key: "styrkor", label: "Styrkor", placeholder: "Vad gör de bra?" },
          { key: "svagheter", label: "Svagheter", placeholder: "Vad kan vi utnyttja?" },
          { key: "triggers", label: "Triggers", placeholder: "När pressar/drar de?" },
        ]}
        mediaSlots={[
          { key: "formation-bild", title: "Formationsbild", description: "Bild eller film på deras uppställning." },
          { key: "klipp", title: "Klipp att titta på", description: "Länka YouTube eller ladda upp." },
        ]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Anfallsspel"
        title="Plan i anfall"
        subtitle="Hur vi tänker bygga upp och skapa lägen."
        sectionKey="anfall"
        fields={[
          { key: "uppbyggnad", label: "Uppbyggnad", placeholder: "Hur bygger vi upp mot deras press?" },
          { key: "yta", label: "Var skapar vi yta?", placeholder: "Korridor, spelyta…" },
          { key: "avslut", label: "Avslutsmönster", placeholder: "Cutback, djupledspass…" },
        ]}
        mediaSlots={[{ key: "anfall-bild", title: "Anfallsskiss" }]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Försvarsspel"
        title="Plan i försvar"
        subtitle="Pressmönster och hur vi försvarar våra korridorer."
        sectionKey="forsvar"
        fields={[
          { key: "press", label: "Press-trigger", placeholder: "När pressar vi?" },
          { key: "kompakthet", label: "Kompakthet", placeholder: "Hur tight ska vi stå?" },
          { key: "korridorer", label: "Korridor-fokus", placeholder: "Tvinga utåt?" },
        ]}
        mediaSlots={[{ key: "forsvar-bild", title: "Försvarsskiss" }]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Omställning"
        title="Omställning anfall → försvar"
        subtitle="Vad gör vi direkt vid bollförlust?"
        sectionKey="omst-forsvar"
        fields={[
          { key: "regel", label: "Regel direkt", placeholder: "Motpress 5 sek?" },
          { key: "fallback", label: "Faller vi tillbaka?", placeholder: "Eller pressar?" },
        ]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Omställning"
        title="Omställning försvar → anfall"
        subtitle="Vad gör vi direkt vid bollvinst?"
        sectionKey="omst-anfall"
        fields={[
          { key: "forsta-pass", label: "Första passet", placeholder: "Djupled? Säkra?" },
          { key: "lopningar", label: "Löpningar", placeholder: "Vem springer i djupled?" },
        ]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Fasta situationer"
        title="Fasta situationer"
        subtitle="Hörnor, frisparkar, inkast — anfall och försvar."
        sectionKey="fasta"
        fields={[
          { key: "hornor-anfall", label: "Hörnor anfall", placeholder: "Vilken signal? Vilka rör sig vart?" },
          { key: "hornor-forsvar", label: "Hörnor försvar", placeholder: "Zon + man-markering" },
          { key: "frisparkar", label: "Frisparkar", placeholder: "Skytt, mur, löpningar…" },
          { key: "inkast", label: "Inkast", placeholder: "Långt eller kort?" },
        ]}
        mediaSlots={[
          { key: "hornor-anfall-bild", title: "Hörna anfall" },
          { key: "hornor-forsvar-bild", title: "Hörna försvar" },
        ]}
      />

      <PhaseBlock
        status="upcoming"
        badge="Fokus"
        title="Veckans fokuspunkter"
        subtitle="3 saker vi särskilt ska göra bra."
        sectionKey="fokus"
        fields={[
          { key: "fokus-1", label: "1", placeholder: "Första fokuset" },
          { key: "fokus-2", label: "2", placeholder: "Andra fokuset" },
          { key: "fokus-3", label: "3", placeholder: "Tredje fokuset" },
        ]}
      />
    </div>
   </>
  );
};

export default MatchKommande;
