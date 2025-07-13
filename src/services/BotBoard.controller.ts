import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { Bot } from "./Bot";
import { BoardConfig, Position } from "../types";
import { BotCell } from "../components/units/BotCell";

const BOT_ANSWER_DELAY = 400;

export class BotBoardController extends BoardController {
  title = 'Bot';
  Cell = BotCell;
  bot: Bot;
  
  constructor(config: BoardConfig) {
    super(config);

    this.bot = new Bot(this.board);

    this.init();

    makeObservable(this)
  }

  init = () => {
    this.resetBoats();
    this.createBoard();
    this.autoFill();
  }

  getPosition = () => {
    return this.bot.getNextPosition();
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
      this.fire(this.getPosition());
    }
  }

  myTurn = () => {
    this.fire(this.getPosition());
  }
}