import { Platform, IFreeGame } from "../types/freegames";
import { ISettings } from "../types/settings";

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

export const filterGamesList = (games: IFreeGame[], settings: ISettings): IFreeGame[] => {
  return games.filter((game) => {
    if (game.state.hasClicked && settings.hideClickedGames === true) {
      return false;
    }

    if (settings.showDRMFreeGames === false) {
      if (game.platform === "GX.games") return false;
      if (game.platform === "IndieGala") return false;
      if (game.platform === "itch.io") return false;
    }

    return true;
  });
};

export const isDrmFreeGame = (game: IFreeGame): boolean => {
  if (game.platform === "GX.games") return true;
  if (game.platform === "IndieGala") return true;
  if (game.platform === "itch.io") return true;

  return false;
};
