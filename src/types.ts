import {Context} from "grammy/out/context";
import {SessionFlavor} from "grammy";
import {EmojiFlavor} from "@grammyjs/emoji";

export interface TurnSessionData {
  turnClues: number[];
  avCluesPage: number;
  doneObjectives: number;
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
}

export interface NavigationButton {
  name: string;
  action: number;
}
