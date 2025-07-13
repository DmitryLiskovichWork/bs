import { observer } from 'mobx-react-lite';
import './App.css';
import { gameEngine } from './services/GameEngine.store';
import { GameBoard } from './components/units/GameBoard';
import { GameStatus } from './components/units/GameStatus';
import { UserSetup } from './components/units/UserSetup';
import { UserBoardController } from './services/UserBoard.controller';

function App() {
  return (
    <div className="app-container">
      <GameStatus />

      <div className="boards-container">
        {gameEngine.boards.map((board) => (
          <>
            {board instanceof UserBoardController && <UserSetup board={board} />}
            <GameBoard 
              key={board.title} 
              title={gameEngine.status === 'done' ? board.winnerTitle : board.title} 
              Cell={board.Cell} 
              board={board.board} 
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default observer(App);
