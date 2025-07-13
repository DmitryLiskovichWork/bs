import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { buildBoard } from "@utils/buildBoard";
import { Board, BoardConfig, Direction, ICellProps, Position } from "types";
import { getBoatFullPath } from "@utils/boardFilling";
import { changeBoardValue } from "@utils/changeBoardValue";
import { Subscriptions } from "@utils/classes/Subscriptions";
import { BoardAutoFiller } from "./BoardAutoFiller.service";

const hasBoats = (board: Board) => 
  board.some(row => row.some(cell => cell === 1))

export abstract class BoardController {
  abstract title: string;
  abstract Cell: React.FC<ICellProps>
  abstract autoFiller?: BoardAutoFiller | null;

  abstract fire: (position: Position) => void;
  abstract fireResult: (props: { isHit: boolean, isDestroyed: boolean, position: Position }) => void;
  // signal that the board can make next move
  // possible to use for triggering, if it's bot
  abstract move: () => void;
  abstract init: () => void;

  subs = new Subscriptions();

  @observable status: 'setup' | 'initialized' = 'setup';
  @observable.ref board: Board = [];
  @observable.ref boats: Position[][] = [];

  constructor(protected config: BoardConfig) {
    this.createBoard()

    makeObservable(this)
  }

  @action setPosition = (x: number, y: number, value: number) => {
    this.board = changeBoardValue(this.board, x, y, value);
  }

  changeStatus = (status: 'setup' | 'initialized') => {
    runInAction(() => {
      this.status = status;
    })
  }

  getPosition = (position: Position) => {
    return this.board[position.y][position.x];
  }

  fill = () => {
    this.autoFiller?.fill()
  }

  @action resetBoats = () => {
    this.boats = [];
  }

  @action createBoard = () => {
    this.board = buildBoard(this.config.width, this.config.height);
  }

  @action addBoat = (x: number, y: number, size: number, direction: Direction | null) => {
    const boatPath = getBoatFullPath({ x, y }, size, direction);

    this.boats.push(boatPath)

    boatPath.forEach(position => {
      this.setPosition(position.x, position.y, 1);
    });
  }

  @computed get hasBoats() {
    return hasBoats(this.board)
  }

  findBoat = (x: number, y: number) => {
    return this.boats.find(boat => boat.some(position => position.x === x && position.y === y))
  }

  subscribe = (event: 'fire', callback: (position: Position, source: BoardController) => void) => {
    const listener = (position: Position) => callback(position, this)

    return this.subs.subscribe(event, listener)
  }

  emit = (event: 'fire', position: Position, source: BoardController) => {
    this.subs.emit(event, position, source)
  }
}