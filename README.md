# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `Details`

## 📦 Architecture Overview

This project emphasizes clean separation of concerns and flexibility.  
The core logic is handled by services, and the main entry point is: GameEngine.store.ts

## 🧩 Component Structure (Atomic Design)

Following Atomic Design principles:

- **Atoms** – smallest independent UI elements (`Cell`, `Button`, `Link`).
- **Molecules** – group atoms into larger pieces (e.g., `BoardGrid`); contain no business logic.
- **Units** – reusable components that *can* include business logic.
- **Modules** – represent larger parts of the app (e.g., different routes or full screens).

## 🎮 Game Logic

The `GameEngine` accepts:
- `Boards` – describes the battlefield behavior.
- `GameController` – defines how moves are performed.

Thanks to this separation, replacing a board or controller implementation leads to different game modes without changing core logic.

Currently supported:
- Two board controller types (Bot and User)

## 🧠 Controllers

- **Bot** – automatically picks targets using internal logic.
- **User** – selects targets via mouse clicks on the opponent’s board.

You can set up **Bot vs Bot** mode to watch automatic gameplay.

## 🔁 Game Flow: `SinglePlayerService`

The `SinglePlayerService` coordinates game turns.

### How it works:
1. Each board knows whether it's its turn to move.
2. The board emits a `fire` event:
   - **Bot**: triggers fire automatically with a delay.
   - **User**: triggers fire by clicking an enemy cell.
3. `SinglePlayerService` validates the move source and determines the next player.

## 🚢 Ship Placement

Boards support:
- **Autofill** – automatic random ship placement.
- **Manual mode** – the user places ships manually.

While placing ships, valid positions are highlighted for easy visualization.

## ✅ Features

- Service-based architecture with fully pluggable logic
- Supports custom game modes (e.g., Bot vs Bot)
- Clean, extensible codebase
- Simple UI focused on logic over styling
- Easy to scale into multiplayer or more complex modes

