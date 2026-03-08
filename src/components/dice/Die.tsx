import type { DieValue } from "../../game/types";
import DieFace from "./DieFace";

interface DieProps {
    value: DieValue;
    isRolling?: boolean;
}

export default function Die({ value, isRolling = false }: DieProps) {
    return (
        <div className={`die-2d ${isRolling ? "die-2d--rolling" : ""}`}>
            <DieFace value={value} />
        </div>
    );
}
