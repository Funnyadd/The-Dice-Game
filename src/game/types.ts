export type TileState = "up" | "down" | "selected" | "disabled";
export type GameState = "notStarted" | "started" | "won" | "lost";
export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type GameAction =
    | { type: "RESET_GAME" }
    | { type: "ROLL_DICE"; diceValues: DieValue[] }
    | { type: "TOGGLE_TILE"; tileNumber: number };

export interface GameContextValue {
    gameData: GameData;
    canRollDice: boolean;
    score: number;
    resultMessage: string;
    rollDice: (diceValues: DieValue[]) => void;
    resetGame: () => void;
    toggleTile: (tileNumber: number) => void;
}

export interface GameData {
    gameState: GameState;
    diceResult: number | null;
    tiles: Tile[];
    error: string | null;
}

export interface Tile {
    number: number;
    state: TileState;
}

export interface TileButtonProps {
    tile: Tile;
}

export interface DiceProps {
    onRollComplete?: (values: DieValue[]) => void;
    disabled?: boolean;
    className?: string;
    count?: number;
}

export interface DieFaceProps {
    value: DieValue;
}
