import {Menu, MenuRange} from "@grammyjs/menu";
import {InputFile, Context} from "grammy";
import {getCurrentGameState} from "../utils/common";
import {attachedToMessageKeyboard, selectTurnClueHandle} from "../utils/tg";
import {availableCluesTitle, turnCluesTitle, turnRules} from "../constants";
import {BotContext, NavigationButton} from "../types";


export const beforeInitialTurnButton = new Menu<BotContext>("initial-objective-done-button").text(
  "Далее",
  async (replyCtx) => {
    replyCtx.menu.close();

    // const doneObjectives = menuCtx.session.doneObjectives;
    replyCtx.session.doneObjectives++;
    // currentGame?.markObjectiveAsDone();
    // console.log(menuCtx.session.doneObjectives);

    const keyboard = attachedToMessageKeyboard([
      {text: "Улики", payload: "available-clues"},
    ]);

    await replyCtx.reply(
      'Ознакомиться со всеми приложенными к делу уликами, можно нажав кнопку "Улики"',
      {reply_markup: keyboard}
    );
    await replyCtx.reply(turnRules);

    startInitialTurn(replyCtx);
  }
);

export function startInitialTurn(ctx: any) {
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
    } else {
      ctx.reply(`<b>Ход ${turnNumber}</b>\nПодождите, ходит другой игрок`,
        {parse_mode: "HTML"});
    }
  }
}

export const availableCluesMenu = new Menu<BotContext>("available-clues")
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange<BotContext>();

    if (currentGame) {
      const cluesKeys: number[] = Array.from(currentGame.availableClues);

      const page = ctx.session.avCluesPage;
      const lastPage = Math.ceil(cluesKeys.length / 2) - 1;

      cluesKeys.forEach((clueKey, index) => {
        if (index <= (page * 2 + 1) && index >= page * 2) {
          const details = currentGame.getClueText(clueKey);

          range
            .text(String(clueKey), async (ctx) => {
              await ctx.menu.nav("clue-details");

              const clueText = `<b>Улика ${clueKey}</b> \n${details}`;
              ctx.editMessageText(
                clueText,
                {parse_mode: "HTML"});

              if (clueKey === 1) {
                await ctx.replyWithPhoto(
                  new InputFile(`./src/assets/${currentGame.id}/01.JPG`),
                  {
                    caption: clueText,
                    reply_markup: availableClueDetails,
                    parse_mode: "HTML"
                  }
                )
                await ctx.answerCallbackQuery();
                await ctx.deleteMessage();
              }
            })
            .row();
        }

      })

      const navigationButtons: NavigationButton[] = [
        ...(!(page === 0) ? [{name: 'Назад', action: page - 1}] : []),
        ...(page < lastPage ? [{name: 'Вперед', action: page + 1}] : []),
      ];

      if (cluesKeys.length > 2) {
        navigationButtons.forEach(({name, action}) => {
          range
            .text(name, async (ctx) => {
              ctx.session.avCluesPage = action;
              ctx.menu.update();
            })

        });
      }
    }

    return range;
  });


export const availableClueDetails = new Menu<BotContext>("clue-details");
availableClueDetails
  .back("Назад", async (ctx) => {
      if (!!ctx.msg?.text) {
        ctx.editMessageText(availableCluesTitle, {parse_mode: "HTML"});
      } else {
        await ctx.deleteMessage();
        await ctx.reply(availableCluesTitle,
          {reply_markup: availableCluesMenu, parse_mode: "HTML"}
        );
      }
    }
  );


export const turnClues = new Menu<BotContext>("clue-choice");
turnClues
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange<BotContext>();

    const turnClues = ctx.session.turnClues;

    if (currentGame) {
      turnClues.forEach(clueKey => {
        range
          .text(String(clueKey), async (ctx) => {
            const details = currentGame.getClueText(clueKey);
            await ctx.menu.nav("turn-clue-details");

            ctx.session.selectedClue = clueKey;

            const clueText = `<b>Улика ${clueKey}</b> \n${details}`;
            ctx.editMessageText(
              clueText,
              {parse_mode: "HTML"});
          })
          .row()
      })
    }

    return range;
  });

export const turnClueDetails = new Menu<BotContext>("turn-clue-details");
turnClueDetails
  .text("Приложить к делу", async (ctx) => await selectTurnClueHandle(ctx))
  .text("Избавиться от улики", async (ctx) => await selectTurnClueHandle(ctx, true))
  .row()
  .back("Назад", async (ctx) => {
      const {currentGame} = getCurrentGameState(ctx);
      const turnNumber = currentGame?.turnNumber || 0;

      ctx.editMessageText(turnCluesTitle(turnNumber), {parse_mode: "HTML"});
    }
  );
