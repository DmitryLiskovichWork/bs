import { config } from "../config";
import { BoardController } from "./BoardsControllers/Board.controller";
import { SinglePlayerService } from "./GameServices/SinglePlayer.service";
import { computed } from "mobx";
import { BotBoardController } from "./BoardsControllers/BotBoard.controller";
import { BoardConfig, IGameController } from "../types";

type GameSettings = {
  GameController: new (...boards: BoardController[]) => IGameController
  EnemyBoard: new (config: BoardConfig) => BoardController
  UserBoard: new (config: BoardConfig) => BoardController
}


export class GameEngine {
  userBoard: BoardController;
  enemyBoard: BoardController;
  gameController: IGameController;

  constructor(private config: BoardConfig, settings: GameSettings) {
    const { GameController, EnemyBoard, UserBoard } = settings;

    this.userBoard = new UserBoard(this.config)
    this.enemyBoard = new EnemyBoard(this.config)
    
    this.gameController = new GameController(this.userBoard, this.enemyBoard)
  }

  @computed get boards() {
    return [
      this.userBoard,
      ...(this.status !== 'setup' ? [this.enemyBoard] : []),
    ]
  }

  @computed get status() {
    const userStatus = this.userBoard.status;

    if(userStatus === 'setup') return 'setup';

    const status = [this.enemyBoard.hasBoats, this.userBoard.hasBoats].includes(false) ? 'done' : 'inprogress';

    return status;
  }

  @computed get winner() {
    if(!this.enemyBoard.hasBoats) {
      return 'user';
    }

    if(!this.userBoard.hasBoats) {
      return 'enemy';
    }

    return null;
  }
}

export const gameEngine = new GameEngine(config, {
  GameController: SinglePlayerService,
  EnemyBoard: BotBoardController,
  UserBoard: BotBoardController,
});