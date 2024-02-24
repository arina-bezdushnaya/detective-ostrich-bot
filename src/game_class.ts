import { gamesMap } from "./constants";
import { Step } from "./types";

export class Game {
  id!: string;
  name!: string;
  playersNumber!: number;
  step!: Step;
  players!: number[];
  // turn: string;
  // turnNumber: number;

  restartGame() {
    this.id = "";
    this.name = "";
    this.playersNumber = 0;
    this.step = Step.GAME_TYPE;
  }

  constructor() {
    this.restartGame();
  }

  setPlayer(id: number) {
    const updatedPLayers = this.players;
    updatedPLayers.push(id);
    this.players = updatedPLayers;
  }

  getClues() {
    const { clues } = require(`./games/${this.id}`);
    console.log(clues);

    // console.log(`name: ${this.name}  age: ${this.age}`);
  }

  setPlayerNumber(value: number) {
    if (this.step !== Step.PLAYERS) {
      return;
    }
    this.playersNumber = value;
  }

  setGameType(id: string) {
    if (this.step !== Step.GAME_TYPE) {
      return;
    }
    this.id = id;
    this.name = gamesMap.get(id) || "";
  }

  setStep(step: Step) {
    this.step = step;
  }

  // function initializeTasks() {
  //   const completedTasks = new Map<string, string | boolean>(
  //     commands.map((command) => [command.command, false])
  //   );
  //   completedTasks.set("player1", false);
  //   completedTasks.set("player2", false);

  //   return completedTasks;
  // }

  // const completedTasks = initializeTasks();

  // function markTaskAsCompleted(task: string) {
  //   completedTasks.set(task, true);
  // }

  //   toString(): string {
  //     return `${this.name}: ${this.age}`;
  //   }
}
