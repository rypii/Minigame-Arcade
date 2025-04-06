// src/games/Minesweeper/Tile.jsx
function Tile({ data, onClick, onRightClick }) {
    const { revealed, mine, number, flagged, explode } = data;

    let content = "";
    if (revealed) {
        if (mine) {
            content = "💣";
        } else if (number > 0) {
            content = number;
        }
    } else if (flagged) {
        content = "🚩";
    }

    return (
        <div
            className={`tile ${revealed ? "revealed" : "hidden"} ${explode ? "explode" : ""}`}
            onClick={onClick}
            onContextMenu={onRightClick}
        >
            {content}
        </div>
    );
}

export default Tile;
