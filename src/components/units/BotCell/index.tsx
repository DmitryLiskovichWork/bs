import { observer } from "mobx-react-lite";
import { gameEngine } from "../../../services/GameEngine.store";
import { Cell } from "../../atoms/Cell";
import { CellStatus } from "../../../config";
import { useCallback } from "react";

type Props = {
  xPos: number;
  yPos: number;
  cell: number;
}

export const BotCell = observer(({ xPos, yPos, cell }: Props) => {
  const { fight: { userFire }, status} = gameEngine;

  const classes = [
    ...(cell !== 1 && cell in CellStatus ? [CellStatus[cell as CellStatus]] : []),
  ]

  const onClick = useCallback(() => {
    if((cell === 0 || cell === 1) && status === 'inprogress') {
      userFire(xPos, yPos);
    }
  }, [cell, xPos, yPos, userFire, status])

  return  (
    <Cell className={classes.join(' ')} onClick={onClick}/>
  )
})