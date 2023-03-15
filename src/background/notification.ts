import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { getGamesFromSources } from "./games";
import { db } from "../utils/db";

export const createNotification = (game: IFreeGame) => {
  Browser.notifications.create(game.url, {
    message: `New free ${game.productType.toLowerCase()} is available!`,
    type: "basic",
    isClickable: true,
    priority: 2,
    iconUrl: game.imageSrc,
    imageUrl: game.imageSrc,
    appIconMaskUrl: game.imageSrc,
    title: game.title,
  });

  db.update("game", { ...game, state: { ...game.state, hasSendNotification: true } });
};

export const checkForNewGames = async () => {
  const games = await getGamesFromSources();
  const { notifications, showPlatforms } = db.get("settings");

  if (games && notifications) {
    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      // Check if game has not send a notification before
      if (!game.state.hasSendNotification) {
        if (!game.platform || !showPlatforms.includes(game.platform)) continue;

        // Send notification
        createNotification(games[i]);
      }
    }
  }
};
