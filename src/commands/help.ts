import { bot } from "../bot";
import { commands } from "../constants";

export function getHelp() {
  bot.command("help", (ctx) => {
    commands.pop();

    const comm = commands
      .map((com) => `/${com.command} - ${com.description}\n`)
      .join("");

    ctx.reply(`${comm}`, { parse_mode: "HTML" });
  });
}
