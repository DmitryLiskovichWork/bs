import { config } from "../config";
import { BoardController } from "./Board.controller";
import { UserBoardController } from "./UserBoard.controller";
import { SinglePlayerService } from "./SinglePlayer.service";
import { computed } from "mobx";
import { BotBoardController } from "./BotBoard.controller";
import { BoardConfig, IGameController } from "../types";

type GameSettings = {
  GameController: new (...boards: BoardController[]) => IGameController
  EnemyBoard: new (config: BoardConfig) => BoardController
}


export class GameEngine {
  userBoard: UserBoardController;
  enemyBoard: BoardController;
  gameController: IGameController;

  constructor(private config: BoardConfig, settings: GameSettings) {
    const { GameController, EnemyBoard } = settings;

    this.userBoard = new UserBoardController(this.config)
    this.enemyBoard = new EnemyBoard(this.config)

    this.enemyBoard.autoFill();
    
    this.gameController = new GameController(this.userBoard, this.enemyBoard)
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
});