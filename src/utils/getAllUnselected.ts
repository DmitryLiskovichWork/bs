import { Board, Position } from "../types";

export const getAllUnselected = (board: Board) => {
  return board.reduce((acc, row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if(cell === 0 || cell === 1) {
        acc.push({ x: cellIndex, y: rowIndex })
      }
    })

    return acc
  }, [] as Position[]);
}