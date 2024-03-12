import { bot } from "../bot";
import { getCurrentGameState } from "../utils/common";

export function getObjectives() {
  bot.command("objectives", (ctx) => {
    const { userId, currentGame } = getCurrentGameState(ctx);

    if (currentGame) {
      const currentObjective = currentGame?.currentObjective;
      const allObjectives = currentGame?.getAllObjectives();

      const objectivesToSend = allObjectives
        .filter((obj: string, index: number) => {
          if (currentObjective >= index) {
            if (currentObjective < index) {
              return `✅ ${obj}`;
            } else {
              return obj;
            }
          }
          return;
        })
        .join("\n");

      ctx.replyWithEmoji`${objectivesToSend}`;
    }
  });
}
