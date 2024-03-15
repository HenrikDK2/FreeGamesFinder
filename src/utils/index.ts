import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { db } from "./db";
import { filterGamesList } from "./game";
import manifest from "../../public/manifest.json";

export const switchIcon = (games: IFreeGame[]) => {
  const icons = ["assets/logo-32.png", "assets/logo-32-hidden.png"];

  Browser.browserAction.setIcon({
    path: filterGamesList(games, db.get("settings")).some((game) => !game.state.hasClicked) ? icons[0] : icons[1],
  });
};

export const minutesToMs = (number: number) => 1000 * number * 60;

// For future providers, it's possible to retrive the HTML from a website.
export const getDOMFromUrl = async (url: string): Promise<HTMLElement | undefined> => {
  const { data } = await axios({ url, timeout: 5000 });
  return DOMPurify.sanitize(data, { RETURN_DOM: true, SANITIZE_DOM: true });
};

// Check for unclaimed games and send notification
export const CheckForUnclaimedGames = () => {
  const games = filterGamesList(db.get("games"), db.get("settings"));
  let unclaimedGamesAmount = 0;
  let message = `You have 1 game that is unclaimed`;

  for (const game of games) {
    if (!game.state.hasClicked) unclaimedGamesAmount += 1;
  }

  if (unclaimedGamesAmount > 1) {
    message = `You have ${unclaimedGamesAmount} games that are unclaimed`;
  }

  if (unclaimedGamesAmount > 0) {
    Browser.notifications.create("popup", {
      type: "basic",
      title: `${manifest.name}`,
      isClickable: true,
      message,
    });
  }
};

export const isURL = (str: string) => {
  // Regular expression pattern for URL matching
  var urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(str);
};
