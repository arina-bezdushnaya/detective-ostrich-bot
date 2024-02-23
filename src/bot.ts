import { Bot } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";
import { commands } from "./constants";
import { insertCommands } from "./commands";
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
export const bot = new Bot<EmojiFlavor>(BOT_TOKEN);

export const gamesState = new Map();
console.log(gamesState);

bot.use(emojiParser());

insertCommands();

//Start the Bot
bot.start();

// Установить список команд
bot.api.setMyCommands(commands);

// bot.on("message", (ctx) => {
//   const message = ctx.message; // the message object
//   console.log(message);

//   ctx.reply(`Привет, ${ctx.from.first_name}!`);
// });

// Отправить сообщение
// bot.api.sendMessage(chat_id, "Hi!");
