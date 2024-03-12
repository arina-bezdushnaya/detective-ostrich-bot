import { Keyboard } from "grammy";
import { startGameRightNowMenu } from "../menus/play";
import { bot } from "../bot";

interface SendMessageParams {
  userId: number;
  text: string;
  replyMarkup?: any;
  parseMode?: any;
}

export const sendNotifIsEverybodyReady =
  (ctx: any) => (userId: number, isGameOwner: boolean) => {
    if (isGameOwner) {
      ctx.reply(`Начать игру, не дожидаясь всех приглашенных участников?`, {
        reply_markup: startGameRightNowMenu,
      });
    } else {
      sendMessage({
        userId,
        text: `Ждем, когда все участники присоединятся к игре`,
      });
    }
  };

export const sendMessage = ({
  userId,
  text,
  replyMarkup,
  parseMode,
}: SendMessageParams) => {
  bot.api.sendMessage(userId, text, {
    reply_markup: replyMarkup,
    parse_mode: parseMode,
  });
};

export const changeKeyboardButtons = (text: string) => {
  return new Keyboard().text(text).resized();
  // .oneTime()
};
