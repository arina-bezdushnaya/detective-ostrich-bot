import {getCurrentGameState, getUserNumber} from "./common";
import {Step} from "../types";
import {takeTest} from "./test";
import {attachedToMessageKeyboard, sendMessage} from "./tg";

export function constructVersion(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    currentGame.setStep(Step.CONSTRUCT_VERSION);

    currentGame.players.map(player => {
      const keyboard = attachedToMessageKeyboard([
        {text: "Далее", payload: "version-is-construct-single-player"},
      ]);

      sendMessage({
        userId: player,
        text: `Настал тот момент, когда вы близки как никогда к разгадке этого дела!\n` +
          `И пока детективный страус ведет подсчет улик, ` +
          `выстройте свою версию случившегося\n\n` +
          `${currentGame.players.length > 1 ?
            'Напишите Страусу в одном сообщении важные факты, которыми Вы хотите поделиться с друзьями. ' +
            'Это поможет раследованию'
            : 'Нажмите "Далее", если версия готова'}`,
        ...(currentGame.players.length === 1 && {replyMarkup: keyboard})
      });
    });
  }
}


export function summarize(ctx: any) {
  const {userId, currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    const playersNumber = currentGame.playersNumber;
    currentGame.addPlayerVersion(userId, ctx.message?.text || '');
    ctx.session.doneObjectives++;

    if (playersNumber === 1) {
      ctx.editMessageReplyMarkup({
        reply_markup: {
          inline_keyboard: []
        }
      });

      takeTest(ctx);
    }

    if (currentGame.versions.size === playersNumber && playersNumber > 1) {
      checkOutVersions(ctx);
    }
  }
}

export function checkOutVersions(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    const players = currentGame.players;

    currentGame.players.map(player => {
      const keyboard = attachedToMessageKeyboard([
        {text: "Далее", payload: "check-out-versions-multiple-players"},
      ]);

      let otherVersions: string = '';
      currentGame.versions.forEach((value, key, map) => {
        if (player !== key) {
          otherVersions += 'Игрок ' + getUserNumber(key, players) + ` : ` + value + '\n';
        }
      });

      const fullMessage = otherVersions + '\n\n' +
        'Если ознакомились с важными фактами, нажмите "Далее"!';

      sendMessage({
        userId: player,
        text: fullMessage,
        replyMarkup: keyboard
      });
    });
  }
}

export async function constructVersionHandle(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame && currentGame.step === Step.CONSTRUCT_VERSION) {
    summarize(ctx);
  }
}
