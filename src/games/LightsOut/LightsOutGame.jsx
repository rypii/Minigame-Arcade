// src/games/LightsOut/LightsOutGame.jsx
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
    const [difficulty, setDifficulty] = useState("easy");
    const [size, setSize] = useState(5);
    const [grid, setGrid] = useState(createGrid(size));
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
        setGrid(createGrid(size));
        setMoves(0);
        setWon(false);
    }, [size]);

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
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                newGrid[nr][nc] = !newGrid[nr][nc];
            }
        }
        setGrid(newGrid);
        setMoves(m => m + 1);
    };

    const newGame = () => {
        setGrid(createGrid(size));
        setMoves(0);
        setWon(false);
    };

    const handleDifficultyChange = (e) => {
        const level = e.target.value;
        setDifficulty(level);
        switch (level) {
            case "medium": setSize(6); break;
            case "hard": setSize(7); break;
            default: setSize(5);
        }
    };

    return (
        <div className="lightsout">
            <button onClick={onBack}>← Back</button>
            <h2>💡 Lights Out</h2>

            <div className="lightsout-controls">
                <label>Difficulty:</label>
                <select value={difficulty} onChange={handleDifficultyChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

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