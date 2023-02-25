import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame, Platform } from "../types/freegames";

export const getProductType = (type?: string) => {
  if (type) type = type.toLowerCase().replace(/ /g, "");

  if (type === "dlc") return "DLC";
  return "GAME";
};

export const getPlatform = (platform: string): Platform | undefined => {
  platform = platform.toLowerCase().replace(/ /g, "");

  if (platform === "epicgamesstore") return "EpicGamesStore";

  if (platform === "gog.com") return "GoG";
  if (platform === "gog") return "GoG";

  if (platform === "itch.io") return "itch.io";
  if (platform === "itchio") return "itch.io";

  if (platform === "indiegala") return "IndieGala";

  if (platform === "gx.games") return "GX.games";

  if (platform === "steam") return "Steam";
};

export const sortGames = (games: IFreeGame[]): IFreeGame[] => {
  return games.sort((a, b) => Number(a.state.hasClicked) - Number(b.state.hasClicked));
};

export const switchIcon = (games: IFreeGame[]) => {
  const icons = ["assets/logo-32.png", "assets/logo-32-hidden.png"];

  Browser.browserAction.setIcon({
    path: games.some((game) => !game.state.hasClicked) ? icons[0] : icons[1],
  });
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
