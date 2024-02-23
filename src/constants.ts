import { GameDescription, Command } from "./types";

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
  // {
  //   command: "games",
  //   description: "Список игр",
  // },
];

// Список игр
export const games: GameDescription[] = [
  { id: "fire-in-laboratory", name: "Пожар в лаборатории" },
  { id: "dealer", name: "Торговец" },
];

export const gamesMap = new Map(games.map((game) => [game.id, game.name]));
