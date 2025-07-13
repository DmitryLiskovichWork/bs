import { Direction } from "types";

export const defaultDirections: { x: number, y: number, dir: Direction }[] = [
  { x: 1, y: 0, dir: 'right' },
  { x: -1, y: 0, dir: 'left' },
  { x: 0, y: 1, dir: 'down' },
  { x: 0, y: -1, dir: 'up' },
]

export const botLevels = {
  easy: {
    threshold: 4
  },
  medium: {
    threshold: 2
  },
  hard: {
    threshold: 0
  }
}

export type BotLevel = keyof typeof botLevels;