import TileButton from "./TileButton";
import type { BoardProps } from "../game/types";

const Board = ({ tiles, onTileClick }: BoardProps) => {
    return (
        <div className="tile-container">
            {tiles.map((tile) => (
                <TileButton key={tile.number} tile={tile} onClick={onTileClick} />
            ))}
        </div>
    );
};

export default Board;
