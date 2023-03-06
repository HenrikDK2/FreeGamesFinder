import { getProductType, getPlatform } from "../../utils";
import { IFreeGame } from "../../types/freegames";
import { db } from "../../utils/db";
import axios from "axios";
import { GamerPowerRequestData } from "../../types/gamerpower";

export const getGamerpower = async (drmFreeGames: boolean): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<GamerPowerRequestData>({
      url: "https://www.gamerpower.com/api/filter",
      timeout: 10000,
      params: {
        platform: drmFreeGames ? "epic-games-store.steam.gog.itchio.drm-free" : "epic-games-store.steam.gog",
        type: "game",
        "sort-by": "date",
      },
    });

    if (status === 200) {
      return data.map((game) => {
        const platformRegex = /\(Steam|IndieGala|Epic\s*Games|itch\.io|itchio|GOG\)/gi;
        let platform: string | undefined;

        const titlePlatformMatch = game.title.match(platformRegex);
        const descPlatformMatch = game.description.match(platformRegex);
        const platformSplit = game.platforms.split(",");

        if (platformSplit.length >= 2 && !platformSplit[1].includes("DRM-Free")) {
          platform = platformSplit[1];
        } else if (titlePlatformMatch) {
          platform = titlePlatformMatch[0];
        } else if (descPlatformMatch) {
          platform = descPlatformMatch[0];
        }

        const url = game.open_giveaway_url;
        const title = game.title.replace(/ \((Steam|IndieGala|Epic\s*Games|itch\.io|itchio|GOG|PC)\)| Giveaway/gi, "");

        const state = db.find("game", { title, url })?.state || {
          hasClicked: false,
          hasSendNotification: false,
        };

        return {
          state: state,
          title,
          imageSrc: game.thumbnail,
          url,
          platform: getPlatform(platform || game.platforms),
          productType: getProductType(game.type),
        };
      });
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};
