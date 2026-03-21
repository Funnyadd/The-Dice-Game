import type { GameData, Tile } from "./types";

export const createInitialTiles = (numberOfTiles: number): Tile[] =>
    Array.from({ length: numberOfTiles }, (_, index) => ({ number: index + 1, state: "up" }));

export const isTileUp = (tile: Tile): boolean => tile.state === "up";
export const isTileDown = (tile: Tile): boolean => tile.state === "down";
export const isTileSelected = (tile: Tile): boolean => tile.state === "selected";
export const isTileDisabled = (tile: Tile): boolean => tile.state === "disabled";

export const hasSelectedTiles = (tiles: Tile[]): boolean => tiles.some((tile) => isTileSelected(tile));

export const getSelectedTotal = (tiles: Tile[]): number =>
    tiles.reduce((sum, tile) => (isTileSelected(tile) ? sum + tile.number : sum), 0);

export const getRemainingScore = (tiles: Tile[]): number =>
    tiles.reduce((sum, tile) => (isTileUp(tile) || isTileDisabled(tile) ? sum + tile.number : sum), 0);

export const areAllTilesClosed = (tiles: Tile[]): boolean =>
    tiles.every((tile) => isTileDown(tile) || isTileSelected(tile));

export const finalizeWonTiles = (tiles: Tile[]): Tile[] => tiles.map((tile) => ({ ...tile, state: "down" }));

export const finalizeLostTiles = (tiles: Tile[]): Tile[] =>
    tiles.map((tile) => {
        if (isTileUp(tile)) return { ...tile, state: "disabled" };
        if (isTileSelected(tile)) return { ...tile, state: "down" };
        return tile;
    });

export const hasCombination = (numbers: number[], target: number): boolean => {
    const memo = new Map<string, boolean>();

    const dfs = (index: number, remaining: number): boolean => {
        if (remaining === 0) return true;
        if (remaining < 0 || index === numbers.length) return false;

        const key = `${index}-${remaining}`;
        const cached = memo.get(key);
        if (cached !== undefined) return cached;

        const found = dfs(index + 1, remaining - numbers[index]) || dfs(index + 1, remaining);

        memo.set(key, found);
        return found;
    };

    return dfs(0, target);
};

export const hasMovesLeft = (tiles: Tile[], target: number): boolean => {
    const availableNumbers = tiles.filter((tile) => !isTileDown(tile)).map((tile) => tile.number);

    return hasCombination(availableNumbers, target);
};

export const canTileBeUsed = (tileNumber: number, candidateNumbers: number[], remaining: number): boolean => {
    if (tileNumber > remaining) return false;

    const otherNumbers = candidateNumbers.filter((number) => number !== tileNumber);
    return hasCombination(otherNumbers, remaining - tileNumber);
};

export const recalculatePlayableTiles = (tiles: Tile[], diceResult: number | null): Tile[] => {
    if (diceResult === null) return tiles;

    const selectedTotal = getSelectedTotal(tiles);
    const remaining = diceResult - selectedTotal;

    const candidateNumbers = tiles
        .filter((tile) => !isTileDown(tile) && !isTileSelected(tile))
        .map((tile) => tile.number);

    return tiles.map((tile) => {
        if (isTileDown(tile) || isTileSelected(tile)) return tile;

        const usable = canTileBeUsed(tile.number, candidateNumbers, remaining);
        return { ...tile, state: usable ? "up" : "disabled" };
    });
};

export const applyRollToTiles = (tiles: Tile[], diceRoll: number): Tile[] => {
    const rolledTiles: Tile[] = tiles.map((tile) => {
        if (isTileSelected(tile)) return { ...tile, state: "down" };
        if (isTileDown(tile)) return tile;
        return { ...tile, state: "up" };
    });

    return recalculatePlayableTiles(rolledTiles, diceRoll);
};

export const toggleTileSelection = (tiles: Tile[], tileNumber: number, diceResult: number | null): Tile[] => {
    const toggledTiles: Tile[] = tiles.map((tile) => {
        if (tile.number !== tileNumber) return tile;
        if (isTileDown(tile) || isTileDisabled(tile)) return tile;

        return { ...tile, state: isTileSelected(tile) ? "up" : "selected" };
    });

    return recalculatePlayableTiles(toggledTiles, diceResult);
};

export const getCanRollDice = (gameData: GameData): boolean => {
    if (gameData.gameState === "won" || gameData.gameState === "lost") return false;
    if (gameData.gameState === "notStarted" || gameData.diceResult === null) return true;

    return hasSelectedTiles(gameData.tiles) && getSelectedTotal(gameData.tiles) === gameData.diceResult;
};

export const getGameScore = (gameData: GameData): number =>
    gameData.gameState === "won" ? 0 : getRemainingScore(gameData.tiles);

export const getResultMessage = (gameData: GameData): string => {
    const score = getGameScore(gameData);

    if (gameData.gameState === "won" || gameData.gameState === "lost") {
        return `You ${gameData.gameState}! Your score is ${score}.`;
    }

    return "";
};
