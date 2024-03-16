import {bot, users} from "../bot";
import {
  createNewGame,
  getCurrentGameState, sendNotifIsEverybodyReady
} from "../utils";
import {Step} from "../types";
import {
  playersNumberMenu,
  gamesMenu,
  useMenus
} from "../menus";

export function play() {
  useMenus();

  function runGame(ctx: any) {
    const {userId, currentGame} = getCurrentGameState(ctx);

    switch (currentGame?.step) {
      case Step.WAITING_FOR_PLAYERS:
        currentGame.checkPLayers(sendNotifIsEverybodyReady(ctx), ctx);
        return;
      // todo add other steps
      case Step.GAME:
        // currentGame.playGame(ctx);
        return;
      case Step.GAME_TYPE:
        ctx.reply("Выберите игру:", {
          reply_markup: gamesMenu,
        });
        return;
      case Step.PLAYERS:
        ctx.reply("Укажите количество игроков:", {
          reply_markup: playersNumberMenu,
        });
        return;
      default:
        createNewGame(userId);
        console.log(users);

        runGame(ctx);
        return;
    }
  }

  bot.command("play", async (ctx) => {
    runGame(ctx);
  });
}
