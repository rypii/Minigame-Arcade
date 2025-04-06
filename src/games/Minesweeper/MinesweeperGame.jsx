// src/games/Minesweeper/MinesweeperGame.jsx
import { useState, useEffect } from "react";
import Tile from "./Tile";
import "../../styles/Minesweeper.css";

const DIFFICULTIES = {
    easy: { size: 6, mines: 6 },
    medium: { size: 8, mines: 10 },
    hard: { size: 10, mines: 20 },
};

function createBoard(size, mines) {
    const board = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ revealed: false, mine: false, number: 0, flagged: false, explode: false }))
    );

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }

    const dirs = [-1, 0, 1];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c].mine) continue;
            let count = 0;
            for (let dr of dirs) {
                for (let dc of dirs) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc].mine) {
                        count++;
                    }
                }
            }
            board[r][c].number = count;
        }
    }

    return board;
}

function MinesweeperGame({ onBack }) {
    const [difficulty, setDifficulty] = useState("medium");
    const { size, mines } = DIFFICULTIES[difficulty];

    const [board, setBoard] = useState(createBoard(size, mines));
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    useEffect(() => {
        resetGame();
    }, [difficulty]);

    const revealTile = (r, c) => {
        if (board[r][c].revealed || board[r][c].flagged || gameOver) return;

        const newBoard = board.map(row => row.map(tile => ({ ...tile })));

        const flood = (r, c) => {
            if (r < 0 || r >= size || c < 0 || c >= size || newBoard[r][c].revealed || newBoard[r][c].flagged) return;
            newBoard[r][c].revealed = true;
            if (newBoard[r][c].number === 0 && !newBoard[r][c].mine) {
                [-1, 0, 1].forEach(dr => {
                    [-1, 0, 1].forEach(dc => {
                        if (dr !== 0 || dc !== 0) flood(r + dr, c + dc);
                    });
                });
            }
        };

        if (newBoard[r][c].mine) {
            newBoard[r][c].revealed = true;
            newBoard[r][c].explode = true;
            for (let row of newBoard) {
                for (let tile of row) {
                    if (tile.mine) tile.revealed = true;
                }
            }
            setBoard(newBoard);
            setGameOver(true);
        } else {
            flood(r, c);
            setBoard(newBoard);
        }
    };

    const toggleFlag = (e, r, c) => {
        e.preventDefault();
        if (board[r][c].revealed || gameOver) return;
        const newBoard = board.map(row => row.map(tile => ({ ...tile })));
        newBoard[r][c].flagged = !newBoard[r][c].flagged;
        setBoard(newBoard);
    };

    useEffect(() => {
        if (!gameOver) {
            const total = size * size;
            const revealed = board.flat().filter(t => t.revealed).length;
            if (revealed === total - mines) {
                setWon(true);
                setGameOver(true);
            }
        }
    }, [board, gameOver, size, mines]);

    const resetGame = () => {
        setBoard(createBoard(size, mines));
        setGameOver(false);
        setWon(false);
    };

    const flaggedCount = board.flat().filter(t => t.flagged).length;

    return (
        <div className="minesweeper">
            <button onClick={onBack}>← Back</button>
            <h2>Minesweeper</h2>

            <div className="difficulty">
                <label>Difficulty: </label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <div className="status">
                {gameOver && (won ? "🎉 You Win!" : "💥 Game Over!")}<br />
                🚩 Flags: {flaggedCount} / {mines}
            </div>

            <button onClick={resetGame}>🔁 New Game</button>

            <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${size}, 40px)` }}
            >
                {board.map((row, r) =>
                    row.map((tile, c) => (
                        <Tile
                            key={`${r}-${c}`}
                            data={tile}
                            onClick={() => revealTile(r, c)}
                            onRightClick={(e) => toggleFlag(e, r, c)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MinesweeperGame;
