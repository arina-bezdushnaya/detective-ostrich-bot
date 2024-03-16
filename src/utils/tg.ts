import {Keyboard, InlineKeyboard, Bot} from "grammy";
import {
  startMultiplePlayersGameMenu,
  startSinglePlayerGameRightNowMenu,
} from "../menus";
import {bot} from "../bot";

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

export async function replyWithButton(ctx: any, text: string, replyMarkup: any) {
  await ctx.reply(text, {
    reply_markup: replyMarkup,
  });
}
