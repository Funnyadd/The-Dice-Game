import { useState } from 'react';

function App() {
    type TileState = "up" | "down" | "selected" | "disabled";

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

        setState = (state: TileState): void =>  {
            this.#state = state
        };

        clone = (): Tile => new Tile(this.#number, this.#state);
    }

    // need to initialize tiles array

    const nbTiles: number = 12; // For now a constant but will make it dynamic (10 or 12)

    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [diceResult, setDiceResult] = useState<number>(0);
    const [tiles, setTiles] = useState<Tile[]>(initialTiles());
    
    function initialTiles() {
        let init = [];
        for (let i = 1; i <= nbTiles; i ++) {
            init.push(new Tile(i));
        }
        return init;
    }

    function setTileStateAt(number: number, nextState: TileState) {
        setTiles((previous) =>
            previous.map(tile => {
                if (tile.getNumber() !== number) return tile;
                return withState(tile, nextState)
            })
        );
    }

    const withState = (tile: Tile, state: TileState) => {
        const copy = tile.clone();
        copy.setState(state);
        return copy;
    };

    const handleRollDiceClick = () => {
        const min: number = 2;
        const max: number = nbTiles;

        if (!isGameStarted) setIsGameStarted(true);

        const result = Math.floor(Math.random() * (max - min + 1)) + min; 
        setDiceResult(result);

        tiles.forEach(tile => {
            if (tile.isSelected()) {
                setTileStateAt(tile.getNumber(), "down");
            }
            else if (tile.getNumber() > result && !tile.isDown()) {
                setTileStateAt(tile.getNumber(), "disabled");
            }
            else if (tile.isDisabled()) {
                setTileStateAt(tile.getNumber(), "up");
            }
        });
    }

    const handleResetGame = () => {
        setDiceResult(0);
        setIsGameStarted(false);
        setTiles(initialTiles());
    }

    // TODO: RECHECK THIS METHOD AS IT IS GENERATED
    const handleTileClick = (tile: Tile) => {
        if (!isGameStarted || tile.isDisabled() || tile.isDown()) return;

        setTiles((prev) => {
            const clicked = prev.find((t) => t.getNumber() === tile.getNumber());
            if (!clicked || clicked.isDisabled()) return prev;

            // 1) toggle clicked tile
            let next = prev.map((t) => {
                if (t.getNumber() !== tile.getNumber()) return t;

                const nextState: TileState = t.isSelected() ? "up" : "selected";
                return withState(t, nextState);
            });

            // 2) compute total selected from NEXT state (not stale `tiles`)
            const totalSelected = next.reduce(
                (sum, t) => (t.isSelected() ? sum + t.getNumber() : sum),
                0
            );

            // 3) disable tiles based on NEXT state
            next = next.map((t) => {
                if (t.isSelected()) return t;
                if (t.getNumber() > diceResult - totalSelected && !t.isDown()) return withState(t, "disabled");
                return t;
            });

            return next;
        });

        
        // if (tile.isSelected()) setTileStateAt(tile.getNumber(), "up");
        // else setTileStateAt(tile.getNumber(), "selected");

        // // get all selected (make function)
        // let totalSelected = tile.getNumber();
        // tiles.forEach(t => t.isSelected() ? totalSelected += t.getNumber() : null);  // find if we keep null here

        // tiles.forEach(t => {
        //     if (t.getNumber() > diceResult - totalSelected && !t.isSelected()) {
        //         setTileStateAt(t.getNumber(), "disabled");
        //     }
        // });
    }

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
                    <strong>Current roll:</strong> {diceResult > 0 ? diceResult : "Roll the dice to start!"}
                </span>
            </div>
            <div>
                <button className="action-btn" onClick={handleResetGame}>Reset</button>
            </div>
        </>
    );
}

export default App;
