import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot } from "../bot";

export function play() {
  // choose players number
  const menu = new Menu<EmojiFlavor>("start-menu")
    .text(
      async (ctx) => await ctx.emoji`Forever alone ${"loudly_crying_face"}`,
      (replyCtx) => replyCtx.reply("Что ж, и такое бывает!")
    )
    .row()
    .text(
      async (ctx) =>
        await ctx.emoji`Два енота, два хвоста ${"raccoon"}${"raccoon"}`,
      async (ctx) => {
        await ctx.reply(
          "Пригласите второго игрока, отправив ему ссылку-приглашение:"
        );
        ctx.reply(`https://t.me/speaking_ostrich_bot?start=${ctx.from.id}`);
      }
    );

  // Make it interactive
  bot.use(menu);

  bot.command("play", async (ctx) => {
    await ctx.reply("Выберите количество игроков:", { reply_markup: menu });
  });
}
