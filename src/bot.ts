import {Bot, GrammyError, HttpError, Context, SessionFlavor, session} from "grammy";
import {emojiParser} from "@grammyjs/emoji";
import {insertCommands} from "./commands";
import {Game} from "./game_class";
import {showClues} from "./utils/tg";
import {BotContext, Step, TurnSessionData} from "./types";
import {getCurrentGameState} from "./utils/common";
import {startGame} from "./menus/play";

require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
export const bot = new Bot<BotContext>(BOT_TOKEN);

export const gamesState = new Map<string, Game>();
export const users = new Map<number, string>();
console.log(gamesState);

function initial(): TurnSessionData {
  return {avCluesPage: 0, turnClues: [], doneObjectives: 0};
}

bot.use(session({initial}));
bot.use(emojiParser());

insertCommands();

//Start the Bot
bot.start();

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// bot.on("callback_query:data", async (ctx) => {
//   console.log("Unknown button event with payload", ctx.callbackQuery.data);
//   await ctx.answerCallbackQuery(); // remove loading animation
// });

bot.callbackQuery("available-clues", async (ctx) => {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame && currentGame.step === Step.GAME) {
    await showClues(ctx);
  }
});

bot.callbackQuery("start-multiple-game-menu", async (ctx) => {
  startGame(ctx);
});


// Установить список команд
// bot.api.setMyCommands(commands);
