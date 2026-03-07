import { NB_TILES } from "./constants";
import {
    applyRollToTiles,
    areAllTilesClosed,
    createInitialTiles,
    finalizeLostTiles,
    finalizeWonTiles,
    getSelectedTotal,
    hasMovesLeft,
    hasSelectedTiles,
    isTileDisabled,
    isTileDown,
    rollDice,
    toggleTileSelection,
} from "./logic";
import type { GameAction, GameData } from "./types";

export const createInitialGameData = (numberOfTiles: number): GameData => ({
    gameState: "notStarted",
    diceResult: null,
    tiles: createInitialTiles(numberOfTiles),
    error: "",
});

export const gameReducer = (state: GameData, action: GameAction): GameData => {
    switch (action.type) {
        case "RESET_GAME":
            return createInitialGameData(NB_TILES);

        case "TOGGLE_TILE": {
            if (state.gameState !== "started") return state;

            const clickedTile = state.tiles.find((tile) => tile.number === action.tileNumber);
            if (!clickedTile || isTileDown(clickedTile) || isTileDisabled(clickedTile)) {
                return state;
            }

            const nextTiles = toggleTileSelection(state.tiles, action.tileNumber, state.diceResult);

            if (areAllTilesClosed(nextTiles)) {
                return { ...state, gameState: "won", tiles: finalizeWonTiles(nextTiles), error: "" };
            }

            return { ...state, tiles: nextTiles, error: "" };
        }

        case "ROLL_DICE": {
            if (state.gameState === "won" || state.gameState === "lost") {
                return { ...state, error: "First click on the reset button to restart the game" };
            }

            if (state.gameState === "started") {
                if (!hasSelectedTiles(state.tiles)) {
                    return { ...state, error: "Select at least one tile!" };
                }

                if (state.diceResult !== null && getSelectedTotal(state.tiles) !== state.diceResult) {
                    return { ...state, error: "The tiles selected need to equal the total dice" };
                }
            }

            const diceRoll = rollDice(NB_TILES);
            const rolledTiles = applyRollToTiles(state.tiles, diceRoll);

            if (!hasMovesLeft(rolledTiles, diceRoll)) {
                return { gameState: "lost", diceResult: diceRoll, tiles: finalizeLostTiles(rolledTiles), error: "" };
            }
            return { gameState: "started", diceResult: diceRoll, tiles: rolledTiles, error: "" };
        }

        default:
            return state;
    }
};
