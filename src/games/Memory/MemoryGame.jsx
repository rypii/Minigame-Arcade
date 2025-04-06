import { useState, useEffect } from "react";
import Card from "./Card";
import "../../styles/Memory.css";

const symbols = ["🍎", "🍌", "🍓", "🍇", "🍉", "🥝"];

function shuffleSymbols() {
    return [...symbols, ...symbols].sort(() => Math.random() - 0.5);
}

function MemoryGame({ onBack }) {
    const [cards, setCards] = useState([]);
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [won, setWon] = useState(false);
    const [time, setTime] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (cards.length && cards.every(card => card.matched)) {
            setWon(true);
            setTimerActive(false);
        }
    }, [cards]);

    useEffect(() => {
        let interval = null;
        if (timerActive) {
            interval = setInterval(() => setTime(t => t + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    const startNewGame = () => {
        const shuffled = shuffleSymbols();
        setCards(shuffled.map((symbol, i) => ({
            id: i,
            symbol,
            flipped: false,
            matched: false
        })));
        setFlippedIndexes([]);
        setWon(false);
        setTime(0);
        setTimerActive(true);
    };

    const handleFlip = (index) => {
        if (flippedIndexes.length < 2 && !cards[index].flipped && !cards[index].matched) {
            const updated = [...cards];
            updated[index].flipped = true;
            const newFlipped = [...flippedIndexes, index];
            setCards(updated);
            setFlippedIndexes(newFlipped);

            if (newFlipped.length === 2) {
                const [i, j] = newFlipped;
                if (updated[i].symbol === updated[j].symbol) {
                    setTimeout(() => {
                        const matched = [...updated];
                        matched[i].matched = true;
                        matched[j].matched = true;
                        setCards(matched);
                        setFlippedIndexes([]);
                    }, 500);
                } else {
                    setTimeout(() => {
                        const reset = updated.map((card, idx) =>
                            newFlipped.includes(idx) ? { ...card, flipped: false } : card
                        );
                        setCards(reset);
                        setFlippedIndexes([]);
                    }, 1000);
                }
            }
        }
    };

    return (
        <div className="memory">
            <button className="back" onClick={onBack}>← Back</button>
            <h2>Memory Match</h2>
            {won && <h3 className="win-msg">🎉 You Win!</h3>}
            <div className="status">⏱️ Time: {time}s</div>
            <button onClick={startNewGame} className="new-game">🔁 New Game</button>
            <div className="grid">
                {cards.map((card, idx) => (
                    <Card
                        key={card.id}
                        symbol={card.symbol}
                        flipped={card.flipped || card.matched}
                        matched={card.matched}
                        onClick={() => handleFlip(idx)}
                    />
                ))}
            </div>
        </div>
    );
}

export default MemoryGame;
