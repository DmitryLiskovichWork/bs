import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { UserSetupService } from "./UserSetup.service";

export class UserBoardController extends BoardController {
  setup: UserSetupService;

  constructor(config: { width: number, height: number }) {
    super(config);

    this.setup = new UserSetupService(this);
    makeObservable(this)
  }
}