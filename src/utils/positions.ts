import { Position } from "../types";
import { isFieldAvailable, isInBoardScope } from "./validation";

export const getAvailablePositions = (board: number[][]): Position[] => 
  board.reduce<Position[]>((acc, row, y) => {
    row.forEach((_, x) => {
      if(isFieldAvailable(board, { x, y })) {
        acc.push({ x, y });
      }
    })

    return acc;
  }, []);

export const getAroundPositions = (board: number[][], position: Position): Position[] => {
  const positions = [];

  for(let i = -1; i <= 1; i++) {
    for(let j = -1; j <= 1; j++) {
      const newPosition = { x: position.x + i, y: position.y + j };

      if(!isInBoardScope(board, newPosition)) continue
      
      positions.push(newPosition);
    }
  }

  return positions;
}