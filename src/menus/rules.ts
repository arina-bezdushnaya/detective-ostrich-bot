import {Menu} from "@grammyjs/menu";
import {EmojiFlavor} from "@grammyjs/emoji";
import {deleteGame, getCurrentGameState, quitTheGame, selectTurnClueHandle} from "../utils";
import {BotContext} from "../types";
import {turnCluesTitle} from "../constants";
import {turnClues} from "./game";

export const rulesMenu = new Menu<BotContext>("rules-menu")
  .text("1 игрока", async (ctx) => {
    await ctx.menu.nav("rules-details");

    const objectivesText =
      "Игрок получает <b><i>6 улик (подсказок)</i></b>. \n" +
      "В каждый свой ход можно выполнить <u>одно</u> из следующих действий: \n" +
      "1. Выбрать одну улику (которую считаете самой важной и существенной) и <i>приложить ее к делу</i>. \n" +
      "2.<i>Избавиться от улики</i> (вывести из игры несущественную улику). \n\n";
    const important =
      "К концу игры Вы должны избавиться не менее, чем от 6 улик, иначе за каждую " +
      "недостающую улику вы лишаетесь <i>3 баллов</i>. \n\n";
    const finallyStep = "В конце хода получите новую улику.";
    const attention =
      "Когда все подсказки открыты, выстроите версию произошедшего.";

    await ctx.editMessageText(`${objectivesText + important + finallyStep + '\n' + attention}`,
      {parse_mode: "HTML"}
    );
  })
  .row()
  .text("2 игроков", async (ctx) => {
    await ctx.menu.nav("rules-details");

    const objectivesText =
      "Каждый игрок получает по <b><i>3 улики (подсказки)</i></b>. \n" +
      "Игроки ходят поочередно, в каждый свой ход можно выполнить <u>одно</u> из следующих действий: \n" +
      "1. Выбрать одну улику (которую считаете самой важной и существенной) и <i>приложить ее к делу</i>. \n" +
      "2.<i>Избавиться от улики</i> (вывести из игры несущественную улику). \n\n";
    const important =
      "К концу игры Вы должны избавиться не менее, чем от 6 улик, иначе за каждую " +
      "недостающую улику вы лишаетесь <i>3 баллов</i>. \n\n";
    const finallyStep = "В конце хода получите новую улику.";
    const attention =
      "Когда все подсказки открыты, обсудите с другом " +
      "имеющиеся у Вас сведения и выстроите версию произошедшего.";

    await ctx.editMessageText(`${objectivesText + important + finallyStep + '\n' + attention}`,
      {parse_mode: "HTML"});
  });


export const rulesDetails = new Menu<BotContext>("rules-details");
rulesDetails
  .back("Назад", async (ctx) => {
      ctx.editMessageText("Правила для", {parse_mode: "HTML"});
    }
  );
