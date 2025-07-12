import { observer } from 'mobx-react-lite';
import './App.css';
import { gameEngine } from './services/GameEngine.store';
import { GameBoard } from './components/units/GameBoard';
import { GameStatus } from './components/units/GameStatus';
import { UserSetup } from './components/units/UserSetup';

function App() {
  return (
    <div className="app-container">
      <GameStatus />
      <UserSetup />

      <div className="boards-container">
        {gameEngine.boards.map((board) => (
          <GameBoard 
            key={board.title} 
            title={gameEngine.status === 'done' ? board.winnerTitle : board.title} 
            Cell={board.Cell} 
            board={board.board} 
          />
        ))}
      </div>
    </div>
  );
}

export default observer(App);
