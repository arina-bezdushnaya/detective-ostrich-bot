import { getRules } from "./rules";
import { getHelp } from "./help";
import { play } from "./play";
import { start } from "./start";
import { getObjectives } from "./objectives";
import { getGameList } from "./games";

export function insertCommands() {
  getRules();
  getHelp();
  play();
  start();
  getObjectives();
  getGameList();
}
