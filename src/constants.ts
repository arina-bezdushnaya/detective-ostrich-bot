import {GameDescription, Command} from "./types";
import {ButtonProps} from "./utils";

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
  {id: "picturesque-scam", name: "Живописная афера"},
];

export const gamesMap = new Map(games.map((game) => [game.id, game.name]));

export const commonObjectives = [
  "Изучите все улики",
  "Постройте версию случившегося",
  "Пройдите тест и узнайте, как близко вы подошли к разгадке",
];

export const availableCluesTitle = `<b>Доступные улики</b>`;

export const turnCluesTitle = (turnNumber: number) => `<b>Ход ${turnNumber}</b>\n`;

export const turnRules = "В свой ход необходимо ознакомиться с представленными уликами, " +
  "а затем либо приложить самую важную улику к делу, " +
  "либо избавиться от самой незначительной улики";

export const showAvailableCluesButton: ButtonProps[] = [{text: "Улики", payload: "show-available-clues"}];
export const testVariants = ['а', 'б', 'в', 'г'];

export const characters: string[][] = [
  ['Миссис Хадсон', 'Вы совсем не разобрались, что произошло! 🤔'],
  ['Инспектор Лестрейд', 'Неплохая работа! Вот если бы вы ещё не отвлекались на ложные следы...🧐'],
  ['Доктор Ватсон', 'Вы потратили много времени на болтовню, но преступнику не удалось от вас уйти! 👍'],
  ['Майкрофт Холмс', 'Даже репутация вашего брата не может затмить ваш талант! 👍'],
  ['Шерлок Холмс', 'Отлично! Как детектив, вы близки к совершенству 👍']
];
