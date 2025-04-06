// src/games/MineSweeper/MineSweeperGame.jsx
import { useState, useEffect, useRef } from "react";
import "../../styles/Minesweeper.css";

function createBoard(rows, cols, mines) {
    const board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
    );

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].mine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                            count++;
                        }
                    }
                }
                board[r][c].count = count;
            }
        }
    }

    return board;
}

export default function MinesweeperGame({ onBack }) {
    const [difficulty, setDifficulty] = useState("easy");
    const getSettings = (level) => {
        switch (level) {
            case "medium": return { rows: 15, cols: 15, mines: 20 };
            case "hard": return { rows: 20, cols: 20, mines: 40 };
            default: return { rows: 9, cols: 9, mines: 10 };
        }
    };

    const { rows, cols, mines } = getSettings(difficulty);
    const [board, setBoard] = useState(() => createBoard(rows, cols, mines));
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (startTime && !gameOver) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [startTime, gameOver]);

    useEffect(() => {
        const allClear = board.every(row => row.every(cell => cell.revealed || cell.mine));
        if (allClear && !gameOver) {
            setWin(true);
            setGameOver(true);
            clearInterval(timerRef.current);
            setScore(timeElapsed);
        }
    }, [board, gameOver, timeElapsed]);

    const reveal = (r, c) => {
        if (gameOver || board[r][c].flagged || board[r][c].revealed) return;
        if (!startTime) setStartTime(Date.now());

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));

        const revealCell = (r, c) => {
            if (r < 0 || r >= rows || c < 0 || c >= cols) return;
            const cell = newBoard[r][c];
            if (cell.revealed || cell.flagged) return;
            cell.revealed = true;
            if (cell.count === 0 && !cell.mine) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr !== 0 || dc !== 0) revealCell(r + dr, c + dc);
                    }
                }
            }
        };

        if (newBoard[r][c].mine) {
            newBoard[r][c].revealed = true;
            setGameOver(true);
            clearInterval(timerRef.current);
        } else {
            revealCell(r, c);
        }

        setBoard(newBoard);
    };

    const flag = (r, c, e) => {
        e.preventDefault();
        if (gameOver || board[r][c].revealed) return;
        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        newBoard[r][c].flagged = !newBoard[r][c].flagged;
        setBoard(newBoard);
    };

    const reset = () => {
        const { rows, cols, mines } = getSettings(difficulty);
        setBoard(createBoard(rows, cols, mines));
        setGameOver(false);
        setWin(false);
        setScore(0);
        setTimeElapsed(0);
        setStartTime(null);
        clearInterval(timerRef.current);
    };

    const handleDifficultyChange = (e) => {
        const level = e.target.value;
        setDifficulty(level);
        const { rows, cols, mines } = getSettings(level);
        setBoard(createBoard(rows, cols, mines));
        setGameOver(false);
        setWin(false);
        setScore(0);
        setTimeElapsed(0);
        setStartTime(null);
        clearInterval(timerRef.current);
    };

    return (
        <div className="minesweeper">
            <button onClick={onBack}>← Back</button>
            <h2>💣 Minesweeper</h2>

            <div className="minesweeper-controls">
                <label>Difficulty:
                    <select value={difficulty} onChange={handleDifficultyChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>

                <button onClick={reset}>🔁 New Game</button>
            </div>

            <div className="minesweeper-stats">
                <p>Time: {timeElapsed}s</p>
                <p>Score: {score}</p>
            </div>

            <div
                className="minesweeper-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
                {board.map((row, r) =>
                    row.map((cell, c) => {
                        const { revealed, mine, flagged, count } = cell;
                        let className = "minetile";
                        if (revealed) className += " revealed";
                        if (revealed && mine) className += " mine";
                        if (flagged) className += " flagged";

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={className}
                                onClick={() => reveal(r, c)}
                                onContextMenu={(e) => flag(r, c, e)}
                            >
                                {revealed && mine && "💣"}
                                {revealed && !mine && count > 0 && count}
                                {!revealed && flagged && "🚩"}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="minesweeper-stats">
                {gameOver && !win && <h3>💥 You hit a mine!</h3>}
                {win && <h3>🎉 You cleared the board!</h3>}
            </div>
        </div>
    );
}
