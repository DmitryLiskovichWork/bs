import { observer } from "mobx-react-lite";
import { Cell } from "@components/atoms/Cell";
import { CellStatus } from "@config/index";
import { useCallback } from "react";
import { UserBoardController } from "@services/BoardsControllers/UserBoard.controller";
import { ICellProps } from "types";
import { gameEngine } from "@services/GameEngine.store";

type Props = ICellProps & {
  board: UserBoardController
}

export const UserCell = observer(({ xPos, yPos, cell, board }: Props) => {
  const { setup: { changePosition, availablePaths, position}, status } = board;
  const { gameController: { activeBoard } } = gameEngine;

  const isActiveCell = position && position.x === xPos && position.y === yPos;
  const isAvailableCell = availablePaths?.some(path => path.some(p => p.x === xPos && p.y === yPos));

  const isVisibleShips = cell === 1 && (board.status === 'setup' || gameEngine.status === 'finished');

  const classes = [
    ...(isActiveCell ? ['active'] : []),
    ...(isAvailableCell ? ['available'] : []),
    ...(isVisibleShips ? ['ship'] : []),
    ...(cell in CellStatus ? [CellStatus[cell as CellStatus]] : []),
  ]

  const onClick = useCallback(() => {
    if(status === 'setup') {
      changePosition(xPos, yPos);
    } 

    // cannot fire on your own board
    if(activeBoard !== board && status === 'initialized') {
      activeBoard.fire({ x: xPos, y: yPos });
    }
  }, [status, changePosition, xPos, yPos, activeBoard, board])

  return  (
    <Cell className={classes.join(' ')} onClick={onClick}/>
  )
})