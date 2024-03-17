import {Menu, MenuRange} from "@grammyjs/menu";
import {getCurrentGameState, normalize_count_form} from "../utils";
import {BotContext, TestQuestion} from "../types";
import {testVariants} from "../constants";

export const finalTest = new Menu<BotContext>("final-test-menu");

testVariants.forEach((answer, index) => {
  finalTest
    .text(answer, async (ctx) => {
      ctx.session.test.push(answer);
      await ctx.menu.update();
      const questionNumber = ctx.session.test.length;

      const {currentGame} = getCurrentGameState(ctx);

      if (currentGame) {
        const {test, trueVersion} = require(`../games/${currentGame.id}`);

        if (questionNumber < test.length) {
          const {question, answers}: TestQuestion = test[questionNumber];
          const nextQuestion = `${questionNumber + 1}. ${question}\n` + `${answers.join('\n')}`;
          ctx.editMessageText(String(nextQuestion), {parse_mode: "HTML"});
        } else {
          ctx.menu.close();
          await ctx.editMessageText('Приступаем к подведению итогов!');
          ctx.session.doneObjectives++;

          await ctx.reply('<b>Что произошло на самом деле:</b>\n\n' + trueVersion,
            {
              reply_markup: showTestAnswers,
              parse_mode: "HTML"
            }
          );
        }
      }
    })
})

export const showTestAnswers = new Menu<BotContext>("true-game-result")
  .text('Показать итоговые баллы', async (ctx) => {
    const {currentGame} = getCurrentGameState(ctx);

    // const playerAnswer = ctx.session.test.map((answer: string, index: number) => {
    //   return `${index + 1}. ${answer}`;
    // }).join(', ');

    if (currentGame) {
      const {trueTestAnswers} = require(`../games/${currentGame.id}`);

      const resetClues = currentGame.resetClues.length;

      // const trueAnswers = trueTestAnswers.map((answer: string, index: number) => {
      //   return `${index + 1}. ${answer}`;
      // }).join(', ');
      const truePlayersAnswersNumber = trueTestAnswers.filter((answer: string, index: number) => {
        return answer === ctx.session.test[index];
      }).length;
      const truePlayersAnswersPoints = truePlayersAnswersNumber * 2;

      let totalPoints = truePlayersAnswersPoints - (6 - resetClues) * 3;
      totalPoints = totalPoints < 0 ? 0 : totalPoints;

      const resetCluesText = resetClues < 6 ?
        '\n\nНо Вы избавились менее чем от 6 улик. А это значит, вычитаем 3 балла ' +
        'за каждую недостающую улику\n\n' : '';
// todo add results, who are you
      const messageText: string =
        // 'Ваши ответы: \n' + playerAnswer + '\n\n' +
        // 'Правильные ответы: \n' + trueAnswers + '\n\n' +
        `Так как каждый верный ответ приносит 2 балла, Вы получаете \n<b>${truePlayersAnswersPoints}</b> ` +
        normalize_count_form(truePlayersAnswersPoints, ['балл', 'балла', 'баллов']) + '!' +
        resetCluesText +
        `Итог игры: <b>${totalPoints}</b> ${normalize_count_form(
          totalPoints, ['балл', 'балла', 'баллов'])}!`;

      await ctx.reply(messageText,
        {
          parse_mode: "HTML"
        }
      );
    }
  });
