import TileButton from "./TileButton";
import type { BoardProps } from "../game/types";

const Board = ({ tiles, onTileClick }: BoardProps) => {
    // Need to find a way to make the tiles be higher than the height of the board
    // so that it gives an effect that they are over the edge

    // Replace disabled state by a giggle

    // Add some sort of animation (if possible) from state up to selected

    return (
        <div className="board-container">
            <div className="tile-container">
                {tiles.map((tile) => (
                    <TileButton key={tile.number} tile={tile} onClick={onTileClick} />
                ))}
            </div>
            <hr className="board-separator" />
            <div className="dice-box">{/* Put the dice here ! */}</div>
        </div>
    );
};

export default Board;
