export interface Command {
  command: string;
  description: string;
}

export interface GameDescription {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  playersNumber: number;
  turn: string;
  turnNumber: number;
}

export enum Step {
  "GAME_TYPE" = "GAME_TYPE",
  "PLAYERS" = "PLAYERS",
  "GAME" = "GAME",
}
