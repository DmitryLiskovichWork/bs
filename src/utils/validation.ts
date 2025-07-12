import { directions } from "../config";
import type { BoatSizes, Direction, Position } from "../types";
import { getAroundPositions } from "./positions";

export const isInBoardScope = (board: number[][], position: Position) => 
  position.x >= 0 && position.x < board[0].length && position.y >= 0 && position.y < board.length;

const validatedPosition = (board: number[][], position: Position): boolean => board[position.y]?.[position.x] === 0;

export const isFieldAvailable = (board: number[][], position: Position) => {
  const isAvailable = getAroundPositions(board, position)
    .every(position => validatedPosition(board, position));

  return isAvailable;
}

export const isEnoughSpaceForDirection = (board: number[][], position: Position, direction: Direction, size: BoatSizes) => {
  const pathToCheck = directions[direction];

  return pathToCheck.slice(0, size - 1).every(p => {
    const newPosition = { x: position.x + p.x, y: position.y + p.y };

    return isInBoardScope(board, newPosition) && isFieldAvailable(board, newPosition);
  });
}