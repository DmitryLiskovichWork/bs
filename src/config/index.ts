import { BoatSizes, Direction, Position } from "types"

export const config = {
  width: 10,
  height: 10,
  botAnswerRate: 400,
  botLevel: 'hard' as const
}

export type BoatConfig = {
  size: BoatSizes;
  count: number;
}

export const boatsConfig: BoatConfig[] = [
  { size: BoatSizes.l, count: 1 },
  { size: BoatSizes.m, count: 2 },
  { size: BoatSizes.s, count: 3 },
  { size: BoatSizes.xs, count: 4 },
]

export const directions: Record<Direction, Position[]> = {
  up: [{ x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -3 }],
  right: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
  down: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
  left: [{ x: -1, y: 0 }, { x: -2, y: 0 }, { x: -3, y: 0 }],
}

export enum CellStatus {
  hit = 2,
  shipHit = 3,
  miss = -1,
}