import { User } from "@grammyjs/types";
import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState } from "../bot";
import { game } from "../utils";

export function start() {
  // const attention = "Игра уже запущена. Сбросить ее и начать заново?";
  const attention = "Игра уже запущена. Сбросить ее?";

  const restartGameMenu = new Menu<EmojiFlavor>("restart-game")
    .text("Да", async (replyCtx) => {
      const currentGameToRestart = game(replyCtx.from?.id);
      currentGameToRestart.restartGame(replyCtx.chat?.id);
      console.log(currentGameToRestart);

      replyCtx.reply("Чтобы начать новую игру, введите  /play");
    })
    .row()
    .text("Нет", async (replyCtx) => {
      await replyCtx.editMessageText("Продолжаем игру!");
      replyCtx.menu.close();

      // replyCtx.menu.nav("gamesMenu");
    });

  bot.use(restartGameMenu);

  bot.command("start", async (ctx) => {
    const currentGameToRestart = game(ctx.from?.id);
    console.log(currentGameToRestart);

    if (currentGameToRestart.id) {
      ctx.reply(attention, {
        reply_markup: restartGameMenu,
      });
    } else {
      if (ctx.match) {
        const userInvited = await bot.api.getChat(ctx.match);
        const username = (userInvited as unknown as User).username;

        bot.api.sendMessage(
          ctx.match,
          `Ваш друг @${ctx.from?.username} присоединился к игре`
        );

        const currentGame = game(Number(ctx.match));
        // currentGame.setPlayerNumber(2);
        console.log(currentGame);
        console.log(gamesState);

        await ctx.reply(
          `@${username} пригласил Вас в игру Детективный страус!`
        );
        ctx.reply("Чтобы узнать список доступных команд, введите  /help");

        return;
      }

      await ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`);
      await ctx.reply(
        ctx.emoji`Детективный страус предлагает сыграть в загадочную игру ${"magnifying_glass_tilted_right"}`
      );

      await ctx.reply("Чтобы узнать список доступных команд, введите  /help");
    }
  });
}
