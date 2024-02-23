import { gamesState } from "./bot";
import { Game } from "./game_class";

export const game = (chatId?: number, initialId?: number) => {
  const currentGame = (id?: number) => gamesState.get(id);

  if (initialId) {
    gamesState.set(chatId, currentGame(initialId));
    return currentGame(chatId);
  }

  if (currentGame(chatId)) {
    return currentGame(chatId);
  } else {
    gamesState.set(chatId, new Game());
    return currentGame(chatId);
  }
};

export const restartGame = (chatId?: number) => {
  gamesState.delete(chatId);
};
