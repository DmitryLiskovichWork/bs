import { observer } from "mobx-react-lite";
import { gameEngine } from "../../../services/GameEngine.store";

export const GameStatus = observer(() => {
  const { userBoard: { status }, fight: { activeBoard }, resetGame } = gameEngine;

  return (
    <div>
      {status !== 'setup' && <button className="reset-button" onClick={resetGame}>Re-start Game</button>}
      {status === 'initialized' && gameEngine.status === 'inprogress' && (
        <h4>
          {activeBoard.title} move
        </h4>
      )}
      {gameEngine.status === 'done' && (
        <h4>
          Your game is over, one more?
        </h4>
      )}
    </div>
  )
})