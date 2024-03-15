import {Menu, MenuRange} from "@grammyjs/menu";
import {EmojiFlavor} from "@grammyjs/emoji";
import {InputFile, Context} from "grammy";
import {getCurrentGameState} from "../utils/common";
import {attachedToMessageKeyboard} from "../utils/tg";
import {availableCluesTitle, turnCluesTitle, turnRules} from "../constants";
import {BotContext, NavigationButton} from "../types";


export const beforeInitialTurnButton = new Menu<EmojiFlavor>("initial-objective-done-button").text(
  "Далее",
  async (replyCtx) => {
    replyCtx.menu.close();

    const menuCtx = (replyCtx as unknown as BotContext);
    // const doneObjectives = menuCtx.session.doneObjectives;
    menuCtx.session.doneObjectives++;
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
    const userTurn = currentGame.userTurn;

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

export const availableCluesMenu = new Menu("available-clues")
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange();

    if (currentGame) {
      const cluesKeys: number[] = currentGame.availableClues;

      const menuCtx = (ctx as unknown as BotContext);
      const page = menuCtx.session.avCluesPage;
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
              menuCtx.session.avCluesPage = action;
              ctx.menu.update();
            })

        });
      }
    }

    return range;
  });


export const availableClueDetails = new Menu("clue-details");
availableClueDetails
  .back("Назад", async (ctx) => {
      // await ctx.menu.nav("available-clues");

      if (!!ctx.msg?.text) {
        ctx.editMessageText(availableCluesTitle, {parse_mode: "HTML"});
      } else {
        await ctx.deleteMessage();
        // await ctx.menu.nav("available-clues");
        // await ctx.menu.back();

        await ctx.reply(availableCluesTitle,
          {reply_markup: availableCluesMenu, parse_mode: "HTML"}
        );
      }
    }
  );


export const turnClues = new Menu("clue-choice");
turnClues
  .dynamic((ctx) => {
    const {currentGame} = getCurrentGameState(ctx);
    const range = new MenuRange();

    const menuCtx = (ctx as unknown as BotContext);
    const turnClues = menuCtx.session.turnClues;
    console.log(turnClues);

    if (currentGame) {
      turnClues.forEach(clueKey => {
        range
          .text(String(clueKey), async (ctx) => {
            const details = currentGame.getClueText(clueKey);
            await ctx.menu.nav("turn-clue-details");

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

export const turnClueDetails = new Menu("turn-clue-details");
turnClueDetails
  .text("Приложить к делу", async (ctx) => {
    // await ctx.menu.nav("available-clues");
    const {currentGame} = getCurrentGameState(ctx);

    if (currentGame) {
      const turnNumber = currentGame.turnNumber;

      ctx.editMessageText(
        turnCluesTitle(turnNumber), {parse_mode: "HTML"});
    }
  })
  .text("Избавиться от улики", async (ctx) => {
    // await ctx.menu.nav("available-clues");

    const {currentGame} = getCurrentGameState(ctx);
    const turnNumber = currentGame?.turnNumber || 0;

    ctx.editMessageText(
      turnCluesTitle(turnNumber), {parse_mode: "HTML"});
  })
  .row()
  .back("Назад", async (ctx) => {
      // await ctx.menu.nav("available-clues");

      const {currentGame} = getCurrentGameState(ctx);
      const turnNumber = currentGame?.turnNumber || 0;

      ctx.editMessageText(turnCluesTitle(turnNumber), {parse_mode: "HTML"});
    }
  );
