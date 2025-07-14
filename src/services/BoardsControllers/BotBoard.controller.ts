import { makeObservable } from "mobx";
import { BoardController } from "./Board.controller";
import { Bot } from "@utils/classes/Bot";
import { GameConfig, ICellProps, Position } from "types";
import { EnemyCell } from "@components/units/EnemyCell";
import { withBoardController } from "@utils/hocs/withBoardController";
import { BoardAutoFiller } from "./BoardAutoFiller.service";

export class BotBoardController extends BoardController {
  private activeProcess: ReturnType<typeof setTimeout> | null = null;

  title = 'Bot';
  Cell = withBoardController(EnemyCell, this) as React.FC<ICellProps>;
  autoFiller: BoardAutoFiller;

  bot: Bot;
  
  constructor(config: GameConfig) {
    super(config);

    this.autoFiller = new BoardAutoFiller(this);

    this.bot = new Bot(this.board, config.botLevel ?? 'hard');

    makeObservable(this)
  }

  init = () => {
    this.resetBoats();
    this.createBoard();
    this.bot.reset()

    this.fill();
  }

  stop = () => {
    if(this.activeProcess) clearTimeout(this.activeProcess);
  }

  fire = () => {
    const nextPosition = this.bot.getNextPosition();

    if(this.activeProcess) this.stop();
    
    this.activeProcess = setTimeout(() => this.emit('fire', nextPosition, this), this.config.botAnswerRate ?? 0)
  }

  fireResult = ({ isHit, isDestroyed, position }: { isHit: boolean, isDestroyed: boolean, position: Position }) => {
    if(isHit) {
      this.bot.updateHits(position);
    }

    if(isDestroyed) {
      this.bot.destroyed();
    }

    if(isHit || isDestroyed) {
      this.fire();
    }
  }

  override subscribe = (event: 'fire', callback: (position: Position, source: BoardController) => void) => {
    const unsubscribe = super.subscribe(event, callback);

    this.fire();

    return unsubscribe;
  }

  move = this.fire
}