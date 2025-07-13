import { observer } from "mobx-react-lite";
import { gameEngine } from "../../../services/GameEngine.store";
import { Cell } from "../../atoms/Cell";
import { CellStatus } from "../../../config";
import { useCallback } from "react";
import { ICellProps } from "../../../types";

export const BotCell = observer(({ xPos, yPos, cell }: ICellProps) => {
  const { gameController: { fire }, status} = gameEngine;

  const classes = [
    ...((cell !== 1 || status === 'done') && cell in CellStatus ? [CellStatus[cell as CellStatus]] : []),
  ]

  const onClick = useCallback(() => {
    if((cell === 0 || cell === 1) && status === 'inprogress') {
      fire({ x: xPos, y: yPos });
    }
  }, [cell, xPos, yPos, fire, status])

  return  (
    <Cell className={classes.join(' ')} onClick={onClick}/>
  )
})