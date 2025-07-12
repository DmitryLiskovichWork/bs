import { observer } from "mobx-react-lite"
import { gameEngine } from "../../../services/GameEngine.store"

export const UserSetup = observer(() => {
  const { userBoard: { setup: { boatSizesLeft }, status } } = gameEngine;
  
  return status === 'setup' ? (
    <div>
      Please add your ships.
      You have next Ships:
      <ul>
        {boatSizesLeft.map(({ size, count }) => (
          <li key={size}>
            Size: {size} - Count: {count}
          </li>
        ))}
      </ul>
      <div>
        
      </div>
      <button onClick={() => gameEngine.userBoard.autoFill()}>Auto Fill Your Board</button>
      <button onClick={() => gameEngine.userBoard.setup.resetBoard()}>Reset Your Board</button>
    </div>
  ) : null
})