import {gamesState, users} from "../bot";
import {Game} from "../game_class";
import {characters} from "../constants";

export const getCurrentGame = (gameId?: string) => {
  return gamesState.get(gameId || "");
};

export const addToGame = (gameId: string, chatId: number) => {
  const runningGame = getCurrentGame(gameId) as Game;

  runningGame.changePlayers(chatId);
  users.set(chatId, gameId);
};

export const quitTheGame = (ctx: any) => {
  const {userId, currentGame} = getCurrentGameState(ctx);

  currentGame?.changePlayers(userId, true);
  users.delete(userId);
};

export const getCurrentGameState = (ctx: any) => {
  const userId = getUserId(ctx);
  const gameId = getGameId(userId);

  return {
    userId,
    gameId,
    currentGame: getCurrentGame(gameId),
  };
};

export const createNewGame = (chatId: number) => {
  const newGame = new Game();
  newGame.changePlayers(chatId);
  const gameId = Math.random().toString(16).slice(2);
  newGame.setGameOwner(chatId);

  users.set(chatId, gameId);
  gamesState.set(gameId, newGame);
};

export const deleteGame = (ctx: any) => {
  const {userId, gameId} = getCurrentGameState(ctx);

  gamesState.delete(gameId as string);
  users.delete(userId);
};

export const getUserId = (ctx: any) => {
  return ctx.from?.id || 0;
};

export const getUserNumber = (userId: number, players: number[]) => {
  const index = players.indexOf(userId);
  return index + 1;
};

export const getGameId = (userId: number) => {
  return users.get(userId);
};

export const getRandomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);

export const normalize_count_form = (n: number, arr: string[]) => {
  n = Math.abs(n) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) {
    return arr[2];
  }
  if (n1 > 1 && n1 < 5) {
    return arr[1];
  }
  if (n1 == 1) {
    return arr[0];
  }

  return arr[2];
}

export const getCharacters = (points: number) => {

  const getDescription = (character: string[]) => {
    return character[0] + `\n` + character[1];
  }

  if (points < 7) {
    return getDescription(characters[0]);
  } else if (points >= 7 && points < 11) {
    return getDescription(characters[1]);
  } else if (points < 15 && points >= 11) {
    return getDescription(characters[2]);
  } else if (points < 18 && points >= 15) {
    return getDescription(characters[3]);
  } else {
    return getDescription(characters[4]);
  }
};
