import { defaultDirections } from "../config/bot";
import { Board, Position } from "../types";
import { getRandomInt } from "./boardFilling";
import { getAllUnselected } from "./getAllUnselected";
import { getAroundPositions } from "./positions";
import { inBoardScope } from "./validation";

export class Bot {
  private hitsSeries: Position[] = [];
  private nextPossiblePositions: Position[] = [];
  private availablePositions: Position[] = [];

  // just analytics for how good bot is
  iteration = 0;

  constructor(private board: Board) {
    this.init()
  }

  private init = () => {
    this.availablePositions = [];
    this.nextPossiblePositions = [];
    
    // fill available positions to fire
    this.availablePositions = getAllUnselected(this.board)
  }

  reset = () => {
    this.init()
  }

  updateHits = (position: Position) => {
    this.nextPossiblePositions.push(position);
    this.hitsSeries.push(position);
  }

  removeAvailablePosition = (position: Position) => {
    this.availablePositions = this.availablePositions.filter(p => p.x !== position.x || p.y !== position.y);
  }

  getNextPosition = () => {
    this.iteration++;

    const nextPosition = this.decideNextPosition();

    this.removeAvailablePosition(nextPosition);
    
    return nextPosition;
  }

  // in case we destroyed the boat we are trying to avoid hitting near the boat
  destroyed = () => {
    const positionsToAvoid = this.hitsSeries
      .flatMap(position => getAroundPositions(this.board, position))
      .reduce((acc, position) => {
        if(acc.some(p => p.x === position.x && p.y === position.y)) return acc;

        return [...acc, position]
      }, [] as Position[])

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
      defaultDirections.filter(({ dir }) => predictedDirections.includes(dir)) :
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