import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { Bot } from "@utils/classes/Bot";
import { GameConfig, Position } from "types";
import { EnemyCell } from "@components/units/EnemyCell";
import { BoardAutoFiller } from "./BoardAutoFiller.service";

export class BotBoardController extends BoardController {
  title = 'Bot';
  Cell = EnemyCell;
  autoFiller: BoardAutoFiller;

  bot: Bot;
  
  constructor(config: GameConfig) {
    super(config);

    this.autoFiller = new BoardAutoFiller(this);

    this.bot = new Bot(this.board, config.botLevel ?? 'hard');

    makeObservable(this)
  }

  init = () => {
    this.resetBoats();
    this.createBoard();
    this.bot.reset()

    this.fill();
  }

  fire = () => {
    const nextPosition = this.bot.getNextPosition();
    
    setTimeout(() => this.emit('fire', nextPosition, this), this.config.botAnswerRate ?? 0)
  }

  fireResult = ({ isHit, isDestroyed, position }: { isHit: boolean, isDestroyed: boolean, position: Position }) => {
    if(isHit) {
      this.bot.updateHits(position);
    }

    if(isDestroyed) {
      this.bot.destroyed();
    }

    if(isHit || isDestroyed) {
      this.fire();
    }
  }

  move = this.fire
}