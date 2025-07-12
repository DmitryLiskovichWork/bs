import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { UserSetupService } from "./UserSetup.service";
import { BoardConfig } from "../types";
import { UserCell } from "../components/units/UserCell";

export class UserBoardController extends BoardController {
  setup: UserSetupService;
  title = 'User';
  Cell = UserCell;

  constructor(config: BoardConfig) {
    super(config);

    this.setup = new UserSetupService(this);
    makeObservable(this)
  }

  fire = (x: number, y: number) => {
    if(this.disabled) return;

    this.emit('fire', { x, y });
  }
}