import {User} from "@grammyjs/types";
import {bot, gamesState, users} from "../bot";
import {
  getCurrentGame,
  addToGame,
  getCurrentGameState,
  sendNotifIsEverybodyReady
} from "../utils";
import {Step} from "../types";
import {restartGameMenu} from "../menus";

export function start() {
  const resetAttempt = "Игра уже запущена. Сбросить ее?";
  const quitAttempt = "Выйти из игры?";

  bot.use(restartGameMenu);

  bot.command("start", async (ctx) => {
    const gameIdYouInvited = ctx.match;

    const {userId, gameId, currentGame} = getCurrentGameState(ctx);
    const gameYouInvited = getCurrentGame(gameIdYouInvited);
    const initiatedId = gameYouInvited?.gameOwner!;

    console.log(gamesState);

    async function joinTheGame() {
      const userInvited = await bot.api.getChat(initiatedId);
      const username = (userInvited as unknown as User).username;

      addToGame(gameIdYouInvited, userId);

      bot.api.sendMessage(
        initiatedId,
        `Ваш друг @${ctx.from?.username} присоединился к игре`
      );

      console.log(gamesState);

      await ctx.reply(`@${username} пригласил Вас в игру ${gameYouInvited?.name}!`);
      await ctx.reply("Чтобы узнать список доступных команд, введите  /help");

      await gameYouInvited?.checkPLayers(sendNotifIsEverybodyReady(ctx), ctx);
    }

    async function restartTheGame() {
      const isSeveralPlayers = currentGame!.players.length > 1;

      await ctx.reply(isSeveralPlayers ? quitAttempt : resetAttempt, {
        reply_markup: restartGameMenu
      });
    }

    async function resetAndJoinTheGame() {
      await restartTheGame();
      joinTheGame();
    }

    const canYouJoin =
      gameYouInvited?.step === Step.WAITING_FOR_PLAYERS &&
      gameYouInvited?.playersNumber > gameYouInvited.players.length;

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
