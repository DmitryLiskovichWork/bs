import { observer } from "mobx-react-lite";
import { gameEngine } from "@services/GameEngine.store";

export const GameStatus = observer(() => {
  const { userBoard: { status }, gameController: { activeBoard, restart } } = gameEngine;

  return (
    <div>
      {status !== 'setup' && <button className="reset-button" onClick={restart}>Re-start Game</button>}
      {status === 'initialized' && gameEngine.status === 'inprogress' && (
        <h4>
          {activeBoard.title} move
        </h4>
      )}
      {gameEngine.status === 'finished' && (
        <h4>
          Your game is over, one more?
        </h4>
      )}
    </div>
  )
})