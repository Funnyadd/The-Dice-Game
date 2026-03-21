import Board from "./components/Board";
import { DEFAULT_DICE_MESSAGE } from "./game/constants";
import { GameProvider } from "./game/provider";
import { useGame } from "./game/useGame";

const AppContent = () => {
    const { gameData, resetGame, resultMessage } = useGame();
    const { diceResult, error } = gameData;

    return (
        <div className="main-container">
            <Board />

            <div>
                <span className="dice-result">
                    <strong>Current roll:</strong> {diceResult ?? DEFAULT_DICE_MESSAGE}
                </span>
                <button className="action-btn" type="button" onClick={resetGame}>
                    Reset
                </button>
            </div>

            <div>
                <p className="m-1">{resultMessage}</p>
            </div>

            <div>
                <p className="m-1">{error ?? ""}</p>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
};

export default App;
