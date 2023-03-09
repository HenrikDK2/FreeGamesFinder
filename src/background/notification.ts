import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { getGamesFromSources } from "./games";
import { db } from "../utils/db";
import { isDrmFreeGame } from "../utils";

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
  const { notifications, drmFreeGames } = db.get("settings");

  if (games && notifications) {
    for (let i = 0; i < games.length; i++) {
      // Check if game has not send a notification before
      if (!games[i].state.hasSendNotification) {
        // Don't send a notification if showDrmFreeGames is true, and the game is not a DRMFreeGame
        if (drmFreeGames === true && !isDrmFreeGame(games[i])) continue;
        // Send notification
        createNotification(games[i]);
      }
    }
  }
};
