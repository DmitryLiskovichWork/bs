import { action, computed, makeObservable, observable } from "mobx";
import { Direction, Position } from "../../../types";
import { BoatConfig, boatsConfig } from "../../../config";
import { findLongestPath } from "../../../utils/directions";
import { isFieldAvailable } from "../../../utils/validation";
import { UserBoardController } from "../UserBoard.controller";

export class UserSetupService {
  @observable.ref position: Position | null = null;
  @observable.ref boatSizesLeft: BoatConfig[] = boatsConfig;

  constructor(private board: UserBoardController) {
    makeObservable(this)
  }

  @computed private get availableSizes () {
    return this.boatSizesLeft.filter(config => config.count > 0).map(config => config.size);
  }

  @computed get availablePaths () {
    return this.position ? findLongestPath(this.board.board, this.position, this.availableSizes) : null;
  }

  @action resetBoard = () => {
    this.position = null
    this.boatSizesLeft = boatsConfig
  }

  @action updateBoard = (x: number, y: number, size: number, direction: Direction | null) => {
    this.board.addBoat(x, y, size, direction)

    this.boatSizesLeft = this.boatSizesLeft.map(config => config.size === size ? { ...config, count: config.count - 1 } : config);

    if(!this.availableSizes.length) {
      this.board.status = 'initialized'
    }
  }

  private computeShift = (x: number, y: number) => {
    if(!this.position) return { x: 0, y: 0 };
    
    const xShift = this.position.x - x;
    const yShift = this.position.y - y;

    return { x: xShift, y: yShift };
  }

  private computeSize = (x: number, y: number) => {
    if(!this.position) return 0

    const { x: xShift, y: yShift } = this.computeShift(x, y);

    return Math.max(Math.abs(xShift), Math.abs(yShift)) + 1;
  }

  private computeDirection = (x: number, y: number) => {
    const { x: xShift, y: yShift } = this.computeShift(x, y);

    const directionX = xShift === 0 ? null : xShift > 0 ? 'left' as const : 'right' as const;
    const directionY = yShift === 0 ? null : yShift > 0 ? 'up' as const : 'down' as const;

    const direction = directionX ?? directionY;

    return direction
  }

  @action changePosition = (x: number, y: number) => {
    if(!isFieldAvailable(this.board.board, { x, y }) || this.availableSizes.length === 0) {
      return;
    }

    if(!this.position) {
      if(this.availableSizes.length === 1 && this.availableSizes[0] === 1) {
        this.updateBoard(x, y, 1, null)
      } else {
        this.setPosition({ x, y });
      }

      return
    }

    if(this.availablePaths?.some(path => path.some(p => p.x === x && p.y === y))) {
      const size = this.computeSize(x, y);
      const direction = this.computeDirection(x, y);

      if(this.availableSizes.includes(size)) {
        this.updateBoard(this.position.x, this.position.y, size, direction);
      }

      this.setPosition(null);

      return
    }

    this.setPosition({ x, y });
  }

  @action setPosition = (position: Position | null) => {
    this.position = position;
  }
}