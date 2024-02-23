import {Bot} from "grammy";
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
const bot = new Bot(BOT_TOKEN);

// Список команд
// play - Начать игру
// goal - Цель игры
// objectives - Задачи игры
// rules - Как играть

bot.command("start", (ctx) =>
  ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`)
);

bot.command("goal", (ctx) => {
  const goalTitle = "Цель игры";
  const goalText = "Восстановить картину преступления";

  ctx.reply(`${goalTitle} - ${goalText}.`);
});

bot.command("objectives", (ctx) => {
  const objectivesTitle = "Задачи игры";
  const objectivesText = "1. Прочитайте запись звонка в службу спасения. 2. ";

  ctx.reply(`${objectivesTitle} - ${objectivesText}.`);
});

// bot.on("message", (ctx) => {
//   const message = ctx.message; // the message object
//   console.log(message);

//   ctx.reply(`Привет, ${ctx.from.first_name}!`);
// });

// bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

//Start the Bot
bot.start();
// bot.api.sendMessage(chat_id, "Hi!");
