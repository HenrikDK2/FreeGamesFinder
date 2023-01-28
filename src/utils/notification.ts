import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { getGames } from "./getGames";
import { v4 as uuidv4 } from "uuid";
import { updateGameState } from ".";

export const createNotification = (game: IFreeGame) => {
  const message = `New free ${game.productType.toLowerCase()} is available!`;

  if (!game.state.hasSendNotification) {
    const id = uuidv4();

    // To get game on notification button click
    sessionStorage.setItem(id, JSON.stringify(game));

    Browser.notifications.create(id, {
      message,
      type: "basic",
      isClickable: true,
      priority: 2,
      iconUrl: game.imageSrc,
      imageUrl: game.imageSrc,
      appIconMaskUrl: game.imageSrc,
      title: game.title,
      contextMessage: "dsdsd",
    });

    updateGameState(game, { hasSendNotification: true });
  }
};

export const checkForNewGames = async () => {
  const games = await getGames();

  if (games) {
    for (const game of games) {
      createNotification(game);
    }
  }
};
