import { observer } from "mobx-react-lite";
import { Cell } from "../../atoms/Cell";
import { CellStatus } from "../../../config";
import { useCallback } from "react";
import { UserBoardController } from "../../../services/BoardsControllers/UserBoard.controller";
import { ICellProps } from "../../../types";

type Props = ICellProps & {
  board: UserBoardController
}

export const UserCell = observer(({ xPos, yPos, cell, board }: Props) => {
  const { setup: { changePosition, availablePaths, position}, status } = board;

  const isActiveCell = position && position.x === xPos && position.y === yPos;
  const isAvailableCell = availablePaths?.some(path => path.some(p => p.x === xPos && p.y === yPos));

  const classes = [
    ...(isActiveCell ? ['active'] : []),
    ...(isAvailableCell ? ['available'] : []),
    ...(cell in CellStatus ? [CellStatus[cell as CellStatus]] : []),
  ]

  const onClick = useCallback(() => {
    if(status === 'setup') {
      changePosition(xPos, yPos);
    }
  }, [status, changePosition, xPos, yPos])

  return  (
    <Cell className={classes.join(' ')} onClick={onClick}/>
  )
})