import { BotLevel } from "../config/bot";

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Position = {
  x: number;
  y: number;
};

export enum BoatSizes {
  xs = 1,
  s = 2,
  m = 3,
  l = 4,
}

export type GameConfig = {
  width: number;
  height: number;
  botAnswerRate?: number;
  botLevel?: BotLevel;
}

export interface ICellProps {
  xPos: number;
  yPos: number;
  cell: number;
}

export type Board = number[][];