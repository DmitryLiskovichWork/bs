import { directions } from "@config/index";
import type { Board, BoatSizes, Direction, Position } from "types";
import { getAroundPositions } from "./positions";

const isEmptyCell = (board: Board, position: Position): boolean => board[position.y]?.[position.x] === 0;

export const inBoardScope = (board: Board, position: Position) => 
  position.x >= 0 && position.x < board[0].length && position.y >= 0 && position.y < board.length;

export const isFieldAvailable = (board: Board, position: Position) => 
  getAroundPositions(board, position).every(position => isEmptyCell(board, position))

export const isEnoughSpaceForDirection = (board: Board, position: Position, direction: Direction, size: BoatSizes) => {
  const directionPath = directions[direction];

  return directionPath.slice(0, size - 1).every(p => {
    const newPosition = { x: position.x + p.x, y: position.y + p.y };

    return inBoardScope(board, newPosition) && isFieldAvailable(board, newPosition);
  });
}