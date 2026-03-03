import { useEffect, useState } from 'react';

function App() {
    type TileState = "up" | "down" | "selected" | "disabled";
    type GameState = "notStarted" | "started" | "won" | "lost";

    class Tile {
        #number: number;
        #state: TileState;

        constructor(number: number, state: TileState = "up") {
            this.#number = number;
            this.#state = state;
        }

        getNumber = (): number => this.#number;
        getState = (): TileState => this.#state;

        isSelected = (): boolean => this.#state === "selected";
        isDisabled = (): boolean => this.#state === "disabled";
        isDown = (): boolean => this.#state === "down";
        isUp = (): boolean => this.#state === "up";

        setState = (state: TileState): void => {
            this.#state = state
        };

        clone = (): Tile => new Tile(this.#number, this.#state);
    }

    // need to initialize tiles array

    const nbTiles: number = 12; // For now a constant but will make it dynamic (10 or 12)
    const defaultDiceRollMessage = "Roll the dice to start!";

    const [gameState, setGameState] = useState<GameState>("notStarted");
    const [diceResult, setDiceResult] = useState<number>(0);
    const [tiles, setTiles] = useState<Tile[]>(initialTiles());
    const [finalResult, setFinalResult] = useState<String>("");
    const [score, setScore] = useState<number>(0);
    const [error, setError] = useState<string>("");
    
    function initialTiles() {
        let init = [];
        for (let i = 1; i <= nbTiles; i ++) {
            init.push(new Tile(i, "up"));
        }
        return init;
    }

    const withState = (tile: Tile, state: TileState) => {
        const copy = tile.clone();
        copy.setState(state);
        return copy;
    };

    const depthFirstSearch = (nums: number[], target: number, i: number, sum: number): boolean => {
        if (sum === target) return true;
        if (sum > target || i === nums.length) return false;
        return depthFirstSearch(nums, target, i + 1, sum + nums[i]) || depthFirstSearch(nums, target, i + 1, sum);
    }

    const hasMovesLeft = (target: number): boolean => {
        const nums = tiles.filter((t) => t.isDisabled() || t.isUp()).map((t) => t.getNumber());
        return depthFirstSearch(nums, target, 0, 0);
    }

    const handleRollDiceClick = () => {
        const min: number = 2;
        const max: number = nbTiles;

        setError("");

        if (gameState == "lost" || gameState == "won") return setError("First click on the reset button to restart the game");
        if (gameState == "notStarted") setGameState("started");
        else if (tiles.every((t) => !t.isSelected())) return setError("Select at least one tile!");

        const diceRoll = Math.floor(Math.random() * (max - min + 1)) + min;

        // Block dice roll update if player hasn't played the turn completely
        const sumOfSelectedTiles = tiles.reduce((sum, t) => t.isSelected() ? sum += t.getNumber() : sum, 0);
        console.log(sumOfSelectedTiles + " : " + diceRoll)
        if (sumOfSelectedTiles < diceResult && diceResult > 0)
            return setError("The tiles selected need to equal the total dice");
        setDiceResult(diceRoll);

        // Check if player lost
        if (!hasMovesLeft(diceRoll)) {
            const totalSumLeft = tiles.reduce((sum, t) => t.isDisabled() || t.isUp() ? sum + t.getNumber() : sum, 0);
            setScore(totalSumLeft);
            setGameState("lost");
            return;
        }

        // Make the board ready for next roll
        setTiles((previousTiles) => {
            return previousTiles.map((pt) => {
                let nextState: TileState;

                if (pt.isSelected()) nextState = "down";
                else if (pt.getNumber() <= diceRoll && pt.isDisabled()) nextState = "up"
                else if (pt.getNumber() > diceRoll && (pt.isUp() || pt.isDisabled())) nextState = "disabled";
                else return pt;

                return withState(pt, nextState);
            });
        });
    }

    const handleResetGameClick = () => {
        setDiceResult(0);
        setGameState("notStarted");
        setTiles(initialTiles());
        setFinalResult("");
        setError("");
    }

    const handleTileClick = (currentTile: Tile) => {
        setError("");
        if (gameState == "notStarted" || !currentTile || currentTile.isDisabled() || currentTile.isDown()) return;

        setTiles((previousTiles) => {
            // toggle clicked tile
            let nextTiles = previousTiles.map((pt) => {
                if (pt.getNumber() !== currentTile.getNumber()) return pt;
                const nextState: TileState = pt.isSelected() ? "up" : "selected";
                return withState(pt, nextState);
            });

            // compute total selected from NEXT state (not stale `tiles`)
            const totalSelected = nextTiles.reduce((sum, nt) => nt.isSelected() ? sum + nt.getNumber() : sum, 0);

            // disable tiles based on NEXT state
            nextTiles = nextTiles.map((nt) => {
                if (nt.isSelected()) return nt;
                if (nt.getNumber() > diceResult - totalSelected && !nt.isDown()) return withState(nt, "disabled");
                if (nt.getNumber() <= diceResult - totalSelected && nt.isDisabled()) return withState(nt, "up");
                return nt;
            });

            return nextTiles;
        });
    }

    useEffect(() => {
        const won = tiles.every((t) => t.isDown() || t.isSelected());
        if (won && gameState == "started") setGameState("won");
    }, [tiles]);

    useEffect(() => {
        if (gameState == "won") {
            setFinalResult("You won! Your score is 0.");
            setTiles((previousTiles) => previousTiles.map((pt) => pt.isDown() ? pt : withState(pt, "down")));
        }
        else if (gameState == "lost") {
            setFinalResult(`You lost! Your score is ${score}.`);
            setTiles((previousTiles) => {
                return previousTiles.map((pt) => {
                    if (pt.isUp()) return withState(pt, "disabled");
                    else if (pt.isSelected()) return withState(pt, "down");
                    else return pt;
                });
            });
        }
    }, [gameState]);

    return (
        <>
            <div className="tile-container">
                {
                    tiles.map(tile => 
                        <button
                            key={tile.getNumber()} 
                            className={"tile-btn tile-btn-" + tile.getState()}
                            onClick={() => handleTileClick(tile)}>
                            {tile.getNumber()}
                        </button>
                    )
                }
            </div>
            <div>
                <button className="action-btn" onClick={handleRollDiceClick}>Roll the Dice</button>
                <span className="dice-result">
                    <strong>Current roll:</strong> {diceResult > 0 ? diceResult : defaultDiceRollMessage}
                </span>
            </div>
            <div>
                <button className="action-btn" onClick={handleResetGameClick}>Reset</button>
            </div>
            <div>
                <p className="m-1">{finalResult}</p>
            </div>
            <div>
                <p className="m-1">{error}</p>
            </div>
        </>
    );
}

export default App;
