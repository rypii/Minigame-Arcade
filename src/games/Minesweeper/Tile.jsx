// src/games/Minesweeper/Tile.jsx
function Tile({ data, onClick }) {
    const { revealed, mine, number } = data;

    let content = "";
    if (revealed) {
        if (mine) {
            content = "💣";
        } else if (number > 0) {
            content = number;
        }
    }

    return (
        <div className={`tile ${revealed ? "revealed" : "hidden"}`} onClick={onClick}>
            {content}
        </div>
    );
}

export default Tile;
