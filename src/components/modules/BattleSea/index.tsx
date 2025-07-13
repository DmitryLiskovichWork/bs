import React from "react"
import { observer } from "mobx-react-lite"
import { UserBoardController } from "../../../services/BoardsControllers/UserBoard.controller"
import { gameEngine } from "../../../services/GameEngine.store"
import { GameBoard } from "../../units/GameBoard"
import { GameStatus } from "../../units/GameStatus"
import { UserSetup } from "../../units/UserSetup"

export const BattleSea = observer(() => {
  const boards = gameEngine.boards.map((board, index) => {
    const title = gameEngine.status === 'finished' && board.hasBoats ? 
      `${board.title} is winner 🏆` : board.title;

    return (
      <React.Fragment key={`${board.title}_${index}`}>
        {board instanceof UserBoardController && <UserSetup board={board} />}
        <GameBoard 
          title={title} 
          Cell={board.Cell} 
          board={board.board} 
        />
      </React.Fragment>
    )
  })
  
  return (
    <div>
      <GameStatus />

      <div className="boards-container">
        {boards}
      </div>
    </div>
  )
})