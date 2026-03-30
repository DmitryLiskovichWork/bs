import { computed, makeObservable, when } from "mobx";
import { config } from "@config/index";
import { GameConfig } from "types";
import { BoardController } from "./BoardsControllers/Board.controller";
import { SingleScreenService } from "./GameServices/SingleScreen.service";
import { BotBoardController } from "./BoardsControllers/BotBoard.controller";
import { IGameController } from "./GameServices/types";
import { UserBoardController } from "./BoardsControllers/UserBoard.controller";

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

    when(() => this.status === 'inprogress', () => {
      this.gameController.start()
    })
  }

  get boards() {
    return [this.userBoard, this.enemyBoard]
  }

  @computed get status() {
    if(this.userBoard.status === 'setup' || this.enemyBoard.status === 'setup') return 'setup';

    return this.userBoard.hasBoats && this.enemyBoard.hasBoats ? 'inprogress' : 'finished';
  }
}

export const gameEngine = new GameEngine(config, {
  GameController: SingleScreenService,
  EnemyBoard: BotBoardController,
  UserBoard: UserBoardController,
});

// Use this to watch how bots fight each other 💀
// export const gameEngine = new GameEngine(config, {
//   GameController: SingleScreenService,
//   EnemyBoard: BotBoardController,
//   UserBoard: BotBoardController,
// });

// Or like user vs user 🤝
// export const gameEngine = new GameEngine(config, {
//   GameController: SingleScreenService,
//   EnemyBoard: UserBoardController,
//   UserBoard: UserBoardController,
// });