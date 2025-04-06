function Tile({ lit, onClick, animate, hint }) {
    return (
        <div
            className={`tile ${lit ? "lit" : "unlit"} ${animate ? "animate" : ""} ${hint ? "hint" : ""}`}
            onClick={onClick}
        />
    );
}

export default Tile;
