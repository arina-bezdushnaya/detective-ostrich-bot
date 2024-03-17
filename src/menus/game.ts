import {Menu, MenuRange} from "@grammyjs/menu";
import {InputFile, Context} from "grammy";
import {
  attachedToMessageKeyboard,
  moveToNextTurn,
  selectTurnClueHandle,
  getCurrentGameState,
} from "../utils";
import {availableCluesTitle, showAvailableCluesButton, turnCluesTitle, turnRules} from "../constants";
import {BotContext, NavigationButton, Step} from "../types";


export const beforeInitialTurnButton = new Menu<BotContext>("initial-objective-done-button").text(
  "Далее",
  async (replyCtx) => {
    replyCtx.menu.close();
    const {currentGame} = getCurrentGameState(replyCtx);

    if (currentGame) {
      currentGame.setPlayersReadInitialSit();

      currentGame.playersReadInitialSit === currentGame.playersNumber &&
      currentGame.setStep(Step.GAME);

      replyCtx.session.doneObjectives++;

      await replyCtx.reply(
        'Ознакомиться со всеми приложенными к делу уликами, можно нажав кнопку "Улики"',
        {reply_markup: attachedToMessageKeyboard(showAvailableCluesButton)}
      );
      await replyCtx.reply(turnRules);


      moveToNextTurn(replyCtx, true);
    }
  }
);


export const availableCluesMenu = new Menu<BotContext>("available-clues")
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange<BotContext>();

    if (currentGame) {
      const cluesKeys: number[] = Array.from(currentGame.availableClues);
      const page = ctx.session.avCluesPage;
      const lastPage = Math.ceil(cluesKeys.length / 4) - 1;

      cluesKeys.forEach((clueKey, index) => {
        if (index < (4 * page + 4) && index >= page * 4) {
          let details: string = currentGame.getClueText(clueKey);
          const isPicture = details.includes('picture_');

          if (isPicture) {
            details = details.split('picture_')[1];
          }

          range
            .text(String(clueKey), async (ctx) => {
              await ctx.menu.nav("clue-details");

              const clueText = `<b>Улика ${clueKey}</b> \n${details}`;

              if (isPicture) {
                await ctx.replyWithPhoto(
                  new InputFile(`./src/assets/${currentGame.id}/${clueKey}.jpg`),
                  {
                    caption: clueText,
                    reply_markup: availableClueDetails,
                    parse_mode: "HTML"
                  }
                )
                await ctx.answerCallbackQuery();
                await ctx.deleteMessage();
              } else {
                ctx.editMessageText(
                  clueText,
                  {parse_mode: "HTML"});
              }
            })
            .row();
        }

      })

      const navigationButtons: NavigationButton[] = [
        ...(!(page === 0) ? [{name: 'Назад', action: page - 1}] : []),
        ...(page < lastPage ? [{name: 'Вперед', action: page + 1}] : []),
      ];

      if (cluesKeys.length > 4) {
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
        let details = currentGame.getClueText(clueKey);
        const isPicture = details.includes('picture_');

        if (isPicture) {
          details = details.split('picture_')[1];
        }

        range
          .text(String(clueKey), async (ctx) => {
            await ctx.menu.nav("turn-clue-details");
            ctx.session.selectedClue = clueKey;

            const clueText = `<b>Улика ${clueKey}</b> \n${details}`;

            if (isPicture) {
              await ctx.replyWithPhoto(
                new InputFile(`./src/assets/${currentGame.id}/${clueKey}.jpg`),
                {
                  caption: clueText,
                  reply_markup: turnClueDetails,
                  parse_mode: "HTML"
                }
              )
              await ctx.answerCallbackQuery();
              await ctx.deleteMessage();
            } else {
              ctx.editMessageText(
                clueText,
                {parse_mode: "HTML"});
            }
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

      if (!!ctx.msg?.text) {
        ctx.editMessageText(turnCluesTitle(turnNumber), {parse_mode: "HTML"});
      } else {
        await ctx.deleteMessage();
        await ctx.reply(turnCluesTitle(turnNumber),
          {reply_markup: turnClues, parse_mode: "HTML"}
        );
      }
    }
  );
