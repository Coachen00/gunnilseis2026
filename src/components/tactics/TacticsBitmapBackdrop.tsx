import { useEffect, useState, type CSSProperties } from "react";
import {
  getTacticsBoardAsset,
  type TacticsBoardScene,
} from "@/data/tacticsBoardAssets";
import {
  CoachboardScene,
  CustomImageScene,
  MatchOverviewScene,
  NeutralAnalysisScene,
  NightPitchScene,
  TrainingPitchPaintedScene,
  WhiteboardScene,
} from "@/components/tactics/PaintedScenes";

type TacticsBitmapBackdropProps = {
  scene: TacticsBoardScene;
};

/**
 * Mappar scener till sin React-komponent. Alla scener är svg — de foto-
 * realistiska bitmaparna hade planlinjer inbakade i bilden, vilket krockade
 * med CSS-linjerna på #pitch. <img>-vägen finns kvar för custom_image.
 */
const SVG_SCENES: Partial<Record<TacticsBoardScene, React.FC<{ className?: string; style?: CSSProperties }>>> = {
  training_pitch: TrainingPitchPaintedScene,
  whiteboard: WhiteboardScene,
  night_pitch: NightPitchScene,
  match_overview: MatchOverviewScene,
  coachboard: CoachboardScene,
  neutral_analysis: NeutralAnalysisScene,
  // custom_image: bara en minimal mörk fallback-yta — den riktiga bilden
  // renderas via #tactics-custom-image, utanför den här React-roten.
  custom_image: CustomImageScene,
};

const TacticsBitmapBackdrop = ({ scene }: TacticsBitmapBackdropProps) => {
  const asset = getTacticsBoardAsset(scene);
  const [bitmapSource, setBitmapSource] = useState(asset.src ?? "");
  const SvgScene = SVG_SCENES[scene];

  useEffect(() => {
    setBitmapSource(asset.src ?? "");
  }, [asset.src, scene]);

  // Wrapper-fig är alltid `pointer-events: none` (sätt också via CSS),
  // så backdrop aldrig fångar klick från taktikytan.
  const wrapperStyle: CSSProperties = {
    "--tactics-backdrop-position": asset.objectPosition,
    backgroundColor: asset.fallback,
    pointerEvents: "none",
  } as CSSProperties;

  return (
    <figure
      className="tactics-backdrop"
      aria-hidden="true"
      data-board-bounds={`${asset.boardBounds.x},${asset.boardBounds.y},${asset.boardBounds.width},${asset.boardBounds.height}`}
      data-scene={scene}
      data-scene-kind={asset.kind}
      style={wrapperStyle}
    >
      {asset.kind === "bitmap" && asset.src && (
        <img
          className="tactics-backdrop__image"
          src={bitmapSource || asset.src}
          alt=""
          draggable={false}
          onError={() => {
            if (asset.fallbackSrc && bitmapSource !== asset.fallbackSrc) {
              setBitmapSource(asset.fallbackSrc);
            }
          }}
        />
      )}
      {asset.kind === "svg" && SvgScene && (
        <SvgScene
          className="tactics-backdrop__image tactics-backdrop__svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      )}
      {/* Soft-light tone over the entire scene — håller scenen visuellt enhetlig.
          Lätt nog att taktiken alltid är lättast att läsa. */}
      <span className="tactics-backdrop__tone" />
    </figure>
  );
};

export default TacticsBitmapBackdrop;
