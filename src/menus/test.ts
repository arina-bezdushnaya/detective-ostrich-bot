import {Menu, MenuRange} from "@grammyjs/menu";
import {getCurrentGameState} from "../utils";
import {BotContext, TestQuestion} from "../types";

export const finalTest = new Menu<BotContext>("final-test-menu");
finalTest
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange<BotContext>();

    const questionNumber = ctx.session.test.size;

    if (currentGame) {
      const {test} = require(`../games/${currentGame.id}`);
      const {answers}: TestQuestion = test[questionNumber];

      answers.forEach((variant, index) => {
        range
          .text(variant, async (ctx) => {
            ctx.session.test.set(questionNumber + 1, variant);
            ctx.menu.update();
            console.log(ctx.session.test);
// todo добавить index + question + answers, кнопки а,б,в,г
            if (test.length !== questionNumber) {
              ctx.editMessageText(
                test[questionNumber + 1].question,
                {parse_mode: "HTML"});
            } else {
              ctx.menu.close();
              ctx.editMessageText('Приступаем к подведению итогов!',
                {parse_mode: "HTML"});
            }

          })
          .row()
      })
    }

    return range;
  });
