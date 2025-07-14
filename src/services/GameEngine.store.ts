import { computed, makeObservable } from "mobx";
import { config } from "@config/index";
import { GameConfig } from "types";
import { BoardController } from "./BoardsControllers/Board.controller";
import { SinglePlayerService } from "./GameServices/SinglePlayer.service";
import { BotBoardController } from "./BoardsControllers/BotBoard.controller";
import { UserBoardController } from "./BoardsControllers/UserBoard.controller";
import { IGameController } from "./GameServices/types";

type GameSettings = {
  GameController: new (...boards: BoardController[]) => IGameController
  EnemyBoard: new (config: GameConfig) => BoardController
  UserBoard: new (config: GameConfig) => BoardController
}


export class GameEngine {
  userBoard: BoardController;
  enemyBoard: BoardController;
  gameController: IGameController;

  constructor(private config: GameConfig, settings: GameSettings) {
    const { GameController, EnemyBoard, UserBoard } = settings;

    this.userBoard = new UserBoard(this.config)
    this.enemyBoard = new EnemyBoard(this.config)
    
    this.gameController = new GameController(this.userBoard, this.enemyBoard)

    makeObservable(this)
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

    const status = [this.enemyBoard.hasBoats, this.userBoard.hasBoats].includes(false) ? 'finished' : 'inprogress';

    return status;
  }
}

export const gameEngine = new GameEngine(config, {
  GameController: SinglePlayerService,
  EnemyBoard: BotBoardController,
  UserBoard: UserBoardController,
});

// Use this to watch how bots fight each other 💀
// export const gameEngine = new GameEngine(config, {
//   GameController: SinglePlayerService,
//   EnemyBoard: BotBoardController,
//   UserBoard: BotBoardController,
// });

// Or like user vs user 🤝
// export const gameEngine = new GameEngine(config, {
//   GameController: SinglePlayerService,
//   EnemyBoard: UserBoardController,
//   UserBoard: UserBoardController,
// });