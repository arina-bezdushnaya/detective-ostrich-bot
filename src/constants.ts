import {GameDescription, Command} from "./types";

// Список команд
export const commands: Command[] = [
  {
    command: "play",
    description: "Начать игру",
  },
  {
    command: "objectives",
    description: "Задачи игры",
  },
  {
    command: "rules",
    description: "Правила",
  },
  {
    command: "start",
    description: "Перезапустить Страуса",
  },
];

// Список игр
export const games: GameDescription[] = [
  {id: "fire-in-laboratory", name: "Пожар в лаборатории"},
  {id: "dealer", name: "Торговец"},
];

export const gamesMap = new Map(games.map((game) => [game.id, game.name]));

export const availableCluesTitle = `<b>Доступные улики</b>`;

export const turnCluesTitle = (turnNumber: number) => `<b>Ход ${turnNumber}</b>\n`;

export const turnRules = "В свой ход необходимо ознакомиться с представленными уликами, " +
  "а затем либо приложить самую важную улику к делу, " +
  "либо избавиться от самой незначительной улики";
