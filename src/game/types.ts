export type TileState = "up" | "down" | "selected" | "disabled";
export type GameState = "notStarted" | "started" | "won" | "lost";

export type GameAction = { type: "RESET_GAME" } | { type: "ROLL_DICE" } | { type: "TOGGLE_TILE"; tileNumber: number };

export interface Tile {
    number: number;
    state: TileState;
}

export interface GameData {
    gameState: GameState;
    diceResult: number | null;
    tiles: Tile[];
    error: string;
}

export interface TileButtonProps {
    tile: Tile;
    onClick: (tileNumber: number) => void;
}

export interface BoardProps {
    tiles: Tile[];
    onTileClick: (tileNumber: number) => void;
}

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;
