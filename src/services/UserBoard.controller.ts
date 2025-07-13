import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { UserSetupService } from "./UserSetup.service";
import { BoardConfig } from "../types";
import { UserCell } from "../components/units/UserCell";
import { withUserBoard } from "../hocs/withUserBoard";

export class UserBoardController extends BoardController {
  setup: UserSetupService;
  title = 'User';
  Cell = withUserBoard(UserCell, this);

  constructor(config: BoardConfig) {
    super(config);

    this.setup = new UserSetupService(this);
    makeObservable(this)
  }

  init = () => {
    this.status = 'setup';
    this.resetBoats();
    this.createBoard();
  }
}