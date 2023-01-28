import Browser from "webextension-polyfill";
import { IFreeGame } from "../../types/freegames";
import { getGames } from "./getGames";
import { updateGameState } from "../../utils";

export const createNotification = (game: IFreeGame) => {
  Browser.notifications.create(game.title, {
    message: `New free ${game.productType.toLowerCase()} is available!`,
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
};

export const checkForNewGames = async () => {
  const games = await getGames();

  if (games) {
    for (let i = 0; i < games.length; i++) {
      if (!games[i].state.hasSendNotification) {
        createNotification(games[i]);
      }
    }
  }
};
