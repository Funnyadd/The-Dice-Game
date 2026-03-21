import { useEffect } from "react";
import { NB_DICE } from "../game/constants";
import { useGame } from "../game/useGame";
import TileButton from "./TileButton";
import Dice from "./dice/Dice";

const Board = () => {
    const { gameData, canRollDice, rollDice } = useGame();
    const { tiles } = gameData;

    useEffect(() => {
        document.documentElement.style.setProperty("--tile-count", String(tiles.length));
    }, [tiles.length]);

    return (
        <div className="board-container">
            <div className="tile-container">
                {tiles.map((tile) => (
                    <TileButton key={tile.number} tile={tile} />
                ))}
            </div>

            <hr className="board-separator" />

            <div className="dice-box">
                <Dice
                    disabled={!canRollDice}
                    count={NB_DICE}
                    onRollComplete={(values) => {
                        rollDice(values);
                    }}
                />
            </div>
        </div>
    );
};

export default Board;
