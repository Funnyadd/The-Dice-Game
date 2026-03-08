import { useState } from "react";
import { isTileDisabled, isTileDown, isTileSelected } from "../game/logic";
import type { TileButtonProps } from "../game/types";

const TileButton = ({ tile, onClick }: TileButtonProps) => {
    const [jiggleTileNumber, setJiggleTileNumber] = useState<number | null>(null);

    const handleTileOnClick = (tileNumber: number) => {
        if (isTileDisabled(tile)) {
            setJiggleTileNumber(null);
            requestAnimationFrame(() => {
                setJiggleTileNumber(tile.number);
            });
            return;
        }

        onClick(tileNumber);
    };

    return (
        <button
            aria-disabled={isTileDisabled(tile)}
            type="button"
            className={[
                "tile-btn",
                `tile-btn-${tile.state}`,
                jiggleTileNumber === tile.number ? "tile-jiggle-animation" : "",
            ].join(" ")}
            onClick={() => handleTileOnClick(tile.number)}
            onAnimationEnd={() => {
                if (jiggleTileNumber === tile.number) setJiggleTileNumber(null);
            }}
        >
            {isTileDown(tile) || isTileSelected(tile) ? "" : tile.number}
        </button>
    );
};

export default TileButton;
