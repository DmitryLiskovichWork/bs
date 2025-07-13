import { action, computed, makeObservable, observable } from "mobx";
import { buildBoard } from "../utils/buildBoard";
import { BoardConfig, BoatSizes, Direction, ICellProps, Position } from "../types";
import { getAvailablePositionsWithDirections, getBoatFullPath, getRandomInt } from "../utils/boardFilling";
import { boatsConfig } from "../config";

const hasBoats = (board: number[][]) => 
  board.some(row => row.some(cell => cell === 1))

export abstract class BoardController {
  abstract title: string;
  abstract Cell: React.FC<ICellProps>

  emitter = new EventTarget();
  disabled = false;

  @observable status: 'setup' | 'initialized' = 'setup';
  @observable.ref board: number[][] = [];
  @observable.ref boats: Position[][] = [];

  constructor(private config: BoardConfig) {
    makeObservable(this)

    this.board = buildBoard(this.config.width, this.config.height)
  }

  @computed get winnerTitle() {
    return this.hasBoats ? `${this.title} is winner 🏆` : this.title;
  }

  @action setPosition = (x: number, y: number, value: number) => {
    this.board[y][x] = value;

    this.board = [...this.board];
  }

  abstract init: () => void;

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

  private randomizeBoatPlacement = (size: BoatSizes) => {
    const availablePositions = getAvailablePositionsWithDirections(this.board, size)
    
    const randomPosition = availablePositions[getRandomInt(0, availablePositions.length - 1)];
  
    const randomDirection = randomPosition.directions[getRandomInt(0, randomPosition.directions.length - 1)];
  
    return this.addBoat(randomPosition.position.x, randomPosition.position.y, size, randomDirection)
  }

  @action autoFill = () => {
    boatsConfig.forEach(({ size, count }) => {
      for(let i = 0; i < count; i++) {
        this.randomizeBoatPlacement(size);
      }
    });

    this.status = 'initialized';
  }

  subscribe = (event: 'fire', callback: (position: Position) => void) => {   
    const listener = ((event: CustomEvent) => {
      callback(event.detail);
    }) as EventListener;
    
    this.emitter.addEventListener(event, listener);

    return () => this.emitter.removeEventListener(event, listener);
  }

  emit = (event: 'fire', position: Position) => {
    this.emitter.dispatchEvent(new CustomEvent(event, { detail: position }));
  }

  fired: ({ isHit, isDestroyed, position }: { isHit: boolean, isDestroyed: boolean, position: Position }) => void = () => {};

  myTurn: () => void = () => {};
}