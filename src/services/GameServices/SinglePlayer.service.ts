import { action, computed, makeObservable, observable } from "mobx";
import { BoardController } from "@services/BoardsControllers/Board.controller";
import { Position } from "types";
import { IGameController } from "./types";

export class SinglePlayerService implements IGameController {
  @observable activeBoardId = 0
  unsubscribes: (() => void)[] = []
  boards: [BoardController, BoardController];
  
  // support only 2 boards
  constructor(...boards: BoardController[]) {
    this.boards = [boards[0], boards[1]];

    this.initBoards()

    makeObservable(this)
  }

  // subscribe on all boards fire action
  @action private initBoards = () => {
    this.unsubscribes.forEach(unsubscribe => unsubscribe())

    this.unsubscribes = this.boards.map(board => {
      board.init()

      return board.subscribe('fire', this.eventBasedFire)
    })

    this.activeBoardId = 0;

    this.activeBoard.move()
  }

  restart = () => {
    this.initBoards()
  }

  @computed get activeBoard() {
    return this.boards[this.activeBoardId];
  }

  @computed private get opponentBoard() {
    return this.boards[this.nextBoardId];
  }

  @computed private get nextBoardId() {
    if(this.activeBoardId >= this.boards.length - 1) {
      return 0;
    } else {
      return this.activeBoardId + 1;
    }
  }

  @action private nextBoard = () => {
    this.activeBoardId = this.nextBoardId;

    this.activeBoard.move();
  }

  private hit(board: BoardController, position: Position) {
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

  private fire = (position: Position) => {
    // fire is only possible if both boards has boats
    if(!this.opponentBoard.hasBoats || !this.activeBoard.hasBoats) return

    const cell = this.opponentBoard.getPosition(position);
    
    const isHit = cell === 1;
    const isDestroyed = isHit ? this.hit(this.opponentBoard, position) : false;

    if(!isHit) {
      this.opponentBoard.setPosition(position.x, position.y, -1);

      this.nextBoard();

      return { isHit, isDestroyed: false };
    }

    this.activeBoard.fireResult({ isHit, isDestroyed, position });

    return { isHit, isDestroyed };
  }

  eventBasedFire = (position: Position, source: BoardController) => {
    if(source === this.activeBoard) {
      this.fire(position)
    }
  }
}