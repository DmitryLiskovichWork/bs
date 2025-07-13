import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { Bot } from "../../utils/Bot";
import { BoardConfig, Position } from "../../types";
import { BotCell } from "../../components/units/BotCell";
import { BoardAutoFiller } from "../BoardAutoFiller.service";

const BOT_ANSWER_DELAY = 300;

export class BotBoardController extends BoardController {
  title = 'Bot';
  Cell = BotCell;
  autoFiller: BoardAutoFiller;

  bot: Bot;
  
  constructor(config: BoardConfig) {
    super(config);

    this.autoFiller = new BoardAutoFiller(this);

    this.bot = new Bot(this.board);

    makeObservable(this)
  }

  init = () => {
    this.disabled = false;
    this.resetBoats();
    this.createBoard();
    this.bot.reset()
    this.autoFiller.fill();
  }

  fire = () => {
    if(this.disabled) return;

    const nextPosition = this.bot.getNextPosition();
    
    setTimeout(() => this.emit('fire', nextPosition), BOT_ANSWER_DELAY)
  }

  fireResult = ({ isHit, isDestroyed, position }: { isHit: boolean, isDestroyed: boolean, position: Position }) => {
    if(isHit && !isDestroyed) {
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