import { gamesMap } from "./constants";
import { Step } from "./types";

export class Game {
  id: string;
  name: string;
  playersNumber: number;
  step: Step;
  // turn: string;
  // turnNumber: number;

  constructor() {
    this.id = "";
    this.name = "";
    this.playersNumber = 0;
    this.step = Step.GAME_TYPE;
    // this.getClues();
  }

  getClues() {
    const { clues } = require(`./games/${this.id}`);
    console.log(clues);

    // console.log(`name: ${this.name}  age: ${this.age}`);
  }

  setPlayerNumber(value: number) {
    this.playersNumber = value;
  }

  setGameType(id: string) {
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
