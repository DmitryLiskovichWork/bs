import { action, makeObservable, observable } from "mobx";
import { BoardController } from "./Board.controller";
import { Position } from "../types";

export class FightService {
  @observable turn: 'p1' | 'p2' = 'p1';
  
  constructor(private p1: BoardController, private p2: BoardController) {
    makeObservable(this)

    this.p1.subscribe('fire', this.fire);
    this.p2.subscribe('fire', this.fire);

    this.p2.disabled = true;
  }

  @action changeTurn = () => {
    this[this.turn].disabled = true;

    this.turn = this.turn === 'p1' ? 'p2' : 'p1';

    this[this.turn].disabled = false;

    this[this.turn]?.myTurn?.();
  }

  @action hit(board: BoardController, position: Position) {
    const boat = board.findBoat(position.x, position.y)

    board.setPosition(position.x, position.y, 2);

    if(!boat) return false;

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

  fire = (position: Position) => {
    // getting enemy board to hit
    const board = this.turn === 'p1' ? this.p2 : this.p1;

    const cell = board.board[position.y][position.x];
    
    const isHit = cell === 1;
    const isDestroyed = isHit ? this.hit(board, position) : false;

    if(!isHit) {
      board.setPosition(position.x, position.y, -1);

      this.changeTurn();

      return { isHit, isDestroyed: false };
    }

    this[this.turn].fired?.({ isHit, isDestroyed, position });

    return { isHit, isDestroyed };
  }
}