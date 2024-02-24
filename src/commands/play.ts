import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState } from "../bot";
import { games } from "../constants";
import { getCurrentGame } from "../utils";
import { Step } from "../types";

export function play() {
  const playersNumberMenu = new Menu<EmojiFlavor>("players-number-menu")
    .text(
      async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
      (replyCtx) => {
        replyCtx.reply("Что ж, и такое бывает!");

        const currentGame = getCurrentGame(replyCtx.from?.id);
        currentGame.setPlayerNumber(1);
        currentGame.setStep(Step.GAME);
        console.log(gamesState);
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

        const currentGame = getCurrentGame(replyCtx.from?.id);
        currentGame.setPlayerNumber(2);
        currentGame.setStep(Step.GAME);

        console.log(gamesState);

        replyCtx.reply(
          `https://t.me/speaking_ostrich_bot?start=${replyCtx.from.id}`
        );
      }
    );

  const gamesMenu = new Menu<EmojiFlavor>("game-selection");
  games.forEach(({ id, name }) => {
    gamesMenu
      .text(name, async (replyCtx) => {
        const currentGame = getCurrentGame(replyCtx.from?.id);
        currentGame.setGameType(id);
        currentGame.setStep(Step.PLAYERS);

        await replyCtx.menu.nav("players-number-menu");
        console.log(gamesState);
        replyCtx.editMessageText("Укажите количество игроков:");
      })
      .row();
  });

  bot.use(gamesMenu);

  // gamesMenu.submenu("players-number-menu");
  gamesMenu.register(playersNumberMenu);

  function runGame(ctx: any) {
    const currentGame = getCurrentGame(ctx.from?.id);
    currentGame.setPlayer(ctx.from?.id);
    console.log(gamesState);

    if (!currentGame.id) {
      ctx.reply("Выберите игру:", {
        reply_markup: gamesMenu,
      });
    }
  }

  bot.command("play", async (ctx) => {
    runGame(ctx);
  });
}
