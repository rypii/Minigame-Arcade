import { useState, useEffect } from "react";
import "../../styles/Memory.css";

const CARD_PAIRS = ["🐶", "🐱", "🦊", "🐸", "🐵", "🐼", "🐷", "🦁", "🐻‍❄️"];

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function generateCards() {
    const doubled = [...CARD_PAIRS, ...CARD_PAIRS];
    return shuffleArray(doubled).map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
    }));
}

export default function MemoryGame({ onBack }) {
    const [cards, setCards] = useState(generateCards);
    const [flipped, setFlipped] = useState([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
        if (cards.length && cards.every((card) => card.matched)) {
            setWon(true);
        }
    }, [cards]);

    const handleFlip = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || cards[index].matched) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((m) => m + 1);
            const [i1, i2] = newFlipped;

            if (cards[i1].emoji === cards[i2].emoji) {
                const newCards = cards.map((card, idx) =>
                    idx === i1 || idx === i2 ? { ...card, matched: true } : card
                );
                setCards(newCards);
                setTimeout(() => setFlipped([]), 800);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const restart = () => {
        setCards(generateCards());
        setFlipped([]);
        setMoves(0);
        setWon(false);
    };

    return (
        <div className="memory">
            <button onClick={onBack}>← Back</button>
            <h2>🧠 Memory Match</h2>
            <button onClick={restart}>🔁 New Game</button>

            <div className="memory-grid">
                {cards.map((card, i) => {
                    const isFlipped = flipped.includes(i) || card.matched;
                    return (
                        <div
                            key={card.id}
                            className={`memcard ${isFlipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
                            onClick={() => handleFlip(i)}
                        >
                            <div className="inner">
                                <div className="front">❓</div>
                                <div className="back">{card.emoji}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="memory-stats">
                <p>Moves: {moves}</p>
                {won && <h3>🎉 You matched them all!</h3>}
            </div>
        </div>
    );
}
