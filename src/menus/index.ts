import {bot} from "../bot";
import {
  availableClueDetails,
  turnClues,
  turnClueDetails,
  availableCluesMenu,
  beforeInitialTurnButton,
} from "./game";
import {startSinglePlayerGameRightNowMenu, playersNumberMenu, gamesMenu} from "./play";

export function useMenus() {
  bot.use(turnClues);
  bot.use(availableCluesMenu);

  turnClues.register(turnClueDetails);
  availableCluesMenu.register(availableClueDetails);

  bot.use(beforeInitialTurnButton);

  bot.use(startSinglePlayerGameRightNowMenu);
  bot.use(playersNumberMenu);
  bot.use(gamesMenu);
}
