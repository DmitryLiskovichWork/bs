import { gameEngine } from "../../../services/GameEngine.store";
import { Grid } from "../../molecules/Grid";
import { UserCell } from "../UserCell";

export const UserBoard = () => {
  const board = gameEngine.userBoard.board;

  return (
    <div>
      <h2>Your Board</h2>
      <Grid data={board}>
        {(x, y, cell) => <UserCell xPos={x} yPos={y} cell={cell} />}
      </Grid>
    </div>
  )
}