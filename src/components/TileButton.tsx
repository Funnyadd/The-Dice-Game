import { useState } from "react";
import { isTileDisabled, isTileDown, isTileSelected } from "../game/logic";
import { useGame } from "../game/useGame";
import type { TileButtonProps } from "../game/types";

const TileButton = ({ tile }: TileButtonProps) => {
    const { toggleTile } = useGame();
    const [jiggleTileNumber, setJiggleTileNumber] = useState<number | null>(null);

    const handleTileOnClick = (tileNumber: number) => {
        if (isTileDown(tile)) {
            return;
        }

        if (isTileDisabled(tile)) {
            setJiggleTileNumber(null);
            requestAnimationFrame(() => {
                setJiggleTileNumber(tile.number);
            });
            return;
        }

        toggleTile(tileNumber);
    };

    return (
        <button
            disabled={isTileDown(tile)}
            className={[
                "tile-btn",
                `tile-btn-${tile.state}`,
                jiggleTileNumber === tile.number ? "tile-jiggle-animation" : "",
            ].join(" ")}
            onClick={() => handleTileOnClick(tile.number)}
            onAnimationEnd={() => {
                if (jiggleTileNumber === tile.number) {
                    setJiggleTileNumber(null);
                }
            }}
        >
            {isTileDown(tile) || isTileSelected(tile) ? "" : tile.number}
        </button>
    );
};

export default TileButton;
