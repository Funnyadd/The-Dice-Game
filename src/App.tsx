import { useReducer } from "react";
import Board from "./components/Board";
import { DEFAULT_DICE_MESSAGE, NB_TILES } from "./game/constants";
import { getRemainingScore } from "./game/logic";
import { createInitialGameData, gameReducer } from "./game/reducer";

const App = () => {
    const [gameData, dispatch] = useReducer(gameReducer, NB_TILES, createInitialGameData);

    const { gameState, diceResult, tiles, error } = gameData;

    const score = gameState === "won" ? 0 : getRemainingScore(tiles);

    let resultMessage = "";
    if (gameState === "won") resultMessage = "You won! Your score is 0.";
    else if (gameState === "lost") resultMessage = `You lost! Your score is ${score}.`;

    const handleRollDiceClick = () => dispatch({ type: "ROLL_DICE" });
    const handleResetGameClick = () => dispatch({ type: "RESET_GAME" });
    const handleTileClick = (tileNumber: number) => dispatch({ type: "TOGGLE_TILE", tileNumber });

    return (
        <main className="app-shell">
            <section className="board-stage">
                <Board tiles={tiles} onTileClick={handleTileClick} />
            </section>

            <section className="hud-card">
                <div className="control-row">
                    <button className="action-btn" onClick={handleRollDiceClick}>
                        Roll the Dice
                    </button>

                    <div className="status-pill">
                        <strong>Current roll:</strong>
                        <span>{diceResult ?? DEFAULT_DICE_MESSAGE}</span>
                    </div>

                    <button className="action-btn" onClick={handleResetGameClick}>
                        Reset
                    </button>
                </div>

                {resultMessage ? <p className="hud-message status-message">{resultMessage}</p> : null}
                {error ? <p className="hud-message error-message">{error}</p> : null}
            </section>
        </main>
    );
};

export default App;
