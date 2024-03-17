import {getCurrentGameState} from "./common";
import {availableCluesTitle, turnCluesTitle} from "../constants";
import {availableCluesMenu, turnClues} from "../menus";
import {constructVersion} from "./versions";
import {Game} from "../game_class";
import {sendMessage} from "./tg";
import {Step} from "../types";
import {bot} from "../bot";
import {InlineKeyboard} from "grammy";


export async function showClues(
  ctx: any,
) {
  await ctx.reply(availableCluesTitle, {
    reply_markup: availableCluesMenu,
    parse_mode: "HTML"
  });
}

export function updateSessionClues(
  ctx: any, selectedClue: number
) {
  const {currentGame} = getCurrentGameState(ctx);
  const currentClues = ctx.session.turnClues
    .filter((clue: number) => clue !== selectedClue);

  if (currentGame && currentGame.remainingClues.size) {
    const newClue = currentGame.addClueForNextTurn();
    currentClues.push(newClue);
  }

  currentClues.length < 3 && currentGame?.setCluesInHands();
  ctx.session.turnClues = currentClues;
}


export async function selectTurnClueHandle(ctx: any, isReset?: boolean) {
  const {currentGame} = getCurrentGameState(ctx);

  ctx.menu.close();
  const selectedClue = ctx.session.selectedClue;

  if (currentGame) {
    const turnNumber = currentGame.turnNumber;

    if (!!ctx.msg?.text) {
      ctx.editMessageText(
        `Вы ${isReset ?
          'избавились от <b>Улики' :
          'приложили к делу <b>Улику'} ${selectedClue}</b>\n\n` +
        `<i>Ход ${turnNumber} завершен</i>`,
        {parse_mode: "HTML"}
      );
    } else {
      await ctx.deleteMessage();
      await ctx.reply(
        `Вы ${isReset ?
          'избавились от <b>Улики' :
          'приложили к делу <b>Улику'} ${selectedClue}</b>\n\n` +
        `<i>Ход ${turnNumber} завершен</i>`,
        {parse_mode: "HTML"}
      );
    }

    await currentGame.finishTurn(ctx, selectedClue, isReset);

    if (currentGame.cluesInHands) {
      moveToNextTurn(ctx);
    } else {
      constructVersion(ctx);
    }
  }
}

export function sendTurnClues(ctx: any) {
  const {userId, currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    const turnNumber = currentGame.turnNumber;
    const userTurn = currentGame.players[currentGame.currentPlayer];

    if (userId === userTurn) {
      console.log('отправляем улики');

      ctx.reply(turnCluesTitle(turnNumber), {
        reply_markup: turnClues,
        parse_mode: "HTML"
      });
    }
  }
}

export function moveToNextTurn(ctx: any, isInitialTurn?: boolean) {
  const {currentGame} = getCurrentGameState(ctx);

  const nextTurnKeyboard = new InlineKeyboard()
    .text('Начать ход', 'next-turn');

  if (currentGame && currentGame.step === Step.GAME) {
    currentGame.players.map((player, index) => {
      const turnNumber = currentGame.turnNumber;

      if (currentGame.currentPlayer === index) {
        console.log('отправляем улики, ход', turnNumber);

        bot.api.sendMessage(player, isInitialTurn ? 'Сделать первый ход' : 'Следующий ход', {
          reply_markup: nextTurnKeyboard,
        });
      } else {
        sendMessage({
          userId: player,
          text: `<b>Ход ${turnNumber}</b>\nПодождите, ходит другой игрок`,
          parseMode: "HTML"
        })
      }
    });
  }
}

export async function notifyPlayersOfNewClue(currentGame: Game) {
  const availableCluesKeyboard = new InlineKeyboard()
    .text("Улики", "show-available-clues");

  currentGame.players.map(async (player) => {

    await bot.api.sendMessage(player, 'В деле появились новые улики!', {
      reply_markup: availableCluesKeyboard,
    });
  });
}
