import { observer } from 'mobx-react-lite';
import './App.css';
import { gameEngine } from './services/GameEngine.store';
import { GameBoard } from './components/units/GameBoard';
import { GameStatus } from './components/units/GameStatus';
import { UserSetup } from './components/units/UserSetup';
import { UserCell } from './components/units/UserCell';
import { BotCell } from './components/units/BotCell';

function App() {
  const userTitle = gameEngine.winner === 'p1' ? 'User Win 🏆' : 'User';
  const botTitle = gameEngine.winner === 'p2' ? 'Opponent Win 🏆' : 'Opponent';
  
  return (
    <div className="app-container">
      <GameStatus />
      <UserSetup />

      <div className="boards-container">
        <GameBoard title={userTitle} Cell={UserCell} board={gameEngine.userBoard.board} />
        {gameEngine.userBoard.status !== 'setup' && 
          <GameBoard title={botTitle} Cell={BotCell} board={gameEngine.enemyBoard.board} />}
      </div>
    </div>
  );
}

export default observer(App);
