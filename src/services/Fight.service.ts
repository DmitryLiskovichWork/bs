import { action, computed, makeObservable, observable } from "mobx";
import { BoardController } from "./Board.controller";
import { Position } from "../types";

export class FightService {
  @observable activeBoardId = 0
  boards: [BoardController, BoardController];
  
  // support only 2 boards
  constructor(...boards: BoardController[]) {
    this.boards = [boards[0], boards[1]];

    // subscribe on all boards fire action
    boards.forEach(board => board.subscribe('fire', this.fire))

    makeObservable(this)
  }

  @computed get activeBoard() {
    return this.boards[this.activeBoardId];
  }

  get nextBoardId() {
    if(this.activeBoardId >= this.boards.length - 1) {
      return 0;
    } else {
      return this.activeBoardId + 1;
    }
  }

  @action nextBoard = () => {
    this.activeBoard.disabled = true;

    this.activeBoardId = this.nextBoardId;

    this.activeBoard.disabled = false;
    
    this.activeBoard.myTurn();
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

    return isDestroyed;
  }

  fire = (position: Position) => {
    // getting enemy board to hit
    const board = this.boards[this.nextBoardId];

    console.log(this.nextBoardId, board)

    const cell = board.board[position.y][position.x];
    
    const isHit = cell === 1;
    const isDestroyed = isHit ? this.hit(board, position) : false;

    if(!isHit) {
      board.setPosition(position.x, position.y, -1);

      this.nextBoard();

      return { isHit, isDestroyed: false };
    }

    this.activeBoard.fired?.({ isHit, isDestroyed, position });

    return { isHit, isDestroyed };
  }
}