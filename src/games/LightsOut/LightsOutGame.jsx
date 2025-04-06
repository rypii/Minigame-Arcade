import { useState, useEffect } from "react";
import "../../styles/LightsOut.css";

function createGrid(size) {
    const grid = [];
    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
            row.push(Math.random() < 0.5);
        }
        grid.push(row);
    }
    return grid;
}

export default function LightsOutGame({ onBack }) {
    const [grid, setGrid] = useState(createGrid(5));
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
        const isWon = grid.every(row => row.every(cell => !cell));
        setWon(isWon);
    }, [grid]);

    const toggle = (r, c) => {
        const dirs = [
            [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        const newGrid = grid.map(row => [...row]);
        for (let [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
                newGrid[nr][nc] = !newGrid[nr][nc];
            }
        }
        setGrid(newGrid);
        setMoves(m => m + 1);
    };

    const newGame = () => {
        setGrid(createGrid(5));
        setMoves(0);
        setWon(false);
    };

    return (
        <div className="lightsout">
            <button onClick={onBack}>← Back</button>
            <h2>💡 Lights Out</h2>
            <button onClick={newGame}>🔁 New Game</button>

            <div className="lightsout-grid">
                {grid.map((row, r) => (
                    <div key={r} className="row">
                        {row.map((lit, c) => (
                            <div
                                key={c}
                                className={`lotile ${lit ? "on" : "off"}`}
                                onClick={() => toggle(r, c)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="lightsout-stats">
                <p>Moves: {moves}</p>
                {won && <h3>🎉 You turned off all the lights!</h3>}
            </div>
        </div>
    );
}
