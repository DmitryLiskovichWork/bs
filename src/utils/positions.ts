import { Board, Position } from "../types";
import { isFieldAvailable, inBoardScope } from "./validation";

export const getAvailablePositions = (board: Board): Position[] => 
  board.reduce<Position[]>((acc, row, y) => {
    row.forEach((_, x) => {
      if(isFieldAvailable(board, { x, y })) {
        acc.push({ x, y });
      }
    })

    return acc;
  }, []);

export const getAroundPositions = (board: Board, position: Position): Position[] => {
  const positions = [];

  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      const newPosition = { y: position.y + i, x: position.x + j };

      if(!inBoardScope(board, newPosition)) continue
      
      positions.push(newPosition);
    }
  }

  return positions;
}