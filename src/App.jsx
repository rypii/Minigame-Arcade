import { useState } from 'react';
import './styles/App.css';
import GameSelector from "./components/GameSelector";
import LightsOutGame from "./games/LightsOut/LightsOutGame";
import MemoryGame from "./games/Memory/MemoryGame";
import MinesweeperGame from './games/MineSweeper/MineSweeperGame';



function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleSelectGame = (game) => {
    setCurrentGame(game);
  };

  const renderGame = () => {
    switch (currentGame) {
      case "lightsout":
        return <LightsOutGame onBack={() => setCurrentGame(null)} />;
      case "memory":
        return <MemoryGame onBack={() => setCurrentGame(null)} />;
      case "minesweeper":
        return <MinesweeperGame onBack={() => setCurrentGame(null)} />;
      default:
        return <GameSelector onSelectGame={handleSelectGame} />;
    }

  };

  return (
    <div className="App">
      <h1>Minigame Arcade</h1>
      {renderGame()}
    </div>
  );

}

export default App;
