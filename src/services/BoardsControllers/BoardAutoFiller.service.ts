import { action, makeObservable } from "mobx";
import { boatsConfig } from "@config/index";
import { BoatSizes } from "types";
import { getRandomInt } from "@utils/boardFilling";
import { getAvailablePositionsWithDirections } from "@utils/boardFilling";
import { BoardController } from "./Board.controller";

export class BoardAutoFiller {
  constructor(private board: BoardController) {
    makeObservable(this)
  }

  private randomizeBoatPlacement = (size: BoatSizes) => {
    const availablePositions = getAvailablePositionsWithDirections(this.board.board, size)
    
    const randomPosition = availablePositions[getRandomInt(0, availablePositions.length - 1)];
  
    const randomDirection = randomPosition.directions[getRandomInt(0, randomPosition.directions.length - 1)];
  
    return this.board.addBoat(randomPosition.position.x, randomPosition.position.y, size, randomDirection)
  }

  @action fill = () => {
    boatsConfig.forEach(({ size, count }) => {
      for(let i = 0; i < count; i++) {
        this.randomizeBoatPlacement(size);
      }
    });

    this.board.status = 'initialized';
  }
}