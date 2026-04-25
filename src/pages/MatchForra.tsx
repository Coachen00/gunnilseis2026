import PageHero from "@/components/PageHero";
import MatchHeader from "@/components/match/MatchHeader";
import MatchPicker from "@/components/match/MatchPicker";
import PhaseBlock from "@/components/match/PhaseBlock";
import { useMatch } from "@/hooks/useMatch";

const MatchForra = () => {
  const { match } = useMatch("played");

  return (
  <>
    <PageHero
      eyebrow="Match · Förra"
      title="Förra matchen"
      description="Vad hände, vad lärde vi oss, vad tar vi med oss. Texter och media sparas automatiskt."
    />
    <div className="container pb-24 space-y-12">
      <MatchPicker status="played" currentMatchId={match?.id} />
      <MatchHeader status="played" />

      <PhaseBlock
        status="played"
        badge="Bra"
        title="Det här fungerade"
        sectionKey="bra"
        fields={[
          { key: "bra-1", label: "1", placeholder: "Vad gick enligt plan?" },
          { key: "bra-2", label: "2", placeholder: "Något mer som vi tar med oss?" },
        ]}
      />

      <PhaseBlock
        status="played"
        badge="Förbättra"
        title="Det här tar vi tag i"
        sectionKey="forbattra"
        fields={[
          { key: "forb-1", label: "1", placeholder: "Konkret förbättring" },
          { key: "forb-2", label: "2", placeholder: "Konkret förbättring" },
        ]}
      />

      <PhaseBlock
        status="played"
        badge="Anfallsspel"
        title="Anfallsspel — så blev det"
        sectionKey="anfall"
        fields={[
          { key: "vad-blev", label: "Vad blev det?", placeholder: "Hur såg vårt anfallsspel ut?" },
          { key: "moment", label: "Moment att titta på", placeholder: "Specifika sekvenser" },
        ]}
        mediaSlots={[{ key: "anfall-klipp", title: "Klipp anfall", description: "YouTube-länk eller film." }]}
      />

      <PhaseBlock
        status="played"
        badge="Försvarsspel"
        title="Försvarsspel — så blev det"
        sectionKey="forsvar"
        fields={[
          { key: "vad-blev", label: "Vad blev det?", placeholder: "Hur försvarade vi?" },
          { key: "moment", label: "Moment att titta på", placeholder: "Specifika sekvenser" },
        ]}
        mediaSlots={[{ key: "forsvar-klipp", title: "Klipp försvar" }]}
      />

      <PhaseBlock
        status="played"
        badge="Omställningar"
        title="Omställningar"
        sectionKey="omst"
        fields={[
          { key: "anf-fors", label: "Anfall → försvar", placeholder: "Hur reagerade vi vid bollförlust?" },
          { key: "fors-anf", label: "Försvar → anfall", placeholder: "Hur startade vi om?" },
        ]}
      />

      <PhaseBlock
        status="played"
        badge="Fasta"
        title="Fasta situationer"
        sectionKey="fasta"
        fields={[
          { key: "anfall", label: "Våra fasta", placeholder: "Hörnor, frisparkar, inkast" },
          { key: "forsvar", label: "Försvar fasta", placeholder: "Höll zonen? Höll markeringen?" },
        ]}
        mediaSlots={[{ key: "fasta-klipp", title: "Klipp fasta situationer" }]}
      />

      <PhaseBlock
        status="played"
        badge="Lärdom"
        title="Lärdomar till nästa match"
        sectionKey="lardomar"
        fields={[
          { key: "lar-1", label: "1", placeholder: "Vad tar vi med oss?" },
          { key: "lar-2", label: "2", placeholder: "Vad ändrar vi?" },
        ]}
      />
    </div>
  </>
  );
};

export default MatchForra;
