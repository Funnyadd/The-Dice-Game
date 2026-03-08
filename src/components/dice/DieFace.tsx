import type { DieValue } from "../../game/types";

interface DieFaceProps {
    value: DieValue;
}

const VISIBLE_PIPS_BY_VALUE: Record<DieValue, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
};

export default function DieFace({ value }: DieFaceProps) {
    const visiblePips = VISIBLE_PIPS_BY_VALUE[value];

    return (
        <div className="die-face-grid">
            {Array.from({ length: 9 }, (_, index) => (
                <span key={index} className={`die-pip ${visiblePips.includes(index) ? "die-pip--visible" : ""}`} />
            ))}
        </div>
    );
}
