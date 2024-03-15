import {bot} from "../bot";
import {getCurrentGameState} from "../utils/common";

export function getObjectives() {
  bot.command("objectives", (ctx) => {
    const {currentGame} = getCurrentGameState(ctx);

    if (currentGame) {
      const currentObjective = ctx.session.doneObjectives;
      const allObjectives = currentGame?.getAllObjectives();

      let objectivesToSend: string[] = allObjectives
        .filter((obj: string, index: number) => index <= currentObjective)
        .map((obj: string, index: number) =>
          index < currentObjective ? `✔ ${obj}` : `       ${obj}`
        );
      const objectives: string = objectivesToSend.join("\n");

      ctx.reply(objectives);
    }
  });
}
