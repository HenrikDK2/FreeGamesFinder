import { IFreeGame } from "../types/freegames";
import { db } from "../utils/db";
import { getEpicGames } from "./providers/epic";
import { getGamerpower } from "./providers/gamepower";
import { getGGDeals } from "./providers/ggdeals";

// First games in array takes priority, so first-party sources should be the first entries in the array
const uniqueGames = (games: IFreeGame[]): IFreeGame[] => {
  const formatStr = (title: string) => title.toLowerCase().replace(/ /g, "");

  return games.filter(
    (a, index, self) =>
      index ===
      self.findIndex((b) => (formatStr(a.title) === formatStr(b.title) && a.platform === b.platform) || a.url === b.url)
  );
};

export const getGamesFromSources = async (): Promise<IFreeGame[]> => {
  const games: IFreeGame[] = uniqueGames([
    ...(await getEpicGames()),
    ...(await getGGDeals()),
    ...(await getGamerpower()),
  ]);

  if (games.length > 0) db.update("games", games);

  return games;
};
