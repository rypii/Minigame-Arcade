// src/games/TicTacToe/TicTacToeGame.jsx
import { useState, useEffect } from "react";
import "../../styles/TicTacToe.css";

export default function TicTacToeGame({ onBack }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [mode, setMode] = useState("player"); // "player" or "bot"
    const winner = calculateWinner(board);

    useEffect(() => {
        if (mode === "bot" && !xIsNext && !winner) {
            const timeout = setTimeout(() => makeBotMove(), 500);
            return () => clearTimeout(timeout);
        }
    }, [board, xIsNext, mode, winner]);

    const handleClick = (i) => {
        if (board[i] || winner || (mode === "bot" && !xIsNext)) return;
        const nextBoard = board.slice();
        nextBoard[i] = xIsNext ? "X" : "O";
        setBoard(nextBoard);
        setXIsNext(!xIsNext);
    };

    const makeBotMove = () => {
        const emptyIndices = board.map((val, i) => (val === null ? i : null)).filter(i => i !== null);
        if (emptyIndices.length === 0) return;
        const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const nextBoard = board.slice();
        nextBoard[move] = "O";
        setBoard(nextBoard);
        setXIsNext(true);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    const status = winner
        ? `🎉 Winner: ${winner}`
        : board.every(Boolean)
            ? "🤝 It's a draw!"
            : `Next: ${xIsNext ? "X" : "O"}`;

    return (
        <div className="tictactoe">
            <button onClick={onBack}>← Back</button>
            <h2>❌ Tic Tac Toe ⭕</h2>

            <div className="mode-select">
                <label>Mode:</label>
                <select value={mode} onChange={(e) => { setMode(e.target.value); resetGame(); }}>
                    <option value="player">2 Player</option>
                    <option value="bot">Vs Bot</option>
                </select>
            </div>

            <div className="status">{status}</div>
            <div className="board">
                {board.map((cell, i) => (
                    <div key={i} className="cell" onClick={() => handleClick(i)}>
                        {cell}
                    </div>
                ))}
            </div>
            <button className="reset" onClick={resetGame}>🔁 New Game</button>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}