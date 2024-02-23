import { bot } from "../bot";

export function getObjectives() {
  bot.command("objectives", (ctx) => {
    const objectivesTitle = "Задачи игры";
    const objectivesText = "1. Прочитайте запись звонка в службу спасения. 2. ";

    ctx.reply(`${objectivesTitle} - ${objectivesText}.`);
  });
}
