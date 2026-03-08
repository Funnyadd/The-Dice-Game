import { useEffect, useMemo, useRef, useState } from "react";
import "./dice.css";
import Die from "./Die";
import type { DieValue } from "../../game/types";

interface DiceProps {
    onRollComplete?: (values: DieValue[], total: number) => void;
    disabled?: boolean;
    className?: string;
    count?: number;
}

const ROLL_DURATION_MS = 700;
const ROLL_TICK_MS = 75;

function randomDieValue(): DieValue {
    return (Math.floor(Math.random() * 6) + 1) as DieValue;
}

function createDiceValues(count: number): DieValue[] {
    return Array.from({ length: count }, () => randomDieValue());
}

function createInitialDiceValues(count: number): DieValue[] {
    return Array.from({ length: count }, () => 1 as DieValue);
}

export default function Dice({ onRollComplete, disabled = false, className = "", count = 2 }: DiceProps) {
    const safeCount = useMemo(() => Math.max(1, count), [count]);

    const [values, setValues] = useState<DieValue[]>(() => createInitialDiceValues(safeCount));
    const [isRolling, setIsRolling] = useState(false);

    const intervalRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        setValues(createInitialDiceValues(safeCount));
    }, [safeCount]);

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
            }

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleRoll = (): void => {
        if (disabled || isRolling) {
            return;
        }

        setIsRolling(true);

        intervalRef.current = window.setInterval(() => {
            setValues(createDiceValues(safeCount));
        }, ROLL_TICK_MS);

        timeoutRef.current = window.setTimeout(() => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            const finalValues = createDiceValues(safeCount);
            const total = finalValues.reduce((sum, value) => sum + value, 0);

            setValues(finalValues);
            setIsRolling(false);
            onRollComplete?.(finalValues, total);
        }, ROLL_DURATION_MS);
    };

    return (
        <div className={`dice-panel ${className}`}>
            <div className="dice-row">
                {values.map((value, index) => (
                    <Die key={index} value={value} isRolling={isRolling} />
                ))}
            </div>

            <button type="button" className="action-btn" onClick={handleRoll} disabled={disabled || isRolling}>
                Roll the Dice
            </button>
        </div>
    );
}
