import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot } from "../bot";
import { games } from "../constants";
import { Game } from "../game_class";

export function getGameList() {
  const gamesMenu = new Menu<EmojiFlavor>("game-selection");
  games.forEach((game) => {
    gamesMenu
      .text(game.name, () => {
        new Game(game.id);
      })
      .row();
  });

  bot.use(gamesMenu);

  bot.command("games", (ctx) => {
    // const comm = games
    //   .map((game) => `/${game[1]} - ${com.description}\n`)
    //   .join("");
    ctx.reply("Выберите игру:", { reply_markup: gamesMenu });
  });
}
