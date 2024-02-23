import { bot } from "../bot";

export function getRules() {
  bot.command("rules", async (ctx) => {
    // markTaskAsCompleted("rules");

    const goal = "<b>Цель игры</b> - Восстановить картину преступления.\n";
    const objectivesText =
      "Каждый игрок получает по <b><i>3 улики (подсказки)</i></b>. \n" +
      "Игроки ходят поочередно, в каждый свой ход можно выполнить <u>одно</u> из следующих действий: \n" +
      "1. Выбрать одну улику (которую считаете самой важной и существенной) и <i>обнародовать</i> ее. \n" +
      "2.<i>Сбросить</i> (вывести из игры) несущественную улику. \n\n";
    const important =
      "В конце игры в <b>Сбросе</b> должно быть не менее 6 улик, иначе за каждую " +
      "недостающую улику вы лишаетесь <i>3 баллов</i>. \n\n";
    const finallyStep = "В конце хода получите новую улику.";
    const attention =
      "Когда все подсказки открыты или отправлены в Сброс, обсудите с другом " +
      "имеющиеся у Вас сведения и выстроите версию произошедшего.";

    await ctx.reply(`${goal}`, { parse_mode: "HTML" });
    await ctx.reply(`${objectivesText + important + finallyStep}`, {
      parse_mode: "HTML",
    });
    await ctx.reply(`${attention}`, { parse_mode: "HTML" });
  });
}
