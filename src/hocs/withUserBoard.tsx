import { UserBoardController } from "../services/BoardsControllers/UserBoard.controller";

type Component<T extends object> = React.ComponentType<T & { board: UserBoardController }>

export const withUserBoard = <T extends object>(
  Component: Component<T>, 
  board: UserBoardController
) => (props: T) => <Component {...props} board={board} />