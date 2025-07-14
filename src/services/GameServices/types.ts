import { Position } from "types";
import { BoardController } from "@services/BoardsControllers/Board.controller";

export interface IGameController {
  activeBoard: BoardController;

  restart: () => void;
  start: () => void;
  eventBasedFire: (position: Position, source: BoardController) => void;
}