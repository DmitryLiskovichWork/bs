import { UserBoardController } from "./UserBoard.controller";
import { action, makeObservable, observable } from "mobx";
import { BoardController } from "./Board.controller";
import { Position } from "../types";
import { Bot } from "./Bot";

const BOT_ANSWER_DELAY = 400;

export class FightService {
  @observable turn: 'user' | 'computer' = 'user';
  bot: Bot;
  
  constructor(private userBoard: UserBoardController, private computerBoard: BoardController) {
    makeObservable(this)

    this.bot = new Bot(this.userBoard.board);
  }

  @action changeTurn = () => {
    this.turn = this.turn === 'user' ? 'computer' : 'user';
  }

  @action hit(board: BoardController, position: Position) {
    const boat = board.findBoat(position.x, position.y)

    board.setPosition(position.x, position.y, 2);

    if(!boat) return;

    const isDestroyed = boat.every(position => board.board[position.y][position.x] === 2)

    if(isDestroyed) {
      boat.forEach(position => {
        board.setPosition(position.x, position.y, 3);
      })
    }

    if(!board.hasBoats) {
      board.status = 'gameover';
    }

    return isDestroyed;
  }

  private fire = (x: number, y: number, board: BoardController) => {
    const cell = board.board[y][x];
    let isDestroyed = false;

    const isHit = cell === 1;

    if(isHit) {
      isDestroyed = this.hit(board, { x, y }) ?? false;
    } else {
      board.setPosition(x, y, -1);
      this.changeTurn();
    }

    return { isHit, isDestroyed };
  }

  userFire = (x: number, y: number) => {
    if(this.turn !== 'user') return;

    const { isHit } = this.fire(x, y, this.computerBoard);

    if(!isHit) {
      setTimeout(() => this.computerFire(), BOT_ANSWER_DELAY)
    }
  }

  @action computerFire = () => {
    if(this.turn !== 'computer') return;

    const newPosition = this.bot.getNextPosition();

    if(!newPosition) {
      console.warn('No more positions to hit for Bot');

      this.computerBoard.status = 'gameover';

      return;
    }

    const {isHit, isDestroyed} = this.fire(newPosition.x, newPosition.y, this.userBoard);

    if(isHit && !isDestroyed) {
      this.bot.updateHits(newPosition);
    }

    if(isDestroyed) {
      this.bot.destroyed();
    }

    if(isHit || isDestroyed) {
      setTimeout(() => this.computerFire(), BOT_ANSWER_DELAY)
    }
  }

}