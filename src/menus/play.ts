import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState } from "../bot";
import { games } from "../constants";
import { getCurrentGameState } from "../utils/common";
import { Step } from "../types";
import { sendNotifIsEverybodyReady } from "../utils/tg";

export const startGameRightNowMenu = new Menu<EmojiFlavor>("start-game-menu")
  .text("Да", (replyCtx) => {
    const { currentGame } = getCurrentGameState(replyCtx);
    currentGame?.startGame();
  })
  .row()
  .text("Нет", async (replyCtx) => {
    await replyCtx.editMessageText("Подождем еще немного!");
    replyCtx.menu.close();
  });

export const playersNumberMenu = new Menu<EmojiFlavor>("players-number-menu")
  .text(
    async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
    async (replyCtx) => {
      const { currentGame } = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.PLAYERS) {
        await replyCtx.reply("Что ж, и такое бывает!");

        currentGame.setStep(Step.GAME);
        console.log(gamesState);
        currentGame.playGame(replyCtx);
      }
    }
  )
  .row()
  .text(
    async (ctx) =>
      await ctx.emoji`Два енота, два хвоста ${"raccoon"}${"raccoon"}`,
    async (replyCtx) => {
      const { gameId, currentGame } = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.PLAYERS) {
        await replyCtx.reply(
          "Пригласите второго игрока, отправив ему ссылку-приглашение:"
        );

        console.log(currentGame);

        currentGame.setPlayerNumber(2);
        currentGame.setStep(Step.WAITING_FOR_PLAYERS);

        console.log(gamesState);

        await replyCtx.reply(
          `https://t.me/speaking_ostrich_bot?start=${gameId}`
        );

        currentGame.checkPLayers(sendNotifIsEverybodyReady(replyCtx), replyCtx);
      }
    }
  );

export const gamesMenu = new Menu<EmojiFlavor>("game-selection");

games.forEach(({ id, name }) => {
  gamesMenu
    .text(name, async (replyCtx) => {
      const { currentGame } = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.GAME_TYPE) {
        currentGame.setGameType(id);
        currentGame.setStep(Step.PLAYERS);

        replyCtx.reply("Укажите количество игроков:", {
          reply_markup: playersNumberMenu,
        });

        console.log(gamesState);
      }
    })
    .row();
});

// replyCtx.menu.close();

// replyCtx.editMessageText("Укажите количество игроков:");
