import { getProductType, getDOMFromUrl, getPlatform } from "../utils";
import { IFreeGame } from "../types/freegames";
import { db } from "../utils/storage";
import { EpicGamesRequestData } from "../types/epicgames";
import axios from "axios";

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

const ggDeals = async (): Promise<IFreeGame[]> => {
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
      if (formatTitle(product.title) === formatTitle(game.title) && game.platform === product.platform) {
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
  const games: IFreeGame[] = uniqueGames([...(await getEpicGames()), ...(await ggDeals())]);
  db.update("games", games || []);

  return games;
};
