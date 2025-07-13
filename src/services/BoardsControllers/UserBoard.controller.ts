import { makeObservable, runInAction } from "mobx";
import { BoardController } from "./Board.controller";
import { UserSetupService } from "./settings/UserSetup.service";
import { BoardConfig } from "../../types";
import { UserCell } from "../../components/units/UserCell";
import { withUserBoard } from "../../hocs/withUserBoard";
import { BoardAutoFiller } from "./BoardAutoFiller.service";

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
    this.setup.resetBoard()
    this.changeStatus('setup');
    this.resetBoats();
    this.createBoard();
  }

  override changeStatus = (status: 'setup' | 'initialized') => {
    runInAction(() => {
      this.setup.position = null;
      this.status = status;
    })
  }

  override fill = () => {
    this.setup.position = null;

    this.autoFiller.fill()
  }

  fireResult = () => {}

  move = () => {}
}