import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState, users } from "../bot";
import { games } from "../constants";
import { createNewGame, getCurrentGameState, getCurrentGame } from "../utils";
import { Step } from "../types";

export function play() {
  const playersNumberMenu = new Menu<EmojiFlavor>("players-number-menu")
    .text(
      async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
      (replyCtx) => {
        const { currentGame } = getCurrentGameState(replyCtx);
        replyCtx.reply("Что ж, и такое бывает!");

        currentGame && currentGame.setStep(Step.GAME);
        console.log(gamesState);
        replyCtx.menu.close();
      }
    )
    .row()
    .text(
      async (ctx) =>
        await ctx.emoji`Два енота, два хвоста ${"raccoon"}${"raccoon"}`,
      async (replyCtx) => {
        await replyCtx.reply(
          "Пригласите второго игрока, отправив ему ссылку-приглашение:"
        );

        const { userId, gameId, currentGame } = getCurrentGameState(replyCtx);
        console.log(currentGame);

        if (currentGame) {
          currentGame.setPlayerNumber(2);
          currentGame.setStep(Step.GAME);

          console.log(gamesState);

          replyCtx.reply(`https://t.me/speaking_ostrich_bot?start=${gameId}`);
          replyCtx.menu.close();
        }
      }
    );

  const gamesMenu = new Menu<EmojiFlavor>("game-selection");

  games.forEach(({ id, name }) => {
    gamesMenu
      .text(name, async (replyCtx) => {
        const { currentGame } = getCurrentGameState(replyCtx);

        if (currentGame && currentGame.step === Step.GAME_TYPE) {
          currentGame.setGameType(id);
          currentGame.setStep(Step.PLAYERS);

          await replyCtx.menu.nav("players-number-menu");
          console.log(gamesState);
          replyCtx.editMessageText("Укажите количество игроков:");
        }
      })
      .row();
  });

  bot.use(gamesMenu);
  gamesMenu.register(playersNumberMenu);

  function runGame(ctx: any) {
    const { userId, currentGame } = getCurrentGameState(ctx);

    if (currentGame) {
      if (currentGame.step === Step.GAME) {
        return;
      }
      ctx.reply("Выберите игру:", {
        reply_markup: gamesMenu,
      });
    } else {
      createNewGame(userId);
      console.log(users);

      runGame(ctx);
    }

    console.log(gamesState);
  }

  bot.command("play", async (ctx) => {
    runGame(ctx);
  });
}
