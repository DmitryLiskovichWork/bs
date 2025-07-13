import { directions } from "../config";
import type { Board, BoatSizes, Direction, Position } from "../types";
import { getBoatFullPath } from "./boardFilling";
import { isEnoughSpaceForDirection } from "./validation";

const directionsValues = Object.keys(directions) as Direction[];

export const getAvailableDirections = (board: Board, position: Position, size: BoatSizes) => {
  return directionsValues.filter(direction => isEnoughSpaceForDirection(board, position, direction, size))
}

export const findLongestPath = (board: Board, position: Position, sizes: BoatSizes[]) => {
  const sortedSizes = [...sizes].sort((a, b) => b - a);

  return directionsValues.map(dir => {
    const size = sortedSizes.find(s => isEnoughSpaceForDirection(board, position, dir, s));

    if(size) {
      return getBoatFullPath(position, size, dir);
    }

    return null;
  }).filter(it => it !== null) as Position[][];
}