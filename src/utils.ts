import { gamesState } from "./bot";
import { Game } from "./game_class";

export const getCurrentGame = (chatId?: number, matchId?: number) => {
  const currentGame = (id?: number) => gamesState.get(id);

  if (matchId) {
    gamesState.set(chatId, currentGame(matchId));
    return currentGame(chatId);
  }

  if (currentGame(chatId)) {
    return currentGame(chatId);
  } else {
    gamesState.set(chatId, new Game());
    return currentGame(chatId);
  }
};

export const deleteGame = (chatId?: number) => {
  gamesState.delete(chatId);
};
