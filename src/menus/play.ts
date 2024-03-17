import {InlineKeyboard} from "grammy";
import {Menu} from "@grammyjs/menu";
import {EmojiFlavor} from "@grammyjs/emoji";
import {games} from "../constants";
import {getCurrentGameState, sendNotifIsEverybodyReady} from "../utils";
import {Step} from "../types";

export const startGame = (ctx: any) => {
  const {userId, currentGame} = getCurrentGameState(ctx);
  console.log(currentGame);

  if (currentGame) {
    currentGame.setStep(Step.WAITING_FOR_FIRST_TURN);

    const userInitialClues = currentGame.initialTurnClues.get(userId) || [];
    const playersNumber = currentGame.players.length;

    playersNumber === 1 ?
      currentGame.startOnePlayerGame(ctx)
      : currentGame.showInitialSituation(ctx, userInitialClues);
  }

  ctx.deleteMessage();
};

export const startSinglePlayerGameRightNowMenu = new Menu<EmojiFlavor>("start-single-game-menu")
  .text("Начать", (replyCtx) => {
    const {currentGame} = getCurrentGameState(replyCtx);

    if (currentGame && currentGame.step === Step.WAITING_FOR_PLAYERS) {
      startGame(replyCtx);
    }

    replyCtx.menu.close();
  });

export const startMultiplePlayersGameMenu = new InlineKeyboard()
  .text("Начать", "start-multiple-game-menu");


export const playersNumberMenu = new Menu<EmojiFlavor>("players-number-menu")
  .text(
    async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
    async (replyCtx) => {
      const {currentGame} = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.PLAYERS) {
        await replyCtx.reply(
          replyCtx.emoji`Что ж, и такое бывает ${"winking_face"}`
        );

        currentGame.startOnePlayerGame(replyCtx);
      }
    }
  )
  .row()
  .text(
    async (ctx) =>
      await ctx.emoji`Два енота, два хвоста ${"raccoon"}${"raccoon"}`,
    async (replyCtx) => {
      const {gameId, currentGame} = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.PLAYERS) {
        await replyCtx.reply(
          "Пригласите второго игрока, отправив ему ссылку-приглашение:"
        );

        currentGame.setPlayerNumber(2);
        currentGame.setStep(Step.WAITING_FOR_PLAYERS);

        await replyCtx.reply(
          `https://t.me/speaking_ostrich_bot?start=${gameId}`
        );

        currentGame.checkPLayers(sendNotifIsEverybodyReady(replyCtx), replyCtx);
      }
    }
  );

export const gamesMenu = new Menu<EmojiFlavor>("game-selection");
games.forEach(({id, name}) => {
  gamesMenu
    .text(name, async (replyCtx) => {
      const {currentGame} = getCurrentGameState(replyCtx);

      if (currentGame?.step === Step.GAME_TYPE) {
        currentGame.setGameType(id);
        currentGame.setStep(Step.PLAYERS);

        replyCtx.reply("Укажите количество игроков:", {
          reply_markup: playersNumberMenu,
        });
      }
    })
    .row();
});
