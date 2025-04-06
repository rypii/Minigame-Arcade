// src/games/Blackjack/BlackjackGame.jsx
import { useState } from "react";
import "../../styles/Blackjack.css";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function getDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function getValue(card) {
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return parseInt(card.rank);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += getValue(card);
    if (card.rank === "A") aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export default function BlackjackGame({ onBack }) {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setShuffling(true);
    setPlayer([]);
    setDealer([]);
    setMessage("");
    setGameOver(false);
    setGameStarted(false);

    setTimeout(() => {
      const newDeck = getDeck();
      const pHand = [newDeck.pop(), newDeck.pop()];
      const dHand = [newDeck.pop(), newDeck.pop()];
      setDeck(newDeck);
      setPlayer(pHand);
      setDealer(dHand);
      setShuffling(false);
      setGameStarted(true);
    }, 1500);
  };

  const hit = () => {
    if (!gameStarted) {
      setMessage("⚠️ Start a new game first!");
      return;
    }
    if (gameOver || shuffling) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...player, newCard];
    setPlayer(newHand);
    setDeck(newDeck);
    const score = calculateScore(newHand);
    if (score > 21) {
      setGameOver(true);
      setMessage("💥 You busted!");
    }
  };

  const stand = () => {
    if (!gameStarted) {
      setMessage("⚠️ Start a new game first!");
      return;
    }
    if (shuffling) return;

    let dHand = [...dealer];
    let tempDeck = [...deck];
    let dScore = calculateScore(dHand);

    while (dScore < 17) {
      const newCard = tempDeck.pop();
      dHand.push(newCard);
      dScore = calculateScore(dHand);
    }

    const pScore = calculateScore(player);
    setDealer(dHand);
    setDeck(tempDeck);
    setGameOver(true);

    if (dScore > 21 || pScore > dScore) setMessage("🎉 You win!");
    else if (pScore < dScore) setMessage("😢 Dealer wins");
    else setMessage("🤝 It's a tie");
  };

  return (
    <div className="blackjack">
      <button onClick={onBack}>← Back</button>
      <h2>🃏 Blackjack</h2>
      <button onClick={startGame} disabled={shuffling}>🔁 New Game</button>

      {shuffling && <div className="shuffling">🔄 Shuffling the deck...</div>}

      {!shuffling && (
        <>
          <div className="hand">
            <h3>Your Hand ({calculateScore(player)})</h3>
            <div className="cards">
              {player.map((card, i) => (
                <span
                  key={i}
                  className={["♥", "♦"].includes(card.suit) ? "red" : ""}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {card.rank}{card.suit}
                </span>
              ))}
            </div>
          </div>

          <div className="hand">
            <h3>Dealer ({gameOver ? calculateScore(dealer) : "??"})</h3>
            <div className="cards">
              {dealer.map((card, i) => {
                if (i === 1 && !gameOver) {
                  return (
                    <span
                      key={i}
                      className="card-back"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  );
                } else {
                  return (
                    <span
                      key={i}
                      className={`${["♥", "♦"].includes(card.suit) ? "red" : ""} ${i === 1 && gameOver ? "reveal" : ""}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {card.rank}{card.suit}
                    </span>
                  );
                }
              })}
            </div>
          </div>

          {!gameOver && (
            <div className="actions">
              <button onClick={hit}>➕ Hit</button>
              <button onClick={stand}>🛑 Stand</button>
            </div>
          )}

          {message && <h3 className="result">{message}</h3>}
        </>
      )}
    </div>
  );
}
