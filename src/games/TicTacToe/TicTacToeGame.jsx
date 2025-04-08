// src/games/TicTacToe/TicTacToeGame.jsx
import { useState, useEffect } from "react";
import "../../styles/TicTacToe.css";

export default function TicTacToeGame({ onBack }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [mode, setMode] = useState("player");
    const [stats, setStats] = useState({ X: 0, O: 0, draw: 0 });
    const [botThinking, setBotThinking] = useState(false);
    const winner = calculateWinner(board);

    useEffect(() => {
        if (winner || board.every(Boolean)) {
            const result = winner || "draw";
            setStats(prev => ({ ...prev, [result]: prev[result] + 1 }));
        }
    }, [winner, board]);

    useEffect(() => {
        if (mode === "bot" && !xIsNext && !winner && !board.every(Boolean)) {
            setBotThinking(true);
            const timeout = setTimeout(() => {
                makeSmartBotMove();
                setBotThinking(false);
            }, 600);
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

    const makeSmartBotMove = () => {
        const bestMove = findBestMove(board);
        if (bestMove !== -1) {
            const nextBoard = board.slice();
            nextBoard[bestMove] = "O";
            setBoard(nextBoard);
            setXIsNext(true);
        }
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

            <div className="status">{botThinking ? "🤖 Thinking..." : status}</div>
            <div className="board">
                {board.map((cell, i) => (
                    <div
                        key={i}
                        className={`cell ${cell === "O" && botThinking ? "bot-move" : ""}`}
                        onClick={() => handleClick(i)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <button className="reset" onClick={resetGame}>🔁 New Game</button>

            <div className="stats">
                <p>❌ X Wins: {stats.X}</p>
                <p>⭕ O Wins: {stats.O}</p>
                <p>🤝 Draws: {stats.draw}</p>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function findBestMove(board) {
    const opponent = "X";
    const player = "O";

    function minimax(board, depth, isMaximizing) {
        const winner = calculateWinner(board);
        if (winner === player) return 10 - depth;
        if (winner === opponent) return depth - 10;
        if (board.every(Boolean)) return 0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = player;
                    const score = minimax(board, depth + 1, false);
                    board[i] = null;
                    best = Math.max(best, score);
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = opponent;
                    const score = minimax(board, depth + 1, true);
                    board[i] = null;
                    best = Math.min(best, score);
                }
            }
            return best;
        }
    }

    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = player;
            const moveVal = minimax(board, 0, false);
            board[i] = null;
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}
