import {Bot} from "grammy";
import { Menu } from "@grammyjs/menu";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";
import { User } from "@grammyjs/types";
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;


var pgp = require('pg-promise')(/*options*/);

// Database connection details;
const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'xxx',
    user: 'xxx',
    password: 'xxx',
};
var db = pgp(cn);

// Простой запрос к базе данных для проверки
// db.query('SELECT NOW()', (err: any, result: any) => {
//     if (err) {
//         console.error('Ошибка выполнения запроса:', err);
//     } else {
//         console.log('Результат запроса:', result.rows[0]);
//     }
// });

db.any('select * from users where active = $1', [true])
    .then(data => {
        console.log('DATA:', data); // print data;
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error;
    });

// Запуск сервера
// const port = 3000;

// app.listen(port, () => {
//     console.log(`Сервер запущен на http://localhost:${port}`);
// });

//Create a new bot
const bot = new Bot(BOT_TOKEN);

// Список команд
const commands = [
    {
        command: "play",
        description: "Начать игру",
    },
    {
        command: "objectives",
        description: "Задачи игры",
    },
    {
        command: "rules",
        description: "Правила",
    },
];

bot.use(emojiParser());

// const players = new Map();

function initializeTasks() {
    const completedTasks = new Map<string, string | boolean>(commands.map(command => ([command.command, false])));
    completedTasks.set('player1', false);
    completedTasks.set('player2', false);

    return completedTasks;
}

const completedTasks = initializeTasks();
console.log('initialTasks', completedTasks);

function markTaskAsCompleted(task: string) {
    completedTasks.set(task, true);
}

function addPlayer(id: string) {
    completedTasks.set(id, false);
}

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

bot.command("start", async (ctx) => {
    if (ctx.match) {
        const userInvited = await bot.api.getChat(ctx.match);
        const username = (userInvited as unknown as User).username;
        // addPlayer(ctx.match);
        // addPlayer(String(ctx.from?.id));
        addPlayer('new_player');

        // console.log(players);
        markTaskAsCompleted('player2');
        console.log('completedTasks', completedTasks);

        bot.api.sendMessage(
            ctx.match,
            `Ваш друг @${ctx.from?.username} присоединился к игре`
        );

        await ctx.reply(`@${username} пригласил Вас в игру Детективный страус!`);
        ctx.reply("Чтобы узнать список доступных команд, введите  /help")

        return;
    }

    markTaskAsCompleted('player1');
    addPlayer(String(ctx.from?.id));
    console.log('completedTasks', completedTasks);

    await ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`);
    await ctx.reply(ctx.emoji`Детективный страус предлагает сыграть в загадочную игру ${"magnifying_glass_tilted_right"}`);

    await ctx.reply("Чтобы узнать список доступных команд, введите  /help")
});

bot.command("objectives", (ctx) => {
    const objectivesTitle = "Задачи игры";
    const objectivesText = "1. Прочитайте запись звонка в службу спасения. 2. ";

    ctx.reply(`${objectivesTitle} - ${objectivesText}.`);
});

bot.command("rules", async (ctx) => {
    markTaskAsCompleted('rules');
    console.log('completedTasks', completedTasks);

    const goal = "<b>Цель игры</b> - Восстановить картину преступления.\n";
    const objectivesText = "Каждый игрок получает по <b><i>3 улики (подсказки)</i></b>. \n" +
        "Игроки ходят поочередно, в каждый свой ход можно выполнить <u>одно</u> из следующих действий: \n" +
        "1. Выбрать одну улику (которую считаете самой важной и существенной) и <i>обнародовать</i> ее. \n" +
        "2.<i>Сбросить</i> (вывести из игры) несущественную улику. \n\n";
    const important = "В конце игры в <b>Сбросе</b> должно быть не менее 6 улик, иначе за каждую " +
        "недостающую улику вы лишаетесь <i>3 баллов</i>. \n\n";
    const finallyStep = "В конце хода получите новую улику.";
    const attention = "Когда все подсказки открыты или отправлены в Сброс, обсудите с другом " +
        "имеющиеся у Вас сведения и выстроите версию произошедшего.";

    await ctx.reply(`${goal}`, {parse_mode: "HTML"});
    await ctx.reply(`${objectivesText + important + finallyStep}`, {parse_mode: "HTML"});
    await ctx.reply(`${attention}`, {parse_mode: "HTML"});
});

bot.command("play", async (ctx) => {
    await ctx.reply("Выберите количество игроков:", {reply_markup: menu});

    console.log('ggg')
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
bot.api.setMyCommands(commands);

// bot.api.sendMessage(chat_id, "Hi!");
