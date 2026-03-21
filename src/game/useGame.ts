import { use } from "react";
import type { GameContextValue } from "./types";
import { GameContext } from "./Context";

export const useGame = (): GameContextValue => {
    const context = use(GameContext);

    if (!context) {
        throw new Error("useGame must be used inside GameProvider");
    }

    return context;
};
