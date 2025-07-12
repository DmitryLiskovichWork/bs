export const buildBoard = (width: number, height: number) => {
  const board = new Array(height).fill(0).map(() => new Array(width).fill(0));

  return board;
}
