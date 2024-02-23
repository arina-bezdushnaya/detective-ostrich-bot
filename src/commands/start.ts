import { User } from "@grammyjs/types";
import { bot } from "../bot";

export function start() {
  // function addPlayer(id: string) {
  //   completedTasks.set(id, false);
  // }

  bot.command("start", async (ctx) => {
    if (ctx.match) {
      const userInvited = await bot.api.getChat(ctx.match);
      const username = (userInvited as unknown as User).username;
      // addPlayer(ctx.match);
      // addPlayer(String(ctx.from?.id));
      // markTaskAsCompleted("player2");

      bot.api.sendMessage(
        ctx.match,
        `Ваш друг @${ctx.from?.username} присоединился к игре`
      );

      await ctx.reply(`@${username} пригласил Вас в игру Детективный страус!`);
      ctx.reply("Чтобы узнать список доступных команд, введите  /help");

      return;
    }

    // markTaskAsCompleted("player1");
    // addPlayer(String(ctx.from?.id));

    await ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`);
    await ctx.reply(
      ctx.emoji`Детективный страус предлагает сыграть в загадочную игру ${"magnifying_glass_tilted_right"}`
    );

    await ctx.reply("Чтобы узнать список доступных команд, введите  /help");
  });
}
