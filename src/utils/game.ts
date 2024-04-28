import { Platform, IFreeGame } from "../types/freegames";
import { ISettings } from "../types/settings";
import { db } from "./db";

export const getProductType = (type?: string) => {
  if (type) type = type.toLowerCase().replace(/ /g, "");

  if (type === "dlc") return "DLC";

  if (type === "bundle") return "BUNDLE";

  return "GAME";
};

export const getPlatform = (platform: string): Platform | undefined => {
  platform = platform.toLowerCase().replace(/ /g, "");

  if (platform === "epicgamesstore") return "Epic Games Store";

  if (platform === "gog.com") return "GoG";
  if (platform === "gog") return "GoG";

  if (platform === "itch.io") return "Itch.io";
  if (platform === "itchio") return "Itch.io";

  if (platform === "indiegala") return "IndieGala";

  if (platform === "gx.games") return "GX.games";

  if (platform === "steam") return "Steam";
};

export const sortGames = (games: IFreeGame[]): IFreeGame[] => {
  return games.sort((a, b) => Number(a.state.hasClicked) - Number(b.state.hasClicked));
};

export const compareGameTitles = (a: IFreeGame["title"], b: IFreeGame["title"]) => {
  const formatStr = (title: string) => title.toLowerCase().replace(/( |™)/g, "");

  return formatStr(a) === formatStr(b);
};

export const getGameState = (title: IFreeGame["title"], url: IFreeGame["url"]) => {
  return (
    db.find("game", { url, title })?.state || {
      hasClicked: false,
      hasSendNotification: false,
    }
  );
};

export const filterGamesList = (games: IFreeGame[], settings: ISettings): IFreeGame[] => {
  return games.filter((game) => {
    if (game.state.hasClicked && settings.hideClickedGames === true) {
      return false;
    }

    if (game.platform && settings.showPlatforms.includes(game.platform)) {
      return true;
    }

    return false;
  });
};
