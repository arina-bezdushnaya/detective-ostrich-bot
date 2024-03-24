import {Bot, GrammyError, HttpError, session} from "grammy";
import {emojiParser} from "@grammyjs/emoji";
import {insertCommands} from "./commands";
import {Game} from "./game_class";
import {BotContext, Step, TurnSessionData} from "./types";
import {startGame} from "./menus";
import {
  constructVersionHandle,
  getCurrentGameState,
  sendTurnClues,
  showClues,
  startTest,
  takeTest
} from "./utils";

require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;

//Create a new bot
export const bot = new Bot<BotContext>(BOT_TOKEN);

export const gamesState = new Map<string, Game>();
export const users = new Map<number, string>();
console.log(gamesState);

function initial(): TurnSessionData {
  return {
    avCluesPage: 0,
    turnClues: [],
    doneObjectives: 0,
    selectedClue: 0,
    test: []
  };
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
// console.log("Unknown button event with payload", ctx.callbackQuery.data);
// await ctx.answerCallbackQuery(ctx.callbackQuery.id, { text: 'hey answer', show_alert: true }); // remove loading animation
// });

bot.callbackQuery("show-available-clues", async (ctx) => {
  const {currentGame} = getCurrentGameState(ctx);
  await ctx.answerCallbackQuery();

  if (currentGame && (
    currentGame.step === Step.GAME ||
    currentGame.step === Step.CONSTRUCT_VERSION ||
    currentGame.step === Step.ALL_PASS_TEST)
  ) {
    await showClues(ctx);
  }
});

bot.callbackQuery("start-multiple-game-menu", async (ctx) => {
  startGame(ctx);
});

bot.callbackQuery("next-turn", async (ctx) => {
  const {currentGame} = getCurrentGameState(ctx);
  await bot.api.answerCallbackQuery(ctx.callbackQuery.id);

  if (currentGame && currentGame.step === Step.GAME) {
    ctx.deleteMessage();
    sendTurnClues(ctx);
  }
});

bot.callbackQuery("version-is-construct-single-player", constructVersionHandle);
bot.on('message', constructVersionHandle);

bot.callbackQuery("check-out-versions-multiple-players", async (ctx) => {
    const {currentGame} = getCurrentGameState(ctx);

    if (currentGame && currentGame.step === Step.CONSTRUCT_VERSION) {
      takeTest(ctx);
    }
  }
);


bot.callbackQuery("start-final-test", async (ctx) => {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame && currentGame.step === Step.CONSTRUCT_VERSION) {
    currentGame.addPassTestPlayer();
    currentGame.passTestPlayers === currentGame.playersNumber && currentGame.setStep(Step.ALL_PASS_TEST);

    ctx.editMessageReplyMarkup({
      reply_markup: {
        inline_keyboard: []
      }
    });

    await startTest(ctx);
  }
});


// Установить список команд
// bot.api.setMyCommands(commands);
