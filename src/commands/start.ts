import { User } from "@grammyjs/types";
import { Menu } from "@grammyjs/menu";
import { EmojiFlavor } from "@grammyjs/emoji";
import { bot, gamesState, users } from "../bot";
import {
  deleteGame,
  getCurrentGame,
  addToGame,
  getCurrentGameState,
} from "../utils/common";
import { Step } from "../types";
import { restartGameMenu } from "../menus/start";

export function start() {
  const resetAttempt = "Игра уже запущена. Сбросить ее?";
  const quitAttempt = "Выйти из игры?";

  bot.use(restartGameMenu);

  bot.command("start", async (ctx) => {
    const gameIdYouInvited = ctx.match;
    const initiatedId = gameIdYouInvited.split("U")[1];

    const { userId, gameId, currentGame } = getCurrentGameState(ctx);
    const gameYouInvited = getCurrentGame(gameIdYouInvited);

    console.log(gamesState);
    console.log("users=", users);
    console.log("gameYouInvited=", gameYouInvited);

    async function joinTheGame() {
      const userInvited = await bot.api.getChat(initiatedId);
      const username = (userInvited as unknown as User).username;

      addToGame(gameIdYouInvited, userId);

      bot.api.sendMessage(
        ctx.match,
        `Ваш друг @${ctx.from?.username} присоединился к игре`
      );

      console.log(gamesState);

      await ctx.reply(`@${username} пригласил Вас в игру Детективный страус!`);
      ctx.reply("Чтобы узнать список доступных команд, введите  /help");
    }

    async function restartTheGame() {
      const isSeveralPlayers = currentGame!.players.length > 1;

      await ctx.reply(isSeveralPlayers ? quitAttempt : resetAttempt, {
        reply_markup: restartGameMenu,
      });
    }

    async function resetAndJoinTheGame() {
      await restartTheGame();
      joinTheGame();
    }

    const canYouJoin = gameYouInvited?.step === Step.WAITING_FOR_PLAYERS;

    if (currentGame) {
      if (gameIdYouInvited && canYouJoin) {
        gameIdYouInvited !== gameId ? resetAndJoinTheGame() : {};
        return;
      }

      restartTheGame();
    } else {
      if (gameIdYouInvited && canYouJoin) {
        joinTheGame();
        return;
      }

      await ctx.reply(`Привет, ${ctx.from?.first_name || "друг"}!`);
      await ctx.reply(
        ctx.emoji`Детективный страус предлагает сыграть в загадочную игру ${"magnifying_glass_tilted_right"}`
      );

      await ctx.reply("Чтобы узнать список доступных команд, введите  /help");
    }
  });
}
