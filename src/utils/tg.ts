import { Keyboard } from "grammy";

import { startGameRightNowMenu } from "../menus/play";
import { bot } from "../bot";

export const sendNotifIsEverybodyReady =
  (ctx: any) => (userId: number, isGameOwner: boolean) => {
    if (isGameOwner) {
      ctx.reply(`Начать игру, не дожидаясь всех приглашенных участников?`, {
        reply_markup: startGameRightNowMenu,
      });
    } else {
      sendMessage(userId, `Ждем, когда все участники присоединятся к игре`);
    }
  };

export const sendMessage = (
  userId: number,
  text: string,
  replyMarkup?: any
) => {
  bot.api.sendMessage(userId, text, { reply_markup: replyMarkup });
};

export const changeKeyboardButtons = (text: string) => {
  return new Keyboard().text(text).resized();
  // .oneTime()
};
