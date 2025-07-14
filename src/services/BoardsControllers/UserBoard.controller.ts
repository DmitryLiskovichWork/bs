import { makeObservable, runInAction } from "mobx";
import { GameConfig, ICellProps, Position } from "types";
import { UserCell } from "@components/units/UserCell";
import { withBoardController } from "@utils/hocs/withBoardController";
import { UserSetupService } from "./settings/UserSetup.service";
import { BoardController } from "./Board.controller";
import { BoardAutoFiller } from "./BoardAutoFiller.service";

export class UserBoardController extends BoardController {
  setup: UserSetupService;
  title = 'User';
  Cell = withBoardController(UserCell, this) as React.FC<ICellProps>;
  autoFiller: BoardAutoFiller;

  constructor(config: GameConfig) {
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
      this.setup.resetBoard();

      this.status = status;
    })
  }

  override fill = () => {
    this.setup.resetBoard();

    this.autoFiller.fill()
  }

  fire = (position: Position) => {
    this.emit('fire', position, this)
  }

  fireResult = () => {}

  move = () => {}
}