import { config } from "../config";
import { BoardController } from "./Board.controller";
import { UserBoardController } from "./UserBoard.controller";
import { FightService } from "./Fight.service";
import { computed } from "mobx";
import { BotBoardController } from "./BotBoard.controller";
import { BoardConfig } from "../types";


export class GameEngine {
  userBoard: UserBoardController;
  enemyBoard: BoardController;
  fight: FightService;

  constructor(private config: BoardConfig, EnemyBoard: new (config: BoardConfig) => BoardController) {
    this.userBoard = new UserBoardController(this.config)
    this.enemyBoard = new EnemyBoard(this.config)

    this.enemyBoard.autoFill();
    
    this.fight = new FightService(this.userBoard, this.enemyBoard)
  }

  resetGame = () => {
    this.userBoard.init();
    this.enemyBoard.init();

    this.enemyBoard.autoFill();
  }

  @computed get boards() {
    return [
      this.userBoard,
      ...(this.status !== 'setup' ? [this.enemyBoard] : []),
    ]
  }

  @computed get status() {
    const enemyStatus = this.enemyBoard.status;
    const userStatus = this.userBoard.status;

    if(userStatus === 'setup') return 'setup';

    const status = [enemyStatus, userStatus].includes('gameover') ? 'gameover' : 'inprogress';

    return status;
  }

  @computed get winner() {
    if(this.status === 'gameover') {
      return this.enemyBoard.status === 'gameover' ? 'p2' : 'p1';
    }

    return null;
  }
}

export const gameEngine = new GameEngine(config, BotBoardController);