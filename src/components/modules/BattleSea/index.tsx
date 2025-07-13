import React from "react"
import { UserBoardController } from "../../../services/BoardsControllers/UserBoard.controller"
import { gameEngine } from "../../../services/GameEngine.store"
import { GameBoard } from "../../units/GameBoard"
import { GameStatus } from "../../units/GameStatus"
import { UserSetup } from "../../units/UserSetup"

export const BattleSea = () => {
  return (
    <div>
      <GameStatus />

      <div className="boards-container">
        {gameEngine.boards.map((board, index) => (
          <React.Fragment key={`${board.title}_${index}`}>
            {board instanceof UserBoardController && <UserSetup board={board} />}
            <GameBoard 
              title={gameEngine.status === 'finished' ? board.winnerTitle : board.title} 
              Cell={board.Cell} 
              board={board.board} 
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}