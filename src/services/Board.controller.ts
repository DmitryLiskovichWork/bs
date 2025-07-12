import { action, computed, makeObservable, observable } from "mobx";
import { buildBoard } from "../utils/buildBoard";
import { BoatSizes, Direction, Position } from "../types";
import { getAvailablePositionsWithDirections, getBoatFullPath, getRandomInt } from "../utils/boardFilling";
import { boatsConfig } from "../config";

const hasBoats = (board: number[][]) => 
  board.some(row => row.some(cell => cell === 1))

export class BoardController {
  @observable status: 'setup' | 'inprogress' | 'gameover' = 'setup';
  @observable.ref board: number[][] = [];
  @observable.ref boats: Position[][] = [];

  constructor(private config: { width: number, height: number }) {
    makeObservable(this)

    this.init();
  }

  @action setPosition = (x: number, y: number, value: number) => {
    this.board[y][x] = value;

    this.board = [...this.board];
  }

  @action init = () => {
    this.status = 'setup';
    this.boats = [];

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
    this.init();

    boatsConfig.forEach(({ size, count }) => {
      for(let i = 0; i < count; i++) {
        this.randomizeBoatPlacement(size);
      }
    });

    this.status = 'inprogress';
  }
}