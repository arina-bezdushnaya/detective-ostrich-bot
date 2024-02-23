import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState } from "../bot";
import { games } from "../constants";
import { Game } from "../game_class";
import { game } from "../utils";

export function getGameList() {
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

        replyCtx.menu.nav("players-number-menu");

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

  // gamesMenu.submenu("players-number-menu");
  gamesMenu.register(playersNumberMenu);

  bot.command("games", async (ctx) => {
    await ctx.reply(
      !game(ctx.from?.id).id
        ? "Выберите игру и нажмите Продолжить:"
        : "Выберите игроков:",
      {
        reply_markup: gamesMenu,
      }
    );
  });
}
