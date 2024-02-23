import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState } from "../bot";
import { games } from "../constants";
import { Game } from "../game_class";
import { game, restartGame as restart } from "../utils";

export function play() {
  const playersNumberMenu = new Menu<EmojiFlavor>("players-number-menu")
    .text(
      async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
      (replyCtx) => {
        replyCtx.reply("Что ж, и такое бывает!");

        game(replyCtx.from?.id).setPlayerNumber(1);
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
        game(replyCtx.from?.id).setPlayerNumber(2);
        console.log(game(replyCtx.from?.id));

        replyCtx.reply(
          `https://t.me/speaking_ostrich_bot?start=${replyCtx.from.id}`
        );
      }
    );

  // bot.use(playersNumberMenu);

  const gamesMenu = new Menu<EmojiFlavor>("game-selection");
  games.forEach((game) => {
    gamesMenu
      .text(game.name, async (replyCtx) => {
        await gamesState.set(replyCtx.from?.id, new Game(game.id));

        await replyCtx.menu.nav("players-number-menu");
        replyCtx.editMessageText("Выберите игроков:");

        // await bot.api.sendMessage(
        //   replyCtx.from?.id,
        //   "Выберите количество игроков:",
        //   {
        //     reply_markup: playersNumberMenu,
        //   }
        // );

        // console.log(gamesState);
      })
      .row();
  });

  bot.use(gamesMenu);

  const restartGame = new Menu<EmojiFlavor>("restart-game")
    .text("Да", async (replyCtx) => {
      restart(replyCtx.chat?.id);
      runInitialStep(replyCtx);
    })
    .row()
    .text("Нет", async (replyCtx) => {
      // replyCtx.menu.close();
      // replyCtx.menu.nav("gamesMenu");
    });

  bot.use(restartGame);

  // gamesMenu.submenu("players-number-menu");
  gamesMenu.register(playersNumberMenu);

  function runInitialStep(ctx: any) {
    console.log(ctx.from?.id);
    console.log(game(ctx.from?.id));

    const currentGame = game(ctx.from?.id);
    // const title =
    //   currentGame && currentGame.id ? "Выберите игроков:" : "Выберите игру:";

    const attention = "Игра уже запущена. Сбросить ее и начать заново?";

    if (currentGame) {
      ctx.reply(attention, {
        reply_markup: restartGame,
      });
    } else {
      ctx.reply("Выберите игру:", {
        reply_markup: gamesMenu,
      });
    }
  }

  bot.command("play", async (ctx) => {
    runInitialStep(ctx);
  });
}
