import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { gamesState } from "../bot";
import { deleteGame, getCurrentGameState } from "../utils/common";

export const restartGameMenu = new Menu<EmojiFlavor>("restart-game")
  .text("Да", async (replyCtx) => {
    const { userId, gameId, currentGame } = getCurrentGameState(replyCtx);

    if (currentGame && gameId) {
      const isSeveralPlayers = currentGame.players.length > 1;

      isSeveralPlayers
        ? currentGame.changePlayers(userId, true)
        : deleteGame(gameId);

      replyCtx.menu.close();
      await replyCtx.editMessageText("Чтобы начать новую игру, введите  /play");
      console.log(userId, gamesState);
    }
  })
  .row()
  .text("Нет", async (replyCtx) => {
    await replyCtx.editMessageText("Продолжаем игру!");
    replyCtx.menu.close();
  });
