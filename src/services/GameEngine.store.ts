import { config } from "../config";
import { BoardController } from "./Board.controller";
import { UserBoardController } from "./UserBoard.controller";
import { FightService } from "./Fight.service";
import { computed } from "mobx";

export class GameEngine {
  userBoard: UserBoardController;
  computerBoard: BoardController;
  fight: FightService;

  constructor(private config: { width: number, height: number }) {
    this.userBoard = new UserBoardController(this.config)
    this.computerBoard = new BoardController(this.config)

    this.computerBoard.autoFill();
    
    this.fight = new FightService(this.userBoard, this.computerBoard)
  }

  resetGame = () => {
    this.userBoard.init();
    this.computerBoard.init();

    this.computerBoard.autoFill();
  }

  @computed get status() {
    const computerStatus = this.computerBoard.status;
    const userStatus = this.userBoard.status;

    const status = [computerStatus, userStatus].includes('gameover') ? 'gameover' : 'inprogress';

    return status;
  }

  @computed get winner() {
    if(this.status === 'gameover') {
      return this.computerBoard.status === 'gameover' ? 'user' : 'computer';
    }

    return null;
  }
}

export const gameEngine = new GameEngine(config);