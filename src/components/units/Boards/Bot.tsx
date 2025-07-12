import { gameEngine } from "../../../services/GameEngine.store";
import { Grid } from "../../molecules/Grid";
import { BotCell } from "../BotCell";

export const BotBoard = () => {
  const board = gameEngine.computerBoard.board;

  return (
    <div>
      <h2>Computer Board</h2>
      <Grid data={board}>
        {(x, y, cell) => <BotCell xPos={x} yPos={y} cell={cell} />}
      </Grid>
    </div>
  )
}