import { useState, type CSSProperties } from "react";
import {
  getTacticsBoardAsset,
  type TacticsBoardScene,
} from "@/data/tacticsBoardAssets";

type TacticsBitmapBackdropProps = {
  scene: TacticsBoardScene;
};

const TacticsBitmapBackdrop = ({ scene }: TacticsBitmapBackdropProps) => {
  const asset = getTacticsBoardAsset(scene);
  const [source, setSource] = useState(asset.src);

  return (
    <figure
      className="tactics-backdrop"
      aria-hidden="true"
      data-board-bounds={`${asset.boardBounds.x},${asset.boardBounds.y},${asset.boardBounds.width},${asset.boardBounds.height}`}
      data-scene={scene}
      style={
        {
          "--tactics-backdrop-position": asset.objectPosition,
          backgroundColor: asset.fallback,
          pointerEvents: "none",
        } as CSSProperties
      }
    >
      <img
        className="tactics-backdrop__image"
        src={source}
        alt=""
        draggable={false}
        onError={() => {
          if (source !== asset.fallbackSrc) setSource(asset.fallbackSrc);
        }}
      />
      <span className="tactics-backdrop__tone" />
    </figure>
  );
};

export default TacticsBitmapBackdrop;
