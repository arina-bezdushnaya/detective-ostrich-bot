import {gamesMap} from "./constants";
import {BotContext, Step} from "./types";
import {getRandomIndex, getUserId} from "./utils/common";
import {
  updateSessionClues,
  sendMessage,
  sendNextButton, notifyPlayersOfNewClue,
} from "./utils/tg";
import {beforeInitialTurnButton} from "./menus/game";

export class Game {
  id: string;
  name: string;
  gameOwner: number;
  playersNumber: number;
  step: Step;
  players: number[];
  currentPlayer: number;
  turnNumber: number;
  initialTurnClues: Map<number, number[]>;
  remainingClues: Set<number>;
  availableClues: Set<number>;
  resetClues: number[];
  allObjectives: string[];

  constructor() {
    this.id = "";
    this.name = "";
    this.gameOwner = 0;
    this.playersNumber = 0;
    this.step = Step.GAME_TYPE;
    this.players = [];
    this.currentPlayer = 0;
    this.turnNumber = 0;
    this.initialTurnClues = new Map();
    this.availableClues = new Set();
    this.remainingClues = new Set();
    this.resetClues = [];
    this.allObjectives = [];
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

  setPlayerNumber(value: number) {
    if (this.step === Step.PLAYERS || this.step === Step.WAITING_FOR_PLAYERS) {
      this.playersNumber = value;
    }
  }

  setCurrentPlayer() {
    const currentUser = this.currentPlayer + 1;
    this.currentPlayer = !!this.players[currentUser] ? currentUser : 0;
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

  async checkPLayers(sendNotification: Function, ctx: any) {
    if (this.playersNumber === this.players.length) {
      await this.startMultiplePlayersGame();
      console.log('начинаем');

      this.players.map((player) => {
        sendNotification({userId: player, isEverybodyJoin: true});
      });
    } else {
      this.players.map((player) => {
        const isGameOwner = this.gameOwner === player;
        sendNotification({userId: player, isGameOwner});
      });
    }
  }

  async startOnePlayerGame(ctx: any) {
    await this.setInitialCommonProperties();

    const initialCluesMap = this.setCluesForInitialTurn();
    const userInitialClues = initialCluesMap.get(this.players[0]) || [];

    this.showInitialSituation(ctx, userInitialClues);
  }

  startMultiplePlayersGame() {
    this.setInitialCommonProperties();
    this.setCluesForInitialTurn();
    console.log(" multiplayer initialCluesMap=", this.initialTurnClues);

    console.log(this);
  }


  setInitialCommonProperties() {
    console.log("set Initial Common Properties");

    this.setPlayerNumber(this.players.length);
    this.setStep(Step.GAME);
    this.setTurnNumber();

    const clues = this.getAllClues();
    const cluesKeys = clues.map((clue: string, index: number) => index);

    this.remainingClues = new Set(cluesKeys);

    this.addClueToAvailable(1);
    // this.addClueToAvailable(2);
    // this.addClueToAvailable(3);
    // this.addClueToAvailable(4);
    // this.addClueToAvailable(5);

    this.deleteClueFromRemaining(0);
    this.deleteClueFromRemaining(1);
  }

  async showInitialSituation(ctx: any, clues: number[]) {
    const userId = getUserId(ctx);

    const [initialObjective] = this.getAllObjectives();
    const initialMessage =
      "Игра началась!\n" +
      "Начинаем полное загадок и тайн расследование🔎\n\n" +
      initialObjective;

    const isReadTheSituation = 'Погрузились в ситуацию? Нажмите "Далее"!';

    const [initialClue] = this.getAllClues();
    this.setCluesToSessionCtx(ctx, clues);

    await sendMessage({userId, text: initialMessage});
    await sendMessage({
      userId,
      text: initialClue,
      parseMode: "HTML",
    });
    await sendNextButton(ctx, isReadTheSituation, beforeInitialTurnButton)

    console.log(userId, this);
  }


  getAllClues() {
    const {clues} = require(`./games/${this.id}`);
    return clues;
  }

  addClueToAvailable(index: number) {
    this.availableClues.add(index);
    this.deleteClueFromRemaining(index);
  }

  addClueToReset(index: number) {
    this.resetClues.push(index);
    this.deleteClueFromRemaining(index);
  }

  getClueText(index: number) {
    const clues = this.getAllClues();
    return clues[index];
  };

  deleteClueFromRemaining(index: number) {
    this.remainingClues.delete(index);
  };

  setCluesToSessionCtx(ctx: any, clues: number[]) {
    const menuCtx = (ctx as unknown as BotContext);
    menuCtx.session.turnClues = Array.from(clues);
    console.log(menuCtx.session.turnClues);
  }

  setCluesForInitialTurn() {
    const initialCluesMap = new Map<number, number[]>();

    this.players.forEach(userId => {

      const userCluesForTurn = [0, 0, 0].map(clue => {
        const cluesSet = this.remainingClues;
        const cluesArr = Array.from(cluesSet);
        const randomIndex = getRandomIndex(cluesArr);

        clue = cluesArr[randomIndex];
        this.deleteClueFromRemaining(clue);
        return clue;
      });

      initialCluesMap.set(userId, userCluesForTurn);
    });

    this.initialTurnClues = initialCluesMap;

    return initialCluesMap;
  }

  addClueForNextTurn() {
    const cluesSet = this.remainingClues;
    const cluesArr = Array.from(cluesSet);
    const randomIndex = getRandomIndex(cluesArr);

    const clueKey = cluesArr[randomIndex];
    this.deleteClueFromRemaining(clueKey);
    return clueKey;
  }


  getAllObjectives() {
    const {objectives} = require(`./games/${this.id}`);
    return objectives;
  }

  setTurnNumber() {
    this.turnNumber++;
  };

  async finishTurn(ctx: any, selectedClue: number, isReset?: boolean) {
    this.setTurnNumber();
    this.setCurrentPlayer();
    this.remainingClues.delete(selectedClue);

    isReset ? this.addClueToReset(selectedClue)
      : this.addClueToAvailable(selectedClue);

    updateSessionClues(ctx, selectedClue);
    !isReset && notifyPlayersOfNewClue(this);
  };
}
