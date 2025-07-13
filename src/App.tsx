import { observer } from 'mobx-react-lite';
import { gameEngine } from './services/GameEngine.store';
import { BattleSea } from './components/modules/BattleSea';
import './App.css';

function App() {
  // just for analytics to check how many iterations bot made until the game is over
  if(gameEngine.status === 'finished') {
    // @ts-ignore
    console.log(gameEngine.enemyBoard.bot?.iteration)
    // @ts-ignore
    console.log(gameEngine.userBoard.bot?.iteration)
  }
  
  return (
    <div className="app-container">
      <BattleSea />
    </div>
  );
}

export default observer(App);
