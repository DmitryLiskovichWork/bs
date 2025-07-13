import { action, computed, makeObservable, observable } from "mobx";
import { buildBoard } from "../../utils/buildBoard";
import { Board, BoardConfig, Direction, ICellProps, Position } from "../../types";
import { getBoatFullPath } from "../../utils/boardFilling";
import { BoardAutoFiller } from "../BoardAutoFiller.service";
import { changeBoardValue } from "../../utils/changeBoardValue";
import { Subscriptions } from "../../utils/Subscriptions";

const hasBoats = (board: Board) => 
  board.some(row => row.some(cell => cell === 1))

export abstract class BoardController {
  abstract title: string;
  abstract Cell: React.FC<ICellProps>
  abstract autoFiller?: BoardAutoFiller;

  abstract fireResult: (props: { isHit: boolean, isDestroyed: boolean, position: Position }) => void;
  abstract move: () => void;
  abstract init: () => void;

  subs = new Subscriptions();
  disabled = false;

  @observable status: 'setup' | 'initialized' = 'setup';
  @observable.ref board: Board = [];
  @observable.ref boats: Position[][] = [];

  constructor(private config: BoardConfig) {
    makeObservable(this)

    this.createBoard()
  }

  @computed get winnerTitle() {
    return this.hasBoats ? `${this.title} is winner 🏆` : this.title;
  }

  @action setPosition = (x: number, y: number, value: number) => {
    this.board = changeBoardValue(this.board, x, y, value);
  }

  getPosition = (position: Position) => {
    return this.board[position.y][position.x];
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

  subscribe = (event: 'fire', callback: (position: Position) => void) => 
    this.subs.subscribe(event, callback)

  emit = (event: 'fire', position: Position) => {
    if(this.disabled) return;

    this.subs.emit(event, position)
  }
}