import { gamesMap } from "./constants";
import { Step } from "./types";
import { getUserId } from "./utils/common";
import { changeKeyboardButtons, sendMessage } from "./utils/tg";

export class Game {
  id: string;
  name: string;
  gameOwner: number;
  playersNumber: number;
  step: Step;
  players: number[];
  // turn: string;
  turnNumber: number;
  availableClues: string[];

  constructor() {
    this.id = "";
    this.name = "";
    this.gameOwner = 0;
    this.playersNumber = 0;
    this.step = Step.GAME_TYPE;
    this.players = [];
    this.turnNumber = 0;
    this.availableClues = [];
  }

  changePlayers(id: number, quit: boolean = false) {
    const currentPlayers = this.players;

    const quitTheGame = () => {
      const updatedPlayers = currentPlayers.filter(
        (playerId) => playerId !== id
      );
      this.players = updatedPlayers;
    };

    const addNewPlayer = () => {
      if (!currentPlayers.includes(id)) {
        currentPlayers.push(id);
        this.players = currentPlayers;
      }
    };

    quit ? quitTheGame() : addNewPlayer();
    this.playersNumber = this.players.length;
  }

  // getClues() {
  //   const { clues } = require(`./games/${this.id}`);
  //   console.log(clues);
  // }

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

  setGameOwner(userId: number) {
    this.gameOwner = userId;
  }

  checkPLayers(sendNotification: Function, ctx: any) {
    if (this.playersNumber === this.players.length) {
      this.playGame(ctx);
    } else {
      this.players.map((player) => {
        const isGameOwner = this.gameOwner === player;
        sendNotification(player, isGameOwner);
      });
    }
  }

  startGame() {
    this.setStep(Step.GAME);
  }

  playGame(ctx: any) {
    const id = getUserId(ctx);
    console.log("game is running");

    const { clues, objectives } = require(`./games/${this.id}`);
    const initialClue = clues[0];

    this.showInitialSituation(id, initialClue);
  }

  showInitialSituation(id: number, initialClue: string) {
    sendMessage(id, `Игра началась!`);
    this.addClueToAvailable(initialClue);

    const keyboard = changeKeyboardButtons("Подсказки");

    sendMessage(
      id,
      `Просмотреть все доступные на текущий момент подсказки, можно нажав кнопку "Подсказки"`,
      keyboard
    );
  }

  addClueToAvailable(clue: string) {
    this.availableClues.push(clue);
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
