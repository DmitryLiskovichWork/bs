import { BoardController } from "@services/BoardsControllers/Board.controller";

export const withBoardController = <T extends object, B extends BoardController>(
  Component: React.FC<T & { board: B }>, 
  board: B
): React.FC<T> => (props: T) => <Component {...props} board={board} />