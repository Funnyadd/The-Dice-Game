import { useEffect, useMemo, useRef, useState } from "react";
import "./dice.css";
import Die from "./Die";
import type { DiceProps, DieValue } from "../../game/types";
import { DICE_ROLL_DURATION_MS, DICE_ROLL_TICK_MS } from "../../game/constants";

const randomDieValue = (): DieValue => (Math.floor(Math.random() * 6) + 1) as DieValue;
const createDiceValues = (count: number): DieValue[] => Array.from({ length: count }, randomDieValue);
const createInitialDiceValues = (count: number): DieValue[] => Array.from({ length: count }, () => 1);

const Dice = ({ onRollComplete, disabled = false, className = "", count = 2 }: DiceProps) => {
    const safeCount = Math.max(1, count);

    const [values, setValues] = useState<DieValue[]>(() => createInitialDiceValues(safeCount));
    const [isRolling, setIsRolling] = useState(false);

    const dieKeys = useMemo(() => Array.from({ length: safeCount }, (_, slot) => `die-${slot + 1}`), [safeCount]);

    const intervalRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const clearTimers = (): void => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => clearTimers, []);

    const handleRoll = (): void => {
        if (disabled || isRolling) return;

        clearTimers();
        setIsRolling(true);

        intervalRef.current = window.setInterval(() => {
            setValues(createDiceValues(safeCount));
        }, DICE_ROLL_TICK_MS);

        timeoutRef.current = window.setTimeout(() => {
            clearTimers();

            const finalValues = createDiceValues(safeCount);

            setValues(finalValues);
            setIsRolling(false);
            onRollComplete?.(finalValues);
        }, DICE_ROLL_DURATION_MS);
    };

    return (
        <div className={`dice-panel ${className}`}>
            <div className="dice-row">
                {dieKeys.map((dieKey, slot) => (
                    <Die key={dieKey} value={values[slot]} isRolling={isRolling} />
                ))}
            </div>

            <button type="button" className="action-btn" onClick={handleRoll} disabled={disabled || isRolling}>
                Roll the Dice
            </button>
        </div>
    );
};

export default Dice;
