import { getProductType, getDOMFromUrl, getPlatform } from "../utils";
import { IFreeGame } from "../types/freegames";
import { db } from "../utils/storage";
import { EpicGamesRequestData } from "../types/epicgames";
import axios from "axios";
import { GamerPowerRequestData } from "../types/gamerpower";

export const getEpicGames = async (): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<EpicGamesRequestData>({
      url: "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
      timeout: 3000,
    });

    if (status === 200) {
      const products = data.data.Catalog.searchStore.elements.filter(
        (p) => p.offerMappings.length > 0 && p.price.totalPrice.discountPrice === 0
      );

      const games: IFreeGame[] = products.map((product) => {
        const url = "https://store.epicgames.com/p/" + product.offerMappings[0].pageSlug;
        const state = db.find("game", { title: product.title })?.state || {
          hasClicked: false,
          hasSendNotification: false,
        };

        return {
          state: state,
          title: product.title,
          imageSrc: product.keyImages.find((e) => e.type === "Thumbnail")?.url,
          url,
          platform: getPlatform("Epic Games Store"),
          productType: getProductType(product.offerType),
        };
      });
      return games;
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};

const getGamerpower = async (drmFreeGames: boolean): Promise<IFreeGame[]> => {
  try {
    const { status, data } = await axios<GamerPowerRequestData>({
      url: "https://www.gamerpower.com/api/filter",
      timeout: 3000,
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

        const title = game.title.replace(/ \((Steam|IndieGala|Epic\s*Games|itch\.io|itchio|GOG)\)| Giveaway/gi, "");
        const state = db.find("game", { title })?.state || {
          hasClicked: false,
          hasSendNotification: false,
        };

        return {
          state: state,
          title,
          imageSrc: game.thumbnail,
          url: game.open_giveaway_url,
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

const getGGDeals = async (): Promise<IFreeGame[]> => {
  try {
    const htmlDocument = await getDOMFromUrl("https://gg.deals/deals/?maxPrice=0");

    if (htmlDocument) {
      return Array.from(htmlDocument.querySelectorAll("[data-container-game-id]")).map((el) => {
        const shopLink = el.querySelector(".shop-link") as HTMLAnchorElement;
        const titleLink = el.querySelector(".game-info-title") as HTMLAnchorElement;
        const img = el.querySelectorAll(".game-picture source")[1] as HTMLSourceElement;

        const url = "https://gg.deals" + shopLink.getAttribute("href");
        const title = titleLink.textContent || "";
        const imageSrc = img.getAttribute("srcset")!.split(",")[1].replace(" 2x", "");
        const state = db.find("game", { title })?.state || { hasClicked: false, hasSendNotification: false };

        return {
          url,
          productType: getProductType(),
          platform: getPlatform(el.getAttribute("data-shop-name")!),
          state,
          title,
          imageSrc,
        };
      });
    }
  } catch (error) {
    console.error(error);
  }

  return [];
};

const formatTitle = (title: string) => title.toLowerCase().replace(/ /g, "");
const uniqueGames = (games: IFreeGame[]): IFreeGame[] => {
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
