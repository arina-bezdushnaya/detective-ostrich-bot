import {Menu} from "@grammyjs/menu";
import {EmojiFlavor} from "@grammyjs/emoji";
import {deleteGame, getCurrentGameState, quitTheGame} from "../utils";

export const restartGameMenu = new Menu<EmojiFlavor>("restart-game")
  .text("Да", async (replyCtx) => {
    const {gameId, currentGame} = getCurrentGameState(replyCtx);

    if (currentGame && gameId) {
      const isSeveralPlayers = currentGame.players.length > 1;

      isSeveralPlayers
        ? quitTheGame(replyCtx)
        : deleteGame(gameId);

      replyCtx.menu.close();
      await replyCtx.editMessageText("Чтобы начать новую игру, введите  /play");
    }
  })
  .row()
  .text("Нет", async (replyCtx) => {
    await replyCtx.editMessageText("Продолжаем игру!");
    replyCtx.menu.close();
  });
