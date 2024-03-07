import { gamesState, users } from "./bot";
import { Game } from "./game_class";

export const getCurrentGame = (gameId?: string) => {
  return gamesState.get(gameId || "");
};

export const addToGame = (gameId: string, chatId: number) => {
  const runningGame = getCurrentGame(gameId) as Game;

  runningGame.changePlayers(chatId);
  users.set(chatId, gameId);
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
  const gameId = `U${chatId}U${Math.random().toString(16).slice(2)}`;
  newGame.setGameOwner(chatId);

  users.set(chatId, gameId);
  gamesState.set(gameId, newGame);
};

export const deleteGame = (gameId: string) => {
  gamesState.delete(gameId);
};

export const getUserId = (ctx: any) => {
  return ctx.from?.id || 0;
};

export const getGameId = (userId: number) => {
  return users.get(userId);
};
