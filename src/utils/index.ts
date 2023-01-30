import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame, Platform } from "../types/freegames";

export const getProductType = (type?: string) => {
  if (type === "DLC") return "DLC";
  return "GAME";
};

export const getPlatform = (platform: string): Platform | undefined => {
  if (platform === "Epic Games Store") return "EpicGamesStore";
  if (platform === "EpicGamesStore") return "EpicGamesStore";

  if (platform === "Gog.com") return "GoG";

  if (platform === "Steam") return "Steam";
};

export const sortGames = (games: IFreeGame[]): IFreeGame[] => {
  if (!games) return [];
  return games.sort((a, b) => Number(a.state.hasClicked) - Number(b.state.hasClicked));
};

export const switchIcon = (games: IFreeGame[] | undefined) => {
  const icons = ["assets/logo-32.png", "assets/logo-32-hidden.png"];

  if (!games) {
    Browser.browserAction.setIcon({ path: icons[1] });
  } else {
    Browser.browserAction.setIcon({
      path: games.some((game) => !game.state.hasClicked) ? icons[0] : icons[1],
    });
  }
};

export const minutesToMs = (number: number) => 1000 * number * 60;

export const getDOMFromUrl = async (url: string): Promise<HTMLElement | undefined> => {
  try {
    const { data } = await axios({ url, timeout: 3000 });
    return DOMPurify.sanitize(data, { RETURN_DOM: true });
  } catch (error) {
    console.error(`Error fetching HTML: ${error}`);
  }
};
