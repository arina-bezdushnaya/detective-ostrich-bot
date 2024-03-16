import {getCurrentGameState} from "./common";
import {Step} from "../types";
import {takeTest} from "./test";
import {attachedToMessageKeyboard, sendMessage} from "./tg";

export function constructVersion(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    currentGame.setStep(Step.CONSTRUCT_VERSION);

    currentGame.players.map(player => {
      const keyboard = attachedToMessageKeyboard([
        {text: "Далее", payload: "version-is-construct"},
      ]);

      sendMessage({
        userId: player,
        text: `Настал тот момент, когда вы близки как никогда к разгадке этого дела!\n` +
          `И пока детективный страус ведет подсчет улик, ` +
          `выстройте свою версию случившегося\n\n` +
          `${currentGame.players.length > 1 ?
            'Напишите Страусу в одном сообщении факты, которыми Вы хотите поделиться с друзьями. Он обязательно передаст'
            : 'Нажмите "Далее", если версия готова'}`,
        ...(currentGame.players.length === 1 && {replyMarkup: keyboard})
      }).then(ctx => console.log(ctx));
    });
  }
}


export function summarize(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    currentGame.setVersionsNumber();
    currentGame.versions === currentGame.playersNumber && takeTest(ctx);
  }
}
