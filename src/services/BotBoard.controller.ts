import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { Bot } from "./Bot";
import { BoardConfig, Position } from "../types";
import { BotCell } from "../components/units/BotCell";
import { BoardAutoFiller } from "./BoardAutoFiller";

const BOT_ANSWER_DELAY = 400;

export class BotBoardController extends BoardController {
  title = 'Bot';
  Cell = BotCell;
  bot: Bot;
  autoFiller: BoardAutoFiller;
  
  constructor(config: BoardConfig) {
    super(config);

    this.autoFiller = new BoardAutoFiller(this);

    this.bot = new Bot(this.board);

    this.init();

    makeObservable(this)
  }

  init = () => {
    this.resetBoats();
    this.createBoard();
    this.autoFiller.fill();
  }

  fire = (position: Position) => {
    if(this.disabled) return;
    
    setTimeout(() => this.emit('fire', position), BOT_ANSWER_DELAY)
  }

  fired = ({ isHit, isDestroyed, position }: { isHit: boolean, isDestroyed: boolean, position: Position }) => {
    if(isHit && !isDestroyed) {
      this.bot.updateHits(position);
    }

    if(isDestroyed) {
      this.bot.destroyed();
    }

    if(isHit || isDestroyed) {
      this.fire(this.bot.getNextPosition());
    }
  }

  myTurn = () => {
    this.fire(this.bot.getNextPosition());
  }
}