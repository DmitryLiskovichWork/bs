import { makeObservable, runInAction } from "mobx";
import { BoardConfig, Position } from "types";
import { UserCell } from "@components/units/UserCell";
import { withUserBoard } from "@utils/hocs/withUserBoard";
import { UserSetupService } from "./settings/UserSetup.service";
import { BoardController } from "./Board.controller";
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

  fire = (position: Position) => {
    this.emit('fire', position, this)
  }

  fireResult = () => {}

  move = () => {}
}