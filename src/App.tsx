import React from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';
import { gameEngine } from './services/GameEngine.store';
import { GameBoard } from './components/units/GameBoard';
import { GameStatus } from './components/units/GameStatus';
import { UserSetup } from './components/units/UserSetup';
import { UserBoardController } from './services/BoardsControllers/UserBoard.controller';

function App() {
  // just for analytics
  if(gameEngine.status === 'done') {
    // @ts-ignore
    console.log(gameEngine.enemyBoard.bot?.iteration)
    // @ts-ignore
    console.log(gameEngine.enemyBoard.bot?.iteration)
  }
  
  return (
    <div className="app-container">
      <GameStatus />

      <div className="boards-container">
        {gameEngine.boards.map((board, index) => (
          <React.Fragment key={`${board.title}_${index}`}>
            {board instanceof UserBoardController && <UserSetup board={board} />}
            <GameBoard 
              title={gameEngine.status === 'done' ? board.winnerTitle : board.title} 
              Cell={board.Cell} 
              board={board.board} 
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default observer(App);
