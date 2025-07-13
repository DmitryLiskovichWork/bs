import { Board } from "types";

export const changeBoardValue = (board: Board, x: number, y: number, value: number): Board => {
  const newBoard = [...board].map(row => [...row]);

  // mutate only copy of the board
  newBoard[y][x] = value;

  return newBoard;
}