import {Bot} from "grammy";
import { Menu } from "@grammyjs/menu";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";
import { User } from "@grammyjs/types";
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
const bot = new Bot(BOT_TOKEN);

// Список команд
const commands = [
    {
        command: "play",
        description: "Начать игру",
    },
    {
        command: "goal",
        description: "Цель игры",
    },
    {
        command: "objectives",
        description: "Задачи игры",
    },
    {
        command: "rules",
        description: "Правила игры",
    },
];

bot.use(emojiParser());

const players = new Set();

// Create a simple menu
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

bot.command("start", async (ctx) => {
    if (ctx.match) {
        const userInvited = await bot.api.getChat(ctx.match);
        const username = (userInvited as unknown as User).username;
        players.add(ctx.match);
        players.add(ctx.from?.id);

        bot.api.sendMessage(
            ctx.match,
            `Ваш друг @${ctx.from?.username} присоединился к игре`
        );

        await ctx.reply(`@${username} пригласил Вас в игру Детективный страус!`);
        ctx.reply("Чтобы узнать список доступных команд, введите  /help")

        return;
    }

    await ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`);
    await ctx.reply("Выберите количество игроков:", {reply_markup: menu});
});

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

bot.command("rules", async (ctx) => {
    const objectivesText = "Каждый игрок получает по <b><i>3 улики (подсказки)</i></b>. \n" +
        "Игроки ходят поочередно, в каждый свой ход можно выполнить <u>одно</u> из следующих действий: \n" +
        "1. Выбрать одну улику (которую считаете самой важной и существенной) и <i>обнародовать</i> ее. \n" +
        "2.<i>Сбросить</i> (вывести из игры) несущественную улику. \n\n";
    const important = "В конце игры в <b>Сбросе</b> должно быть не менее 6 карт, иначе за каждую " +
        "недостающую улику вы лишаетесь <i>3 баллов</i>. \n";
    const finallyStep = "В конце хода получите новую улику.";
    const attention = "Когда все подсказки открыты или отправлены в Сброс, обсудите с другом " +
        "имеющиеся у Вас сведения и выстроите версию произошедшего.";

    await ctx.reply(`${objectivesText + important + finallyStep}`, {parse_mode: "HTML"});
    await ctx.reply(`${attention}`, {parse_mode: "HTML"});

});


bot.command("help", (ctx) => {
    const comm = commands.map(com => `/${com.command} - ${com.description}\n`).join('');

    ctx.reply(
        `${comm}`,
        {parse_mode: "HTML"},
    );
});

// bot.on("message", (ctx) => {
//   const message = ctx.message; // the message object
//   console.log(message);

//   ctx.reply(`Привет, ${ctx.from.first_name}!`);
// });

// bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

//Start the Bot
bot.start();

// Установить список команд
// bot.api.setMyCommands(commands);

// bot.api.sendMessage(chat_id, "Hi!");
