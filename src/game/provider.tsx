import { useCallback, useMemo, useReducer, type ReactNode } from "react";
import { NB_TILES } from "./constants";
import { getCanRollDice, getGameScore, getResultMessage } from "./logic";
import { createInitialGameData, gameReducer } from "./reducer";
import type { DieValue, GameContextValue } from "./types";
import { GameContext } from "./Context";

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameData, dispatch] = useReducer(gameReducer, NB_TILES, createInitialGameData);

    const rollDice = useCallback((diceValues: DieValue[]) => dispatch({ type: "ROLL_DICE", diceValues }), []);
    const resetGame = useCallback(() => dispatch({ type: "RESET_GAME" }), []);
    const toggleTile = useCallback((tileNumber: number) => dispatch({ type: "TOGGLE_TILE", tileNumber }), []);

    const value = useMemo<GameContextValue>(
        () => ({
            gameData,
            canRollDice: getCanRollDice(gameData),
            score: getGameScore(gameData),
            resultMessage: getResultMessage(gameData),
            rollDice,
            resetGame,
            toggleTile,
        }),
        [gameData, rollDice, resetGame, toggleTile]
    );

    return <GameContext value={value}>{children}</GameContext>;
};
