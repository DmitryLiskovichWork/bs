import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { UserSetupService } from "./settings/UserSetup.service";
import { BoardConfig } from "../../types";
import { UserCell } from "../../components/units/UserCell";
import { withUserBoard } from "../../hocs/withUserBoard";
import { BoardAutoFiller } from "../BoardAutoFiller.service";

export class UserBoardController extends BoardController {
  setup: UserSetupService;
  title = 'User';
  Cell = withUserBoard(UserCell, this);
  autoFiller: BoardAutoFiller;

  constructor(config: BoardConfig) {
    super(config);

    this.autoFiller = new BoardAutoFiller(this);

    this.setup = new UserSetupService(this);
    makeObservable(this)
  }

  init = () => {
    this.status = 'setup';
    this.setup.resetBoard()
    this.resetBoats();
    this.createBoard();
  }

  fireResult = () => {}

  move = () => {}
}