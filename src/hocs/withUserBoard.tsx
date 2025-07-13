import { UserBoardController } from "../services/UserBoard.controller";
import { ICellProps } from "../types";

export const withUserBoard = (
  Component: React.ComponentType<ICellProps & { board: UserBoardController }>, 
  board: UserBoardController
) => (props: ICellProps) => <Component {...props} board={board} />