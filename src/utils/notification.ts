import Browser from "webextension-polyfill";
import { IFreeGameData } from "../types/freegames";
import { getGames } from "./getGames";
import { setGameState, switchIcon } from ".";
import { v4 as uuidv4 } from "uuid";

export const createNotification = ({ productType, title, url, state, imageSrc }: IFreeGameData) => {
  const message = `New free ${productType.toLowerCase()} is available!`;

  setGameState(title, { ...state, hasSendNotification: true });

  if (!state.hasSendNotification) {
    const id = uuidv4();

    // To reference notifications
    sessionStorage.setItem(id, url);

    Browser.notifications.create(id, {
      message,
      type: "basic",
      iconUrl: imageSrc,
      isClickable: true,
      priority: 2,
      appIconMaskUrl: imageSrc,
      imageUrl: imageSrc,
      title,
      contextMessage: "dsdsd",
    });
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
