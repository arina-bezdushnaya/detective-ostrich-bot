import {Keyboard, InlineKeyboard, Bot} from "grammy";
import {startMultiplePlayersGameMenu, startSinglePlayerGameRightNowMenu} from "../menus/play";
import {bot} from "../bot";
import {availableCluesMenu} from "../menus/game";
import {availableCluesTitle} from "../constants";
import {getCurrentGameState} from "./common";
import {Game} from "../game_class";

interface SendMessageParams {
  userId: number;
  text: string;
  replyMarkup?: any;
  parseMode?: any;
}

interface SendNotifParams {
  userId: number;
  isGameOwner?: boolean;
  isEverybodyJoin?: boolean;
}

export const sendNotifIsEverybodyReady = (ctx: any) => {
  return async ({userId, isGameOwner = false, isEverybodyJoin = false}: SendNotifParams) => {

    if (isEverybodyJoin) {

      await sendMessage({
        userId,
        text: `Все участники подключились`,
        replyMarkup: startMultiplePlayersGameMenu
      });

    } else if (isGameOwner) {
      await ctx.reply(`Чтобы начать игру, не дожидаясь всех приглашенных участников, нажмите "Начать"`, {
        reply_markup: startSinglePlayerGameRightNowMenu,
      });
    } else {
      await sendMessage({
        userId,
        text: `Ждем, когда все участники присоединятся к игре`,
      });
    }
  };
}

export async function sendMessage({
                                    userId,
                                    text,
                                    replyMarkup,
                                    parseMode,
                                  }: SendMessageParams) {
  await bot.api.sendMessage(userId, text, {
    reply_markup: replyMarkup,
    parse_mode: parseMode,
  });
}

// эти две клавиатуры располагаются там же, где обычная клавиатура
export const keyboardButtons = (text: string) => {
  return new Keyboard().text(text).resized();
  // .persistent()
  // .oneTime()
};

export const oneTimeKeyboardButtons = (text: string) => {
  return (
    new Keyboard()
      .text(text)
      .resized()
      // .persistent()
      .oneTime()
  );
};

export interface ButtonProps {
  text: string;
  payload?: string;
}

// клавиатура, привязанная к сообщению
export const attachedToMessageKeyboard = (buttons: ButtonProps[]): InlineKeyboard => {
  const keyboard = new InlineKeyboard();
  buttons.forEach(({text, payload}) => keyboard.text(text, payload));

  return keyboard;
};

export async function sendNextButton(ctx: any, text: string, replyMarkup: any) {
  await ctx.reply(text, {
    reply_markup: replyMarkup,
  });
}

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

  if (currentGame) {
    const newClue = currentGame.addClueForNextTurn();
    const currentClues = ctx.session.turnClues
      .filter((clue: number) => clue !== selectedClue);

    currentClues.push(newClue);
    ctx.session.turnClues = currentClues;
  }
}


export async function selectTurnClueHandle(ctx: any, isReset?: boolean) {
  const {currentGame} = getCurrentGameState(ctx);

  ctx.menu.close();
  const selectedClue = ctx.session.selectedClue;

  if (currentGame) {
    const turnNumber = currentGame.turnNumber;

    ctx.editMessageText(
      `Вы ${isReset ?
        'избавились от <b>Улики' :
        'приложили к делу <b>Улику'} ${selectedClue}</b>\n\n` +
      `<i>Ход ${turnNumber} завершен</i>`,
      {parse_mode: "HTML"}
    );

    await currentGame.finishTurn(ctx, selectedClue, isReset);
    moveToNextTurn(currentGame);
  }
}

export function moveToNextTurn(currentGame: Game) {
  currentGame.players.map((player, index) => {
    const turnNumber = currentGame.turnNumber;

    if (currentGame.currentPlayer === index) {
      console.log('отправляем улики, ход', turnNumber);
      sendMessage({
        userId: player,
        text: 'Следующий ход',
        replyMarkup: attachedToMessageKeyboard([{text: 'Ходить', payload: 'next-turn'}])
      })
    } else {
      sendMessage({
        userId: player,
        text: `<b>Ход ${turnNumber}</b>\nПодождите, ходит другой игрок`,
        parseMode: "HTML"
      })
    }
  });
}


export function notifyPlayersOfNewClue(currentGame: Game) {
  currentGame.players.map((player, index) => {
    const keyboard = attachedToMessageKeyboard([
      {text: "Улики", payload: "available-clues"},
    ]);

    sendMessage({
      userId: player,
      text: 'В деле появились новые улики!',
      replyMarkup: keyboard
    })
  });
}
