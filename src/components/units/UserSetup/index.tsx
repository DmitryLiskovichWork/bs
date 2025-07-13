import { observer } from "mobx-react-lite"
import { UserBoardController } from "../../../services/BoardsControllers/UserBoard.controller"

type Props = {
  board: UserBoardController
}

export const UserSetup = observer(({ board }: Props) => {
  const { setup: { boatSizesLeft }, status } = board
  
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
      <button onClick={() => board.autoFiller.fill()}>Auto Fill Your Board</button>
      <button onClick={() => board.setup.resetBoard()}>Reset Your Board</button>
    </div>
  ) : null
})