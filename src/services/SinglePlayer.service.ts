import { action, computed, makeObservable, observable } from "mobx";
import { BoardController } from "./Board.controller";
import { IGameController, Position } from "../types";
import { getRandomInt } from "../utils/boardFilling";

export class SinglePlayerService implements IGameController {
  @observable activeBoardId = getRandomInt(0, 1)
  unsubscribes: (() => void)[] = []
  boards: [BoardController, BoardController];
  
  // support only 2 boards
  constructor(...boards: BoardController[]) {
    this.boards = [boards[0], boards[1]];

    this.initBoards()
    this.activeBoard.move()

    makeObservable(this)
  }

  // subscribe on all boards fire action
  @action initBoards = () => {
    this.unsubscribes.forEach(unsubscribe => unsubscribe())

    this.unsubscribes = this.boards.map(board => {
      board.init()
      return board.subscribe('fire', this.fire)
    })

    this.activeBoardId = getRandomInt(0, 1);
  }

  @action restart = () => {
    this.initBoards()
  }

  @computed get activeBoard() {
    return this.boards[this.activeBoardId];
  }

  @computed get oppositeBoard() {
    return this.boards[this.nextBoardId];
  }

  @computed get nextBoardId() {
    if(this.activeBoardId >= this.boards.length - 1) {
      return 0;
    } else {
      return this.activeBoardId + 1;
    }
  }

  @action nextBoard = () => {
    if(this.boards.some(board => !board.hasBoats)) {
      this.activeBoard.disabled = true;
      this.oppositeBoard.disabled = true;

      return
    }

    this.activeBoard.disabled = true;

    this.activeBoardId = this.nextBoardId;

    this.activeBoard.disabled = false;
    
    this.activeBoard.move();
  }

  hit(board: BoardController, position: Position) {
    const boat = board.findBoat(position.x, position.y)

    board.setPosition(position.x, position.y, 2);

    if(!boat) return false;

    const isDestroyed = boat.every(position => board.getPosition(position) === 2)

    if(isDestroyed) {
      boat.forEach(position => {
        board.setPosition(position.x, position.y, 3);
      })
    }

    return isDestroyed;
  }

  fire = (position: Position) => {
    const cell = this.oppositeBoard.getPosition(position);
    
    const isHit = cell === 1;
    const isDestroyed = isHit ? this.hit(this.oppositeBoard, position) : false;

    if(!isHit) {
      this.oppositeBoard.setPosition(position.x, position.y, -1);

      this.nextBoard();

      return { isHit, isDestroyed: false };
    }

    this.activeBoard.fired?.({ isHit, isDestroyed, position });

    return { isHit, isDestroyed };
  }
}