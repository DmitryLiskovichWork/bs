import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { gameEngine } from "@services/GameEngine.store";
import { Cell } from "@components/atoms/Cell";
import { CellStatus } from "@config/index";
import { ICellProps } from "../../../types";
import { BotBoardController } from "@services/BoardsControllers/BotBoard.controller";

export const EnemyCell = observer(({ xPos, yPos, cell, board }: ICellProps & { board: BotBoardController }) => {
  const { gameController: { activeBoard }, status} = gameEngine;

  const classes = [
    ...((cell !== 1 || status === 'finished') && cell in CellStatus ? [CellStatus[cell as CellStatus]] : []),
  ]

  const onClick = useCallback(() => {
    if((cell === 0 || cell === 1) && status === 'inprogress') {
      if(activeBoard !== board) {
        activeBoard.fire({ x: xPos, y: yPos });
      }
    }
  }, [cell, status, activeBoard, xPos, yPos, board])

  return  (
    <Cell className={classes.join(' ')} onClick={onClick}/>
  )
})