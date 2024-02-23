import {Bot} from "grammy";
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
const bot = new Bot(BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => {
    const message = ctx.message; // the message object
    console.log(message);

    ctx.reply(`Привет, ${ctx.from.first_name}!`);
});

//Start the Bot
bot.start();
// bot.api.sendMessage(chat_id, "Hi!");
