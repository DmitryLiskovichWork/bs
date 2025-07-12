import { directions } from "../config";
import { BoatSizes, Direction, Position } from "../types";
import { getAvailableDirections } from "./directions";
import { getAvailablePositions } from "./positions";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getAvailablePositionsWithDirections = (board: number[][], size: BoatSizes) => {
  const availablePositions = getAvailablePositions(board)

  return availablePositions.reduce<{ position: Position, directions: Direction[] }[]>((acc, position ) => {
    const availableDirections = getAvailableDirections(board, position, size)

    if(availableDirections.length > 0) {
      acc.push({
        position,
        directions: availableDirections
      })
    }

    return acc
  }, [])
}

export const getBoatFullPath = (position: Position, size: BoatSizes, direction: Direction | null): Position[] => {
  const path = direction ? directions[direction].map(p => ({ x: position.x + p.x, y: position.y + p.y })) as Position[] : [];

  return [
    position,
    ...path,
  ].slice(0, size);
}