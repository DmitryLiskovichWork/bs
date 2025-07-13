import { defaultDirections } from "../config/bot";
import { Board, Position } from "../types";
import { getRandomInt } from "./boardFilling";
import { getAroundPositions } from "./positions";
import { inBoardScope } from "./validation";

export class Bot {
  private hitsSeries: Position[] = [];
  private nextPossiblePositions: Position[] = [];
  private availablePositions: Position[] = [];

  constructor(private board: Board) {
    // fill available positions to fire
    for(let y = 0; y < this.board.length; y++) {
      for(let x = 0; x < this.board[y].length; x++) {
        this.availablePositions.push({ x, y });
      }
    }
  }

  updateHits = (position: Position) => {
    this.nextPossiblePositions.push(position);
    this.hitsSeries.push(position);
  }

  updateAvailablePositions = (position: Position) => {
    this.availablePositions = this.availablePositions.filter(p => p.x !== position.x || p.y !== position.y);
  }

  getNextPosition = () => {
    const nextPosition = this.decideNextPosition();

    this.updateAvailablePositions(nextPosition);
    
    return nextPosition;
  }

  // in case we destroyed the boat we are trying to avoid hitting near the boat
  destroyed = () => {
    const positionsToAvoid = this.hitsSeries.flatMap(position => getAroundPositions(this.board, position));

    this.availablePositions = this.availablePositions
      .filter(p => positionsToAvoid.every(position => position.x !== p.x || position.y !== p.y));

    this.nextPossiblePositions = [];
    this.hitsSeries = []
  }

  // get next random or predicted position
  private decideNextPosition = () => {
    const possiblePosition = this.nextPossiblePositions?.find(position => this.predictNextHit(position));
    const predictedPosition = possiblePosition ? this.predictNextHit(possiblePosition) : null;

    if(predictedPosition) {
      return predictedPosition;
    };

    return this.availablePositions[getRandomInt(0, this.availablePositions.length - 1)];
  }

  // predict direction by two positions
  getDirection = (position1: Position, position2: Position) => {
    const xDiff = position2.x - position1.x;
    const yDiff = position2.y - position1.y;

    if(xDiff === 0) return ['up', 'down'];

    if(yDiff === 0) return ['left', 'right'];

    return ['up', 'down', 'left', 'right'];
  }

  // predict next hit by direction
  private predictNextHit = (position: Position) => {
    // try to predict direction by two last hits
    const predictedDirections = this.hitsSeries.length > 1 ? 
      this.getDirection(this.hitsSeries[this.hitsSeries.length - 2], this.hitsSeries[this.hitsSeries.length - 1]) : null;

    // try to keep only predicted directions
    const directions = predictedDirections ? 
      defaultDirections.filter(({ way }) => predictedDirections.includes(way)) :
      defaultDirections;

    const possiblePositions = directions.map(({ x, y }) => ({
      x: position.x + x,
      y: position.y + y,
    }))
    .filter(({ x, y}) => inBoardScope(this.board, { x, y }))
    .filter(({ x, y }) => this.availablePositions.some(p => p.x === x && p.y === y))

    const randomPosition = possiblePositions[getRandomInt(0, possiblePositions.length - 1)];

    // if we didn't find next position, we remove the position from stack
    if(!randomPosition) {
      this.nextPossiblePositions = this.nextPossiblePositions.filter(p => p.x !== position.x || p.y !== position.y);
    }

    return randomPosition ?? null
  }
}