import { IFreeGame } from "../types/freegames";
import { db } from "../utils/db";
import { getEpicGames } from "./providers/epic";
import { getGamerpower } from "./providers/gamepower";
import { getGGDeals } from "./providers/ggdeals";

// First games in array takes priority, so first-party sources should be the first entries in the array
const uniqueGames = (games: IFreeGame[]): IFreeGame[] => {
  const formatTitle = (title: string) => title.toLowerCase().replace(/ /g, "");

  return games.filter((game, i) => {
    const index = games.findIndex((product) => {
      if (
        formatTitle(game.title).includes(formatTitle(product.title)) &&
        game.platform === product.platform &&
        game.productType === product.productType
      ) {
        return true;
      } else {
        return false;
      }
    });

    if (index === i) return true;
    return false;
  });
};

export const getGamesFromSources = async (): Promise<IFreeGame[]> => {
  const { drmFreeGames } = db.get("settings");

  const games: IFreeGame[] = uniqueGames([
    ...(await getEpicGames()),
    ...(await getGGDeals()),
    ...(await getGamerpower(drmFreeGames)),
  ]);

  db.update("games", games || []);

  return games;
};
