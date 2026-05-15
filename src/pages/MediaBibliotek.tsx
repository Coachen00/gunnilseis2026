import PageHero from "@/components/PageHero";
import MediaLibraryManager from "@/components/media/MediaLibraryManager";
import { Info } from "lucide-react";

const MediaBibliotek = () => {
  return (
    <>
      <PageHero
        eyebrow="Verktyg · Media"
        title="Mediabibliotek"
        description="Ladda upp klipp eller länka från YouTube, koppla mot rätt kategori i spelmodellen och välj om spelarna ska se det."
      />

      <div className="container pb-section space-y-8">
        <div className="flex items-start gap-3 rounded-md border border-border bg-card/40 p-4 text-sm leading-relaxed text-foreground/80">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
          <div>
            <p>
              <strong className="font-bold">Så fungerar det:</strong> tränare laddar upp filmer
              (eller lägger in YouTube-länk), taggar med kategori och datum, och växlar synligheten.
              Klippen visas automatiskt på respektive spelmodell-sida — t.ex. {' '}
              <em>Anfall</em>, <em>Försvar</em>, <em>Identitet</em> — för de spelare som loggat in.
            </p>
          </div>
        </div>

        <MediaLibraryManager />
      </div>
    </>
  );
};

export default MediaBibliotek;
