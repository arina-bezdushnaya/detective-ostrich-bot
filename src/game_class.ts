import { gamesMap } from "./constants";

export class Game {
  id: string;
  name: string;

  constructor(id: string) {
    this.id = id;
    this.name = gamesMap.get(id) || "";
    this.getClues();
  }

  getClues() {
    const { clues } = require(`./games/${this.id}`);
    console.log(clues);

    // console.log(`name: ${this.name}  age: ${this.age}`);
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
