import { useState, useEffect } from "react";
import Tile from "./Tile";
import "../../styles/LightsOut.css";

const SIZES = {
    easy: 3,
    medium: 5,
    hard: 7,
};

function generateBoard(size) {
    const board = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => false)
    );

    const moves = size + Math.floor(Math.random() * size);
    for (let i = 0; i < moves; i++) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        toggleNeighbors(board, r, c);
    }

    return board;
}

function toggleNeighbors(board, r, c) {
    const size = board.length;
    const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            board[nr][nc] = !board[nr][nc];
        }
    }
}

function isSolved(board) {
    return board.every(row => row.every(cell => !cell));
}

function LightsOutGame({ onBack }) {
    const [difficulty, setDifficulty] = useState("medium");
    const [board, setBoard] = useState(generateBoard(SIZES[difficulty]));
    const [moveCount, setMoveCount] = useState(0);
    const [won, setWon] = useState(false);
    const [lastPressed, setLastPressed] = useState(null);

    useEffect(() => {
        handleNewGame();
    }, [difficulty]);

    const handleTileClick = (r, c) => {
        const newBoard = board.map(row => [...row]);
        toggleNeighbors(newBoard, r, c);
        setBoard(newBoard);
        setMoveCount(moveCount + 1);
        setLastPressed([r, c]);
        if (isSolved(newBoard)) setWon(true);
    };

    const handleNewGame = () => {
        const newBoard = generateBoard(SIZES[difficulty]);
        setBoard(newBoard);
        setMoveCount(0);
        setWon(false);
        setLastPressed(null);
    };

    return (
        <div className="lightsout">
            <button className="back" onClick={onBack}>← Back</button>
            <h2>Lights Out ({difficulty})</h2>

            <div className="controls">
                <label>
                    Difficulty:
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy (3x3)</option>
                        <option value="medium">Medium (5x5)</option>
                        <option value="hard">Hard (7x7)</option>
                    </select>
                </label>
                <button onClick={handleNewGame}>🔁 New Game</button>
            </div>

            <div className="status">
                Moves: {moveCount} {won && "| 🎉 You won!"}
            </div>

            <div
                className="board"
                style={{ gridTemplateColumns: `repeat(${board.length}, 60px)` }}
            >
                {board.map((row, r) =>
                    row.map((lit, c) => (
                        <Tile
                            key={`${r}-${c}`}
                            lit={lit}
                            onClick={() => handleTileClick(r, c)}
                            animate={lastPressed && lastPressed[0] === r && lastPressed[1] === c}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default LightsOutGame;
