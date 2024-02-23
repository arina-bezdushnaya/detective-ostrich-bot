import { gamesState } from "./bot";

export const game = (chatId?: number) => {
  const currentGame = gamesState.get(chatId);
  console.log(currentGame);

  if (currentGame) {
    console.log("fbgfgc");
    return currentGame;
  } else {
    gamesState.set(chatId, null);
    return null;
  }
};

export const restartGame = (chatId?: number) => {
  gamesState.delete(chatId);
};
