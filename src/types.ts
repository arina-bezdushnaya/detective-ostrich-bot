import {Context} from "grammy/out/context";
import {SessionFlavor} from "grammy";
import {EmojiFlavor} from "@grammyjs/emoji";

export interface TurnSessionData {
  turnClues: number[];
  selectedClue: number;
  avCluesPage: number;
  doneObjectives: number;
  test: string[];
}

export type BotContext = Context & SessionFlavor<TurnSessionData> & EmojiFlavor;

export interface Command {
  command: string;
  description: string;
}

export interface GameDescription {
  id: string;
  name: string;
}

export enum Step {
  "GAME_TYPE" = "GAME_TYPE",
  "PLAYERS" = "PLAYERS",
  "WAITING_FOR_PLAYERS" = "WAITING_FOR_PLAYERS",
  "GAME" = "GAME",
  "WAITING_FOR_FIRST_TURN" = "WAITING_FOR_FIRST_TURN",
  "CONSTRUCT_VERSION" = "CONSTRUCT_VERSION",
  "ALL_PASS_TEST" = "ALL_PASS_TEST"
}

export interface NavigationButton {
  name: string;
  action: number;
}

export interface TestQuestion {
  question: string;
  answers: string[];
}
