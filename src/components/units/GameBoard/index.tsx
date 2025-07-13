import { Board } from "../../../types";
import { Grid } from "../../molecules/Grid";

type Props = {
  title: string;
  board: Board;
  Cell: React.ComponentType<{ xPos: number; yPos: number; cell: number }>;
}

export const GameBoard = ({ title, board, Cell }: Props) => (
  <div className='game-board'>
    <h2>{title}</h2>
    <Grid data={board}>
      {(x, y, cell) => <Cell xPos={x} yPos={y} cell={cell} />}
    </Grid>
  </div>
)