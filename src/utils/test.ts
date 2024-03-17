import {getCurrentGameState, normalize_count_form} from "./common";
import {attachedToMessageKeyboard} from "./tg";
import {finalTest} from "../menus/test";
import {TestQuestion} from "../types";

export function takeTest(ctx: any) {
  const {currentGame} = getCurrentGameState(ctx);

  if (currentGame) {
    const keyboard = attachedToMessageKeyboard([
      {text: "Начать тест", payload: "start-final-test"},
    ]);

    ctx.reply(
      `Прикреплены к делу <b>${currentGame.availableClues.size}</b> ` +
      normalize_count_form(currentGame.availableClues.size, ['улика', 'улики', 'улик']) + `\n` +
      `Вы избавились от <b>${currentGame.resetClues.length}</b> ` +
      normalize_count_form(currentGame.resetClues.length, ['улики', 'улик', 'улик']) + `\n\n` +
      'Теперь давайте узнаем, кто Вы: Шерлок Холмс или Миссис Хадсон!\nа может даже Майкрофт Холмс...',
      {
        reply_markup: keyboard,
        parse_mode: 'HTML'
      })
  }
}

export async function startTest(ctx: any) {
  await ctx.reply('<i>На каждый вопрос выберите один вариант ответа</i>', {parse_mode: "HTML"});

  const {currentGame} = getCurrentGameState(ctx);
  const questionNumber = ctx.session.test.length;

  if (currentGame) {
    const {test} = require(`../games/${currentGame.id}`);

    if (questionNumber < test.length) {
      const {question, answers}: TestQuestion = test[questionNumber];
      const variant = `${questionNumber + 1}. ${question}\n` + `${answers.join('\n')}`;

      await ctx.reply(
        variant,
        {
          reply_markup: finalTest
        });
    }
  }
}
