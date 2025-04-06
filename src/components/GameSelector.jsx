function GameSelector({ onSelectGame }) {
    const games = [
        { id: "lightsout", name: "Lights Out", emoji: "💡" },
        { id: "memory", name: "Memory Match", emoji: "🧠" },
        { id: "minesweeper", name: "Minesweeper", emoji: "💣" },
        // Add more games here
    ];

    return (
        <div className="game-selector">
            <h2>Select a Game</h2>
            <div className="game-grid">
                {games.map((game) => (
                    <div key={game.id} className="game-card" onClick={() => onSelectGame(game.id)}>
                        <span className="emoji">{game.emoji}</span>
                        <span className="title">{game.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameSelector;
