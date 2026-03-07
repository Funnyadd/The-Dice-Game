import type { TileButtonProps } from "../game/types";

const TileButton = ({ tile, onClick }: TileButtonProps) => {
    return (
        <button className={`tile-btn tile-btn-${tile.state}`} onClick={() => onClick(tile.number)}>
            {tile.number}
        </button>
    );
};

export default TileButton;
