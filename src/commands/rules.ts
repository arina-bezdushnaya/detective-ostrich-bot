import {bot} from "../bot";
import {rulesDetails, rulesMenu} from "../menus";

export function getRules() {
  bot.use(rulesMenu);
  rulesMenu.register(rulesDetails);

  bot.command("rules", async (ctx) => {
    const goal = "<b>Цель игры</b> - Восстановить картину преступления.\n";

    await ctx.reply(`${goal}`, {parse_mode: "HTML"});
    await ctx.reply("Правила для", {
      reply_markup: rulesMenu,
      parse_mode: "HTML"
    });
  });
}
