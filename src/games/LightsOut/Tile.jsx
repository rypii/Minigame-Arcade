function Tile({ lit, onClick, animate }) {
    return (
        <div
            className={`tile ${lit ? "lit" : "unlit"} ${animate ? "animate" : ""}`}
            onClick={onClick}
        />
    );
}

export default Tile;
