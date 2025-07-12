import { observer } from "mobx-react-lite";
import { gameEngine } from "../../../services/GameEngine.store";

export const GameStatus = observer(() => {
  const { userBoard: { status }, fight: { turn }, winner, resetGame } = gameEngine;

  return (
    <div>
      {status === 'inprogress' && <button className="reset-button" onClick={resetGame}>Re-start Game</button>}
      {gameEngine.status === 'gameover' && (
        <h4>
          {winner === 'p2' ? 'You lost' : 'You won'}
        </h4>
      )}
      {status === 'inprogress' && gameEngine.status === 'inprogress' && (
        <h4>
          {turn === 'p1' ? 'Your move' : 'Computer move'}
        </h4>
      )}
    </div>
  )
})